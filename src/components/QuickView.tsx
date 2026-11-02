import { useEffect, useRef, useState } from 'react'
import { interactions } from '../studio/interactions'
import type { InteractionId } from '../studio/interactions'
import type { PanelType } from '../content/experiences'
const destinations: readonly { id: InteractionId; title: string; note: string }[] = [
  {id:'projects',title:'Projects',note:'Software & case studies'}, {id:'design',title:'Design',note:'Unwrap & visual work'},
  {id:'community',title:'Community',note:'Leadership & event stories'}, {id:'about',title:'About',note:'Background & education'},
  {id:'archive',title:'Experience',note:'Career archive'}, {id:'archive-skills',title:'Skills',note:'Tools & demonstrated work'},
  {id:'resume',title:'Resume',note:'Open the PDF'}, {id:'contact',title:'Contact',note:'Email & profiles'},
  {id:'stickers',title:'Sticker book',note:'Original artwork collections'}, {id:'github',title:'GitHub',note:'Code & contributions'},
  {id:'linkedin',title:'LinkedIn',note:'Professional profile'},
]
export default function QuickView({ onDirect, onExplore, lightRendering=false, onLightRenderingChange }: { lightRendering?: boolean; onLightRenderingChange?: (value:boolean)=>void; onDirect: (type: PanelType, item?: string) => void; onExplore: (id: InteractionId, keyboard?: boolean) => void }) {
  const [open,setOpen]=useState(false)
  const [explore,setExplore]=useState(false)
  const root=useRef<HTMLElement>(null)
  const trigger=useRef<HTMLButtonElement>(null)
  useEffect(()=>{
    if(!open)return
    const outside=(event:MouseEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)}
    document.addEventListener('click',outside)
    return()=>document.removeEventListener('click',outside)
  },[open])
  return <section ref={root} className="quick-view-disclosure" aria-label="Studio Menu" onKeyDown={event=>{if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();setOpen(false);trigger.current?.focus()}}}>
    <button id="studio-destinations" ref={trigger} className="quick-view-trigger" aria-expanded={open} aria-controls="quick-view-links" onClick={()=>setOpen(value=>!value)}><span aria-hidden="true">⌘</span><strong>Studio Menu</strong><span className="quick-view-description">Portfolio directory</span><span className="quick-view-chevron" aria-hidden="true">{open?'−':'+'}</span></button>
    <div id="quick-view-links" className="quick-view-drawer" hidden={!open}><div className="quick-view-heading"><p>Find your corner.</p><label><input type="checkbox" checked={explore} onChange={event=>setExplore(event.target.checked)} /> Focus room on selection</label>{onLightRenderingChange&&<label><input type="checkbox" checked={lightRendering} onChange={event=>onLightRenderingChange(event.target.checked)} /> Lighter 3D rendering</label>}</div>
    <nav className="quick-view-grid" aria-label="Quick View destinations">{destinations.map(destination=>{
      const action=interactions[destination.id]
      return <button key={action.id} aria-label={explore?action.keyboardLabel:`Open ${destination.title}`} onClick={event=>{
        trigger.current?.focus({preventScroll:true});setOpen(false)
        if(explore)onExplore(action.id,event.detail===0)
        else onDirect(action.panel,action.item)
      }}><strong>{destination.title}</strong><small>{destination.note}</small><span aria-hidden="true">↗</span></button>
    })}</nav></div>
  </section>
}
