import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { Object3D } from 'three'

/** One reversible paper motion, with latest-request completion and no React frame state. */
export function usePrinterPaper(model: Object3D, out: boolean, reducedMotion: boolean, sequence: number, onPrinted: () => void) {
  const amount = useRef(0)
  const completed = useRef(false)
  const { invalidate } = useThree()
  const paper = useMemo(() => {
    let sheet: Object3D | undefined
    model.traverse(object => { if (object.userData.stable_id === 'ResumePaper') sheet = object })
    return sheet
  }, [model])
  const initial = useMemo(() => paper?.position.clone(), [paper])
  useEffect(() => { completed.current = false; invalidate() }, [out, sequence, invalidate])
  useFrame((_, delta) => {
    const target = out ? 1 : 0
    amount.current = reducedMotion ? target : MathUtils.damp(amount.current, target, 6, Math.min(delta, .05))
    if (paper && initial) { paper.position.z = initial.z + amount.current * .18; paper.position.y = initial.y + amount.current * .025 }
    if (Math.abs(amount.current - target) > .001) invalidate()
    if (out && amount.current > .97 && !completed.current) { completed.current = true; onPrinted() }
  })
  return amount
}
