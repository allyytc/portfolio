# Phase 5B — interactive objects and studio experiences

Implemented locally in `allyytc/portfolio`. No deployment, commit, push, original-repository changes, asset downloads or dependency additions. Full Phase 6 content/media migration remains deferred.

## Changes

- **One panel system:** `PortfolioDialog.tsx` retains the native modal, focus containment, Escape/close and return-focus behavior. `ExperiencePanels.tsx` supplies reusable experience content, category navigation, project/media details, a real-media viewer and an optional demonstration-link component. Cream/sage panels now use darker readable text, responsive grids and a consistent Back to Studio action.
- **Central object registry:** `interactions.ts` declares panel types, selected entries, scene roots, hover labels, hit zones and camera targets. The eight pinboard roots independently select their organization/event; the sticker book has its own destination. Scene selection stays separate from HTML rendering.
- **Monitor / Projects:** In Progress, Hackathon Projects, Past Projects and Design Work categories, plus the existing three-project Selected view. Cards open readable details and return keyboard focus to their card. The three existing records are preserved; one concise Sally’s POS record makes Past Projects functional. The remaining software projects and full media/detail migration stay in the preserved inventory.
- **Printer:** the existing independent paper motion is isolated in `usePrinterPaper.ts`. It uses refs/demand frames, supports interruption/repetition and skips animation for reduced motion. The same unchanged resume PDF remains available directly and after focus/printing.
- **Design / Unwrap:** a clearly labeled pending-verification entry, with reusable media/demo components ready for supplied screenshots/URLs. No invented UI, features, results or artwork.
- **Community:** five organization entries and three event overview routes sourced from the pinned local inventory. Pinboard frames and HTML cards reach Engineering Student Council, Startup Hub, Design for America, BeaverHacks, AI Club, BeaverHacks 2026, Innovation Jam 2026 and Engineers’ Week 2026. No event photographs were added.
- **Sticker book:** category navigation for BeaverHacks, Innovation Jam, Engineers’ Week and other design work. Three previously acquired owner artworks are copied unchanged into `public/media/`. Cards open an accessible enlarged image/caption view; empty categories state their status honestly.
- **Reading / archive / Contact:** source-backed About introduction; Experience, Skills and Resume routes; one existing Impact Studio experience and the original skills categories; accessible email/profile interface. Owner-approved current role wording is used. Profile signs open the existing URLs on the user gesture and retain HTML links.

## Camera and panel coordination

The Phase 5A camera controller, measured presets, default pose and all geometry are unchanged. Normal object actions wait for the current matching focus transition before opening the panel; printer actions also wait for paper completion. Reduced motion and failed/unavailable WebGL expose content immediately. Direct shortcuts wait out unrelated in-flight movement without starting a new focus move. Latest-request bookkeeping prevents stale content from reopening.

Related content within a settled camera zone changes without refocusing. Closing a panel retains the current focused pose; Back to Studio resets to the approved overview. Camera input remains blocked while the modal is active. Existing orbit/zoom, touch opt-in, keyboard controls, loading failure and decoder retry remain intact.

## Preservation and rights

`assets/checkpoints/phase5a-interactions/` holds 23 recoverable pre-change files and SHA-256 metadata. All 21 prior Phase 4D artifact hashes still match, including the 3,260,508-byte GLB and editable Blender source. Camera controller/preset/config/bounds files and package/lock files also match the checkpoint. See [preservation-check.json](evidence/phase5b/preservation-check.json).

No new model, code library, generated artwork or purchased asset was introduced. Existing source artwork permission/provenance remains documented in `PHASE4B_ASSETS.md` and `assets/source/portfolio-media/acquisition.json`; the three HTML image copies match those source SHA-256 values. `public/licenses/portfolio-media-NOTICE.txt` retains pinned sources and the limited owner-local-rebuild permission. Organization marks retain their respective rights; a general third-party artwork license is not inferred.

## Validation and screenshots

- `npm run build`: strict TypeScript and Vite passed. The existing ~972KB lazy Three/loader chunk warning remains.
- `npm test`: **17 passed (1.4m)**. Seven experience checks were also rerun after improving panel text contrast. Coverage includes real mesh/sign/bench/book clicks, all eight independently selected pinboard items, project categories/detail/back focus, real media bytes, direct email/profile URLs, rapid switching, unrelated shortcut coordination, repeated/interrupted printing, modal input blocking, close/reset, keyboard, actual emulated touch gestures, reduced motion, model/WebGL/decoder failures, retry and demand-rendered idle.
- External profile tests intercept their destination requests; no live profile service is needed to verify the URLs. Touch input is browser-emulated, not a physical-device performance benchmark. No new per-frame React state is used. Runtime diagnostics remain in [browser-metrics.json](evidence/phase5b/browser-metrics.json).

Required evidence:

1. [Projects monitor](evidence/phase5b/projects-monitor.png), [project detail](evidence/phase5b/project-detail.png).
2. [Printer animation](evidence/phase5b/printer-animation.png), [resume reveal](evidence/phase5b/resume-reveal.png).
3. [Design / Unwrap](evidence/phase5b/design-unwrap.png).
4. [Community pinboard hub](evidence/phase5b/community-pinboard.png), [event overview](evidence/phase5b/community-event.png).
5. [Sticker gallery](evidence/phase5b/sticker-book-gallery.png), [mobile gallery](evidence/phase5b/mobile-gallery.png).
6. [About / reading nook](evidence/phase5b/about-reading-nook.png), [archive](evidence/phase5b/archive.png).

Matching JSON captures record camera state and paper progress alongside the experience screenshots. The animation capture shows paper emerging while the camera is moving; the reveal capture records a settled printer view and near-complete paper motion.

## Limits and stop boundary

The exported `StickerBook.005` is one baked mesh (mesh 22), with no separate cover or hinge. A true 3D opening/page turn would require splitting, editing and rebaking the source asset. That is deferred; the physical book click and complete gallery navigation work without it.

Unwrap details/screenshots/demo remain unverified. BeaverHacks artwork is reserved because no verified copy was already in the local approved media subset. Event entries are concise source-backed overviews, not complete migrated case studies. Earlier room texture/window seams and the partly occluded About plaque remain unchanged; bench/sign alternatives work. No full Phase 6 migration or production deployment was started. Stopped after Phase 5B.
