import { Box3, Vector3 } from 'three'
import { pivotBounds } from '../layout/apply'
import type { EditPivot } from '../layout/apply'

export interface Warning { id: string; kind: 'overlap' | 'bounds' | 'structure'; text: string }
// Three.js space. Interior floor, side-porch deck and fixed structure measured from the Blender source (see CABIN_EDITOR_GUIDE.md).
const floors = [new Box3(new Vector3(-3.75, -1, -2.85), new Vector3(3.9, 6, 3.2)), new Box3(new Vector3(-6.95, -1, .05), new Vector3(-3.95, 6, 3.15))]
const structure: { name: string; box: Box3 }[] = [
  { name: 'the loft stairs', box: new Box3(new Vector3(.28, 0, -1.07), new Vector3(1.12, 2.4, 1.53)) },
  { name: 'the left wall', box: new Box3(new Vector3(-3.95, 0, -2.87), new Vector3(-3.74, 3.5, 2.0)) },
  { name: 'the back wall', box: new Box3(new Vector3(-3.9, 0, -2.95), new Vector3(3.9, 3.5, -2.68)) },
  { name: 'the window wall', box: new Box3(new Vector3(3.6, 0, -2.8), new Vector3(4.15, 3.2, .6)) },
]
const shrink = (box: Box3, by: number) => box.clone().expandByScalar(-by)
const overlap = (a: Box3, b: Box3, min: number) => {
  const x = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x), y = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y), z = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z)
  return x > min && y > min && z > min
}
export function computeWarnings(pivots: Map<string, EditPivot>): Warning[] {
  const warnings: Warning[] = []
  const boxes = new Map<string, Box3>()
  for (const [id, item] of pivots) boxes.set(id, pivotBounds(item.pivot))
  for (const [id, item] of pivots) {
    const { entry } = item, box = boxes.get(id)!
    if (box.isEmpty() || !item.pivot.visible) continue
    const centre = box.getCenter(new Vector3())
    if (entry.kind === 'floor') {
      if (!floors.some(floor => floor.containsPoint(new Vector3(centre.x, 0, centre.z).setY(1)))) warnings.push({ id, kind: 'bounds', text: `${entry.label} is outside the cabin floor and porch deck.` })
      if (!entry.wallMounted) for (const wall of structure) if (overlap(shrink(box, .02), shrink(wall.box, .02), .05)) warnings.push({ id, kind: 'structure', text: `${entry.label} intersects ${wall.name}.` })
    }
    if (entry.kind === 'outdoor' && floors[0].containsPoint(new Vector3(centre.x, 1, centre.z))) warnings.push({ id, kind: 'bounds', text: `${entry.label} stands inside the cabin.` })
    if (entry.kind === 'floor' && box.min.y < -.15) warnings.push({ id, kind: 'bounds', text: `${entry.label} sinks below the floor.` })
    if (entry.exempt || entry.kind !== 'floor') continue
    for (const [otherId, other] of pivots) {
      if (otherId <= id) continue
      if (!other.pivot.visible) continue
      const o = other.entry; if (o.exempt || o.kind !== 'floor') continue
      if (entry.overlaps?.includes(otherId) || o.overlaps?.includes(id)) continue
      if (overlap(shrink(box, .03), shrink(boxes.get(otherId)!, .03), .08)) warnings.push({ id, kind: 'overlap', text: `${entry.label} overlaps ${o.label}.` })
    }
  }
  return warnings
}
