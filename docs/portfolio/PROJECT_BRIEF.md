# Ally Chen — Creative Studio Portfolio

Approved foundation brief · 2026-10-26 (America/Los_Angeles)

## Scope and repository boundary

Build the new portfolio only in `allyytc/portfolio`, locally at `/Users/ally/Github/portfolio`. The original `allyytc/allyytc.github.io` repository and `https://allyytc.github.io/` are strictly read-only references. Never change their files, branches, settings, workflows, remotes, DNS, hosting, or deployment configuration. Do not deploy to the live domain. No deployment is included in this task.

Budget: $0. Use free local development tools and assets with documented licenses permitting the intended use. Blender is already connected; leave it untouched during foundation work. No asset research, asset downloads, or room implementation in this phase.

## Approved concept

A detailed, cozy, isometric 3D creative studio. The room itself is the homepage hero. Warm wood, sage green, and cream establish the palette, with abundant plants and soft lighting. The studio should feel deliberately composed and personally inhabited, with custom wooden navigation signs, a bunny figurine, desk computer, printer, sticker book, design corner, community wall, and reading nook.

Exact identity copy:

- Name sign: **Ally Chen**.
- Subtitle: **Developer · Designer · Product**.
- Desk role label: **Software Developer Intern @ Impact Studio**.

The new role label is explicitly owner-approved. Preserve the original “Web Developer Intern” wording in the historical inventory instead of erasing it.

## Navigation and content parity

- Desk monitor opens Projects, retaining all nine source software projects and their detail/media records.
- Printer opens Resume.
- Pinboard / community wall opens Community, including all organizations and event case studies.
- Design corner features Unwrap. Its descriptions, dates, role, links, stack, results, and media are pending verification; invent none of them. Preserve existing graphics and sticker collections alongside future design work.
- Reading nook opens About, with education, experience, and skills accessible from the same content system.
- The sticker book holds the existing sticker/design collections; its precise interaction can be decided during implementation.
- The bunny figurine and plants contribute to the studio's identity; no navigation behavior is assumed.

Explore Mode and Quick View must expose the same portfolio content, project details, galleries, external links, resume, and contact information. Use one typed content source and shared section state; the 3D room is an alternate navigation surface. Quick View must remain usable on mobile, with a keyboard, with reduced motion, and when WebGL fails or is unavailable.

Resume and Contact must be directly accessible in persistent HTML navigation without entering or exploring the room. A missing resume must have an honest, directly reachable status, not a broken download. The source references `allychen-resume2028-pm.pdf`, but that file is absent from the inspected source tree; supply or verify the correct document before implementing a download.

## Content preservation

`CONTENT_INVENTORY.md` identifies pages, sections, projects, awards, organizations, roles, skills, links, and media. `reference/` preserves the inspected content-bearing source files as inert `.txt` copies, with a pinned tree manifest and complete media-path appendix. Keep long descriptions, project contributions, event responsibilities, captions, dates, credits, and videos through migration. Do not shorten away information to fit the scene.

Treat the original `app/` React prototype as additional reference, not verified current biography. Its 2027 graduation/availability labels, alternate LinkedIn URL, Impact traffic claim, and other differences require verification against the static pages and owner input. Unwrap is future scope only, with no verified source content found.

## Implementation foundation

- React + TypeScript + Vite; npm lockfile and strict TypeScript checking.
- `src/content/`: owner-approved identity now; shared typed portfolio records later.
- `src/studio/`: reserved React Three Fiber scene boundary. Three.js/R3F dependencies are deferred until scene work uses them, to avoid unused packages.
- `src/App.tsx`: minimal HTML foundation and direct Contact / Resume status access. It is not the finished Quick View or room.
- Later: editable Blender sources under `assets/blender/`, optimized GLB exports under `public/models/`, with licensing provenance. No assets populated now.
- Use lazy loading and isolate WebGL failures from HTML content when implementing the scene.

## Visual quality and acceptance for later work

Build a coherent, detailed isometric composition with readable navigation signs, warm wood materials, cream surfaces, sage accents, varied plants, soft shadows, and intentional prop placement. Avoid generic low-detail block furniture, default shiny materials, clutter that hides controls, and unreadable text. The room should communicate the approved studio concept at its initial camera angle.

Check composition, text contrast, hotspot affordances, keyboard focus, touch targets, mobile framing, reduced-motion behavior, and WebGL fallback. Optimize exported geometry, textures, lights, shadows, and device pixel ratio after measuring real performance; do not sacrifice content access for rendering effects. Preview representative desktop and mobile views before calling visual work complete.

## Foundation completion boundary

Complete the source inventory, this brief, repository safety rules, minimal runnable app, and typecheck/build verification. Stop there. No 3D scene, placeholder room, asset discovery, model downloads, Blender edits, paid services, deployment setup, or live-domain changes are authorized by this phase.

## Open verification items

- Obtain or confirm the resume PDF; preserve its existing path in the inventory meanwhile.
- Verify Unwrap's actual content and media before adding public project copy.
- Resolve prototype/static conflicts before importing claims into the new content model.
- Confirm rights and retain credits for existing third-party photos/art before publishing copies; no repository-wide license was found in the inspected tree.

## Resume follow-up — 2026-10-27

The owner-provided `allychen-resume2028.pdf` is now verified and connected through the shared Resume panel in the new portfolio. See `PHASE3_REPORT.md`. The original repository remains read-only, including its historical missing resume reference.

## Owner refinements — Phase 4A, 2026-10-27

