import { AdditiveBlending, CanvasTexture, Color, DoubleSide, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, Shape, Vector3, CylinderGeometry, BoxGeometry } from 'three'
import type { Object3D } from 'three'

// Phase 7D layout. Coordinates are web/three space: x right, y up, z toward the viewer (Blender y = -z).
export const hearthLightPosition = new Vector3(-3.15, .62, 1.1)
export const porchLightPosition = new Vector3(-5.4, 2.1, 2.2)
export const signpostPosition = [-2.0, -.3, 6.3] as const
const find = (root: Object3D, name: string) => { let hit: Object3D | undefined; root.traverse(o => { if (!hit && o.userData.stable_id === name) hit = o }); return hit }

/** Phase 7E: hearth, porch and roof are positioned in the Blender source. Only the retired directory meshes are hidden here. */
export function arrangeWorld(world: Object3D) {
  // The hearth faces away from the warm key light; lift its natural stone toward warm neutral so the cool fill does not turn it blue.
  // Materials are shared with the cached GLTF, so clone before tinting; multiplying the shared colour compounded on every reload (stone turned white).
  world.traverse(o => {
    if (!(o instanceof Mesh)) return
    const tint = (m: typeof o.material) => { if (!Array.isArray(m) && m.name.includes('7E warm stone') && 'color' in m) { const copy = m.clone() as typeof m & { color: Color }; copy.color.multiply(new Color(1.55, 1.2, .8)); return copy } return m }
    o.material = Array.isArray(o.material) ? o.material.map(tint) : tint(o.material)
  })
  for (const name of ['ProjectsSign', 'AboutSign', 'CommunitySign', 'ContactSign']) { const node = find(world, name); if (node) node.visible = false }
}

function labelTexture(text: string, width: number, height: number) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = Math.round(1024 * height / width)
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4
  const draw = () => {
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f6ead2'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    let size = canvas.height * .62
    ctx.font = `800 ${size}px Nunito, "Avenir Next", system-ui, sans-serif`
    const fit = canvas.width * .92 / ctx.measureText(text).width
    if (fit < 1) { size *= fit; ctx.font = `800 ${size}px Nunito, "Avenir Next", system-ui, sans-serif` }
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + size * .04)
    texture.needsUpdate = true
  }
  draw(); void document.fonts?.ready.then(draw)
  return texture
}

function plank(text: string, width: number, height: number, direction: 1 | -1, stableId: string | null, wood: MeshStandardMaterial, trim: MeshStandardMaterial) {
  const group = new Group(); if (stableId) group.userData.stable_id = stableId
  const tip = height * .45, shape = new Shape(), half = width / 2, h = height / 2
  if (direction === 1) shape.moveTo(-half, -h).lineTo(half, -h).lineTo(half + tip, 0).lineTo(half, h).lineTo(-half, h)
  else shape.moveTo(half, -h).lineTo(-half, -h).lineTo(-half - tip, 0).lineTo(-half, h).lineTo(half, h)
  shape.closePath()
  const body = new Mesh(new ExtrudeGeometry(shape, { depth: .09, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 1 }), wood)
  body.position.z = -.045; body.castShadow = true; group.add(body)
  const rim = new Mesh(new BoxGeometry(width + tip * .1, .035, .12), trim); rim.position.set(direction * tip * .05, h - .01, 0); group.add(rim)
  const rim2 = rim.clone(); rim2.position.y = -h + .01; group.add(rim2)
  const label = new Mesh(new PlaneGeometry(width * .9, height * .66), new MeshBasicMaterial({ map: labelTexture(text, width * .9, height * .66), transparent: true, toneMapped: false, side: DoubleSide, depthWrite: false }))
  label.position.set(0, 0, .062); group.add(label)
  return group
}

