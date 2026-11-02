/** Content-domain types. No component, camera, scene-object or routing imports. */
export interface SourceReference { repository: string; ref: string; path: string; anchor?: string; blob?: string }
export interface Verification { status: 'source-preserved' | 'prototype-subset' | 'pending'; notes?: string[] }
export interface ExternalLink { id: string; label: string; href: string; kind?: 'github' | 'devpost' | 'live' | 'demo' | 'contact' | 'source'; verification?: 'not-checked' | 'resolved' | 'blocked' | 'missing' }
interface MediaBase { id: string; src: string; caption?: string; source: SourceReference; originalPath: string; sourceURL?: string; sha256?: string; gitBlob?: string; rights: 'owner-local-rebuild' | 'review-required'; credits?: string[] }
export type MediaAsset = MediaBase & ({ kind: 'image'; alt: string; width?: number; height?: number } | { kind: 'video'; title: string; poster?: string; mime?: string } | { kind: 'embed'; title: string; watchURL: string })
export type InlineContent = string | { text: string; emphasis: 'strong' | 'em' } | { text: string; href: string }
export type RichText = readonly InlineContent[]
export type ContentBlock =
  | { kind: 'paragraph'; content: RichText }
  | { kind: 'list'; items: readonly RichText[]; ordered?: boolean }
  | { kind: 'tags'; items: readonly string[] }
  | { kind: 'gallery'; label: string; mediaIds: readonly string[] }
  | { kind: 'media'; mediaId: string }
  | { kind: 'links'; items: readonly ExternalLink[] }
  | { kind: 'details'; summary: string; blocks: readonly ContentBlock[] }
export interface CaseStudySection { id: string; title?: string; blocks: readonly ContentBlock[]; source?: SourceReference }
export interface ProjectCategory { id: 'in-progress' | 'hackathons' | 'past-projects' | 'design-work'; label: string; source?: SourceReference }
export interface Project { id: string; title: string; category: ProjectCategory['id']; overview: string; status?: string; presentation?: 'software' | 'web-ux' | 'product' | 'technical'; recognition?: readonly string[]; awards?: readonly string[]; technologies: readonly string[]; heroMediaId?: string; sections: readonly CaseStudySection[]; media: readonly MediaAsset[]; links: readonly ExternalLink[]; source?: SourceReference; verification: Verification }
export interface Experience { id: string; title: string; organization: string; dates: string; projectIds?: readonly string[]; sections: readonly CaseStudySection[]; links?: readonly ExternalLink[]; source: SourceReference; verification: Verification }
export interface Organization { id: string; title: string; role?: string; dates?: string; sections: readonly CaseStudySection[]; media: readonly MediaAsset[]; links: readonly ExternalLink[]; eventIds?: readonly string[]; source: SourceReference; verification: Verification }
export interface Event { id: string; title: string; dates?: string; role?: string; sections: readonly CaseStudySection[]; media: readonly MediaAsset[]; links: readonly ExternalLink[]; organizationIds?: readonly string[]; source: SourceReference; verification: Verification }
export interface DesignWork { id: string; title: string; category: string; sections?: readonly CaseStudySection[]; media: readonly MediaAsset[]; links?: readonly ExternalLink[]; source: SourceReference; verification: Verification }
export interface SkillCategory { id: string; title: string; items: readonly string[]; source?: SourceReference }
export interface Profile { name: string; subtitle: string; preferredRole: string; about: readonly CaseStudySection[]; education: readonly { degree: string; institution: string; minor?: string; graduation?: string; source: SourceReference }[]; experience: readonly Experience[]; skills: readonly SkillCategory[]; links: readonly ExternalLink[]; source: SourceReference; verification: Verification }
