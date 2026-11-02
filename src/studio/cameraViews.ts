import sceneBounds from './sceneBounds.json' with { type: 'json' }
export type Vec3 = readonly [number, number, number]
export interface CameraView {
  position: Vec3
  target: Vec3
  span: readonly [number, number]
  // CameraControls constrains each orbit around the measured focus area.
  orbit: { azimuth: readonly [number, number]; polar: readonly [number, number] }
  zoom: readonly [number, number]
}
function view(target: Vec3, offset: Vec3, span: readonly [number, number]): CameraView {
  const azimuth = Math.atan2(offset[0], offset[2])
  return {
    target, span,
    position: [target[0] + offset[0], target[1] + offset[1], target[2] + offset[2]],
    orbit: { azimuth: [azimuth - .18, azimuth + .18], polar: [.85, 1.28] },
    zoom: [.9, 1.25],
  }
}
interface Bounds { min: number[]; max: number[]; center: number[]; size: number[] }
const nodes = sceneBounds.nodes as Record<string, Bounds>
function union(names: string[]): Bounds {
  const boxes = names.map(n => nodes[n])
  const min = [0, 1, 2].map(i => Math.min(...boxes.map(b => b.min[i])))
  const max = [0, 1, 2].map(i => Math.max(...boxes.map(b => b.max[i])))
  return { min, max, center: min.map((v, i) => (v + max[i]) / 2), size: min.map((v, i) => max[i] - v) }
}
function measured(bounds: Bounds, offset: Vec3, minimumSpan: readonly [number, number], lift = 0): CameraView {
  const target: Vec3 = [bounds.center[0], bounds.center[1] + lift, bounds.center[2]]
  const length = Math.hypot(...offset)
  const horizontal = Math.hypot(offset[0], offset[2])
  const right = [offset[2] / horizontal, 0, -offset[0] / horizontal]
  const direction = offset.map(v => v / length)
  const up = [direction[1] * right[2], direction[2] * right[0] - direction[0] * right[2], -direction[1] * right[0]]
  let width = 0, height = 0
  for (const x of [bounds.min[0], bounds.max[0]]) for (const y of [bounds.min[1], bounds.max[1]]) for (const z of [bounds.min[2], bounds.max[2]]) {
    const p = [x - target[0], y - target[1], z - target[2]]
    width = Math.max(width, Math.abs(p.reduce((n, v, i) => n + v * right[i], 0)) * 2)
    height = Math.max(height, Math.abs(p.reduce((n, v, i) => n + v * up[i], 0)) * 2)
  }
  return view(target, offset, [Math.max(minimumSpan[0], width * 1.2), Math.max(minimumSpan[1], height * 1.2)])
}
const overview = view([-.7, 1.6, .65], [10, 9, 16], [14.4, 10.1])
overview.zoom = [.82, 1.05]
overview.orbit = { azimuth: [Math.atan2(9, 13) - .14, Math.atan2(9, 13) + .14], polar: [1.02, 1.19] }
export const cameraViews = {
  default: overview,
  workstation: measured(sceneBounds.zones.workstation, [8, 7.95, 13], [5.5, 4.2], .18),
  designCorner: view([-5.6,1.1,1.8], [4,4.6,9], [5.0,4.0]),
  communityPinboard: measured(union(['Community_ESC', 'Community_StartupHub', 'Community_DFA', 'Community_BeaverHacks', 'Community_AIClub', 'Community_BeaverHacks2026', 'Community_InnovationJam2026', 'Community_EngineersWeek']), [1.6, 4.5, 11], [4, 3.3]),
  readingNook: view([-2.9,1.5,1.1], [5,5.2,11], [5.2,4.2]),
  archive: measured(sceneBounds.zones.archive, [6.5, 5.5, 11], [3.6, 3]),
  printer: measured(union(['PrinterBody', 'ResumePaper']), [7, 7, 12], [3.5, 2.7]),
  externalLinks: measured(union(['ExternalGitHub', 'ExternalLinkedIn']), [5, 6.8, 12], [3.7, 3]),
  loftBedding: view([2.1, 2.9, -1.9], [7, 7.5, 12], [4.5, 3.5]),
} satisfies Record<string, CameraView>
export type CameraViewName = keyof typeof cameraViews
export function fitCamera(viewName: CameraViewName, width: number, height: number, zoom = 1) {
  const preset = cameraViews[viewName]
  const multiplier = Math.max(preset.zoom[0], Math.min(preset.zoom[1], zoom))
  return Math.min(width / preset.span[0], height / preset.span[1]) * multiplier
}