The chair is **fully black**, including shell, arms, base and caster hubs. Warm wood, sage, cream and plants remain the surrounding studio palette. Phase 4A refines the desk and baked lighting, gives the 3D scene visual priority, and establishes a separate temporary full-room blockout. Stop for owner visual review before detailed room assembly; see `PHASE4A_REPORT.md`. Earlier phase restrictions above are historical task boundaries, not a rollback of this authorization.

## Owner authorization — Phase 4B, 2026-10-27

Complete the coherent loft construction and integrate it into the existing browser app. The latest chair direction is **soft sage upholstery and cream ergonomic shell/frame**, superseding the Phase 4A black finish. Add all architectural/content zones, curated furnishings and separately named future targets; preserve Projects/Resume/Contact. Defer Phase 4C polish, Phase 5 behaviors and full content migration. The original site stays read-only, with no deployment. Current source/evidence: `PHASE4B_REPORT.md`.

## Owner authorization — Phase 4C/4D, 2026-10-27

Phase 4C prepared bounded named cameras, local compression/loader recovery and visual refinements; the owner supplied Phase 4D while validation continued. Phase 4D authorizes targeted licensed furniture/foliage replacements, a complete recognizable window/nook, better bedding, measured optimization and actual browser evidence. Preserve the default isometric orientation, existing workstation/identity and direct HTML actions; use tighter responsive framing rather than CSS model scaling. Keep visitor orbit/navigation disabled. Current source and results: `PHASE4D_REPORT.md`; previous versions remain recoverable. Stop before Phase 5 navigation or Phase 6 migration.


## Phase 5A implementation boundary

The approved Phase 4D isometric overview and model are retained. Bounded orbit/zoom and measured focus views now expose workstation, design, community, reading, archive, printer and social destinations. A shared registry provides scene hitboxes and accessible HTML destination actions; direct Projects, Resume and Contact remain independent of WebGL. Touch rotation/pinch is opt-in to retain native page scrolling. Reduced motion skips camera animation. Phase 5B object choreography and Phase 6 content migration remain deferred. See `PHASE5A_REPORT.md` for tested behavior and evidence.


## Phase 5B implementation boundary

The owner authorized shared HTML experiences for the existing room objects. Projects has category/card/detail navigation; community frames select individual source-backed organization/event entries; the sticker book exposes existing local artwork; reading/About and archive link to Experience, Skills and Resume. The same registry serves scene and HTML actions, with camera/panel synchronization and existing paper motion preserved. Unwrap remains pending verification. The room, Blender source and camera controller are retained. Stop after Phase 5B; full Phase 6 content/media migration and deployment remain deferred. See `PHASE5B_REPORT.md`.


## Phase 6A implementation boundary

The owner authorized typed domain content, source-to-destination migration tracking, reusable case-study/media UI and one complete project example. KO.rbit is preserved from the pinned original source, including full descriptions, role/features, full stack, award, gallery order/captions and demo/links. All remaining source pages and media stay inventoried for Phase 6B/6C; existing Phase 5B subsets remain functional. Preferred role is unchanged. No scene/camera rebuild, bulk migration or deployment. See `PHASE6A_REPORT.md` and `MIGRATION_CHECKLIST.md`.

## Phase 6B handoff

All nine original projects and 11 graphics / 15 stickers / 20 supporting design and merchandise records are migrated through shared data and components. Earlier statements above about absent Unwrap source reflect historical phases: read-only inspection now found the local `calhacks2026` Unwrap app and two existing development UI captures. Only documented source observations are shown; personal role/research, final features, public URLs and outcomes remain pending. No 3D/camera/printer changes, video-player rewrite, Phase 6C migration, optimization phase or deployment. See `PHASE6B_REPORT.md`.

## Phase 6C handoff

The original About/Education, one professional role, six skill categories/40 skills, five organization narratives and three event stories are now integrated through `src/content/profile.ts`, `community.ts` and `ProfileExperiences.tsx`. Original role title `Web Developer Intern` and full responsibilities remain intact; the owner-preferred visible title remains `Software Developer Intern @ Impact Studio`. Every displayed original media reference now has a verified shared local destination. Photography-led event and organization stories reuse Phase 6B artwork, galleries and links, with About, archive, skills and Contact treatments suited to their content. No 3D, camera, printer, project-data or video-player rebuild. Unwrap gaps remain explicit. Stop after Phase 6C; no Phase 7 optimization or Phase 8 deployment. See `PHASE6C_REPORT.md`.

## Phase 7A handoff — 2026-10-29

The room remains the homepage hero. One collapsible Quick View replaces the permanent destination pills and duplicate action row, with direct HTML access by default and optional room focus. Experience and Skills are separate destinations. Immediate header Resume/Contact access remains. Panels share readable typography, sticky detail-return controls, measured section offsets and saved list positions. Existing bounded camera behavior, real content, media, printer and model remain intact. No new library or asset acquisition. Stop after Phase 7A; no Phase 7B performance work or deployment. See `PHASE7A_REPORT.md`.

## Phase 7B current handoff — 2026-10-29

Measured optimization adds panel-boundary lazy content, a geometry-identical phone GLB with a smaller baked texture, device-appropriate render resolution and optional lighter shadows. Hash routes support sections/projects/events and browser history under static-host subpaths. Source-generated text HTML, metadata, contrast fixes and recovery for graphics context/embedded texture/content-module failure preserve access without the room. All original content, media and editable Blender assets remain intact. No deployment or original-site change. Development noindex remains; canonical and absolute social URLs await the approved launch destination. Stop after Phase 7B; Phase 8 requires an independent final audit and explicit launch approval. Reports: `PERFORMANCE_REPORT.md`, `ACCESSIBILITY_AUDIT.md`, `REGRESSION_CHECKLIST.md`.
