// Typed registry of independently movable cabin objects. Pure data: shared by the runtime layout, the dev editor and the dev-only save endpoint.
// Placements are stored as OFFSETS from the placement baked into the GLB, in three.js space (x right, y up, z toward the viewer), degrees for rotation.
export type EditGroup = 'Architecture' | 'Interior shell' | 'Outdoors' | 'Workstation' | 'Reading nook' | 'Art porch' | 'Community' | 'Details' | 'Signage'
export type EditKind = 'floor' | 'wall' | 'surface' | 'outdoor'
export interface EditableObject {
  id: string
  label: string
  group: EditGroup
  /** stable_id of GLB nodes, or "#Name" for a runtime-built Object3D. All nodes move as one unit. */
  nodes: readonly string[]
  kind: EditKind
  /** Locked entries are architecture-like; the editor requires an explicit unlock. */
  locked?: boolean
  /** Flat items (rugs) or small props never trigger furniture collision warnings. */
  exempt?: boolean
  /** Designed to sit flush against a wall (hearth): skips the wall-intersection check. */
  wallMounted?: boolean
  /** Entries this object may deliberately overlap (lamp on table, printer on desk). */
  overlaps?: readonly string[]
  scale?: readonly [number, number]
  /** Camera preset used by "review" buttons and retargeted when the object moves. */
  view?: 'workstation' | 'readingNook' | 'designCorner' | 'communityPinboard' | 'archive' | 'printer' | 'externalLinks'
}
const community = (id: string, label: string, node: string): EditableObject => ({ id, label, group: 'Community', nodes: [node], kind: 'wall', exempt: true, view: 'communityPinboard' })
export const editableObjects: readonly EditableObject[] = [
  { id: 'desk', label: 'Desk (body + drawers)', group: 'Workstation', nodes: ['Desk'], kind: 'floor', overlaps: ['printer', 'deskChair', 'deskRug', 'deskPlant', 'monitor', 'keyboard', 'deskLamp', 'deskBooks', 'deskMouse'], view: 'workstation' },
  { id: 'monitor', label: 'Monitor (projects)', group: 'Workstation', nodes: ['ProjectsMonitor'], kind: 'surface', exempt: true, view: 'workstation' },
  { id: 'keyboard', label: 'Keyboard', group: 'Workstation', nodes: ['Keyboard'], kind: 'surface', exempt: true, view: 'workstation' },
  { id: 'deskLamp', label: 'Desk lamp', group: 'Workstation', nodes: ['DeskLamp'], kind: 'surface', exempt: true },
  { id: 'deskBooks', label: 'Desk books', group: 'Workstation', nodes: ['DeskBooks'], kind: 'surface', exempt: true },
  { id: 'deskMouse', label: 'Mouse', group: 'Workstation', nodes: ['DeskMouse'], kind: 'surface', exempt: true },
  { id: 'printer', label: 'Printer (resume)', group: 'Workstation', nodes: ['PrinterBody', 'ResumePaper'], kind: 'surface', exempt: true, view: 'printer' },
  { id: 'deskChair', label: 'Desk chair', group: 'Workstation', nodes: ['DeskChair'], kind: 'floor', overlaps: ['desk', 'deskRug'], view: 'workstation' },
  { id: 'deskRug', label: 'Desk rug', group: 'Workstation', nodes: ['DeskRug'], kind: 'floor', exempt: true, view: 'workstation' },
  { id: 'deskPlant', label: 'Floor plant (by desk)', group: 'Workstation', nodes: ['DeskPlant'], kind: 'floor', exempt: true },
  { id: 'readingArmchair', label: 'Reading armchair', group: 'Reading nook', nodes: ['ReadingArmchair'], kind: 'floor', overlaps: ['readingRug', 'conversationTable'], view: 'readingNook' },
  { id: 'readingRug', label: 'Reading rug', group: 'Reading nook', nodes: ['ReadingRug'], kind: 'floor', exempt: true, view: 'readingNook' },
  { id: 'conversationTable', label: 'Low table + books', group: 'Reading nook', nodes: ['ConversationTable'], kind: 'floor', overlaps: ['readingRug'], view: 'readingNook' },
  { id: 'readingLamp', label: 'Floor lamp', group: 'Reading nook', nodes: ['ReadingLamp'], kind: 'floor', exempt: true },
  { id: 'nookSideTable', label: 'Nook side table', group: 'Reading nook', nodes: ['NookSideTable'], kind: 'floor', exempt: true },
  { id: 'entrancePlant', label: 'Plant (by fireplace)', group: 'Reading nook', nodes: ['EntrancePlant'], kind: 'floor', exempt: true },
  { id: 'fireplace', label: 'Fireplace + flames', group: 'Reading nook', nodes: ['Fireplace', 'FireEmbers'], kind: 'floor', wallMounted: true, scale: [.9, 1.1], view: 'readingNook' },
  // Interior shell parts (baked separately in Phase 7F so nothing is locked). Collision checks are skipped; the warnings' stair/wall boxes are fixed references.
  { id: 'floorBoards', label: 'Floor boards', group: 'Interior shell', nodes: ['FloorBoards'], kind: 'surface', exempt: true },
  { id: 'loftDeck', label: 'Loft deck, rails, posts, rear frame', group: 'Interior shell', nodes: ['LoftDeck'], kind: 'surface', exempt: true },
  { id: 'loftBed', label: 'Loft bed', group: 'Interior shell', nodes: ['LoftBed'], kind: 'surface', exempt: true },
  { id: 'rearPlasterWall', label: 'Rear plaster wall', group: 'Interior shell', nodes: ['RearPlasterWall'], kind: 'surface', exempt: true },
  { id: 'leftReturnWall', label: 'Left return wall + skirting', group: 'Interior shell', nodes: ['LeftReturnWall'], kind: 'surface', exempt: true },
  { id: 'loftRails', label: 'Loft rails + balusters', group: 'Interior shell', nodes: ['LoftRails'], kind: 'surface', exempt: true },
  { id: 'loftSupports', label: 'Loft columns + rear frame', group: 'Interior shell', nodes: ['LoftSupports'], kind: 'surface', exempt: true },
  { id: 'windowLedge', label: 'Window ledge', group: 'Interior shell', nodes: ['WindowLedge'], kind: 'surface', exempt: true },
  { id: 'conversationBooks', label: 'Low-table books', group: 'Reading nook', nodes: ['ConversationBooks'], kind: 'surface', exempt: true },
  { id: 'nookBooks', label: 'Side-table books', group: 'Reading nook', nodes: ['NookBooks'], kind: 'surface', exempt: true },
  { id: 'staircase', label: 'Staircase', group: 'Interior shell', nodes: ['Staircase'], kind: 'surface', exempt: true },
  { id: 'windowWall', label: 'Window wall + ledge', group: 'Interior shell', nodes: ['WindowWall'], kind: 'surface', exempt: true },
  { id: 'windowBench', label: 'Window bench', group: 'Interior shell', nodes: ['WindowBench'], kind: 'surface', exempt: true },
  { id: 'benchCushions', label: 'Bench cushions + blankets', group: 'Interior shell', nodes: ['SoftFurnishings'], kind: 'surface', exempt: true },
  { id: 'floorCushion', label: 'Floor cushion', group: 'Interior shell', nodes: ['FloorCushion'], kind: 'floor', exempt: true },
  { id: 'designDesk', label: 'Design desk + seat', group: 'Interior shell', nodes: ['DesignDesk'], kind: 'floor', exempt: true, view: 'designCorner' },
  { id: 'skillsCabinet', label: 'Skills cabinet', group: 'Interior shell', nodes: ['SkillsCabinet'], kind: 'floor', exempt: true, view: 'archive' },
  { id: 'experienceShelf', label: 'Experience shelf', group: 'Interior shell', nodes: ['ExperienceShelf'], kind: 'floor', exempt: true, view: 'archive' },
  { id: 'wallShelf', label: 'Wall shelf + books', group: 'Interior shell', nodes: ['WallShelf'], kind: 'surface', exempt: true },
  { id: 'communityBoard', label: 'Community pinboard backing', group: 'Interior shell', nodes: ['CommunityBoard'], kind: 'surface', exempt: true, view: 'communityPinboard' },
  { id: 'wallClock', label: 'Wall clock', group: 'Interior shell', nodes: ['WallClock'], kind: 'surface', exempt: true },
  { id: 'hangingPlants', label: 'Hanging/window plants', group: 'Interior shell', nodes: ['HangingPlants'], kind: 'surface', exempt: true },
  { id: 'floorPlant2', label: 'Plants (archive, floor)', group: 'Interior shell', nodes: ['FloorPlant2'], kind: 'surface', exempt: true },
  { id: 'frontTrim', label: 'Entrance step + front trim', group: 'Interior shell', nodes: ['StudioStatic'], kind: 'surface', exempt: true },
  { id: 'backWall', label: 'Back wall boards + corner posts', group: 'Architecture', nodes: ['BackWall'], kind: 'surface', exempt: true },
  { id: 'floorFascia', label: 'Floor fascia + threshold', group: 'Architecture', nodes: ['FloorFascia'], kind: 'surface', exempt: true },
  { id: 'leftWallFrame', label: 'Left wall cap + doorway frame', group: 'Architecture', nodes: ['LeftWallFrame'], kind: 'surface', exempt: true },
  { id: 'porchStool', label: 'Porch stool', group: 'Art porch', nodes: ['PorchStool'], kind: 'floor', exempt: true, view: 'designCorner' },
  { id: 'porchSketchbook', label: 'Porch sketchbook', group: 'Art porch', nodes: ['PorchSketchbook'], kind: 'surface', exempt: true, view: 'designCorner' },
  { id: 'porchSupplyTable', label: 'Porch supply table + paints', group: 'Art porch', nodes: ['PorchSupplyTable'], kind: 'floor', exempt: true, view: 'designCorner' },
  { id: 'porchFern', label: 'Porch fern', group: 'Art porch', nodes: ['PorchFern'], kind: 'floor', exempt: true },
  { id: 'terrain', label: 'Ground, rocks and grass', group: 'Outdoors', nodes: ['ForestGround'], kind: 'surface', exempt: true },
  { id: 'forest', label: 'Spruce forest (all trees)', group: 'Outdoors', nodes: ['#Spruce woodland'], kind: 'surface', exempt: true, scale: [.5, 1.5] },
  { id: 'chimney', label: 'Chimney stack', group: 'Reading nook', nodes: ['Chimney'], kind: 'surface', exempt: true, view: 'readingNook' },
  { id: 'hearthMantel', label: 'Mantel + corbels', group: 'Reading nook', nodes: ['HearthMantel'], kind: 'surface', exempt: true, view: 'readingNook' },
  { id: 'roofShingles', label: 'Main roof shingles + underlay', group: 'Architecture', nodes: ['RoofShingles'], kind: 'surface', exempt: true },
  { id: 'roofRafters', label: 'Main roof rafters', group: 'Architecture', nodes: ['RoofRafters'], kind: 'surface', exempt: true },
  { id: 'roofTrim', label: 'Roof ridge, eave and fascia trim', group: 'Architecture', nodes: ['RoofTrim'], kind: 'surface', exempt: true },
  { id: 'porchRoofShingles', label: 'Porch roof shingles + underlay', group: 'Art porch', nodes: ['PorchRoofShingles'], kind: 'surface', exempt: true },
  { id: 'porchRoofFrame', label: 'Porch roof rafters + trim', group: 'Art porch', nodes: ['PorchRoofFrame'], kind: 'surface', exempt: true },
  { id: 'porchBoards', label: 'Porch deck boards + joists', group: 'Art porch', nodes: ['PorchBoards'], kind: 'surface', exempt: true, view: 'designCorner' },
  { id: 'porchFascia', label: 'Porch fascia boards', group: 'Art porch', nodes: ['PorchFascia'], kind: 'surface', exempt: true },
  { id: 'porchPosts', label: 'Porch posts', group: 'Art porch', nodes: ['PorchPosts'], kind: 'surface', exempt: true },
  { id: 'porchBeams', label: 'Porch beams + braces', group: 'Art porch', nodes: ['PorchBeams'], kind: 'surface', exempt: true },
  { id: 'porchRails', label: 'Porch rails + balusters', group: 'Art porch', nodes: ['PorchRails'], kind: 'surface', exempt: true },
  { id: 'porchSteps', label: 'Porch steps', group: 'Art porch', nodes: ['PorchSteps'], kind: 'surface', exempt: true },
  { id: 'paintSupplies', label: 'Paint jars + brushes', group: 'Art porch', nodes: ['PaintSupplies'], kind: 'surface', exempt: true, view: 'designCorner' },
  { id: 'porchLanternLamp', label: 'Porch lantern', group: 'Art porch', nodes: ['PorchLanternLamp'], kind: 'surface', exempt: true },
  { id: 'porchStringLights', label: 'Porch string lights', group: 'Art porch', nodes: ['PorchStringLights'], kind: 'surface', exempt: true },
  { id: 'easel', label: 'Art easel + canvas', group: 'Art porch', nodes: ['ArtEasel'], kind: 'floor', overlaps: ['porchSupplyTable'], view: 'designCorner' },
    community('communityEsc', 'Card: Eng. Council', 'Community_ESC'), community('communityStartup', 'Card: Startup Hub', 'Community_StartupHub'),
  community('communityDfa', 'Card: Design for America', 'Community_DFA'), community('communityBeaverHacks', 'Card: BeaverHacks', 'Community_BeaverHacks'),
  community('communityAi', 'Card: AI Club', 'Community_AIClub'), community('communityBh26', 'Card: BeaverHacks 2026', 'Community_BeaverHacks2026'),
  community('communityIj', 'Card: Innovation Jam', 'Community_InnovationJam2026'), community('communityEw', 'Card: Engineers’ Week', 'Community_EngineersWeek'),
  { id: 'aboutBook', label: 'About book', group: 'Details', nodes: ['AboutBook'], kind: 'surface', exempt: true, view: 'readingNook' },
  { id: 'sketchbook', label: 'Sketchbook', group: 'Details', nodes: ['Sketchbook'], kind: 'surface', exempt: true, view: 'designCorner' },
  { id: 'stickerBook', label: 'Sticker book', group: 'Details', nodes: ['StickerBook'], kind: 'surface', exempt: true, view: 'designCorner' },
  { id: 'unwrapDisplay', label: 'Unwrap display', group: 'Details', nodes: ['UnwrapDisplay'], kind: 'surface', exempt: true, view: 'designCorner' },
  { id: 'skillsVolume', label: 'Skills volume', group: 'Details', nodes: ['SkillsVolume'], kind: 'surface', exempt: true, view: 'archive' },
  { id: 'experienceVolume', label: 'Experience volume', group: 'Details', nodes: ['ExperienceVolume'], kind: 'surface', exempt: true, view: 'archive' },
  { id: 'github', label: 'GitHub plaque', group: 'Signage', nodes: ['ExternalGitHub'], kind: 'surface', exempt: true, view: 'externalLinks' },
  { id: 'linkedin', label: 'LinkedIn plaque', group: 'Signage', nodes: ['ExternalLinkedIn'], kind: 'surface', exempt: true, view: 'externalLinks' },
  { id: 'signpost', label: 'Front-field signpost', group: 'Signage', nodes: ['#Front field signpost'], kind: 'outdoor', scale: [.5, 1.3] },
]
/** Phase 7F: nothing is locked any more. Entries may still set `locked` to require an explicit Unlock in the editor. */
export const lockedStructures = [] as readonly string[]
export const registryIds = editableObjects.map(entry => entry.id)
export const byId = new Map(editableObjects.map(entry => [entry.id, entry]))

