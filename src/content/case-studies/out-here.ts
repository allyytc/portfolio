import type { Project, MediaAsset } from '../schema'

const source = {
  repository: 'AndrewYin04/out-here',
  ref: 'readme',
  path: 'README.md',
}

function shot(id: string, file: string, alt: string): MediaAsset {
  return {
    id, kind: 'image', src: `media/out-here/${file}`, originalPath: file,
    source, rights: 'owner-local-rebuild', alt, caption: alt, width: 1600, height: 1000,
  }
}

export const project: Project = {
  id: 'out-here',
  title: 'Out Here | Meta Closer Together AI Hackathon 2026',
  category: 'hackathons',
  presentation: 'product',
  overview: 'Turn a casual “I’m free” into a real plan with friends nearby, in a walkable 3D city with an AI companion. Built in a weekend at Meta’s invite-only Closer Together AI Hackathon, with 75 participants admitted.',
  technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Blender', 'MapLibre', 'Supabase', 'UI/UX Design'],
  heroMediaId: 'oh-street',
  sections: [
    {
      id: 'problem',
      title: 'Problem',
      blocks: [{
        kind: 'paragraph',
        content: ['You have a free hour in a new city. By the time a group chat answers, the window is gone. Maps show where friends are, not who is free or what they would actually do.'],
      }],
    },
    {
      id: 'role',
      title: 'Role',
      blocks: [
        { kind: 'paragraph', content: ['I built the 3D world, modeled the Muse companion in Blender, made the avatars, and designed the UI/UX.'] },
        { kind: 'paragraph', content: ['Team: Andrew Yin, Alan Nguyen, Alex Nguyen, Ally Chen, and Rishab-Mal.'] },
      ],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Built the walkable 3D city, so a plan, a friend, and the open seats sit in the street you are about to cross.'],
          ['Modeled Muse in Blender, the companion that takes “I’ve got 45 minutes, can I grab boba?” and returns a place, a walk time, and a friend who is free.'],
          ['Made the avatars people follow through that city, including the third-person view and the status bubbles on friends nearby.'],
          ['Designed the UI around the loop: say you are free, accept a plan, walk there, and keep the crew for next time.'],
        ],
      }],
    },
    {
      id: 'screenshots',
      title: 'Screenshots',
      blocks: [{
        kind: 'gallery',
        label: 'Out Here screenshots',
        mediaIds: ['oh-avatars', 'oh-city', 'oh-muse', 'oh-free', 'oh-memories'],
      }],
    },
  ],
  media: [
    shot('oh-street', 'street.webp', 'Third-person 3D street with an avatar, the Muse companion, and nearby plans.'),
    shot('oh-avatars', 'avatars.webp', 'Third-person view with friend avatars and status bubbles in the city.'),
    shot('oh-city', 'city.webp', 'Wider view of the 3D city block, avatar, and Muse.'),
    shot('oh-muse', 'muse-plan.webp', 'Muse draft of a boba plan with Maya, including walk time and open seats.'),
    shot('oh-free', 'im-free.webp', 'I’m free composer: time, activity, and a note to Muse.'),
    shot('oh-memories', 'memories.webp', 'Memories page with a shared crew album and a prompt to plan again.'),
  ],
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/AndrewYin04/out-here', kind: 'github', verification: 'resolved' },
    { id: 'demo', label: 'Demo video', href: 'https://youtu.be/5RyUiRBquXs', kind: 'demo', verification: 'resolved' },
    { id: 'live', label: 'Live demo', href: 'https://out-here-three.vercel.app', kind: 'live', verification: 'resolved' },
  ],
  verification: { status: 'source-preserved', notes: ['Description follows the project README. Ally’s role and hackathon details were confirmed by her for this update.'] },
}
