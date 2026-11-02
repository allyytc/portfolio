import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { identity } from './content/identity'
import { parseRoute, writeRoute, updateRouteTitle, ContentRouteContext } from './navigation'
import QuickView from './components/QuickView'
import PortfolioDialog from './components/PortfolioDialog'
import type { PanelSelection, PanelType } from './content/experiences'
import SceneBoundary from './components/SceneBoundary'
import { useReducedMotion } from './hooks/useReducedMotion'

import { interactions } from './studio/interactions'
import type { InteractionId, NavigationRequest } from './studio/interactions'
import type { CameraViewName } from './studio/cameraViews'

const Studio = lazy(() => import('./studio/Studio'))

export default function App() {
  const [routeEpoch,setRouteEpoch]=useState(0)
  const [routeNotice,setRouteNotice]=useState(false)
  const [selection, setSelection] = useState<PanelSelection | null>(null)
  const [printing, setPrinting] = useState(false)
  const reducedMotion = useReducedMotion()
  const [request, setRequest] = useState<NavigationRequest>({ id: null, view: 'default', serial: 0, keyboard: false })
  const [settled, setSettled] = useState(0)
  const [ready, setReady] = useState(false)
  const [paperReady, setPaperReady] = useState(false)
  const [touchEnabled, setTouchEnabled] = useState(false)
  const [lightRendering,setLightRendering]=useState(false)
  const onUnavailable=useCallback(()=>setReady(false),[])
  const [hint, setHint] = useState(true)
  const [command, setCommand] = useState({ serial: 0, zoomDelta: 0 })
  const serial = useRef(0)
  const consumed = useRef(0)
  const pending = useRef<PanelSelection | null>(null)
  const panel = selection?.type ?? null
  const onReady = useCallback(() => setReady(true), [])
  const onSettled = useCallback((value: number) => setSettled(value), [])
  const onPrinted = useCallback(() => setPaperReady(true), [])
  const reset = (syncURL=true) => {
    if(syncURL)writeRoute(null)
    else updateRouteTitle(null)
    pending.current = null
    consumed.current = ++serial.current
    setSelection(null); setPrinting(false)
    setRequest({ id: null, view: 'default', serial: serial.current, keyboard: false })
  }
  const direct = (value: PanelType, item?: string, syncURL=true) => {
    if(syncURL){setRouteNotice(false);writeRoute({type:value,item})}
    else updateRouteTitle({type:value,item})
    consumed.current = serial.current
    setPrinting(false)
    if (ready && settled !== request.serial && !reducedMotion) pending.current = { type: value, item }
    else { pending.current = null; setSelection({ type: value, item }) }
  }
  const openProjects = () => direct('projects')
  const openResume = () => direct('resume')
  const closePanel = () => { writeRoute(null); pending.current = null; setSelection(null); setPrinting(false) }
  const navigate = (id: InteractionId, keyboard = false) => {
    const item = interactions[id]
    // External tabs are opened only by the current user gesture, never by an
    // asynchronous camera completion (which would be popup-blocked).
    if (item.panel === 'external' && item.href) window.open(item.href, '_blank', 'noopener,noreferrer')
    const target = { type: item.panel, item: item.item }
    setRouteNotice(false);writeRoute(target)
    pending.current = null
    if (selection && item.view === request.view && settled === request.serial) {
      consumed.current = serial.current
      setSelection(target)
      return
    }
    const next = ++serial.current
    setSelection(null); setPaperReady(reducedMotion); setPrinting(item.panel === 'resume')
    setRequest({ id, view: item.view, serial: next, keyboard })
    if (!ready || reducedMotion) {
      consumed.current = next; setSelection(target)
    }
  }
  useEffect(() => {
    if (ready && request.serial !== settled) return
    if (pending.current) { setSelection(pending.current); pending.current = null; return }
    if (!request.id || consumed.current >= request.serial) return
    const item = interactions[request.id]
    if (item.panel === 'resume' && !paperReady) return
    consumed.current = request.serial
    setSelection({ type: item.panel, item: item.item })
  }, [request, settled, paperReady, ready])
  const browserRoute=useRef<()=>void>(()=>{})
  browserRoute.current=()=>{const route=parseRoute(location.hash);setRouteNotice(route.invalid);setRouteEpoch(epoch=>epoch+1);if(route.selection)direct(route.selection.type,route.selection.item,false);else reset(false)}
  useEffect(()=>{if(location.hash)browserRoute.current();const apply=()=>browserRoute.current();window.addEventListener('hashchange',apply);return()=>{window.removeEventListener('hashchange',apply)}},[])
  // DEV-ONLY: the cabin editor's review buttons reuse the normal camera request path (no panel opens).
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const onView = (event: Event) => { const next = ++serial.current; consumed.current = next; setSelection(null); setRequest({ id: null, view: (event as CustomEvent<CameraViewName>).detail, serial: next, keyboard: false }) }
    window.addEventListener('cabin-editor-view', onView)
    return () => window.removeEventListener('cabin-editor-view', onView)
  }, [])
  const focused = request.id ? interactions[request.id] : null
  const zoom = (zoomDelta: number) => setCommand(value => ({ serial: value.serial + 1, zoomDelta }))

  return (
    <div className="site-shell midnight-cabin">
      <a className="skip-link" href="#studio-destinations" onClick={event=>{event.preventDefault();document.getElementById('studio-destinations')?.focus()}}>Skip to portfolio navigation</a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="Ally Chen home"><span className="leaf-mark" aria-hidden="true">❧</span> Ally Chen<span className="wordmark-dot">.</span></a>
        <nav aria-label="Portfolio navigation">
          <button onClick={openProjects}>Projects</button>
          <button onClick={openResume}>Resume</button>
          <button className="contact-trigger" onClick={() => direct('contact')}>Contact <span aria-hidden="true">↗</span></button>
        </nav>
      </header>

      <main>
        {routeNotice&&<p className="route-notice" role="status">That portfolio link is unavailable. Choose a destination from Studio Menu or the direct links.</p>}
        <h1 className="sr-only">Ally Chen’s creative studio</h1>
        <div className="studio-meta">
          <p className="eyebrow">{identity.subtitle}</p>
          <p className="role-label"><span aria-hidden="true" />{identity.role}</p>
        </div>
        <section className="studio-stage" aria-label="Interactive miniature creative studio">
          <div className="stage-corner"><span className="tiny-leaf" aria-hidden="true">✧</span> Midnight Spruce · Creative cabin</div>
          <SceneBoundary onUnavailable={() => setReady(false)}>
            <Suspense fallback={<div className="scene-loading" role="status">Opening the studio<span className="loading-dots">…</span></div>}>
              <Studio lightRendering={lightRendering} onUnavailable={onUnavailable} onNavigate={navigate} request={request} command={command} onSettled={onSettled} onReset={()=>reset()} ready={ready} onReady={onReady} touchEnabled={touchEnabled} onPrinted={onPrinted} panel={panel} paperOut={printing || panel === 'resume'} reducedMotion={reducedMotion} />
            </Suspense>
          </SceneBoundary>
          <div className="camera-toolbar" aria-label="Camera controls">
            <button disabled={!ready || settled !== request.serial} onClick={() => zoom(-.1)} aria-label="Zoom out">−</button>
            <button disabled={!ready || settled !== request.serial} onClick={() => zoom(.1)} aria-label="Zoom in">+</button>
            <button onClick={()=>reset()}>Reset View</button>
            <button className="touch-toggle" aria-pressed={touchEnabled} onClick={() => setTouchEnabled(v => !v)}>Touch controls {touchEnabled ? 'on' : 'off'}</button>
          </div>
          {hint && !focused && <div className="scene-caption camera-hint"><span>Follow a wooden sign, try the monitor, or visit the art porch.</span><button aria-label="Dismiss camera hint" onClick={() => setHint(false)}>×</button></div>}

        </section>

        <p className="sr-only" role="status">{focused ? `${focused.title}${ready && settled !== request.serial ? ', moving camera' : ', view ready'}` : 'Studio overview'}</p>
        {focused && !selection && settled === request.serial && <section className="focus-card" aria-label="Focused studio zone"><div><p className="eyebrow">In the studio</p><h2>{focused.title}</h2><button onClick={() => direct(focused.panel, focused.item)}>Open {focused.shortLabel}</button></div><button onClick={()=>reset()}>Back to Studio</button></section>}
        <QuickView lightRendering={lightRendering} onLightRenderingChange={setLightRendering} onDirect={direct} onExplore={navigate} />
      </main>

      <footer className="site-footer"><span>Midnight Spruce · Ally Chen</span><a href={`mailto:${identity.email}`}>{identity.email} ↗</a><a className="text-portfolio-link" href={`${import.meta.env.BASE_URL}content.html`}>Text portfolio</a><a className="credit" href={`${import.meta.env.BASE_URL}licenses/THIRD_PARTY_NOTICES.txt`}>Asset credits</a></footer>
      {selection && <ContentRouteContext.Provider value={writeRoute}><PortfolioDialog key={routeEpoch} selection={selection} onClose={closePanel} onReset={()=>reset()} onNavigate={navigate} /></ContentRouteContext.Provider>}
    </div>
  )
}
