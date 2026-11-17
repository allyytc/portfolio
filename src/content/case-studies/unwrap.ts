import type { Project, MediaAsset } from '../schema'

const source = {
  repository: 'Jonjlim/calhacks2026',
  ref: 'readme',
  path: 'README.md',
}

function shot(id: string, file: string, alt: string, width: number, height: number): MediaAsset {
  return {
    id, kind: 'image', src: `media/unwrap/${file}`, originalPath: `media/unwrap/${file}`,
    source, rights: 'owner-local-rebuild', alt, caption: alt, width, height,
  }
}

export const project: Project = {
  id: 'unwrap',
  title: 'Unwrap',
  category: 'hackathons',
  presentation: 'product',
  status: 'Cal Hacks 2026 · Visa track',
  overview: 'Friends pool what they remember about someone and pick a gift together. Built at Cal Hacks 2026 on the Visa track. No award.',
  technologies: ['Next.js', 'React', 'TypeScript', 'React Three Fiber', 'Three.js', 'Fetch.ai', 'Convex', 'UI/UX Design'],
  heroMediaId: 'unwrap-council',
  sections: [
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['I owned product and UX, the React Three Fiber frontend (the 3D world map, Book of Possibilities, phone join flow, and council visuals), and the multi-agent Fetch.ai implementation.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['A shared gift room: memories and ideas come in from phones, then the group compares real product options.'],
          ['An AI council of agents reads the clues and proposes gifts. Payments in the build are pledges, not checkout.'],
          ['The README calls the event Cal Hacks 13.0, October 2026.'],
        ],
      }],
    },
    {
      id: 'screenshots',
      title: 'Screenshots',
      blocks: [{
        kind: 'gallery',
        label: 'Unwrap screenshots',
        mediaIds: ['unwrap-proposal'],
      }],
    },
  ],
  media: [
    shot('unwrap-council', 'council.webp', 'Unwrap gift map with council companions around a shared gift.', 1440, 900),
    shot('unwrap-proposal', 'proposal.webp', 'Narrow Unwrap view of a gift proposal, contribution shares, and approval state.', 700, 900),
  ],
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/Jonjlim/calhacks2026', kind: 'github', verification: 'resolved' },
    { id: 'demo', label: 'Live demo', href: 'https://unwrap-six.vercel.app', kind: 'live', verification: 'resolved' },
    { id: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/unwrap-y7w16s', kind: 'devpost', verification: 'resolved' },
  ],
  verification: {
    status: 'source-preserved',
    notes: ['Published from the local case-study draft. Role, Visa track, and public links were confirmed by Ally. Screenshots are the existing development captures, recompressed.'],
  },
}

export const unwrap = project