export interface Placement { position: [number, number, number]; rotation: [number, number, number]; scale: number; /** Deleted (hidden) in the editor; saved so it stays gone. */ hidden?: boolean }
export interface LayoutFile { version: 1; objects: Record<string, Placement> }
export const bounds = { position: 12, scale: [.3, 2.5] as const }
export const identityPlacement = (): Placement => ({ position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 })

/** Dev-save validation. Returns an error string or null. */
export function validateLayout(value: unknown): string | null {
  const file = value as LayoutFile
  if (!file || file.version !== 1 || typeof file.objects !== 'object' || file.objects === null) return 'Layout must be {version:1, objects:{…}}'
  for (const [id, p] of Object.entries(file.objects)) {
    if (!byId.has(id)) return `Unknown object id: ${id}`
    const entry = byId.get(id)!
    if (!Array.isArray(p?.position) || p.position.length !== 3 || p.position.some(v => !Number.isFinite(v) || Math.abs(v) > bounds.position)) return `${id}: position out of bounds`
    if (!Array.isArray(p.rotation) || p.rotation.length !== 3 || p.rotation.some(v => !Number.isFinite(v) || Math.abs(v) > 720)) return `${id}: rotation out of bounds`
    const [min, max] = entry.scale ?? bounds.scale
    if (p.hidden !== undefined && typeof p.hidden !== 'boolean') return `${id}: hidden must be true/false`
    if (!Number.isFinite(p.scale) || p.scale < Math.min(min, bounds.scale[0]) || p.scale > Math.max(max, bounds.scale[1])) return `${id}: scale out of bounds`
  }
  return null
}
export function formatLayout(file: LayoutFile): string {
  const round = (n: number) => Math.round(n * 10000) / 10000
  const objects: Record<string, Placement> = {}
  for (const id of Object.keys(file.objects).sort()) {
    const p = file.objects[id]
    objects[id] = { position: p.position.map(round) as Placement['position'], rotation: p.rotation.map(round) as Placement['rotation'], scale: round(p.scale), ...(p.hidden ? { hidden: true } : {}) }
  }
  return JSON.stringify({ version: 1, objects }, null, 2) + '\n'
}
