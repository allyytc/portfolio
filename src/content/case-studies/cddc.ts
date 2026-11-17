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
  overview: 'A redesign of the Corvallis Daytime Drop-In Center site so guests can find help on a phone, and donors get a clear page. The center serves unhoused people in Benton County. The live nonprofit site is still the current one; these frames are the redesign.',
  technologies: ['WordPress', 'React', 'Tailwind CSS', 'Figma', 'UI/UX Design', 'User Research'],
  heroMediaId: 'cddc-home',
  sections: [
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['Project lead for Design for America. I directed an 11-person team through discovery, wireframes, and front-end work, and I still meet with the center. The DFA term ended. A few of us are finishing the build. The site serves 300+ people a day.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Navigation ordered for guests: Get Help, Contact, About, Donate.'],
          ['A warmer guest-facing voice, and a more direct donate page.'],
          ['Phone-first layout, since most guests will not be on a desktop.'],
          ['Next: a current homepage video, a monthly services calendar, and an accessibility pass.'],
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
