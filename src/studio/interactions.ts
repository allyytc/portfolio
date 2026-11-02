import { identity } from '../content/identity'
import type { PanelType } from '../content/experiences'
import type { CameraViewName } from './cameraViews'

export type InteractionId = 'projects' | 'design' | 'community' | 'about' | 'archive' | 'resume' | 'github' | 'linkedin' | 'contact' | 'stickers' | 'esc' | 'startup' | 'dfa' | 'beaverhacks' | 'ai-club' | 'beaverhacks2026' | 'innovationJam2026' | 'engineersWeek' | 'archive-skills'
export interface Interaction {
  id: InteractionId
  label: string
  shortLabel: string
  keyboardLabel: string
  objects: readonly string[]
  hitObjects?: readonly string[]
  hitZones?: readonly ('projectsBoard' | 'nameBoard' | 'readingBench' | 'archive')[]
  view: CameraViewName
  panel: PanelType
  item?: string
  navigation?: boolean
  title: string
  description?: string
  href?: string
}
export const interactions: Record<InteractionId, Interaction> = {
  projects: { id: 'projects', label: 'Explore Projects', shortLabel: 'Projects', keyboardLabel: 'Focus Projects', objects: ['ProjectsMonitor', 'ProjectsSign'], hitObjects: ['ProjectsMonitor','ProjectsSign'], view: 'workstation', panel: 'projects', title: 'Projects' },
  design: { id: 'design', label: 'Explore My Designs', shortLabel: 'Design', keyboardLabel: 'Focus Design Work', objects: ['ArtEasel', 'UnwrapDisplay', 'Sketchbook'], view: 'designCorner', panel: 'design', title: 'Design work · Unwrap', description: 'Unwrap content is pending verification.' },
  community: { id: 'community', label: 'Explore Community', shortLabel: 'Community', keyboardLabel: 'Focus Community', objects: ['CommunitySign'], view: 'communityPinboard', panel: 'community', title: 'Community & involvement', description: 'Engineering Student Council · Startup Hub · Design for America · BeaverHacks · AI Club. Event details will join these reserved frames.' },
  about: { id: 'about', label: 'About Me', shortLabel: 'About', keyboardLabel: 'Focus About Me', objects: ['Fireplace', 'AboutBook', 'AboutSign'], hitZones: ['readingBench'], view: 'readingNook', panel: 'about', title: 'About me', description: `${identity.subtitle} — ${identity.role}.` },
  'archive-skills': { id: 'archive-skills', label: 'Skills', shortLabel: 'Skills', keyboardLabel: 'Focus Skills', objects: [], view: 'archive', panel: 'archive', item: 'skills', title: 'Skills', navigation: false },
  archive: { id: 'archive', label: 'Skills & Experience', shortLabel: 'Skills & experience', keyboardLabel: 'Focus Skills and Experience', objects: ['SkillsVolume', 'ExperienceVolume'], hitZones: ['archive'], view: 'archive', panel: 'archive', title: 'Skills & experience', description: 'For experience and skills, open my resume.' },
  resume: { id: 'resume', label: 'Print Resume', shortLabel: 'Printer', keyboardLabel: 'Focus Resume Printer', objects: ['PrinterBody', 'ResumePaper'], view: 'printer', panel: 'resume', title: 'Resume printer' },
  github: { id: 'github', label: 'GitHub', shortLabel: 'GitHub', keyboardLabel: 'Focus GitHub', objects: ['ExternalGitHub'], view: 'externalLinks', panel: 'external', item: 'github', title: 'GitHub', href: 'https://github.com/allyytc' },
  linkedin: { id: 'linkedin', label: 'LinkedIn', shortLabel: 'LinkedIn', keyboardLabel: 'Focus LinkedIn', objects: ['ExternalLinkedIn'], view: 'externalLinks', panel: 'external', item: 'linkedin', title: 'LinkedIn', href: 'https://linkedin.com/in/allyychen/' },
  contact: { id: 'contact', label: 'Contact Ally', shortLabel: 'Contact', keyboardLabel: 'Focus Contact', objects: ['ContactSign'], view: 'externalLinks', panel: 'contact', title: 'Get in touch', href: `mailto:${identity.email}`, description: identity.email },
  stickers: { id: 'stickers', label: 'Open Sticker Book', shortLabel: 'Sticker book', keyboardLabel: 'Focus Sticker Book', objects: ['StickerBook'], view: 'designCorner', panel: 'stickers', title: 'The sticker book' },
  'esc': { id: 'esc', label: 'Engineering Student Council', shortLabel: 'Engineering Student Council', keyboardLabel: 'Focus Engineering Student Council', objects: ['Community_ESC'], view: 'communityPinboard', panel: 'community', item: 'esc', title: 'Engineering Student Council', navigation: false },
  'startup': { id: 'startup', label: 'Startup Hub', shortLabel: 'Startup Hub', keyboardLabel: 'Focus Startup Hub', objects: ['Community_StartupHub'], view: 'communityPinboard', panel: 'community', item: 'startup', title: 'Startup Hub', navigation: false },
  'dfa': { id: 'dfa', label: 'Design for America', shortLabel: 'Design for America', keyboardLabel: 'Focus Design for America', objects: ['Community_DFA'], view: 'communityPinboard', panel: 'community', item: 'dfa', title: 'Design for America', navigation: false },
  'beaverhacks': { id: 'beaverhacks', label: 'BeaverHacks', shortLabel: 'BeaverHacks', keyboardLabel: 'Focus BeaverHacks', objects: ['Community_BeaverHacks'], view: 'communityPinboard', panel: 'community', item: 'beaverhacks', title: 'BeaverHacks', navigation: false },
  'ai-club': { id: 'ai-club', label: 'AI Club', shortLabel: 'AI Club', keyboardLabel: 'Focus AI Club', objects: ['Community_AIClub'], view: 'communityPinboard', panel: 'community', item: 'ai-club', title: 'AI Club', navigation: false },
  'beaverhacks2026': { id: 'beaverhacks2026', label: 'BeaverHacks 2026', shortLabel: 'BeaverHacks 2026', keyboardLabel: 'Focus BeaverHacks 2026', objects: ['Community_BeaverHacks2026'], view: 'communityPinboard', panel: 'community', item: 'beaverhacks2026', title: 'BeaverHacks 2026', navigation: false },
  'innovationJam2026': { id: 'innovationJam2026', label: 'Innovation Jam 2026', shortLabel: 'Innovation Jam 2026', keyboardLabel: 'Focus Innovation Jam 2026', objects: ['Community_InnovationJam2026'], view: 'communityPinboard', panel: 'community', item: 'innovationJam2026', title: 'Innovation Jam 2026', navigation: false },
  'engineersWeek': { id: 'engineersWeek', label: 'Engineers’ Week 2026', shortLabel: 'Engineers’ Week 2026', keyboardLabel: 'Focus Engineers’ Week 2026', objects: ['Community_EngineersWeek'], view: 'communityPinboard', panel: 'community', item: 'engineersWeek', title: 'Engineers’ Week 2026', navigation: false },
}
export const interactionList = Object.values(interactions)
export const navigationList = interactionList.filter(entry => entry.navigation !== false)
const objectActions = new Map(interactionList.flatMap(entry => entry.objects.map(name => [name, entry.id] as const)))
export function interactionForObject(object: { userData: Record<string, unknown>; parent: unknown }): InteractionId | null {
  let current = object as typeof object | null
  while (current) {
    if (current.userData.interactionId) return current.userData.interactionId as InteractionId
    const id = objectActions.get(String(current.userData.stable_id ?? ''))
    if (id) return id
    current = current.parent as typeof object | null
  }
  return null
}
export interface NavigationRequest {
  id: InteractionId | null
  view: CameraViewName
  serial: number
  keyboard: boolean
}
export interface CameraCommand { serial: number; zoomDelta: number }
