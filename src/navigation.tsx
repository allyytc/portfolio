import { createContext, useContext } from 'react'
import type { PanelSelection } from './content/experiences'
// Stable public slugs, independent of Three.js and the lazy content bundle.
const projectIds=new Set(['impact-studio','cddc','korbit','er-overwatch','combocraft','lantern','sallys-pos','afterlife-metro','dementia','unwrap'])
const communityIds=new Set(['esc','startup','dfa','beaverhacks','ai-club','beaverhacks2026','innovationJam2026','engineersWeek'])
export function parseRoute(hash:string):{selection:PanelSelection|null;invalid:boolean}{
 let parts:string[];try{parts=decodeURIComponent(hash.replace(/^#\/?/,'')).split('/').filter(Boolean)}catch{return {selection:null,invalid:true}}
 const [section,item]=parts;if(!section)return {selection:null,invalid:false}
 if(section==='projects')return {selection:{type:'projects',...(item&&projectIds.has(item)?{item}:{})},invalid:parts.length>2||Boolean(item&&!projectIds.has(item))}
 if(section==='events')return {selection:{type:'community',...(item&&communityIds.has(item)?{item}:{})},invalid:!item||!communityIds.has(item)||parts.length>2}
 if(section==='community')return {selection:{type:'community',...(item&&communityIds.has(item)?{item}:{})},invalid:parts.length>2||Boolean(item&&!communityIds.has(item))}
 if(section==='experience'||section==='skills')return {selection:{type:'archive',...(section==='skills'?{item:'skills'}:{})},invalid:parts.length>1}
 if(section==='design')return {selection:{type:'design',...(item==='unwrap'?{item}:{})},invalid:parts.length>2||Boolean(item&&item!=='unwrap')}
 if(section==='profiles')return {selection:{type:'external',item:item==='linkedin'?'linkedin':'github'},invalid:Boolean(item&&!['github','linkedin'].includes(item))||parts.length>2}
 if(['about','contact','resume','stickers'].includes(section))return {selection:{type:section as 'about'|'contact'|'resume'|'stickers'},invalid:parts.length>1}
 return {selection:null,invalid:true}
}
export function formatRoute(selection:PanelSelection|null):string{
 if(!selection)return ''
 if(selection.type==='archive')return selection.item==='skills'?'#skills':'#experience'
 if(selection.type==='external')return `#profiles/${selection.item==='linkedin'?'linkedin':'github'}`
 if(selection.type==='community'&&selection.item&&['beaverhacks2026','innovationJam2026','engineersWeek'].includes(selection.item))return `#events/${selection.item}`
 return `#${selection.type}${selection.item?'/'+encodeURIComponent(selection.item):''}`
}
export function updateRouteTitle(selection:PanelSelection|null){document.title=selection?`${selection.type==='archive'?(selection.item==='skills'?'Skills':'Experience'):selection.type.charAt(0).toUpperCase()+selection.type.slice(1)} | Ally Chen`:'Ally Chen | Creative Studio'}
export function writeRoute(selection:PanelSelection|null){const hash=formatRoute(selection);if(location.hash!==hash)history.pushState(null,'',location.pathname+location.search+hash);updateRouteTitle(selection)}
export const ContentRouteContext=createContext<(selection:PanelSelection)=>void>(()=>{})
export const useContentRoute=()=>useContext(ContentRouteContext)
