import { useEffect, useRef, useState } from 'react'
import { useContentRoute } from '../navigation'
import { usePanelReturn } from '../hooks/usePanelReturn'
import { profile } from '../content/profile'
import { organizations, events, communityOverview } from '../content/community'
import { caseStudies } from '../content/catalog'
import { designWork } from '../content/design-work'
import { identity } from '../content/identity'
import { resume } from '../content/resume'
import type { PanelSelection } from '../content/experiences'
import type { InteractionId } from '../studio/interactions'
import CaseStudy, { CaseStudySections } from './case-study/CaseStudy'
import { ExternalLinks, ResponsiveImage, ScreenshotGallery } from './case-study/Media'
import type { ImageAsset } from './case-study/Media'

type Navigate = (id: InteractionId) => void
const contactLinks = profile.links.filter(link => !link.href.includes('allychen-resume'))
const eventTitles = Object.fromEntries(events.map(event => [event.id, event.title]))
function focus(id: string) { requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true })) }
function StoryJumpLinks({ ids }: { ids: readonly { id: string; title?: string }[] }) {
  return <nav className="story-jumps" aria-label="Story sections">{ids.filter(s=>s.title).map(s=><a href={`#case-${s.id}`} key={s.id} onClick={event=>{
    event.preventDefault(); const target=document.getElementById(`case-${s.id}`);const dialog=target?.closest('dialog');if(!target||!dialog)return
    const header=(dialog.querySelector('.dialog-head')?.getBoundingClientRect().height??126)+(dialog.querySelector('.detail-back')?.getBoundingClientRect().height??0)
    dialog.scrollTo({top:dialog.scrollTop+target.getBoundingClientRect().top-dialog.getBoundingClientRect().top-header-18,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});target.focus({preventScroll:true})
  }}>{s.title}</a>)}</nav>
}
export function AboutExperience({ onNavigate }: { onNavigate: Navigate }) {
  return <article className="about-editorial"><p className="eyebrow">Technology · Design · Business</p><div className="about-portrait"><ResponsiveImage asset={profile.media[0] as ImageAsset} eager /></div>
    <CaseStudySections sections={profile.about.map(section=>({...section,title:undefined}))} media={profile.media} />
    <section className="education-card" aria-label="Education"><h3>Education</h3>{profile.education.map(education=><div key={education.degree}><h4>{education.degree}</h4><p>Minor in {education.minor}</p><p>{education.institution} · Graduating {education.graduation}</p></div>)}</section>
    <div className="portrait-note"><ResponsiveImage asset={profile.media[1] as ImageAsset} /><p className="current-role">{profile.preferredRole}</p></div>
    <nav className="related-links" aria-label="About links"><button onClick={()=>onNavigate('archive')}>Experience →</button><button onClick={()=>onNavigate('archive-skills')}>Skills →</button><button onClick={()=>onNavigate('resume')}>Resume →</button></nav><ExternalLinks links={contactLinks.filter(link=>!link.href.startsWith('tel:'))} />
  </article>
}
export function CareerArchive({ selection, onNavigate }: { selection: PanelSelection; onNavigate: Navigate }) {
  const route=useContentRoute()
  const archivePosition=usePanelReturn()
  const [tab,setTab]=useState(selection.item==='skills'?'Skills':'Experience')
  const [projectId,setProjectId]=useState<string|null>(null)
  const [skill,setSkill]=useState<string|null>(null)
  const [roleContextOpen,setRoleContextOpen]=useState(false)
  const returnTo=useRef('archive-project-impact-studio')
  if(projectId&&caseStudies[projectId])return <CaseStudy project={caseStudies[projectId]} onBack={()=>{setProjectId(null);route({type:'archive',item:tab==='Skills'?'skills':undefined});archivePosition.restore(returnTo.current)}} onSelect={setProjectId} backLabel="Back to archive" />
  const openProject=(id:string,invoker:string)=>{route({type:'projects',item:id});archivePosition.save();returnTo.current=invoker;setProjectId(id)}
  // Match exact source technology names only. No inferred proficiency or fuzzy associations.
  const matches=skill?Object.values(caseStudies).filter(project=>project.verification.status!=='pending'&&project.technologies.some(t=>t.toLowerCase()===skill.toLowerCase())):[]
  return <><nav className="panel-categories" aria-label="Archive sections">{['Experience','Skills'].map(value=><button key={value} aria-pressed={tab===value} onClick={()=>{setTab(value);route({type:'archive',item:value==='Skills'?'skills':undefined})}}>{value}</button>)}</nav>
    {tab==='Experience'?<section className="career-archive"><h3>{identity.role}</h3><p className="eyebrow">Career archive · Most recent first</p><ol className="career-timeline">{profile.experience.map(role=><li key={role.id}><span className="timeline-date">{role.dates}</span><h4>{role.title}</h4><p className="project-kind">{role.organization}</p><CaseStudySections sections={role.sections} media={[]} /><details open={roleContextOpen} onToggle={event=>setRoleContextOpen(event.currentTarget.open)}><summary>Role context & related work</summary><p>The original portfolio lists this position as {role.title}. The studio uses the preferred visible label above.</p>{role.projectIds?.map(id=><button className="text-link" id={`archive-project-${id}`} key={id} onClick={()=>openProject(id,`archive-project-${id}`)}>View Work: {caseStudies[id].title} →</button>)}</details></li>)}</ol></section>:<section className="skills-explorer"><p className="panel-intro">Tools and practices across development, design, and leadership.</p><div className="skills-grid">{profile.skills.map(group=><section key={group.id}><h3>{group.title}</h3><ul className="skill-buttons">{group.items.map(item=><li key={item}><button aria-pressed={skill===item} onClick={()=>setSkill(skill===item?null:item)}>{item}</button></li>)}</ul></section>)}</div>{skill&&<aside className="skill-evidence" aria-live="polite"><h4>{skill} in the portfolio</h4>{matches.length?<ul>{matches.map(project=><li key={project.id}><button className="text-link" id={`skill-project-${project.id}`} onClick={()=>openProject(project.id,`skill-project-${project.id}`)}>{project.title} →</button></li>)}</ul>:<p>No exact project technology association is recorded in the original project data.</p>}</aside>}</section>}
    <button className="primary-link" onClick={()=>onNavigate('resume')}>Open Resume →</button>
  </>
}
export function CommunityStories({ selection, onNavigate }: { selection: PanelSelection; onNavigate: Navigate }) {
  const route=useContentRoute()
  const chooseStory=(id:string)=>{route({type:'community',item:id});setSelected(id)}
  const overviewPosition=usePanelReturn()
  const returnCard=useRef(selection.item)
  const [selected,setSelected]=useState(selection.item)
  const [filter,setFilter]=useState('All')
  const [projectId,setProjectId]=useState<string|null>(null)
  const heading=useRef<HTMLHeadingElement>(null)
  const event=events.find(item=>item.id===selected)
  const organization=organizations.find(item=>item.id===selected)
  const entry=event??organization
  const association=event?.id==='engineersWeek'?"Engineers' Week":organization?.id==='esc'?'COE Student Council':organization?.id==='startup'?'Startup Hub':null
  const relatedDesigns=association?designWork.filter(work=>work.category==='Graphics'&&work.association.includes(association)).flatMap(work=>work.media.filter(asset=>asset.kind==='image').map(asset=>({...asset,caption:`${work.title} — ${asset.caption??work.association}`}))) as ImageAsset[]:[]
  useEffect(()=>{if(selected&&!projectId){heading.current?.focus();if(entry)document.title=`${entry.title} | Ally Chen`}},[selected,projectId,entry?.title])
  const back=()=>{route({type:'community'});setSelected(undefined);overviewPosition.restore(`community-card-${returnCard.current??selected}`)}
  if(projectId&&caseStudies[projectId])return <CaseStudy project={caseStudies[projectId]} onBack={()=>{setProjectId(null);route({type:'community',item:selected});focus('community-project-link')}} onSelect={setProjectId} backLabel="Back to Community story" />
  if(entry)return <article className={`community-detail ${event?'event-story':'organization-story'}`}>
    <button className="panel-link detail-back" onClick={back}>← Back to Community</button><p className="eyebrow">{event?'Event case study':'Organization'}</p><h3 ref={heading} tabIndex={-1}>{entry.title}</h3>
    {entry.role&&<p className="organization-role">{entry.role}</p>}{entry.dates&&<p className="timeline-date">{entry.dates}</p>}
    {event?<><p className="panel-intro">{event.overview}</p><figure className="event-hero"><ResponsiveImage asset={event.media.find(a=>a.id===event.heroMediaId) as ImageAsset} eager /></figure><StoryJumpLinks ids={event.sections} /><CaseStudySections sections={event.sections} media={event.media} /></>:<><figure className="organization-hero"><ResponsiveImage asset={entry.media[0] as ImageAsset} eager /></figure><CaseStudySections sections={entry.sections} media={entry.media} /><ScreenshotGallery items={entry.media.filter(a=>a.kind==='image') as ImageAsset[]} label={`${entry.title} original photographs`} /></>}
    {organization?.eventIds?.length?<nav className="related-links" aria-label="Related case studies">{organization.eventIds.map(id=><button className="text-link" key={id} onClick={()=>chooseStory(id)}>{eventTitles[id]} →</button>)}</nav>:null}
    {organization?.id==='dfa'&&<button id="community-project-link" className="text-link" onClick={()=>{route({type:'projects',item:'cddc'});setProjectId('cddc')}}>View Project: Corvallis Daytime Drop-In Center Website →</button>}
    {relatedDesigns.length>0 && <section className="case-section"><h4>{event?'Related event graphics':'Organization design work'}</h4><ScreenshotGallery items={relatedDesigns} label={event?'Related event graphics':'Organization design work'} /></section>}
    <ExternalLinks links={entry.links} />
    {event&&<nav className="related-links" aria-label="Event design links"><button onClick={()=>onNavigate('stickers')}>Explore event artwork →</button><button onClick={()=>onNavigate('design')}>Design gallery →</button>{organizations.filter(o=>o.eventIds?.includes(event.id)).map(o=><button key={o.id} onClick={()=>chooseStory(o.id)}>{o.title} →</button>)}</nav>}
  </article>
  const cards=[...organizations.map(o=>({...o,kind:'Organization',overview:'',image:o.media[0]})),...events.map((e,i)=>({...e,kind:'Event case study',overview:communityOverview.eventCards[i].overview,image:communityOverview.eventCards[i].media}))]
  return <section className="community-memories"><div className="community-intro"><ResponsiveImage asset={communityOverview.media as ImageAsset} />{communityOverview.intro.map(p=><p className="panel-intro" key={p}>{p}</p>)}</div><nav className="panel-categories" aria-label="Community categories">{['All','Organizations','Event case studies'].map(value=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value}</button>)}</nav><div className="community-grid">{cards.filter(c=>filter==='All'||(filter==='Organizations'?c.kind==='Organization':c.kind==='Event case study')).map(entry=><button className="community-card" id={`community-card-${entry.id}`} key={entry.id} onClick={()=>{overviewPosition.save();returnCard.current=entry.id;chooseStory(entry.id)}}><span className="eyebrow">{entry.kind}</span><ResponsiveImage asset={entry.image as ImageAsset} /><strong>{entry.title}</strong>{entry.role&&<small>{entry.role}</small>}{entry.dates&&<small>{entry.dates}</small>}{entry.overview&&<span>{entry.overview}</span>}<span aria-hidden="true">Explore →</span></button>)}</div></section>
}
export function ContactExperience({ onNavigate }: { onNavigate: Navigate }) {
  return <section className="contact-card"><span className="eyebrow">Let’s connect</span><p className="panel-intro">Let’s make something thoughtful.</p><a className="primary-link" href={`mailto:${identity.email}`}>Email {identity.email} ↗</a><ExternalLinks links={contactLinks.filter(link=>!link.href.startsWith('mailto:'))} /><button className="text-link" onClick={()=>onNavigate('resume')}>Open Resume →</button>{resume.url&&<a className="text-link" href={`${import.meta.env.BASE_URL}${resume.url}`} target="_blank" rel="noopener noreferrer">Open Resume PDF ↗</a>}</section>
}
