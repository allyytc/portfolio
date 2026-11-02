# Ally Chen — Portfolio

Local interactive cozy loft studio, built only in `allyytc/portfolio`. The original portfolio and live domain remain read-only. Nothing is deployed.

## Local development

Use Node.js 22.12+ (22.x) or 24+ and npm.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm test
```

Development and preview bind to localhost. `build` runs strict TypeScript checking and outputs `dist/`. `npm test` runs 59 isolated Playwright checks; on this Mac it uses installed Chrome, otherwise use Playwright's Chromium. No hosting or deployment configuration is present.

## Project map

- `src/App.tsx`: accessible navigation, shared Projects/Resume state, lazy-loaded 3D.
- `src/content/identity.ts`: approved identity and current role label.
- `src/studio/Studio.tsx`: R3F scene, shared object hitboxes/hover feedback and animated printer paper.
- `src/studio/StudioCamera.tsx`: bounded CameraControls, interruptible named transitions, intended wheel/touch gestures and keyboard controls.
- `src/studio/interactions.ts`: one typed destination/action registry for scene objects and HTML.
- [Performance report](docs/portfolio/PERFORMANCE_REPORT.md): before/after measurements, phone export, lazy loading, hash routes and technical limits.
- [Accessibility audit](docs/portfolio/ACCESSIBILITY_AUDIT.md) and [regression checklist](docs/portfolio/REGRESSION_CHECKLIST.md).
- [Phase 7A report](docs/portfolio/PHASE7A_REPORT.md): collapsible Quick View, consistent panels, saved reading positions and responsive interaction polish.
- [Phase 6C report](docs/portfolio/PHASE6C_REPORT.md): complete About, archive, skills, community/event migration, contact and shared artwork links.
- [Phase 6B report](docs/portfolio/PHASE6B_REPORT.md): all original projects, design/sticker migration, improved case studies, verified media and Unwrap source gaps.
- [Phase 6A report](docs/portfolio/PHASE6A_REPORT.md): source preservation, typed schemas, complete KO.rbit example, media components and migration ledger.
- [Migration checklist](docs/portfolio/MIGRATION_CHECKLIST.md): all source pages, projects, galleries and media; completed original-content migration and documented remaining verification gaps.
- [Content architecture](src/content/README.md): data types, provenance and case-study registration.
- [Phase 5B report](docs/portfolio/PHASE5B_REPORT.md): shared panels, independent pinboard actions, project categories/details, sticker gallery and validation.
- [Phase 5A report](docs/portfolio/PHASE5A_REPORT.md): controls, measured targets, validation, screenshots and remaining visual gaps.
- `assets/blender/studio-phase4d.blend`: current editable loft and baked web preview; `public/models/loft-studio-v4d.glb`: expanded web scene. Earlier Blender/model files remain preserved.
- [Phase 4D report](docs/portfolio/PHASE4D_REPORT.md): current asset replacements, window/nook, before/after evidence, licensing, camera preparation and measured performance.
- [Phase 4C handoff](docs/portfolio/PHASE4C_REPORT.md): camera/loader groundwork and preserved baseline.
- [Phase 4B report](docs/portfolio/PHASE4B_REPORT.md): expanded room, zone screenshots, licensing, performance and remaining gaps.
- [Phase 4A report](docs/portfolio/PHASE4A_REPORT.md): current renders, before/after comparisons, full-black chair, baking and visual-review boundary.
- [Phase 3 report](docs/portfolio/PHASE3_REPORT.md): results, evidence, licenses, limitations and rebuild commands.
- [Content inventory](docs/portfolio/CONTENT_INVENTORY.md): source-backed content, media, links, and verification gaps.
- [Project brief](docs/portfolio/PROJECT_BRIEF.md): approved concept and phase boundary.
- [Repository findings](docs/portfolio/FOUNDATION_NOTES.md): inspected state and validation.
- [Agent rules](AGENTS.md): safety, preservation, licensing, and quality requirements.

The full loft construction is integrated; Phase 4D targeted asset refinement is integrated; Phase 5A camera navigation is integrated. Phase 5B object experiences are integrated. Phase 6A infrastructure and the complete KO.rbit example are integrated. Phase 6B migrates all nine original projects and 46 design/sticker/supporting records through shared case studies and gallery filters. Phase 6C completes About/Education, the original role, all 40 skills, five organizations, three event stories and Contact. Phase 7A adds a compact Quick View with immediate section access, optional camera focus and polished responsive panels. Phase 7B adds measured phone/loading optimizations, static-host-safe hash links, source-generated text content, accessibility fixes and graceful fallbacks. Nothing is deployed. Phase 8 requires an independent audit and explicit launch approval. The printer animates its paper and reveals the owner-supplied resume PDF; the direct Resume button and Quick View expose the same file. The PDF is copied unchanged. Unwrap includes two existing development UI captures and source-backed observations; personal contributions and delivery outcomes remain pending verification.

`npm test` starts/reuses the local dev server (5173) and a production audit server (4174), building the latter if needed. `npm run audit:a11y` runs the axe-backed panel audit; axe-core is audit-only and excluded from production. Share links such as `/#projects/korbit`, `/#events/beaverhacks2026`, `/#skills` and `/#design/unwrap`. The text portfolio is available at `/content.html`. Development robots remain noindex; no canonical production domain is assumed. See the performance report for profiling commands and launch-audit limits.
