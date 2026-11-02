import { CanvasTexture, CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from 'three'

/** Procedural forest-floor texture (moss mottling, needle litter, pebbles, fern flecks) drawn once into a tiling canvas, laid as a lit transparent overlay over the whole ground. */
export function createForestFloorDetail() {
  const size = 1024, canvas = document.createElement('canvas'); canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  let seed = 5; const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  const blob = (x: number, y: number, r: number, color: string) => { for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) { const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2) } }
  for (let i = 0; i < 38; i++) blob(random() * size, random() * size, 70 + random() * 120, random() < .5 ? 'rgba(20,48,28,.34)' : 'rgba(86,70,36,.26)') // moss and earth mottling
  for (let i = 0; i < 2600; i++) { // needle litter and moss flecks
    const x = random() * size, y = random() * size, a = random() * Math.PI, l = 3 + random() * 9
    ctx.strokeStyle = ['rgba(150,98,44,.55)', 'rgba(30,60,32,.6)', 'rgba(210,150,70,.35)', 'rgba(14,30,20,.55)'][Math.floor(random() * 4)]; ctx.lineWidth = 1 + random() * 1.2
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke()
  }
  for (let i = 0; i < 180; i++) { const x = random() * size, y = random() * size, r = 1.5 + random() * 3.5; ctx.fillStyle = random() < .5 ? 'rgba(120,118,104,.55)' : 'rgba(70,66,58,.6)'; ctx.beginPath(); ctx.ellipse(x, y, r, r * .7, random() * 3, 0, 6.3); ctx.fill() } // pebbles
  for (let i = 0; i < 70; i++) { const x = random() * size, y = random() * size; ctx.strokeStyle = 'rgba(60,118,64,.55)'; ctx.lineWidth = 1.4; for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + random(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * (5 + random() * 8), y + Math.sin(a) * (5 + random() * 8)); ctx.stroke() } } // fern flecks
  const texture = new CanvasTexture(canvas); texture.wrapS = texture.wrapT = RepeatWrapping; texture.repeat.set(16, 16); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4
  const overlay = new Mesh(new CircleGeometry(90, 48), new MeshStandardMaterial({ map: texture, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }))
  overlay.name = 'Forest floor detail'; overlay.rotation.x = -Math.PI / 2; overlay.position.y = -.33; overlay.raycast = () => {}; overlay.renderOrder = 1
  return overlay
}
