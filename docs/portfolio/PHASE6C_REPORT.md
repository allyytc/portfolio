# Phase 6C — experience, leadership, events and profile

The remaining substantive content displayed by the six original static portfolio pages is migrated into the studio's shared HTML experiences. About/Education, professional experience, all original skills, five organizations, three event stories and Contact now use complete source-backed records. The original repository and live site were read-only; nothing was committed, pushed, published or deployed. Phase 7 optimization and Phase 8 deployment were not started.

## Content and interface changes

- `src/content/profile.ts`: all three original About paragraphs, rich emphasis, degree, minor, university, June 2028 graduation, both original portraits, original contact destinations, the one original professional role and all six skill categories / 40 skills. No additional personal history, creative interests, roles, ratings or years of proficiency are invented.
- Official source title **Web Developer Intern**, organization, **May 2026 - Present**, all four full responsibility bullets and original View Work link are retained. The preferred visible label **Software Developer Intern @ Impact Studio** is shown separately. Original biography wording is not silently rewritten to match the preferred label. Source claims such as the biography's 300+ daily users remain original copy, not newly verified metrics.
- `src/content/community.ts`: Engineering Student Council, Startup Hub, Design for America, BeaverHacks and **Artificial Intelligence Club** (full original title); complete descriptions, roles, dates, all ordered photos and original CTAs. Future-tense plans, including AI Club's later marketing role and Startup Hub's plans, remain future tense.
- BeaverHacks 2026: full overview/context, personal role introduction, marketing/outreach, merchandise/design, volunteer coordination, 28 event-carousel photos, 12 merchandise photos, six sticker designs and original hero imagery.
- Innovation Jam 2026: full overview/context, personal role, event coordination, branding/merch and pitch-session contributions, nine event photos, four stickers, four name tags, three plaques, tote and original hero. Source prize/grant figures remain verbatim; no new outcomes are inferred.
- Engineers' Week 2026: full overview/context, role, brand identity, outreach/promotion, sticker design/production, original event-photo sequence, five sticker designs and original hero. The existing Engineers' Week flyer from the shared Phase 6B design registry also appears as related event graphics.
- `src/components/ProfileExperiences.tsx`: personal editorial About and education card; chronological archive with expandable role context, related project and retained return focus; grouped skills with exact source-technology project associations; memory-wall organization/event cards, distinct organization stories and photography-led event sections; minimal Contact with verified email/GitHub/LinkedIn, original published telephone destination and direct working PDF access.
- Shared ESC and Startup Hub graphics appear in their organization stories. `DesignGallery.tsx` keeps original external event links and adds internal story cross-links. Event stories reuse the same original sticker/design/merchandise binaries already used by the sticker book and design gallery. No artwork files are duplicated per view.

`ExperiencePanels.tsx` now delegates these destinations to the complete records; shortened Phase 5B biography/experience/skills duplicates have been removed from `experiences.ts`, which retains shared selection/media types. Existing project explorer and Unwrap data are unchanged. `CaseStudy.tsx` adds an optional return-label prop for archive/community project connections; the default Back to Projects flow remains intact. Existing rich-block and accessible gallery/lightbox components are reused rather than rebuilt.

## Source completeness and media

Authoritative source is the preserved original static site at commit `35ecfec2c43c535ea013e23720ffa6ad73108f10`; scripts parse its HTML and literal data arrays as inert data, never executing original JS. Original labels, paragraphs, lists, emphasis, dates, photo order, gallery associations and supplied captions are retained. Uncaptioned photos receive only neutral organization/event and sequence labels; no identities or activities are guessed. Original footer/contact destinations are centralized in the directly accessible Contact interface, and old page chrome is replaced by studio navigation.

Phase 6C uses **120 unique original files, 117,532,505 source bytes**. 35 files were already local and reused; 85 additional originals were acquired. All match their pinned Git blobs, manifest byte counts and SHA-256; every HTTP-served asset was checked against the original blob. The pre-acquisition [media register](PHASE6C_MEDIA.md), [required references](evidence/phase6c/required-media.json) and [acquisition results](evidence/phase6c/media-acquisition.json) preserve exact provenance and local-use rights boundaries. No transformations, generated media, model downloads, paid services or dependencies were introduced.

