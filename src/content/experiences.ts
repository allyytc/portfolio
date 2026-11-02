// Shared UI selection types. Full source content lives in profile.ts and community.ts.
// Provenance: docs/portfolio/CONTENT_INVENTORY.md and reference/*.html.txt.
export type PanelType = 'projects' | 'resume' | 'design' | 'community' | 'stickers' | 'about' | 'archive' | 'contact' | 'external'
export interface PanelSelection { type: PanelType; item?: string }
export interface PortfolioMedia { id: string; title: string; category: string; src: string; alt: string; caption: string }
