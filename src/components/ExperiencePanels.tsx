import { useEffect, useRef, useState } from 'react'
import { useContentRoute } from '../navigation'
import { usePanelReturn } from '../hooks/usePanelReturn'
import DesignGallery from './DesignGallery'
import { ResponsiveImage } from './case-study/Media'
import CaseStudy from './case-study/CaseStudy'
import { caseStudies, projectCategories } from '../content/catalog'
import { projects, featuredProjectIds } from '../content/projects'
import { resume } from '../content/resume'
import { AboutExperience, CareerArchive, CommunityStories, ContactExperience } from './ProfileExperiences'
import type { PanelSelection, PortfolioMedia } from '../content/experiences'
import { interactions } from '../studio/interactions'
import type { InteractionId } from '../studio/interactions'

export interface ExperienceProps { selection: PanelSelection; onNavigate: (id: InteractionId) => void }

/** Reusable media viewer: only real records create images; missing media stays honest. */
export function MediaGallery({ items, label }: { items: readonly PortfolioMedia[]; label: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(item => item.id === selected)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (selected) heading.current?.focus() }, [selected])
  if (!items.length) return <p className="empty-state" role="status">{label} artwork is reserved here. No verified images have been added to this gallery yet.</p>
  if (item) return <div className="media-detail"><button className="panel-link" onClick={() => { setSelected(null); requestAnimationFrame(() => document.getElementById(`media-card-${item.id}`)?.focus()) }}>← Back to gallery</button><h3 ref={heading} tabIndex={-1}>{item.title}</h3><figure><img src={`${import.meta.env.BASE_URL}${item.src}`} alt={item.alt} /><figcaption>{item.caption}</figcaption></figure></div>
  return <div className="media-grid" aria-label={label}>{items.map(item => <button className="media-card" id={`media-card-${item.id}`} key={item.id} onClick={() => setSelected(item.id)}><img src={`${import.meta.env.BASE_URL}${item.src}`} alt={item.alt} loading="lazy" /><strong>{item.title}</strong><small>{item.caption}</small></button>)}</div>
}

/** Demo slots require an explicit URL; no fabricated Unwrap screen or live embed. */
export function ProjectDemo({ href, label }: { href?: string; label: string }) {
  return href ? <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a> : <p className="verification-note">Screenshots and interactive demonstration pending verification.</p>
}

