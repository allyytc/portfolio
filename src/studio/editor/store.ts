// DEV-ONLY cabin editor state. Imported by dev-only modules; never part of the production UI.
import { useSyncExternalStore } from 'react'
import { applyLayout, applyPlacement, readPlacement, savedLayout } from '../layout/apply'
import type { EditPivot } from '../layout/apply'
import { bounds, byId, formatLayout, identityPlacement, validateLayout } from '../layout/registry'
import type { LayoutFile, Placement } from '../layout/registry'
import { computeWarnings } from './collisions'
import type { Warning } from './collisions'

export type Mode = 'translate' | 'rotate' | 'scale'
export interface EditorState {
  active: boolean; selectedId: string | null; mode: Mode; space: 'world' | 'local'; fullRotation: boolean; heightUnlock: boolean; freeCamera: boolean
  snap: { enabled: boolean; position: number; rotation: number; scale: number }
  layout: LayoutFile; baseline: LayoutFile; undo: LayoutFile[]; redo: LayoutFile[]
  dragging: boolean; version: number; unlocked: string[]; warnings: Warning[]; showWarnings: boolean; message: string; dirty: boolean
}
const clone = (file: LayoutFile): LayoutFile => JSON.parse(JSON.stringify(file))
let state: EditorState = {
  active: false, selectedId: null, mode: 'translate', space: 'world', fullRotation: false, heightUnlock: false, freeCamera: false,
  snap: { enabled: true, position: .05, rotation: 15, scale: .05 }, layout: clone(savedLayout), baseline: clone(savedLayout), undo: [], redo: [],
  dragging: false, version: 0, unlocked: [], warnings: [], showWarnings: true, message: '', dirty: false,
}
const listeners = new Set<() => void>()
export const runtime: { pivots: Map<string, EditPivot>; invalidate: () => void } = { pivots: new Map(), invalidate: () => {} }
const emit = () => { listeners.forEach(listener => listener()); runtime.invalidate() }
const set = (patch: Partial<EditorState>) => { state = { ...state, ...patch }; emit() }
export const getState = () => state
export const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
export const useEditor = <T,>(select: (value: EditorState) => T): T => useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb) }, () => select(state), () => select(state))

