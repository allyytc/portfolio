import { Box3, CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector3 } from 'three'
import type { Object3D } from 'three'

// Real event/organization photographs (resized derivatives of migrated originals in public/media) with a large readable caption.
const cards: Record<string, { file: string; label: string }> = {
  Community_ESC: { file: 'card-esc.jpg', label: 'Eng. Council' },
  Community_StartupHub: { file: 'card-startup.jpg', label: 'Startup Hub' },
  Community_DFA: { file: 'card-dfa.jpg', label: 'Design for America' },
  Community_BeaverHacks: { file: 'card-beaverhacks.jpg', label: 'BeaverHacks' },
  Community_AIClub: { file: 'card-ai-club.jpg', label: 'AI Club' },
  Community_BeaverHacks2026: { file: 'card-beaverhacks2026.jpg', label: 'BeaverHacks 2026' },
  Community_InnovationJam2026: { file: 'card-innovationJam2026.jpg', label: 'Innovation Jam' },
  Community_EngineersWeek: { file: 'card-engineersWeek.jpg', label: 'Engineers’ Week' },
}

function cardTexture(file: string, label: string, onLoad: () => void) {
  const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 540
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4
  const paint = (image?: HTMLImageElement) => {
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.fillStyle = '#f0e5d2'; ctx.fillRect(0, 0, 640, 540)
    ctx.fillStyle = '#263f35'; ctx.fillRect(14, 14, 612, 512)
    if (image) ctx.drawImage(image, 14, 14, 612, 512)
    const band = ctx.createLinearGradient(0, 330, 0, 526); band.addColorStop(0, 'rgba(20,42,37,0)'); band.addColorStop(.4, 'rgba(20,42,37,.88)'); band.addColorStop(1, 'rgba(20,42,37,.96)')
    ctx.fillStyle = band; ctx.fillRect(14, 330, 612, 196)
    ctx.fillStyle = '#f0e5d2'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    let size = 86; ctx.font = `800 ${size}px Nunito, "Avenir Next", system-ui, sans-serif`
    const fit = 560 / ctx.measureText(label).width; if (fit < 1) { size *= fit; ctx.font = `800 ${size}px Nunito, "Avenir Next", system-ui, sans-serif` }
    ctx.fillText(label, 320, 455)
    texture.needsUpdate = true; onLoad()
  }
  paint()
  const image = new Image(); image.onload = () => paint(image)
  image.src = `${import.meta.env.BASE_URL}media/world/${file}`
  void document.fonts?.ready.then(() => paint(image.complete && image.naturalWidth ? image : undefined))
  return texture
}

export function applyCommunityCards(root: Object3D, redraw: () => void) {
  root.updateMatrixWorld(true)
  const nodes = new Map<string, Object3D>()
  root.traverse(o => { if (typeof o.userData.stable_id === 'string' && o.userData.stable_id in cards && !nodes.has(o.userData.stable_id)) nodes.set(o.userData.stable_id, o) })
  for (const [id, node] of nodes) {
    const box = new Box3().setFromObject(node), size = box.getSize(new Vector3()), center = box.getCenter(new Vector3())
    const { file, label } = cards[id]
    const plane = new Mesh(new PlaneGeometry(size.x * .96, size.y * .96), new MeshBasicMaterial({ map: cardTexture(file, label, redraw), toneMapped: false }))
    plane.position.copy(node.worldToLocal(new Vector3(center.x, center.y, box.max.z + .006)))
    plane.name = `${label} photo card`
    node.add(plane)
  }
}
