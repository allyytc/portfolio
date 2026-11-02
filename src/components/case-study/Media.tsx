import { useEffect, useRef, useState } from 'react'
import type { MediaAsset } from '../../content/schema'
export type ImageAsset = Extract<MediaAsset, { kind: 'image' }>
const url = (src: string) => /^(https?:)?\/\//.test(src) ? src : `${import.meta.env.BASE_URL}${src}`

export function ResponsiveImage({ asset, eager = false }: { asset: ImageAsset; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? <p className="media-unavailable" role="status">This image couldn’t load.</p> : <img src={url(asset.src)} alt={asset.alt} width={asset.width} height={asset.height} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
}
export function ExternalLinks({ links }: { links: readonly { id: string; href: string; label: string }[] }) {
  if (!links.length) return null
  return <nav className="case-links" aria-label="Project links">{links.map(link => <a className="panel-link" key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</nav>
}
export function TechnologyTags({ items }: { items: readonly string[] }) {
  return items.length ? <ul className="tags" aria-label="Technologies">{items.map(item => <li key={item}>{item}</li>)}</ul> : null
}
export function VideoDemo({ asset }: { asset: Exclude<MediaAsset, { kind: 'image' }> }) {
  const [loaded, setLoaded] = useState(false)
  if (asset.kind === 'video') return <figure className="case-video"><video controls preload="metadata" poster={asset.poster ? url(asset.poster) : undefined} aria-label={asset.title}><source src={url(asset.src)} type={asset.mime} /><a href={url(asset.src)}>Open {asset.title}</a></video>{asset.caption && <figcaption>{asset.caption}</figcaption>}</figure>
  return <figure className="case-video">{loaded ? <iframe src={asset.src} title={asset.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button className="video-load" onClick={() => setLoaded(true)}><span aria-hidden="true">▷</span> Load demo video</button>}{asset.caption && <figcaption>{asset.caption}</figcaption>}<a className="text-link" href={asset.watchURL} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></figure>
}
function ImageLightbox({ items, initial, onClose }: { items: readonly ImageAsset[]; initial: number; onClose: () => void }) {
  const [index, setIndex] = useState(initial)
  const [fullSize, setFullSize] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)
  const item = items[index]
  useEffect(() => {
    const dialog = ref.current
    const invoker = document.activeElement as HTMLElement | null
    dialog?.showModal()
    dialog?.querySelector<HTMLButtonElement>('button[aria-label="Close image"]')?.focus()
    return () => { dialog?.close(); if (invoker?.isConnected) invoker.focus({ preventScroll: true }) }
  }, [])
  return <dialog className={`image-lightbox${fullSize ? ' image-lightbox--full' : ''}`} ref={ref} aria-label="Project image viewer" onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose() }} onKeyDown={event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); setIndex(i => Math.max(0, i - 1)) }
    if (event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); setIndex(i => Math.min(items.length - 1, i + 1)) }
  }}>
    <div className="lightbox-toolbar"><span>{index + 1} / {items.length}</span><button className="lightbox-size" aria-pressed={fullSize} onClick={() => setFullSize(value => !value)}>{fullSize ? 'Fit image' : 'Show full-size image'}</button><button aria-label="Close image" onClick={onClose} autoFocus>×</button></div>
    <figure><ResponsiveImage key={item.id} asset={item} eager />{item.caption && <figcaption aria-live="polite">{item.caption}</figcaption>}</figure>
    <nav aria-label="Image navigation"><button disabled={!index} onClick={() => setIndex(i => i - 1)}>← Previous image</button><button disabled={index === items.length - 1} onClick={() => setIndex(i => i + 1)}>Next image →</button></nav>
  </dialog>
}
export function ScreenshotGallery({ items, label }: { items: readonly ImageAsset[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null)
  if (!items.length) return null
  return <><div className="screenshot-gallery" aria-label={label}>{items.map((asset, i) => <figure key={asset.id}><button className="screenshot-button" onClick={() => setIndex(i)} aria-label={`Enlarge image ${i + 1}: ${asset.alt}`}><ResponsiveImage asset={asset} /></button>{asset.caption && <figcaption>{asset.caption}</figcaption>}</figure>)}</div>{index !== null && <ImageLightbox items={items} initial={index} onClose={() => setIndex(null)} />}</>
}
export function DesignShowcase({ items, label }: { items: readonly ImageAsset[]; label: string }) {
  return <ScreenshotGallery items={items} label={label} />
}