Across original-content phases, **179 distinct displayed/referenced source media files** now have local destinations. The original tree also contains **65 unreferenced alternate/HEIC/prototype/utility assets**: their paths and hashes remain preserved in the source inventory, with no published content association found. They are explicitly labeled as unreferenced, not falsely marked as migrated or counted as missing displayed photos. The two local Unwrap development captures and owner-provided PDF are separate from these original-tree counts.

The [374-record current ledger](evidence/phase6c/migration-index.json) and [Markdown checklist](MIGRATION_CHECKLIST.md) record each source, destination, text/media completeness, links, status and ambiguity. Historical Phase 6A and 6B indices remain unchanged. Six prototype React snapshots remain historical references; conflicting prototype graduation, LinkedIn and other claims are not silently promoted into the static site's biography.

## Navigation and verification

Existing studio interaction IDs, room mesh targets and camera controllers are retained. Reading nook opens About, archive exposes Experience/Skills, each pinboard frame independently opens its organization/event, Contact remains directly accessible and the printer/header expose the working owner-supplied PDF. The same HTML panels are used by Quick View. Internal cross-links connect DFA to CDDC, Impact experience to its case study, exact skills to matching source technologies, related organizations/events and sticker collections to their event stories. Event section anchors scroll within the dialog, respect reduced motion, focus the heading and account for the opaque sticky header. No public URL router or hosting configuration was added.

[Link checks](evidence/phase6c/link-checks.json) cover 11 unique original contact/organization/work destinations: eight HTTP URLs resolved with 200; email and telephone exactly match the original published source (no mail sent or phone call made). The old `allychen-resume2028-pm.pdf` is known missing; provenance keeps that historical reference while the UI offers the existing unchanged owner-supplied `public/files/allychen-resume2028.pdf`. Its actual local PDF response is verified. HTTP 200 is reachability, not independent verification of every external content claim.

## Validation and screenshots

**Strict TypeScript / Vite production build and all 48 tests passed** (2.3 minutes, one worker). Final results are recorded in [validation.json](evidence/phase6c/validation.json). The new migration suite verifies all five organization narratives/dates/roles/original CTAs, full event paragraphs and responsibility lists against original HTML, every original carousel's order and artwork references, photo rendering, lightbox keyboard operation, About/Education, official/preferred role distinction, all 40 skills, exact project links, Contact/PDF, sticker-to-event links, mobile overflow, heading focus and Back to Studio. It also checks all 120 served file blobs and that initial studio landing requests no migrated media. Existing project, loader, camera, touch, bounded zoom/orbit, printer, social and modal regressions are retained.

Desktop/mobile evidence is under `evidence/phase6c/`:

- `about-desktop.png`, `about-mobile.png`.
- `experience-desktop.png`, `experience-mobile.png`.
- `skills-desktop.png`, `skills-mobile.png`.
- `community-desktop.png`, `community-mobile.png` and five `organization-*-desktop.png` stories.
- `beaverhacks2026-desktop.png`, `beaverhacks2026-mobile.png`.
- `innovationJam2026-desktop.png`, `innovationJam2026-mobile.png`.
- `engineersWeek-desktop.png`, `engineersWeek-mobile.png`.
- `contact-desktop.png`, `contact-mobile.png`.

Representative desktop and mobile renders were inspected for typography, image containment, legible section navigation and opaque headers. Regression captures write to `phase6c/regression/`, preserving historical screenshots.

[Preservation checks](evidence/phase6c/preservation-checks.json) verify the recoverable 48-file Phase 6B checkpoint, all 24 protected App/studio/project/identity/resume/package files, all 21 Phase 4D artifacts including editable Blender and current GLB, and all 15 pinned source snapshots. `VideoDemo` remains byte-for-byte unchanged. No camera, room, printer, model or project factual-data changes occurred. The existing approximately 972 KB raw lazy model-loader build warning remains; Phase 7 optimization is deferred.

## Remaining verification gaps and stopping point

No substantive original static-page text or displayed media remains omitted. Unwrap's personal contributions, research evidence, final implementation/deployment outcomes and approved public links remain pending exactly as in Phase 6B. The two original project Devpost HTTP 403 checks remain documented in Phase 6B; no unsupported claim of resolution is added. Public-use rights for underlying third-party photographs/artwork remain distinct from the owner's authorized local migration.

Phase 6C is the stopping point. No Phase 7 optimization or Phase 8 deployment was performed.
