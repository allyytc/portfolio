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
  overview: 'A live map inside a Facebook-style app that turns “I’m free” into a plan you can join now. Built at the Meta Closer Together AI Hackathon in November 2026. Invite-only, 75 people admitted, travel funded by Meta. No award.',
  technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Blender', 'MapLibre', 'Supabase', 'UI/UX Design'],
  heroMediaId: 'oh-street',
  sections: [
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['I built the 3D world, modeled the Muse companion in Blender, made the avatars, and did the UI/UX. Team: Andrew Yin, Alan Nguyen, Alex Nguyen, Ally Chen, and Rishab-Mal.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Friends on a map with status bubbles, then a 3D city you walk through together.'],
          ['Muse, a small companion, turns a free-text “I’m free” note into a plan with a place, a time, and open seats.'],
          ['The project README also calls the event the Facebook Closer Together AI Hackathon 2026. People in the demo are fictional.'],
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
