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
  overview: 'Friends each remember a different side of someone. Unwrap turns those clues into one gift the group chooses together, inside a shared 3D world. Cal Hacks 2026, Visa track.',
  technologies: ['Next.js', 'React', 'TypeScript', 'React Three Fiber', 'Three.js', 'Fetch.ai', 'Convex', 'UI/UX Design'],
  heroMediaId: 'unwrap-council',
  sections: [
    {
      id: 'problem',
      title: 'Problem',
      blocks: [{
        kind: 'paragraph',
        content: ['Group gifts fall apart in chat. Everyone who knows the person holds a different clue, research happens in private, and a generic recommendation misses the detail that would have made the gift land.'],
      }],
    },
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['I owned product and UX, the React Three Fiber frontend, and the multi-agent Fetch.ai system. The frontend includes the 3D world map, the Book of Possibilities, the phone join flow, and the council visuals.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Shaped the product as one shared room: memories on the outside, real gift options toward the middle, and a choice the group makes together.'],
          ['Built the React Three Fiber world, including the 3D map, the Book of Possibilities, the phone join flow, and the council companions.'],
          ['Implemented the Fetch.ai council so agents read the clues and research sourced gifts, while the group still approves the pick.'],
          ['Made the money decision explicit with contribution limits and revision-specific approval. The build records pledges.'],
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
