import { useEffect, useMemo, useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Box3, Box3Helper, Color, Vector3 } from 'three'
import { gizmoState } from '../layout/gizmoState'
import { pivotBounds } from '../layout/apply'
import { runtime, store, useEditor } from './store'

function Outline({ id, color }: { id: string; color: string }) {
  const helper = useMemo(() => new Box3Helper(new Box3(), new Color(color)), [color])
  useFrame(() => { const item = runtime.pivots.get(id); if (item) { pivotBounds(item.pivot, helper.box); helper.visible = !helper.box.isEmpty() } })
  return <primitive object={helper} />
}

/** DEV-ONLY: selection outline, warning outlines and move/rotate/scale gizmos. Mounted inside the R3F canvas. */
export default function EditorScene() {
  const active = useEditor(s => s.active), id = useEditor(s => s.selectedId), mode = useEditor(s => s.mode), space = useEditor(s => s.space)
  const snap = useEditor(s => s.snap), full = useEditor(s => s.fullRotation), heightUnlock = useEditor(s => s.heightUnlock), unlocked = useEditor(s => s.unlocked)
  const warnings = useEditor(s => s.warnings), showWarnings = useEditor(s => s.showWarnings)
  const { invalidate, camera, gl } = useThree()
  const gizmo = useRef<{ addEventListener: (type: string, cb: (event: { value?: unknown }) => void) => void; removeEventListener: (type: string, cb: (event: { value?: unknown }) => void) => void } | null>(null)
  // Gizmo hover tells the camera rig not to start an orbit; a stuck drag flag is cleared on any pointer release.
  useEffect(() => {
    const controls = gizmo.current; (window as unknown as Record<string, unknown>).__cabinGizmo = controls; const hover = (event: { value?: unknown }) => { gizmoState.hover = Boolean(event.value) }
    const release = () => { if (store.isDragging()) store.setDragging(false) }
    controls?.addEventListener('axis-changed', hover); window.addEventListener('pointerup', release, true)
    return () => { controls?.removeEventListener('axis-changed', hover); window.removeEventListener('pointerup', release, true); gizmoState.hover = false }
  })
  // Test/debug hook: screen position (CSS px) of an object's pivot.
  useEffect(() => {
    ;(window as unknown as Record<string, unknown>).__cabinEditorScreen = (id: string, lift = 0, dx = 0, dz = 0) => {
      const item = runtime.pivots.get(id); if (!item) return null
      const p = item.pivot.getWorldPosition(new Vector3()); p.y += lift; p.x += dx; p.z += dz; p.project(camera)
      const r = gl.domElement.getBoundingClientRect(); return { x: r.left + (p.x + 1) / 2 * r.width, y: r.top + (1 - p.y) / 2 * r.height }
    }
  }, [camera, gl])
  useEffect(() => { invalidate() }, [active, id, mode, space, invalidate])
  if (!active) return null
  const item = id ? runtime.pivots.get(id) : undefined
  const locked = Boolean(item?.entry.locked && !unlocked.includes(item.entry.id))
  const warned = showWarnings ? [...new Set(warnings.map(w => w.id))] : []
  const kind = item?.entry.kind
  return <>
    {item && <Outline key={`sel-${id}`} id={item.entry.id} color={warned.includes(item.entry.id) ? '#ff6b5c' : locked ? '#9aa5a0' : '#ffd27a'} />}
    {warned.filter(w => w !== id).map(w => <Outline key={`warn-${w}`} id={w} color="#ff6b5c" />)}
    {item && !locked && <TransformControls ref={gizmo as never} key={`${id}-${mode}`} object={item.pivot} mode={mode} space={mode === 'scale' ? 'local' : space} size={.8}
      translationSnap={snap.enabled ? snap.position : undefined} rotationSnap={snap.enabled ? snap.rotation * Math.PI / 180 : undefined} scaleSnap={snap.enabled ? snap.scale : undefined}
      showX={mode === 'rotate' ? full : true} showY={mode === 'translate' ? kind !== 'floor' || heightUnlock : true} showZ={mode === 'rotate' ? full : kind !== 'wall'}
      onMouseDown={() => { store.checkpoint(); store.setDragging(true) }} onMouseUp={() => store.setDragging(false)} onObjectChange={() => { if (id) store.syncFromPivot(id) }} />}
  </>
}
