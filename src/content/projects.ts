import { caseStudies, projectCategories } from './catalog'
// Discovery cards reference a single authoritative case study, never a second copy.
export const projects = Object.values(caseStudies).map(project => ({
  id: project.id, title: project.title,
  category: projectCategories.find(category => category.id === project.category)!.label,
  kind: project.awards?.[0] ?? project.recognition?.[0] ?? project.status ?? projectCategories.find(category => category.id === project.category)!.label,
  description: project.overview, tags: project.technologies,
  href: project.links[0]?.href, linkLabel: project.links[0]?.label,
  thumbnail: project.media.find(asset => asset.id === project.heroMediaId && asset.kind === 'image'),
  pending: project.verification.status === 'pending',
}))
export const featuredProjectIds = ['impact-studio','korbit','er-overwatch']
