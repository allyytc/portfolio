import { useEffect, useRef } from 'react'
import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { OrthographicCamera } from 'three'
import { cameraViews, fitCamera } from './cameraViews'
import type { CameraViewName } from './cameraViews'
import { gizmoState } from './layout/gizmoState'
import type { CameraCommand, NavigationRequest } from './interactions'
import type { RefObject } from 'react'

interface Props {
  request: NavigationRequest; command: CameraCommand; reducedMotion: boolean
  blocked: boolean; touchEnabled: boolean; ready: boolean
  onSettled: (serial: number) => void; onReset: () => void
  probe: RefObject<((x: number, y: number) => boolean) | null>
}
declare global {
  interface Window {
    __studioCamera?: { view: CameraViewName; position: number[]; target: number[]; zoom: number; azimuth: number; polar: number; minZoom: number; maxZoom: number; transitioning: boolean }
  }
}
const A = CameraControlsImpl.ACTION
/** Production orbit half-span around the front view (radians). 150° = 300° of freedom; the 60° directly behind the cabin stays out of view. */
const ORBIT_HALF_SPAN = 150 * Math.PI / 180
export default function StudioCamera(props: Props) {
  const controls = useRef<CameraControls>(null)
  const revision = useRef(0)
  const moving = useRef(false)
  const handledCommand = useRef(0)
  const objectGesture = useRef<number | null>(null)
  // Stable mappings must not overwrite the gesture guard during hover rerenders.
  const mouseButtons = useRef({ left: A.ROTATE, middle: A.NONE, right: A.NONE, wheel: A.ZOOM })
  const touches = useRef({ one: A.TOUCH_ROTATE, two: A.TOUCH_ZOOM_ROTATE, three: A.NONE })
  const latest = useRef(props)
  latest.current = props
  const { size, invalidate, camera, gl } = useThree()
  const applyLimits = (rig: CameraControls, view: CameraViewName) => {
    const base = fitCamera(view, size.width, size.height)
    if (gizmoState.free) {
      rig.minAzimuthAngle = -Infinity; rig.maxAzimuthAngle = Infinity; rig.minPolarAngle = .02; rig.maxPolarAngle = Math.PI - .02
      rig.minZoom = base * .12; rig.maxZoom = base * 9
      const buttons = mouseButtons.current as { right: number }; buttons.right = A.TRUCK; rig.mouseButtons.right = A.TRUCK
    } else {
      // Production: orbit almost all the way round (everything except the view straight from behind the cabin), never below the ground, wide zoom, no panning.
      const front = Math.atan2(cameraViews.default.position[0] - cameraViews.default.target[0], cameraViews.default.position[2] - cameraViews.default.target[2])
      rig.minAzimuthAngle = front - ORBIT_HALF_SPAN; rig.maxAzimuthAngle = front + ORBIT_HALF_SPAN; rig.minPolarAngle = .5; rig.maxPolarAngle = 1.38
      rig.minZoom = base * .45; rig.maxZoom = base * 4.2
      const buttons = mouseButtons.current as { right: number }; buttons.right = A.NONE; rig.mouseButtons.right = A.NONE
    }
  }

  const compact = size.width <= 800 || window.matchMedia('(pointer: coarse)').matches
  const allowed = !props.blocked && props.ready && (!compact || props.touchEnabled)

  useEffect(() => {
    const rig = controls.current
    if (!rig) return
    const token = ++revision.current
    const preset = cameraViews[props.request.view]
    moving.current = true
    rig.enabled = false
    const base = fitCamera(props.request.view, size.width, size.height)
    applyLimits(rig, props.request.view)
    const animate = props.request.serial > 0 && !props.reducedMotion
    void Promise.all([
      rig.setLookAt(...preset.position, ...preset.target, animate), rig.zoomTo(base, animate),
    ]).then(() => {
      if (token !== revision.current) return
      moving.current = false
      const p = latest.current
      rig.enabled = !p.blocked && p.ready && (!compact || p.touchEnabled)
      rig.update(0); invalidate(); p.onSettled(p.request.serial)
    })
    invalidate()
    return () => { revision.current++ }
  }, [props.request.serial, props.request.view, props.reducedMotion, size.width, size.height, compact, invalidate])

  useEffect(() => {
    const rig = controls.current
    if (rig) rig.enabled = allowed && !moving.current
  }, [allowed])
  // DEV-ONLY: the cabin editor toggles an unrestricted camera (full 360° orbit, wide zoom, right-drag pan).
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const toggle = (event: Event) => { gizmoState.free = Boolean((event as CustomEvent<boolean>).detail); const rig = controls.current; if (rig) { applyLimits(rig, latest.current.request.view); invalidate() } }
    window.addEventListener('cabin-editor-free-camera', toggle)
    return () => window.removeEventListener('cabin-editor-free-camera', toggle)
  }) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const rig = controls.current
    if (!rig || !props.command.serial || handledCommand.current === props.command.serial) return
    handledCommand.current = props.command.serial
    if (moving.current || props.blocked) return
    void rig.zoomTo(Math.max(rig.minZoom, Math.min(rig.maxZoom, (camera as OrthographicCamera).zoom * (1 + props.command.zoomDelta))), !props.reducedMotion)
    invalidate()
  }, [props.command, props.blocked, props.reducedMotion, camera, invalidate])

  useEffect(() => {
    const canvas = gl.domElement
    const down = (event: PointerEvent) => {
      const rig = controls.current
      if (!rig) return
      canvas.focus({ preventScroll: true })
      const hit = gizmoState.hover || latest.current.probe.current?.(event.clientX, event.clientY)
      objectGesture.current = hit ? event.pointerId : null
      rig.mouseButtons.left = hit ? A.NONE : A.ROTATE
      rig.touches.one = hit ? A.NONE : A.TOUCH_ROTATE
    }
    const move = (event: PointerEvent) => {
      const rig = controls.current
      if (rig && objectGesture.current === event.pointerId) {
        rig.mouseButtons.left = A.NONE
        rig.touches.one = A.NONE
      }
    }
    const up = (event: PointerEvent) => {
      if (objectGesture.current !== event.pointerId) return
      objectGesture.current = null
      const rig = controls.current
      if (rig) { rig.mouseButtons.left = A.ROTATE; rig.touches.one = A.TOUCH_ROTATE }
    }
    const wheel = (event: WheelEvent) => {
      if ((document.activeElement !== canvas && !event.ctrlKey && !event.metaKey && !gizmoState.free) || moving.current || latest.current.blocked || (compact && !latest.current.touchEnabled)) {
        event.stopImmediatePropagation()
        return
      }
      event.preventDefault()
    }
    const key = (event: KeyboardEvent) => {
      const rig = controls.current
      if (!rig || latest.current.blocked) return
      if (event.key === 'Home') { event.preventDefault(); latest.current.onReset(); return }
      if (moving.current) return
      const animated = !latest.current.reducedMotion
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault()
        void rig.rotate(event.key === 'ArrowLeft' ? -.06 : event.key === 'ArrowRight' ? .06 : 0, event.key === 'ArrowUp' ? -.04 : event.key === 'ArrowDown' ? .04 : 0, animated)
      } else if (['+', '=', '-', '_'].includes(event.key)) {
        event.preventDefault()
        void rig.zoomTo(Math.max(rig.minZoom, Math.min(rig.maxZoom, (camera as OrthographicCamera).zoom * (event.key === '-' || event.key === '_' ? .9 : 1.1))), animated)
      }
      invalidate()
    }
    canvas.tabIndex = 0
    canvas.setAttribute('aria-label', 'Studio camera. Drag to rotate, focus here to scroll to zoom. Arrow keys rotate, plus and minus zoom, Home resets. Destination buttons follow the studio.')
    canvas.style.touchAction = compact && props.touchEnabled ? 'none' : 'pan-y pinch-zoom'
    canvas.addEventListener('pointerdown', down, true)
    canvas.addEventListener('pointermove', move, true)
    canvas.addEventListener('pointerup', up, true)
    canvas.addEventListener('pointercancel', up, true)
    canvas.addEventListener('wheel', wheel, { capture: true, passive: false })
    canvas.addEventListener('keydown', key)
    return () => { canvas.removeEventListener('pointerdown', down, true); canvas.removeEventListener('pointermove', move, true); canvas.removeEventListener('pointerup', up, true); canvas.removeEventListener('pointercancel', up, true); canvas.removeEventListener('wheel', wheel, true); canvas.removeEventListener('keydown', key) }
  }, [gl, compact, props.touchEnabled, invalidate])
  useFrame(() => {
    const rig = controls.current
    if (rig && import.meta.env.DEV) window.__studioCamera = { view: latest.current.request.view, position: camera.position.toArray(), target: rig.getTarget(new Vector3()).toArray(), zoom: (camera as OrthographicCamera).zoom, azimuth: rig.azimuthAngle, polar: rig.polarAngle, minZoom: rig.minZoom, maxZoom: rig.maxZoom, transitioning: moving.current }
  })
  return <CameraControls ref={controls} makeDefault domElement={gl.domElement} enabled={allowed && !moving.current} smoothTime={.35} draggingSmoothTime={.18}
    mouseButtons={mouseButtons.current}
    touches={touches.current} />
}
