import type { Project, MediaAsset } from '../schema'

const source = {
  repository: 'allyytc/portfolio',
  ref: 'content-refresh',
  path: 'src/content/case-studies/cddc.ts',
}

function shot(id: string, file: string, alt: string, height: number): MediaAsset {
  return {
    id, kind: 'image', src: `media/cddc-frames/${file}`, originalPath: `media/cddc-frames/${file}`,
    source, rights: 'owner-local-rebuild', alt, caption: alt, width: 1280, height,
  }
}

export const project: Project = {
  id: 'cddc',
  title: 'Corvallis Daytime Drop-In Center Website',
  category: 'in-progress',
  presentation: 'web-ux',
  status: 'In progress',
  overview: 'A phone-first redesign of the Corvallis Daytime Drop-In Center site, so someone who needs help can reach it in a few taps. I lead the 11-person Design for America team. The site serves 300+ people a day.',
  technologies: ['WordPress', 'React', 'Tailwind CSS', 'Figma', 'UI/UX Design', 'User Research'],
  heroMediaId: 'cddc-home',
  sections: [
    {
      id: 'problem',
      title: 'Problem',
      blocks: [{
        kind: 'paragraph',
        content: ['The center serves unhoused people in Benton County, and the current site makes critical information hard to find. For a guest with a few minutes on a phone, that is a barrier to getting help.'],
      }],
    },
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['Project lead. I meet with the center, direct an 11-person team through discovery and wireframes, and design and build the front end. The DFA term ended, and a few of us are still finishing the build. The frames below are the redesign. The center’s current public site is still the one linked here.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Ordered the navigation by what a guest needs first: Get Help, then Contact, About, and Donate.'],
          ['Split the tone on purpose: warm and simple for guests, direct for donors who need to trust where a gift goes.'],
          ['Designed phone-first, because most guests will only ever open this on a phone.'],
          ['Run the work with the center in the room: wireframes go back, get marked up, and change.'],
        ],
      }],
    },
    {
      id: 'screenshots',
      title: 'Design frames',
      blocks: [{
        kind: 'gallery',
        label: 'CDDC redesign frames',
        mediaIds: ['cddc-help', 'cddc-donate'],
      }],
    },
  ],
  media: [
    shot('cddc-home', 'home.webp', 'Redesign frame: homepage with Get Help, Contact, About, and Donate.', 800),
    shot('cddc-help', 'get-help.webp', 'Redesign frame: Get Help and Support, open Monday through Friday.', 800),
    shot('cddc-donate', 'donate.webp', 'Redesign frame: donate page, with a photo and a Donate Now button.', 750),
  ],
  links: [
    { id: 'live', label: 'Current site', href: 'https://corvallisddc.org/en/', kind: 'live', verification: 'resolved' },
  ],
  verification: {
    status: 'source-preserved',
    notes: ['No public GitHub repo for this redesign. Frames are cropped from the existing design comps, not the current live site.'],
  },
}
