import { useState } from 'react'
import { designWork } from '../content/design-work'
import { ScreenshotGallery } from './case-study/Media'
import type { ImageAsset } from './case-study/Media'
export default function DesignGallery({ stickersOnly = false, onOpenEvent }: { stickersOnly?: boolean; onOpenEvent?: (id: string) => void }) {
  const [category, setCategory] = useState('All design work')
  const [association, setAssociation] = useState(stickersOnly ? 'Innovation Jam' : 'All associations')
  const normalize = (value: string) => value.replace(/[’‘]/g, "'")
  const filtered = designWork.filter(item => (!stickersOnly || item.category === 'Stickers') && (category === 'All design work' || item.category === category) && (association === 'All associations' || normalize(item.association).includes(normalize(association))))
  const links = [...new Map(filtered.flatMap(item => item.links ?? []).map(link => [link.href, link])).values()]
  const eventLinks = links.flatMap(link=>{const id=link.href.includes('beaverhacks-2026')?'beaverhacks2026':link.href.includes('innovation-jam-2026')?'innovationJam2026':link.href.includes('eweek.html')?'engineersWeek':null;return id?[{id,label:link.label}]:[]})
  const images = filtered.flatMap(item => item.media.filter(asset => asset.kind === 'image').map(asset => ({...asset, caption: `${item.title} — ${asset.caption ?? item.association}`}))) as ImageAsset[]
  return <section className="design-collection" aria-label={stickersOnly ? 'Sticker collection' : 'Design collection'}>
    {!stickersOnly && <nav className="panel-categories" aria-label="Design categories">{['All design work','Graphics','Stickers','Event materials','Merchandise'].map(label => <button key={label} aria-pressed={category===label} onClick={()=>setCategory(label)}>{label}</button>)}</nav>}
    <nav className="panel-categories" aria-label={stickersOnly ? 'Sticker gallery categories' : 'Design associations'}>{(stickersOnly ? ['BeaverHacks','Innovation Jam','Engineers’ Week'] : ['All associations','COE Student Council','Startup Hub','BeaverHacks','Innovation Jam','Engineers’ Week']).map(label=><button key={label} aria-pressed={association===label} onClick={()=>setAssociation(label)}>{label}</button>)}</nav>
    {links.length > 0 && <nav className="case-links" aria-label="Original event pages">{links.map(link => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</nav>}
    {onOpenEvent && eventLinks.length>0 && <nav className="related-links" aria-label="Studio event stories">{eventLinks.map(link=><button key={link.id} onClick={()=>onOpenEvent(link.id)}>Read {link.label.replace(/ →$/,'')} in the studio →</button>)}</nav>}
    <p className="gallery-count" role="status">{images.length} {images.length === 1 ? 'design' : 'designs'}</p>
    {images.length ? <ScreenshotGallery key={`${category}-${association}`} items={images} label={stickersOnly ? 'Sticker artwork' : 'Graphic design and event artwork'} /> : <p className="empty-state">No source artwork is associated with this filter.</p>}
  </section>
}
