import { Box3, Euler, Group, MathUtils, Vector3 } from 'three'
import type { Object3D } from 'three'
import { cameraViews } from '../cameraViews'
import type { CameraViewName } from '../cameraViews'
import { editableObjects, identityPlacement } from './registry'
import type { EditableObject, LayoutFile, Placement } from './registry'
import saved from './layout.json'

export const savedLayout = saved as unknown as LayoutFile
export interface EditPivot { entry: EditableObject; pivot: Group; base: { position: Vector3 } }

const findNode = (root: Object3D, selector: string) => {
  let hit: Object3D | undefined
  root.traverse(o => { if (!hit && (selector.startsWith('#') ? o.name === selector.slice(1) : o.userData.stable_id === selector)) hit = o })
  return hit
}

/** Wraps each registry entry in a pivot group at its floor-centre so move/rotate/scale act on the visible object. World transforms are preserved. */
export function buildPivots(root: Object3D): Map<string, EditPivot> {
  root.updateMatrixWorld(true)
  const pivots = new Map<string, EditPivot>()
  for (const entry of editableObjects) {
    const nodes = entry.nodes.map(selector => findNode(root, selector)).filter((node): node is Object3D => Boolean(node))
    if (!nodes.length) continue
    const box = new Box3(); nodes.forEach(node => box.expandByObject(node))
    const existing = nodes[0].parent
    if (existing?.userData.editId === entry.id) { pivots.set(entry.id, { entry, pivot: existing as Group, base: { position: (existing.userData.base as Vector3).clone() } }); continue } // idempotent under StrictMode
    const centre = box.getCenter(new Vector3()); centre.y = box.min.y
    const pivot = new Group(); pivot.name = `edit:${entry.id}`; pivot.userData.editId = entry.id; pivot.userData.base = centre.clone()
    pivot.position.copy(centre); root.add(pivot); pivot.updateMatrixWorld(true)
    nodes.forEach(node => pivot.attach(node))
    pivots.set(entry.id, { entry, pivot, base: { position: centre.clone() } })
  }
  return pivots
}

export function applyPlacement(item: EditPivot, placement: Placement) {
  item.pivot.position.set(item.base.position.x + placement.position[0], item.base.position.y + placement.position[1], item.base.position.z + placement.position[2])
  item.pivot.rotation.copy(new Euler(MathUtils.degToRad(placement.rotation[0]), MathUtils.degToRad(placement.rotation[1]), MathUtils.degToRad(placement.rotation[2]), 'YXZ'))
  item.pivot.scale.setScalar(placement.scale)
  item.pivot.visible = !placement.hidden
  // Deleted objects must not intercept pointer rays either.
  item.pivot.traverse(o => { if (!o.userData.rayOriginal) o.userData.rayOriginal = o.raycast; o.raycast = placement.hidden ? () => {} : (o.userData.rayOriginal as Object3D['raycast']) })
  item.pivot.updateMatrixWorld(true)
}
export function readPlacement(item: EditPivot): Placement {
  return {
    position: [item.pivot.position.x - item.base.position.x, item.pivot.position.y - item.base.position.y, item.pivot.position.z - item.base.position.z],
    rotation: [MathUtils.radToDeg(item.pivot.rotation.x), MathUtils.radToDeg(item.pivot.rotation.y), MathUtils.radToDeg(item.pivot.rotation.z)],
    scale: item.pivot.scale.x,
    ...(item.pivot.visible ? {} : { hidden: true }),
  }
}
export function applyLayout(pivots: Map<string, EditPivot>, layout: LayoutFile) {
  for (const [id, item] of pivots) applyPlacement(item, layout.objects[id] ?? identityPlacement())
  retargetViews(pivots)
}

// Camera destinations follow the objects they frame: the baked view is translated by the mean offset of its anchors.
const baseViews = new Map<CameraViewName, { position: number[]; target: number[] }>()
const anchors: Partial<Record<CameraViewName, string[]>> = {
  workstation: ['desk', 'monitor'], printer: ['printer'], readingNook: ['fireplace'], designCorner: ['easel'],
  communityPinboard: ['communityEsc', 'communityStartup', 'communityDfa', 'communityBeaverHacks', 'communityAi', 'communityBh26', 'communityIj', 'communityEw'],
  archive: ['skillsVolume'], externalLinks: ['github', 'linkedin'],
}
export function retargetViews(pivots: Map<string, EditPivot>) {
  for (const [name, ids] of Object.entries(anchors) as [CameraViewName, string[]][]) {
    const view = cameraViews[name] as unknown as { position: number[]; target: number[] }
    if (!baseViews.has(name)) baseViews.set(name, { position: [...view.position], target: [...view.target] })
    const base = baseViews.get(name)!
    const delta = new Vector3(); let count = 0
    for (const id of ids) { const item = pivots.get(id); if (item) { delta.add(item.pivot.position).sub(item.base.position); count++ } }
    if (count) delta.divideScalar(count)
    for (let i = 0; i < 3; i++) { view.position[i] = base.position[i] + delta.getComponent(i); view.target[i] = base.target[i] + delta.getComponent(i) }
  }
  if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__studioViews = cameraViews // DEV/test hook: the live, layout-retargeted views
}

/** World-space bounds of an edit pivot, ignoring decorative light pools. */
export function pivotBounds(pivot: Object3D, target = new Box3()): Box3 {
  target.makeEmpty(); pivot.updateMatrixWorld(true)
  pivot.traverse(o => { if (o.name.startsWith('glow:')) return; const mesh = o as Object3D & { geometry?: { boundingBox: Box3 | null; computeBoundingBox: () => void } }; if (mesh.geometry) { if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox(); if (mesh.geometry.boundingBox) target.union(mesh.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)) } })
  return target
}

/** True when the object (or an ancestor) was deleted in the editor; hidden objects must not be clickable or hoverable. */
export function isObjectHidden(object: Object3D | null): boolean {
  for (let node = object; node; node = node.parent) if (!node.visible) return true
  return false
}
