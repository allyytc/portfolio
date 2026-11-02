import { Fragment, useEffect, useRef } from 'react'
import type { CaseStudySection, ContentBlock, MediaAsset, Project, RichText } from '../../content/schema'
import { projectCategories } from '../../content/catalog'
import { ExternalLinks, ResponsiveImage, ScreenshotGallery, TechnologyTags, VideoDemo } from './Media'

export function RichContent({ content }: { content: RichText }) {
  return <>{content.map((part, index) => <Fragment key={index}>{typeof part === 'string' ? part : 'href' in part ? <a href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a> : part.emphasis === 'strong' ? <strong>{part.text}</strong> : <em>{part.text}</em>}</Fragment>)}</>
}
const hasText = (content: RichText) => content.some(p => (typeof p === 'string' ? p : p.text).trim())
export function hasBlockContent(block: ContentBlock, media: readonly MediaAsset[]): boolean {
  switch (block.kind) {
    case 'paragraph': return hasText(block.content)
    case 'list': return block.items.some(hasText)
    case 'tags': return block.items.some(item => item.trim())
    case 'links': return block.items.length > 0
    case 'media': return media.some(item => item.id === block.mediaId)
    case 'gallery': return media.some(item => item.kind === 'image' && block.mediaIds.includes(item.id))
    case 'details': return block.blocks.some(item => hasBlockContent(item, media))
  }
}
function Blocks({ blocks, media }: { blocks: readonly ContentBlock[]; media: readonly MediaAsset[] }) {
  return <>{blocks.filter(block => hasBlockContent(block, media)).map((block, i) => {
    switch (block.kind) {
      case 'paragraph': return <p key={i}><RichContent content={block.content} /></p>
      case 'list': { const List = block.ordered ? 'ol' : 'ul'; return <List key={i}>{block.items.filter(hasText).map((item, n) => <li key={n}><RichContent content={item} /></li>)}</List> }
      case 'tags': return <TechnologyTags key={i} items={block.items} />
      case 'links': return <ExternalLinks key={i} links={block.items} />
      case 'media': { const asset = media.find(item => item.id === block.mediaId)!; return asset.kind === 'image' ? <figure key={i}><ResponsiveImage asset={asset} />{asset.caption && <figcaption>{asset.caption}</figcaption>}</figure> : <VideoDemo key={i} asset={asset} /> }
      case 'gallery': return <ScreenshotGallery key={i} label={block.label} items={block.mediaIds.flatMap(id => { const asset = media.find(item => item.id === id); return asset?.kind === 'image' ? [asset] : [] })} />
      case 'details': return <details key={i}><summary>{block.summary}</summary><Blocks blocks={block.blocks} media={media} /></details>
    }
  })}</>
}
export function CaseStudySections({ sections, media }: { sections: readonly CaseStudySection[]; media: readonly MediaAsset[] }) {
  return <>{sections.filter(section => section.blocks.some(block => hasBlockContent(block, media))).map(section => <section className="case-section" key={section.id} aria-labelledby={section.title ? `case-${section.id}` : undefined} data-case-section={section.id}>{section.title && <h4 tabIndex={-1} id={`case-${section.id}`}>{section.title}</h4>}<Blocks blocks={section.blocks} media={media} /></section>)}</>
}
export default function CaseStudy({ project, onBack, onSelect, related = [], backLabel = 'Back to Projects' }: { project: Project; onBack: () => void; onSelect: (id: string) => void; backLabel?: string; related?: readonly { id: string; title: string }[] }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus(); document.title=`${project.title} | Ally Chen` }, [project.id,project.title])
  const hero = project.media.find(media => media.id === project.heroMediaId)
  const relatedProjects = related.filter(item => item.id !== project.id)
  const category = projectCategories.find(item => item.id === project.category)
  const displaySections = project.sections.map(section => ({...section, blocks: section.blocks.filter(block => !(hero && hero.kind !== 'image' && block.kind === 'media' && block.mediaId === hero.id))}))
  const navigable = displaySections.filter(section => section.title && section.blocks.some(block => hasBlockContent(block, project.media)))
  const jump = (id: string) => {
    const target = document.getElementById(`case-${id}`)
    const dialog = target?.closest<HTMLDialogElement>('.portfolio-dialog')
    if (!target || !dialog) return
    const headerHeight = parseFloat(getComputedStyle(dialog).getPropertyValue('--studio-panel-head-height')) || 126
    const navHeight = (dialog.querySelector('.case-section-nav')?.getBoundingClientRect().height || 0) + (dialog.querySelector('.detail-back')?.getBoundingClientRect().height || 0)
    dialog.scrollTo({ top: dialog.scrollTop + target.getBoundingClientRect().top - dialog.getBoundingClientRect().top - headerHeight - navHeight - 20, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    target.focus({preventScroll:true})
  }
  return <article className={`case-study case--${project.presentation ?? 'software'}`} aria-label={`${project.title} case study`}>
    <button className="panel-link detail-back" onClick={onBack}>← {backLabel}</button>
    <header className="case-header"><p className="eyebrow">{category?.label}</p><h3 ref={heading} tabIndex={-1}>{project.title}</h3><p className="case-overview">{project.overview}</p>{project.status && <p className="status-pill">{project.status}</p>}{project.awards?.length ? <ul className="case-awards" aria-label="Awards">{project.awards.map(award => <li key={award}>{award}</li>)}</ul> : null}{project.recognition?.length ? <ul className="case-awards" aria-label="Recognition">{project.recognition.map(item => <li key={item}>{item}</li>)}</ul> : null}<TechnologyTags items={project.technologies} /><ExternalLinks links={project.links} /></header>
    {project.presentation === 'product' && hero?.kind === 'image' && <figure className="case-hero"><ResponsiveImage asset={hero} eager />{hero.caption && <figcaption>{hero.caption}</figcaption>}</figure>}
    {project.verification.status === 'pending' && <aside className="pending-case" aria-label="Content verification"><h4>Content pending verification</h4><ul>{project.verification.notes?.map(note => <li key={note}>{note}</li>)}</ul></aside>}
    {navigable.length >= 4 && <nav className="case-section-nav" aria-label="Case study sections">{navigable.map(section => <button key={section.id} onClick={() => jump(section.id)}>{section.title}</button>)}</nav>}
    {project.presentation !== 'product' && hero && (hero.kind === 'image' ? <figure className="case-hero"><ResponsiveImage asset={hero} eager />{hero.caption && <figcaption>{hero.caption}</figcaption>}</figure> : <div className="case-hero-video"><VideoDemo asset={hero} /></div>)}
    <CaseStudySections sections={displaySections} media={project.media} />
    {relatedProjects.length > 0 && <nav className="case-related" aria-label="Other projects"><h4>More projects</h4>{relatedProjects.map(item => <button className="panel-link" key={item.id} onClick={() => onSelect(item.id)}>{item.title} →</button>)}</nav>}
  </article>
}
