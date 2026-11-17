import type { Project, MediaAsset } from '../schema'

const source = {
  repository: 'allyytc/portfolio',
  ref: 'content-refresh',
  path: 'src/content/case-studies/impact-studio.ts',
}

function shot(id: string, file: string, alt: string, width: number, height: number): MediaAsset {
  return {
    id, kind: 'image', src: `media/impact-sections/${file}`, originalPath: `media/impact-sections/${file}`,
    source, rights: 'owner-local-rebuild', alt, caption: alt, width, height,
  }
}

export const project: Project = {
  id: 'impact-studio',
  title: 'Impact Studio Website',
  category: 'in-progress',
  presentation: 'web-ux',
  status: 'In Progress',
  overview: 'Redesign of the Oregon State Impact Studio site: clearer navigation, a homepage people can scan, and portfolio pages for faculty initiatives. I design it and ship it in Drupal.',
  technologies: ['Drupal', 'HTML/CSS', 'UI/UX Design', 'Figma'],
  heroMediaId: 'impact-hero',
  sections: [
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['Software Developer Intern. I lead the redesign with marketers, designers, and other contributors, then implement it: Figma frames, Drupal pages, and faculty initiative subdomains.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Homepage hierarchy so a first visit explains what Impact Studio does.'],
          ['Navigation into Portfolio, Our Approach, and Our Services.'],
          ['Faculty initiative subdomains, configured and launched.'],
          ['Traffic reports used to decide what to change next.'],
        ],
      }],
    },
    {
      id: 'screenshots',
      title: 'Live site',
      blocks: [{
        kind: 'gallery',
        label: 'Impact Studio live site',
        mediaIds: ['impact-welcome', 'impact-steps', 'impact-story', 'impact-portfolio', 'impact-about'],
      }],
    },
  ],
  media: [
    shot('impact-hero', 'home-hero.webp', 'Impact Studio homepage: Where ideas become reality.', 1440, 760),
    shot('impact-welcome', 'home-welcome.webp', 'Welcome section: students working together, with a short explanation of the studio.', 1440, 690),
    shot('impact-steps', 'home-steps.webp', 'Three-step process: you bring an idea, the studio builds and tests, then launches.', 1223, 688),
    shot('impact-story', 'initiative-story.webp', 'Portfolio story for ORTSOC, from the 2020 idea to the active program.', 1440, 813),
    shot('impact-portfolio', 'portfolio-hero.webp', 'Portfolio page: A portfolio of possibilities.', 1440, 757),
    shot('impact-about', 'about-hero.webp', 'About page: Behind every idea is a team.', 1440, 757),
  ],
  links: [
    { id: 'live', label: 'Live site', href: 'https://impactstudio.oregonstate.edu/', kind: 'live', verification: 'resolved' },
  ],
  verification: {
    status: 'source-preserved',
    notes: ['Role title updated to Software Developer Intern at the owner’s request. Screenshots captured from the live site in November 2026. No public GitHub repo for this Drupal site.'],
  },
}