const refresh = (message?: string) => {
  const dirty = formatLayout(state.layout) !== formatLayout(state.baseline)
  set({ version: state.version + 1, warnings: computeWarnings(runtime.pivots), dirty, ...(message !== undefined ? { message } : {}) })
}
export const store = {
  register(pivots: Map<string, EditPivot>, invalidate: () => void) { runtime.pivots = pivots; runtime.invalidate = invalidate; applyLayout(pivots, state.layout); set({ warnings: computeWarnings(pivots) }) },
  setActive(active: boolean) { set({ active, selectedId: active ? state.selectedId : null, dragging: false, message: active ? 'Edit mode: portfolio navigation is paused. Free camera is on.' : '' }); store.setFreeCamera(active) },
  setFreeCamera(on: boolean) { set({ freeCamera: on }); window.dispatchEvent(new CustomEvent('cabin-editor-free-camera', { detail: on })) },
  select(id: string | null) {
    if (id && !byId.has(id)) return
    const locked = id ? byId.get(id)?.locked && !state.unlocked.includes(id) : false
    set({ selectedId: id, message: id ? (locked ? `${byId.get(id)!.label} is locked architecture. Use “Unlock” to move it.` : byId.get(id)!.label) : '' })
  },
  patch(patch: Partial<Pick<EditorState, 'mode' | 'space' | 'fullRotation' | 'heightUnlock' | 'snap' | 'showWarnings'>>) { set(patch) },
  unlock(id: string, on: boolean) { set({ unlocked: on ? [...state.unlocked, id] : state.unlocked.filter(value => value !== id) }) },
  setDragging(dragging: boolean) { set({ dragging }) },
  isDragging() { return state.dragging },
  checkpoint() { set({ undo: [...state.undo.slice(-49), clone(state.layout)], redo: [] }) },
  /** Writes the current pivot transform of an object into the working layout (clamped to registry bounds). */
  syncFromPivot(id: string) {
    const item = runtime.pivots.get(id); if (!item) return
    const [min, max] = item.entry.scale ?? bounds.scale
    const s = Math.max(Math.min(min, bounds.scale[0]), Math.min(Math.max(max, bounds.scale[1]), item.pivot.scale.x))
    item.pivot.scale.setScalar(s); item.pivot.updateMatrixWorld(true)
    const placement = readPlacement(item)
    const objects = { ...state.layout.objects }
    if (isIdentity(placement)) delete objects[id]; else objects[id] = placement
    state = { ...state, layout: { version: 1, objects } }
    refresh()
  },
  /** Numeric/keyboard edit: applies a placement to the object and records it. */
  setPlacement(id: string, placement: Placement, history = true) {
    const item = runtime.pivots.get(id); if (!item) return
    if (history) store.checkpoint()
    applyPlacement(item, placement)
    store.syncFromPivot(id)
  },
  nudge(id: string, delta: Partial<Placement> & { dPosition?: [number, number, number]; dRotation?: [number, number, number]; dScale?: number }) {
    const item = runtime.pivots.get(id); if (!item) return
    const cur = readPlacement(item)
    store.setPlacement(id, {
      position: cur.position.map((v, i) => v + (delta.dPosition?.[i] ?? 0)) as Placement['position'],
      rotation: cur.rotation.map((v, i) => v + (delta.dRotation?.[i] ?? 0)) as Placement['rotation'],
      scale: cur.scale + (delta.dScale ?? 0),
      ...(cur.hidden ? { hidden: true } : {}),
    })
  },
  /** Delete = hide: saved in layout.json, undoable, restorable. The model files are never modified. */
  toggleHidden(id: string) {
    const item = runtime.pivots.get(id); if (!item) return
    store.checkpoint(); applyPlacement(item, { ...readPlacement(item), hidden: item.pivot.visible }); store.syncFromPivot(id)
    store.message(item.pivot.visible ? `${item.entry.label} restored` : `${item.entry.label} deleted (hidden). Use Restore or Undo to bring it back.`)
  },
  resetSelected() { const id = state.selectedId; if (id) store.setPlacement(id, state.baseline.objects[id] ? clone({ version: 1, objects: { [id]: state.baseline.objects[id] } }).objects[id] : identityPlacement()) },
  undoStep() { const prev = state.undo[state.undo.length - 1]; if (!prev) return; state = { ...state, undo: state.undo.slice(0, -1), redo: [...state.redo, clone(state.layout)], layout: prev }; applyLayout(runtime.pivots, state.layout); refresh('Undo') },
  redoStep() { const next = state.redo[state.redo.length - 1]; if (!next) return; state = { ...state, redo: state.redo.slice(0, -1), undo: [...state.undo, clone(state.layout)], layout: next }; applyLayout(runtime.pivots, state.layout); refresh('Redo') },
  restoreBaseline() { store.checkpoint(); state = { ...state, layout: clone(state.baseline) }; applyLayout(runtime.pivots, state.layout); refresh('Restored the last saved layout') },
  restoreOriginal() { store.checkpoint(); state = { ...state, layout: { version: 1, objects: {} } }; applyLayout(runtime.pivots, state.layout); refresh('Reset every object to the GLB placement (not saved yet)') },
  exportText() { return formatLayout(state.layout) },
  importText(text: string) {
    try {
      const file = JSON.parse(text) as LayoutFile; const error = validateLayout(file)
      if (error) { set({ message: `Import rejected: ${error}` }); return false }
      store.checkpoint(); state = { ...state, layout: clone(file) }; applyLayout(runtime.pivots, state.layout); refresh('Layout imported (not saved yet)'); return true
    } catch { set({ message: 'Import rejected: not valid JSON' }); return false }
  },
  async save() {
    const error = validateLayout(state.layout); if (error) { set({ message: `Not saved: ${error}` }); return }
    try {
      const response = await fetch('/__cabin-layout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: formatLayout(state.layout) })
      const body = await response.json() as { ok: boolean; error?: string; file?: string }
      if (!body.ok) { set({ message: `Not saved: ${body.error ?? response.status}` }); return }
      state = { ...state, baseline: clone(state.layout) }; refresh(`Saved to ${body.file}. Commit it to keep it.`)
    } catch { set({ message: 'Save endpoint unavailable. Use Export / Copy JSON instead.' }) }
  },
  message(text: string) { set({ message: text }) },
}
const isIdentity = (p: Placement) => !p.hidden && p.position.every(v => Math.abs(v) < 1e-4) && p.rotation.every(v => Math.abs(v) < 1e-3) && Math.abs(p.scale - 1) < 1e-4

if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__cabinEditor = { store, getState, runtime }