/** World-navigation signpost for the front field: large high-contrast labels, one stable id per destination. */
export function createSignpost() {
  const root = new Group(); root.name = 'Front field signpost'
  const wood = new MeshStandardMaterial({ color: '#4a2d1f', roughness: .78 })
  const post = new MeshStandardMaterial({ color: '#6f4938', roughness: .85 })
  const brass = new MeshStandardMaterial({ color: '#c59a60', roughness: .45, metalness: .5 })
  const stone = new MeshStandardMaterial({ color: '#59615a', roughness: 1 })
  const base = new Mesh(new CylinderGeometry(.5, .62, .2, 7), stone); base.position.y = .1; base.castShadow = true; root.add(base)
  const pole = new Mesh(new BoxGeometry(.2, 4.0, .2), post); pole.position.y = 2.1; pole.castShadow = true; root.add(pole)
  const cap = new Mesh(new BoxGeometry(.3, .12, .3), brass); cap.position.y = 4.15; root.add(cap)
  const lantern = new Mesh(new BoxGeometry(.2, .26, .2), new MeshBasicMaterial({ color: '#ffb35c', toneMapped: false })); lantern.position.y = 4.34; root.add(lantern)
  const rows: [string, 1 | -1, string | null, number][] = [['ALLY CHEN', -1, null, 3.4], ['PROJECTS', 1, 'ProjectsSign', 2.62], ['ABOUT', -1, 'AboutSign', 2.02], ['COMMUNITY', 1, 'CommunitySign', 1.42], ['CONTACT', -1, 'ContactSign', .82]]
  for (const [text, direction, id, y] of rows) {
    const board = plank(text, id ? 1.75 : 2.5, id ? .5 : .74, direction, id, wood, brass)
    board.position.set(direction * -.12, y, .12); root.add(board)
  }
  root.rotation.y = .55
  root.scale.setScalar(.64)
  root.position.set(signpostPosition[0], signpostPosition[1], signpostPosition[2])
  return root
}

function glowTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d'); if (!ctx) return new CanvasTexture(canvas)
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,170,80,.95)'); g.addColorStop(.35, 'rgba(255,130,50,.45)'); g.addColorStop(1, 'rgba(255,110,40,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; return texture
}
const poolSpecs: { id: string; at: [number, number, number]; size: number; opacity: number; vertical?: boolean }[] = [
  { id: 'fireplace', at: [.5, .035, 0], size: 2.9, opacity: .55 }, // floor pool in front of the hearth (offset from pivot centre, rotated with it)
  { id: 'desk', at: [.55, .865, -.15], size: 1.1, opacity: .42 }, // lamp pool on the desktop
  { id: 'porchLanternLamp', at: [0, .03, 0], size: 2.0, opacity: .38 }, // lantern pool on the deck
]
/** Soft flame bloom: a camera-facing additive glow in the firebox plus a wider wall wash. Animated in Studio's HearthLight. */
export function addFlameGlow(pivots: Map<string, { pivot: Object3D }>) {
  const item = pivots.get('fireplace'); if (!item || item.pivot.getObjectByName('glow:flame')) return
  const texture = glowTexture()
  const make = (name: string, size: number, opacity: number, at: [number, number, number]) => {
    const sprite = new Mesh(new PlaneGeometry(size, size), new MeshBasicMaterial({ map: texture, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false }))
    sprite.name = name; sprite.position.set(...at); sprite.rotation.y = Math.PI / 2; sprite.renderOrder = 6; sprite.raycast = () => {}; sprite.userData.baseOpacity = opacity; item.pivot.add(sprite)
  }
  make('glow:flame', 1.1, .8, [.34, .5, 0]) // core bloom at the fire
  make('glow:flame-wash', 2.6, .26, [.3, .8, 0]) // wide warm wash over the hearth and mantel
}
/** Cheap additive light pools for baked (unlit) surfaces: parented to the object pivots so they follow edited layouts. */
export function addGlowPools(pivots: Map<string, { pivot: Object3D; base: { position: { y: number } } }>) {
  const texture = glowTexture()
  for (const spec of poolSpecs) {
    const item = pivots.get(spec.id); if (!item || item.pivot.getObjectByName(`glow:${spec.id}`)) continue
    const pool = new Mesh(new PlaneGeometry(spec.size, spec.size), new MeshBasicMaterial({ map: texture, transparent: true, opacity: spec.opacity, blending: AdditiveBlending, depthWrite: false, toneMapped: false }))
    pool.name = `glow:${spec.id}`; pool.rotation.x = -Math.PI / 2; pool.position.set(spec.at[0], spec.at[1] - item.base.position.y, spec.at[2]); pool.renderOrder = 2; pool.raycast = () => {}
    item.pivot.add(pool)
  }
}
