// Test-only rendering of actual pending data. No mock portfolio facts/media.
import { createRoot } from 'react-dom/client'
import CaseStudy from '../../src/components/case-study/CaseStudy'
import { unwrap, korbit } from '../../src/content/catalog'
import '../../src/styles.css'
const project = { ...unwrap, status: undefined, media: [], heroMediaId: undefined, links: [], sections: [
  { id: 'problem', title: 'Problem', blocks: [] },
  { id: 'empty-media', title: 'Gallery', blocks: [{ kind: 'gallery' as const, label: 'Screenshots', mediaIds: [] }] },
  { id: 'empty-details', title: 'Implementation', blocks: [{ kind: 'details' as const, summary: 'Technical details', blocks: [] }] },
  { id: 'source-details', title: 'Source technical text', blocks: [{ kind: 'details' as const, summary: 'Expand source technical details', blocks: korbit.sections.find(section => section.id === 'tech-stack')!.blocks }] },
] }
createRoot(document.getElementById('fixture')!).render(<CaseStudy project={project} onBack={() => {}} onSelect={() => {}} related={[{id:unwrap.id,title:unwrap.title}]} />)