export function DesignExperience({ onNavigate, initialFeatured=false }: Pick<ExperienceProps, 'onNavigate'> & { initialFeatured?: boolean }) {
  const route=useContentRoute()
  const readingPosition = usePanelReturn()
  const [featured, setFeatured] = useState(initialFeatured)
  if (featured) return <CaseStudy project={caseStudies.unwrap} onBack={() => { setFeatured(false); route({type:'design'}); readingPosition.restore('design-unwrap-link') }} onSelect={() => {}} />
  return <><p className="panel-intro">These are some of the flyers, stickers, and promotional materials I've designed for campus events and organizations.</p>
    <article className="unwrap-card"><span className="eyebrow">Featured product prototype</span><h3>Unwrap</h3>{caseStudies.unwrap.media[0]?.kind === 'image' && <div className="unwrap-preview"><ResponsiveImage asset={caseStudies.unwrap.media[0]} /></div>}<span className="status-pill">Details pending verification</span><p>{caseStudies.unwrap.overview}</p><p>Existing development UI and source are available; individual contributions and deployment outcomes remain unverified.</p><button id="design-unwrap-link" className="text-link" onClick={() => { readingPosition.save(); route({type:'design',item:'unwrap'}); setFeatured(true) }}>View Unwrap →</button></article>
    <button className="panel-link" onClick={() => onNavigate('stickers')}>Open the sticker book →</button><DesignGallery onOpenEvent={id=>onNavigate(id as InteractionId)} />
  </>
}
export function ProjectExplorer({ onNavigate, initialProject }: Pick<ExperienceProps, 'onNavigate'> & { initialProject?:string }) {
  const route=useContentRoute()
  const readingPosition = usePanelReturn()
  const [category, setCategory] = useState(initialProject?'All projects':'Selected')
  const [selected, setSelected] = useState<string | null>(initialProject??null)
  const returnTarget = useRef<string | null>(null)
  const project = selected ? caseStudies[selected] : undefined
  if (project) return <CaseStudy project={project} onBack={() => { setSelected(null); route({type:'projects'}); readingPosition.restore(returnTarget.current ?? `project-card-${project.id}`) }} onSelect={id => { route({type:'projects',item:id}); readingPosition.clear(); returnTarget.current = `project-card-${id}`; const target = projects.find(item => item.id === id); if (target) setCategory(target.category); setSelected(id) }} related={projects} />
  const visible = category === 'Selected' ? projects.filter(project => featuredProjectIds.includes(project.id)) : category === 'All projects' ? projects : projects.filter(project => project.category === category)
  return <><p className="panel-intro">Software, product and design work, with the details behind each build.</p><nav className="panel-categories" aria-label="Project categories">{['Selected','All projects', ...projectCategories.map(category => category.label)].map(value => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</nav>
    {category === 'Design Work' ? <DesignExperience onNavigate={onNavigate} /> : <><button id="project-featured-unwrap" className="featured-unwrap" onClick={() => { readingPosition.save(); returnTarget.current = 'project-featured-unwrap'; route({type:'projects',item:'unwrap'}); setSelected('unwrap') }}><span>Featured product prototype</span><strong>Unwrap</strong><small>Personalized, thoughtful gift discovery · Development prototype ↗</small></button><div className="project-list">{visible.map((project, index) => <article key={project.id} className="project-card"><span className="project-number">{String(index+1).padStart(2,'0')}</span><div>{project.thumbnail?.kind === 'image' && <div className="project-thumbnail"><ResponsiveImage asset={project.thumbnail} /></div>}<p className="project-kind">{project.kind}</p><h3>{project.title}</h3><p>{project.description}</p><button id={`project-card-${project.id}`} className="text-link" onClick={() => { readingPosition.save(); returnTarget.current = `project-card-${project.id}`; route({type:'projects',item:project.id}); setSelected(project.id) }}>View {project.title} →</button></div></article>)}</div></>}
  </>
}

export function StickerExperience({ onNavigate }: Pick<ExperienceProps, 'onNavigate'>) {
  return <><p className="panel-intro">Original sticker collections for shared experiences.</p><DesignGallery stickersOnly onOpenEvent={id=>onNavigate(id as InteractionId)} /><p className="prototype-note">Existing owner artwork from the portfolio. Organization marks retain their respective rights.</p></>
}

export function ExperienceContent({ selection, onNavigate }: ExperienceProps) {
  switch (selection.type) {
    case 'projects': return <ProjectExplorer initialProject={selection.item} onNavigate={onNavigate} />
    case 'community': return <CommunityStories selection={selection} onNavigate={onNavigate} />
    case 'design': return <DesignExperience initialFeatured={selection.item==='unwrap'} onNavigate={onNavigate} />
    case 'stickers': return <StickerExperience onNavigate={onNavigate} />
    case 'archive': return <CareerArchive selection={selection} onNavigate={onNavigate} />
    case 'about': return <AboutExperience onNavigate={onNavigate} />
    case 'contact': return <ContactExperience onNavigate={onNavigate} />
    case 'external': { const item = selection.item === 'linkedin' ? interactions.linkedin : interactions.github; return <><p className="panel-intro">Find me on {item.title}.</p><a className="primary-link" href={item.href} target="_blank" rel="noopener noreferrer">Visit {item.title} ↗</a></> }
    case 'resume': return <div className="resume-content"><div className="resume-preview" aria-hidden="true"><span>ALLY CHEN</span><strong>Resume</strong><i /><i /><i /><i /></div><p>A closer look at my experience, skills, and the work behind the studio.</p><a className="primary-link" href={`${import.meta.env.BASE_URL}${resume.url}`} target="_blank" rel="noopener noreferrer">Open Resume PDF ↗</a></div>
  }
}
