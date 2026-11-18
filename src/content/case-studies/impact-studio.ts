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
  overview: 'As Software Developer Intern, I am leading the redesign of Oregon State’s Impact Studio site and shipping it in Drupal. A first visit now explains the studio, and faculty initiatives have a real home.',
  technologies: ['Drupal', 'HTML/CSS', 'UI/UX Design', 'Figma'],
  heroMediaId: 'impact-hero',
  sections: [
    {
      id: 'problem',
      title: 'Problem',
      blocks: [{
        kind: 'paragraph',
        content: ['The previous site buried the mission in jargon and repeated itself across pages. A first-time visitor had to hunt to learn what Impact Studio does and who it is for.'],
      }],
    },
    {
      id: 'role',
      title: 'Role',
      blocks: [{
        kind: 'paragraph',
        content: ['Software Developer Intern. I lead the redesign with marketers, designers, and other contributors, then ship it: Figma, Drupal pages, and new faculty initiative subdomains.'],
      }],
    },
    {
      id: 'highlights',
      title: 'Highlights',
      blocks: [{
        kind: 'list',
        items: [
          ['Rebuilt the homepage so the first screen states the mission and points to Portfolio, Our Approach, and Our Services.'],
          ['Shipped the live Drupal site, including the lifecycle story and portfolio pages for faculty initiatives.'],
          ['Configured and launched new faculty initiative subdomains end to end.'],
          ['Turn site traffic into performance reports that decide the next UX and content changes.'],
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
