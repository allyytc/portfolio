import { Component, lazy, Suspense, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { identity } from '../content/identity'
import { resume } from '../content/resume'
const ExperienceContent = lazy(() => import('./ExperiencePanels').then(module => ({ default: module.ExperienceContent })))
import type { PanelSelection, PanelType } from '../content/experiences'
import type { InteractionId } from '../studio/interactions'
class PanelContentBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<section role="alert"><h3>Portfolio content could not load.</h3><p>You can still read the text portfolio, open the resume, or contact Ally directly.</p><nav className="related-links" aria-label="Content recovery"><a href={`${import.meta.env.BASE_URL}content.html`}>Read the text portfolio →</a><a href={`${import.meta.env.BASE_URL}${resume.url}`} target="_blank" rel="noopener noreferrer">Open Resume PDF ↗</a><a href={`mailto:${identity.email}`}>Email {identity.email} ↗</a><button onClick={()=>location.reload()}>Retry by reloading</button></nav></section>:this.props.children}
}
export type Panel = PanelType | null
const titles: Record<PanelType, string> = { projects: 'Selected projects.', resume: 'My resume.', design: 'Design work · Unwrap', community: 'Community & involvement', stickers: 'The sticker book', about: 'About me', archive: 'Skills & experience', contact: 'Get in touch', external: 'Around the web' }
const sectionOptions: { id: InteractionId; type: PanelType; label: string }[] = [
  {id:'projects',type:'projects',label:'Projects'}, {id:'design',type:'design',label:'Design / Unwrap'}, {id:'community',type:'community',label:'Community'}, {id:'stickers',type:'stickers',label:'Sticker book'}, {id:'about',type:'about',label:'About'}, {id:'archive',type:'archive',label:'Experience & skills'}, {id:'resume',type:'resume',label:'Resume'}, {id:'contact',type:'contact',label:'Contact'}, {id:'github',type:'external',label:'Profiles'},
]
export default function PortfolioDialog({ selection, onClose, onReset, onNavigate }: { selection: PanelSelection; onClose: () => void; onReset: () => void; onNavigate: (id: InteractionId) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const previous = useRef(`${selection.type}-${selection.item ?? ''}`)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const invoker = document.activeElement as HTMLElement | null
    dialog.showModal()
    return () => { dialog.close(); if (invoker?.isConnected && invoker !== document.body) invoker.focus() }
  }, [])
  useEffect(() => {
    const key = `${selection.type}-${selection.item ?? ''}`
    if (key === previous.current) return
    previous.current = key
    if (ref.current) { ref.current.scrollTop = 0; ref.current.querySelector<HTMLElement>('#panel-title')?.focus() }
  }, [selection.type, selection.item])
  useEffect(() => {
    const element = header.current
    if (!element || !ref.current) return
    const update = () => ref.current?.style.setProperty('--studio-panel-head-height', `${element.getBoundingClientRect().height}px`)
    const observer = new ResizeObserver(update); observer.observe(element); update()
    return () => observer.disconnect()
  }, [])
  return <dialog ref={ref} className={`portfolio-dialog experience-${selection.type}`} aria-labelledby="panel-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="dialog-head" ref={header}><div className="dialog-topline"><span className="eyebrow">{{projects:'At the workstation',design:'From the art porch',community:'On the community wall',about:'By the fireside',archive:'From the archive',resume:'Fresh from the printer',stickers:'From the art book',contact:'A note from the cabin',external:'Beyond the cabin'}[selection.type]}</span><button className="close-button" onClick={onClose} aria-label="Close panel" autoFocus>×</button></div>
    <div className="dialog-navigation"><button className="panel-link" onClick={onReset}>↖ Back to Studio</button><label className="section-picker">Explore <select aria-label="Explore studio sections" value={selection.type} onChange={event => { const option = sectionOptions.find(item => item.type === event.target.value); if (option) onNavigate(option.id) }}>{sectionOptions.map(item => <option key={item.type} value={item.type}>{item.label}</option>)}</select></label></div>
    </div><div className="dialog-body"><h2 id="panel-title" tabIndex={-1}>{titles[selection.type]}</h2><PanelContentBoundary key={`${selection.type}-${selection.item??''}`}><Suspense fallback={<p role="status" className="panel-intro">Opening this part of the portfolio…</p>}><ExperienceContent key={`${selection.type}-${selection.item ?? ''}`} selection={selection} onNavigate={onNavigate} /></Suspense></PanelContentBoundary></div>
  </dialog>
}
