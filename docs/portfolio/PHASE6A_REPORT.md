# Phase 6A — preservation, content architecture and one complete example

Completed locally in `allyytc/portfolio`. Original repository/site access was read-only. No commit, push, deployment, CMS, dependency installation, generated portfolio media or 3D rebuild.

## Source preservation and tracking

All six original static pages plus `projects.js` were fetched through read-only GitHub access and compared with pinned ref `35ecfec2c43c535ea013e23720ffa6ad73108f10`. Content matches apart from connector-trimmed trailing whitespace. Read-only GETs of all six live pages also return HTTP 200 and match the pinned source apart from trailing whitespace; see `evidence/phase6a/live-source-checks.json`. Existing snapshots, complete file manifest, full inventory, captions, URLs and discrepancy notes remain preserved.

The new [migration checklist](MIGRATION_CHECKLIST.md) links the 338-record [source-to-destination ledger](evidence/phase6a/migration-index.json). It tracks all six pages, nine original projects plus pending Unwrap, five organizations, three events, eleven graphics entries, 38 gallery/array groups, every original media file (244), profile/skills and six historical prototype components. Each record includes source, destination, migration/media/link status, missing information and notes. Overlapping carousel/data arrays are deliberately retained as source groups, not counted as unique artwork collections.

[Content audit](evidence/phase6a/content-audit.json) preserves headings, static text blocks, references and embedded script data. [Organization source data](evidence/phase6a/organizations-source.json) retains full original descriptions, dates, ordered photos and CTAs. No original JS is executed as an extraction shortcut. Nothing is marked fully migrated merely because a Phase 5B overview exists.

## Architecture and UI

- `src/content/schema.ts`: typed Project, ProjectCategory, CaseStudySection, MediaAsset, Experience, Organization, Event, DesignWork, SkillCategory, Profile and ExternalLink. Rich blocks support paragraphs/emphasis, ordered/unordered lists, tags, galleries, individual media, links and expandable technical material.
- `src/content/catalog.ts` and `case-studies/korbit.ts`: complete case-study registration and explicitly pending Unwrap. Typed data imports no React, camera or scene code. Existing Project cards derive KO.rbit metadata from its authoritative case study; other prototype subsets stay intact.
- `src/components/case-study/CaseStudy.tsx`: optional status/awards/hero, full source sections, technology tags, external links, other-project navigation and Back to Projects. Existing modal shell supplies Back to Studio, close/Escape, focus containment and panel coordination. Absent optional sections are omitted.
- `Media.tsx`: responsive images/captions, screenshot galleries, nested native image lightbox with arrow-key/previous/next controls, local video support, on-request demo embeds, external links, tags and design-showcase support. The image viewer restores focus and closes independently of the parent panel. No fabricated media or empty project sections.
- `src/content/README.md`: source/provenance conventions and how to add later case studies without changing the room.

## Complete representative project: KO.rbit

The example preserves the original summary and full Description, all **six personal-role items**, the **complete Tech Stack paragraph**, all **six Features**, the original **ten tags**, original award, three external project links, source demo/caption and all **five screenshot captions in original order**. Rich emphasis from the source lists is retained. There is no invented Problem, Outcome, Status or design-process section where the original supplied none.

Only five small original screenshots were copied: **183,108 bytes total**, all verified against original Git blob hashes and served byte-for-byte. [Acquisition evidence](evidence/phase6a/media-acquisition.json) and [permission/provenance notes](PHASE6A_MEDIA.md) retain exact URLs and hashes. Underlying third-party imagery/marks still require appropriate review before publication; this is the owner-requested local rebuild, not a general artwork-license grant.

The sample opens from the existing Projects monitor or direct Projects/Quick View. Other-project and Back navigation preserve category/focus behavior. Other projects remain the earlier subsets or deferred inventory entries. No bulk Phase 6B/6C migration was performed. The preferred role remains `Software Developer Intern @ Impact Studio`.

## Validation and evidence

`npm run build` passes strict TypeScript and Vite. The existing large lazy Three/loader chunk warning remains. `npm test`: **22 passed (1.5m)**, including all prior camera/hover/printer/touch/fallback checks and five new content checks.

The browser independently parses the original HTML and checks every KO.rbit paragraph/list/headline/award unit against the rendered case study: **20 source text units**, six role items, six features, ten original tags. It also checks original gallery order/captions, local image MIME/bytes/checksums, external hrefs, on-request embed URL, mobile overflow, lightbox keyboard/Escape/focus, other-project/back/reset and conditional omission of empty fields. The test-only optional-data fixture renders real pending Unwrap data and existing technical text, not invented portfolio facts. See [parity result](evidence/phase6a/case-study-parity.json).

- [Desktop case study](evidence/phase6a/case-desktop-top.png), [technical content](evidence/phase6a/case-desktop-details.png).
- [Image viewer](evidence/phase6a/image-lightbox.png).
- [Mobile overview](evidence/phase6a/case-mobile-top.png), [mobile gallery](evidence/phase6a/case-mobile-gallery.png).
- New regression captures are under `evidence/phase6a/regression/`; earlier Phase 5B project captures remain reproducible from the saved checkpoint.

[Link checks](evidence/phase6a/link-checks.json): GitHub and both YouTube URLs return HTTP 200. **Devpost returns HTTP 403**, so it is retained and marked blocked, not asserted broken or verified. HTTP reachability does not guarantee playback or independently validate project claims. The embed test intercepts the source URL to verify behavior without depending on a third-party player.

## Preservation, missing information and stop boundary

A recoverable pre-change checkpoint is in `assets/checkpoints/phase5b-content/`. Original source snapshots, camera controller/presets, interaction registry, printer animation, editable Blender source, GLB and dependency files remain unchanged; [preservation evidence](evidence/phase6a/preservation-check.json) records hashes. Existing context identifies prototype/static graduation dates, role/metric wording and LinkedIn differences; those are not silently reconciled by this phase.

Unwrap details/UI/screenshots/demo remain missing. The original `-pm.pdf` reference remains absent from the pinned tree; the already supplied owner PDF stays unchanged and functional. Other projects, organizations, event narratives and their full galleries remain scheduled for Phase 6B/6C. No new owner input is required to review this example, but blocked links and later artwork/photo rights need verification before publication. Stopped after Phase 6A; no production files or domain settings were changed.
