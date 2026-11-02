import { useEffect, useMemo, useState } from 'react'
import { byId, editableObjects, lockedStructures } from '../layout/registry'
import type { CameraViewName } from '../cameraViews'
import { readPlacement } from '../layout/apply'
import { getState, runtime, store, useEditor } from './store'
import './editor.css'

const views: [string, CameraViewName][] = [['Overview', 'default'], ['Workstation', 'workstation'], ['Reading nook', 'readingNook'], ['Art porch', 'designCorner'], ['Community', 'communityPinboard']]
const num = (v: number) => (Math.round(v * 1000) / 1000).toString()

function NumberField({ label, value, onCommit }: { label: string; value: number; onCommit: (v: number) => void }) {
  const [text, setText] = useState(num(value))
  useEffect(() => setText(num(value)), [value])
  const commit = () => { const v = parseFloat(text); if (Number.isFinite(v) && Math.abs(v - value) > 1e-6) onCommit(v); else setText(num(value)) }
  return <label className="ce-num"><span>{label}</span><input value={text} inputMode="decimal" onChange={e => setText(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') { commit(); (e.target as HTMLInputElement).blur() } e.stopPropagation() }} /></label>
}

/** DEV-ONLY editor chrome. Absent from production builds (mounted only behind import.meta.env.DEV and lazy-imported). */
export default function EditorPanel() {
  const s = useEditor(x => x)
  const [query, setQuery] = useState('')
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const item = s.selectedId ? runtime.pivots.get(s.selectedId) : undefined
  const placement = useMemo(() => (item ? readPlacement(item) : null), [item, s.version, s.selectedId]) // eslint-disable-line react-hooks/exhaustive-deps
  const locked = Boolean(item?.entry.locked && !s.unlocked.includes(item.entry.id))

  useEffect(() => {
    if (!s.active) return
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const id = store_selected()
      const fine = event.shiftKey ? .2 : 1, st = store_snap()
      const move = (dx: number, dy: number, dz: number) => { if (id) store.nudge(id, { dPosition: [dx * st.position * fine, dy * st.position * fine, dz * st.position * fine] }) }
      const key = event.key
      if ((event.metaKey || event.ctrlKey) && key.toLowerCase() === 'z') { event.preventDefault(); event.stopImmediatePropagation(); if (event.shiftKey) store.redoStep(); else store.undoStep(); return }
      if (key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); if (id) store.select(null); else store.setActive(false); return }
      if (!id) return
      if (key === 'Delete' || key === 'Backspace') { event.preventDefault(); event.stopImmediatePropagation(); store.toggleHidden(id); return }
      if (isLocked(id)) return
      const handled = ({ ArrowLeft: () => move(-1, 0, 0), ArrowRight: () => move(1, 0, 0), ArrowUp: () => move(0, 0, -1), ArrowDown: () => move(0, 0, 1), PageUp: () => move(0, 1, 0), PageDown: () => move(0, -1, 0),
        '[': () => store.nudge(id, { dRotation: [0, -st.rotation * fine, 0] }), ']': () => store.nudge(id, { dRotation: [0, st.rotation * fine, 0] }),
        '-': () => store.nudge(id, { dScale: -st.scale * fine }), '=': () => store.nudge(id, { dScale: st.scale * fine }), '+': () => store.nudge(id, { dScale: st.scale * fine }) } as Record<string, () => void>)[key]
      if (handled) { event.preventDefault(); event.stopImmediatePropagation(); handled() }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [s.active])

  if (!s.active) return <button className="ce-open" onClick={() => store.setActive(true)} title="Development only: reposition furniture visually">Edit Cabin <i>DEV</i></button>
  const q = query.trim().toLowerCase()
  const list = editableObjects.filter(o => !q || o.label.toLowerCase().includes(q) || o.group.toLowerCase().includes(q))
  const groups = [...new Set(list.map(o => o.group))]
  const warningsFor = (id: string) => s.warnings.filter(w => w.id === id)
  return <aside className="ce-panel" aria-label="Cabin editor (development only)">
    <header><strong>Edit Cabin</strong><i>DEV ONLY</i><button onClick={() => store.setActive(false)}>Exit</button></header>
    <p className="ce-msg" role="status">{s.message || 'Click an object in the scene or pick one below.'}</p>
    <section className="ce-row">
      {(['translate', 'rotate', 'scale'] as const).map(m => <button key={m} className={s.mode === m ? 'on' : ''} onClick={() => store.patch({ mode: m })}>{m === 'translate' ? 'Move' : m === 'rotate' ? 'Rotate' : 'Scale'}</button>)}
      <button onClick={() => store.patch({ space: s.space === 'world' ? 'local' : 'world' })} title="Gizmo orientation">{s.space === 'world' ? 'World' : 'Local'}</button>
    </section>
    <section className="ce-row small">
      <label><input type="checkbox" checked={s.snap.enabled} onChange={e => store.patch({ snap: { ...s.snap, enabled: e.target.checked } })} /> Snap</label>
      <label>move <select value={s.snap.position} onChange={e => store.patch({ snap: { ...s.snap, position: +e.target.value } })}>{[.01, .05, .1, .25].map(v => <option key={v} value={v}>{v} m</option>)}</select></label>
      <label>rot <select value={s.snap.rotation} onChange={e => store.patch({ snap: { ...s.snap, rotation: +e.target.value } })}>{[5, 15, 45, 90].map(v => <option key={v} value={v}>{v}°</option>)}</select></label>
      <label><input type="checkbox" checked={s.heightUnlock} onChange={e => store.patch({ heightUnlock: e.target.checked })} /> Height</label>
      <label title="Unlimited orbit, wide zoom, right-drag to pan"><input type="checkbox" checked={s.freeCamera} onChange={e => store.setFreeCamera(e.target.checked)} /> Free camera 360°</label>
      <label><input type="checkbox" checked={s.fullRotation} onChange={e => store.patch({ fullRotation: e.target.checked })} /> Full rotation</label>
    </section>
    <section className="ce-row">
      <button onClick={() => store.undoStep()} disabled={!s.undo.length}>Undo</button><button onClick={() => store.redoStep()} disabled={!s.redo.length}>Redo</button>
      <button onClick={() => store.resetSelected()} disabled={!item}>Reset object</button>
      <button className="danger" onClick={() => { if (item) store.toggleHidden(item.entry.id) }} disabled={!item}>{item && placement?.hidden ? 'Restore' : 'Delete'}</button>
    </section>
    <section className="ce-row small"><span>Review:</span>{views.map(([label, view]) => <button key={view} onClick={() => window.dispatchEvent(new CustomEvent('cabin-editor-view', { detail: view }))}>{label}</button>)}</section>
    {item && placement && <section className="ce-detail">
      <h3>{item.entry.label}{locked && <button onClick={() => store.unlock(item.entry.id, true)}>Unlock</button>}</h3>
      <div className="ce-grid">
        <NumberField label="X" value={placement.position[0]} onCommit={v => store.setPlacement(item.entry.id, { ...placement, position: [v, placement.position[1], placement.position[2]] })} />
        <NumberField label="Y" value={placement.position[1]} onCommit={v => store.setPlacement(item.entry.id, { ...placement, position: [placement.position[0], v, placement.position[2]] })} />
        <NumberField label="Z" value={placement.position[2]} onCommit={v => store.setPlacement(item.entry.id, { ...placement, position: [placement.position[0], placement.position[1], v] })} />
        <NumberField label="Rot Y°" value={placement.rotation[1]} onCommit={v => store.setPlacement(item.entry.id, { ...placement, rotation: [placement.rotation[0], v, placement.rotation[2]] })} />
        {s.fullRotation && <><NumberField label="Rot X°" value={placement.rotation[0]} onCommit={v => store.setPlacement(item.entry.id, { ...placement, rotation: [v, placement.rotation[1], placement.rotation[2]] })} />
          <NumberField label="Rot Z°" value={placement.rotation[2]} onCommit={v => store.setPlacement(item.entry.id, { ...placement, rotation: [placement.rotation[0], placement.rotation[1], v] })} /></>}
        <NumberField label="Scale" value={placement.scale} onCommit={v => store.setPlacement(item.entry.id, { ...placement, scale: v })} />
      </div>
      <p className="ce-hint">Offsets from the baked GLB placement (metres, degrees). Arrows move X/Z · PgUp/PgDn height · [ ] rotate · − = scale · Shift = fine · Delete/Backspace = delete (hide) · ⌘/Ctrl+Z undo.</p>
      {warningsFor(item.entry.id).map((w, i) => <p key={i} className="ce-warn">⚠ {w.text}</p>)}
    </section>}
    <input className="ce-search" placeholder="Search objects…" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.stopPropagation()} />
    <nav className="ce-list" aria-label="Editable objects">
      {groups.map(group => <div key={group}><h4>{group}</h4>{list.filter(o => o.group === group).map(o => <button key={o.id} className={s.selectedId === o.id ? 'on' : ''} disabled={!runtime.pivots.has(o.id)} onClick={() => store.select(o.id)}>
        {o.label}{s.layout.objects[o.id]?.hidden ? ' ✕ deleted' : s.layout.objects[o.id] ? ' •' : ''}{warningsFor(o.id).length ? ' ⚠' : ''}{o.locked && !s.unlocked.includes(o.id) ? ' 🔒' : ''}</button>)}</div>)}
    </nav>
    <section className="ce-global">
      {s.warnings.length > 0 && <label><input type="checkbox" checked={s.showWarnings} onChange={e => store.patch({ showWarnings: e.target.checked })} /> Show {s.warnings.length} warning{s.warnings.length === 1 ? '' : 's'}</label>}
      {s.showWarnings && s.warnings.slice(0, 6).map((w, i) => <p key={i} className="ce-warn">⚠ {w.text}</p>)}
      <div className="ce-row">
        <button className="primary" onClick={() => void store.save()} disabled={!s.dirty}>Save layout to project{s.dirty ? ' •' : ''}</button>
        <button onClick={() => store.restoreBaseline()} disabled={!s.dirty}>Revert unsaved</button>
      </div>
      <div className="ce-row">
        <button onClick={() => { void navigator.clipboard?.writeText(store.exportText()); store.message('Layout JSON copied.') }}>Copy JSON</button>
        <button onClick={() => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([store.exportText()], { type: 'application/json' })); a.download = 'layout.json'; a.click() }}>Download</button>
        <button onClick={() => setShowImport(v => !v)}>Import…</button>
        <button onClick={() => { if (confirm('Reset every object to its original GLB placement? (Not saved until you press Save.)')) store.restoreOriginal() }}>Restore baseline</button>
      </div>
      {showImport && <div><textarea value={importText} onChange={e => setImportText(e.target.value)} onKeyDown={e => e.stopPropagation()} placeholder='Paste layout JSON {"version":1,"objects":{…}}' /><button onClick={() => { if (store.importText(importText)) setShowImport(false) }}>Apply import</button></div>}
      {lockedStructures.length > 0 && <details><summary>Locked architecture</summary><ul>{lockedStructures.map(l => <li key={l}>{l}</li>)}</ul></details>}
    </section>
  </aside>
}
const store_selected = () => getState().selectedId
const store_snap = () => getState().snap
const isLocked = (id: string) => Boolean(byId.get(id)?.locked) && !getState().unlocked.includes(id)
