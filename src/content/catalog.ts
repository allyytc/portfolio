import { project as impactStudio } from './case-studies/impact-studio'
import { project as cddc } from './case-studies/cddc'
import { project as erOverwatch } from './case-studies/er-overwatch'
import { project as combocraft } from './case-studies/combocraft'
import { project as lantern } from './case-studies/lantern'
import { project as sallysPos } from './case-studies/sallys-pos'
import { project as afterlifeMetro } from './case-studies/afterlife-metro'
import { project as dementia } from './case-studies/dementia'
import { korbit } from './case-studies/korbit'
export { korbit } from './case-studies/korbit'
import type { Project, ProjectCategory } from './schema'
export { unwrap } from './case-studies/unwrap'
import { unwrap } from './case-studies/unwrap'
export const projectCategories: readonly ProjectCategory[] = [
  { id: 'in-progress', label: 'In Progress' }, { id: 'hackathons', label: 'Hackathon Projects' },
  { id: 'past-projects', label: 'Past Projects' }, { id: 'design-work', label: 'Design Work' },
]
export const caseStudies: Readonly<Record<string, Project>> = {
  'impact-studio': impactStudio, cddc, korbit, 'er-overwatch': erOverwatch,
  combocraft, lantern, 'sallys-pos': sallysPos, 'afterlife-metro': afterlifeMetro, dementia, unwrap,
}
