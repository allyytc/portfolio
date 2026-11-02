# Phase 4B — integrated cozy loft construction

2026-10-27 · `allyytc/portfolio` · local `main` · $0. No commit, push, deployment, original-site write, hosting change, or new dependency. The Phase 4B request supersedes Phase 4A's black chair and review boundary; the chair is now sage upholstery with cream shell/frame/arms. Prior source/export files and working code are checkpointed under `assets/checkpoints/phase4a/`.

## Deliverables and evidence

- Editable source: `assets/blender/studio-phase4b.blend`, with `PortfolioLoft4B` (758 editable objects) and `LoftBaked4B` (web geometry / preview). Phase 3, Phase 4A and temporary blockout scenes remain present. Earlier `.blend` files are unchanged.
- Browser model: **`public/models/loft-studio-v4b.glb`**. The earlier `desk-studio.glb` remains preserved and is no longer the runtime URL. This is an expanded source-derived room, not a restart or replacement with another person's environment.
- [Complete Blender render](evidence/phase4b/blender-studio.png).
- [Actual browser full room](evidence/phase4b/browser-studio-large.png), [desktop](evidence/phase4b/browser-desktop.png), [mobile](evidence/phase4b/browser-mobile.png).
- Actual browser zone studies: [desk](evidence/phase4b/browser-desk.png), [design corner](evidence/phase4b/browser-design-corner.png), [community wall](evidence/phase4b/browser-community-wall.png), [reading nook](evidence/phase4b/browser-reading-nook.png).
- [Phase 4A → 4B comparison](evidence/phase4b/before-after-browser.png) and [Blender/browser comparison](evidence/phase4b/blender-browser-comparison.png).
- [Asset/license register](PHASE4B_ASSETS.md); machine records in `evidence/phase4b/{final-scene,bake-export,gltf-verification,browser-metrics,artifact-manifest}.json`.

The close-ups are local evidence-camera studies of the actual loaded browser model, not additional public navigation modes. Native HTML controls and shared content panels remain available above/below the scene.

## Construction and zoning

The Phase 4A architecture was only an unexported clay study. It was inspected and retained as reference; its solid stair block and opaque window marker were not promoted to final furniture.

The current 7.8 × 5.8m cutaway contains an oak floor with visible foundation/trim/entrance step, plaster wall returns, timber posts/beams, raised boarded loft with railing, open timber staircase, and defined side-window framing. The window's front cutaway and clear opening preserve sight lines into the reading nook. A finished exterior landscape is intentionally absent.

The existing desk now sits against the rear/left studio wall. Its monitor, wooden PROJECTS sign, printer and paper retain their prior behavior and independent export identities. The printer stands on its own adapted cabinet, brought forward to clear the stair sight line. The exact current-role nameplate remains on the desk and in HTML. Source-derived rounded sage/cream upholstery replaces all-black chair materials; wheels retain a natural dark finish.

The upper loft includes a reused bed, cushions/pillows, an original draped blanket with a hem, and plants. The window nook includes a reused cushion bench, cushions, books, side table and floor lamp. A small lounge-seat/table/rug grouping connects the foreground to the workstation without filling the entrance path.

The design desk has an original bound sketchbook and sticker collection volume with cover/pages/spine/elastic, organized pencils, a real owner sticker image and a dedicated tablet labelled `Unwrap / Content pending`. No Unwrap screenshot or project claims were fabricated. The community cork/pegboard holds eight separately named reservations for Engineering Student Council, Startup Hub, Design for America, BeaverHacks, AI Club, BeaverHacks 2026, Innovation Jam 2026 and Engineers' Week. Selected actual owner design media is included; unverified event photographs and logos remain labelled reservations.

The archive uses an actual open bookcase, low storage shelf and distinct labelled Skills / Experience volumes. These are future destinations, not duplicate Resume triggers. GitHub and LinkedIn physical plaques carry the actual licensed Font Awesome brand outlines as shallow relief and their future URL metadata. One small original bunny relief appears on the entrance sign; no borrowed character model or fabricated organization artwork.

## Editable organization and interaction contract

Ten source collections: `Entrance`, `Workstation`, `DesignCorner`, `CommunityWall`, `ReadingNook`, `Loft`, `Archive`, `ExternalLinks`, `PlantsAndDecor`, `LightingAndCamera`.

Twenty-four stable export IDs survive as glTF extras, independent of Blender's automatic name suffixes. `ProjectsMonitor`, `ProjectsSign`, `PrinterBody`, `ResumePaper` retain the existing action contract. The eight `Community_*` IDs, `UnwrapDisplay`, `StickerBook`, `Sketchbook`, `AboutBook`, `SkillsVolume`, `ExperienceVolume`, `AboutSign`, `CommunitySign`, `ContactSign`, `ExternalGitHub`, and `ExternalLinkedIn` are independently selectable future meshes. `StudioStatic` contains the remaining fixed environment. **Phase 5 actions are not implemented.**

`src/studio/sceneConfig.ts` shares model version, framing and three actual mesh hit points with Playwright. The camera is orthographic, mapped from Blender `(9,-13,9.5)` to Three `(9,9.5,13)`, looking at `(0,1.55,0)`; the room fits within a nominal 11.2 × 8.6 span. The camera sees the full architecture, workstation, board, stairs, nook, design area and signpost. Small destination labels require close views; accessible Projects/Resume/Contact controls remain HTML.

## Baking and web integration

The existing React/R3F/Drei architecture and animation system are retained. Source copies are converted for export, then fixed zones are joined temporarily for one non-overlapping 4096² atlas. A face-ID attribute allows the baked geometry to be split back into named future targets without sharing overlapping UV islands. Cycles diffuse COLOR + DIRECT + INDIRECT, 48 samples, 12px bleed; final bake 89.28s on this host. High-quality PNG is retained and packed in Blender; the GLB embeds JPEG quality 90.

Fixed furniture, architecture, foliage, signs and future targets use one verified `KHR_materials_unlit` atlas. Runtime lights/shadows are disabled on those materials, avoiding double-lighting. The monitor, printer and animating paper remain PBR; the paper is hidden while baking so its shadow cannot be stuck in the fixed texture. AgX / neutral exposure remains common to Blender and Three. The browser loads the expanded versioned model URL, and the test checks new-zone IDs, preventing a false pass against cached workstation-only geometry.

The printer's paper is found by stable ID rather than an exact Blender object name. Pointer movement refreshes the contextual tooltip across multi-material target meshes. Native dialogs, keyboard focus behavior, reduced-motion support, direct HTML navigation and WebGL/model failure handling remain intact. The owner PDF is unchanged.

## Validation and measured limits

`npm run build` passes strict TypeScript and Vite. Existing lazy Three/Drei chunk warning remains (~1.025 MB raw / 271 KB gzip). No extra animation framework or unused library was installed.

`npm test`: **4 passed**, final interaction run 18.4s. Coverage includes actual monitor/sign mesh clicks, printer raycast and independent paper progression, three real shared project records, direct Resume, PDF MIME/byte equality, Escape/focus trapping/restoration, drag rejection, mobile/reduced motion, demand-rendered idle, model failure and WebGL-unavailable content access. No runtime page errors were reported in the interaction run. Capture errors are recorded separately.

Final GLB: **18,799,828 bytes**, 430,591 mesh triangles, 24 root meshes / stable IDs, one embedded atlas image. Sampled runtime peak: 48 draw calls, 470,141 triangles including shadow passes, 6 GPU textures and 35 geometries. Active-frame interval ~16.73ms in isolated headless Chrome on this host; idle rendering settles. These are not physical mobile GPU measurements or network-loading benchmarks. The 18.8MB payload needs later optimization before production.

## Comparison with the approved studio concept and remaining gaps

The approved reference is the owner's conversation image; no invented source URL or AI-rendered substitute was introduced. The actual comparison images above show implementation evidence. The room now follows its general zoning: entrance signs on the left, rear workstation and community display, raised rear/right bed, connecting stairs, side-window nook, curated foreground seating/design/storage and physical social plaques. Warm wood, sage, cream, blush accents, vegetation and soft contact shading are present.

The result **does not yet match the concept's final visual fidelity**. Remaining Phase 4C candidates: less angular lounge furniture and lamp silhouettes, softer/less uniform bedding and textiles, denser botanical variation, better art-directed grain, additional lighting/color calibration, atlas denoising/texel allocation for close views, and reduced geometry/payload. Thin rail/stair members show light/black edge artifacts in some angles; small labels lose clarity at the whole-room camera scale. The nook and design area remain somewhat screened by the side frame/front shelf at this isometric angle, though visible and separately documented in close-ups. The window is a clear cutaway rather than an exterior view with glazing/reflections.

Content blockers: Unwrap UI/media remains unverified; event-photo/logo permissions are unresolved; most community frames are intentionally reserved. Full original portfolio migration and new room interactions remain deferred. The content inventory and reference snapshots were not rewritten or shortened.

## Reproduction and stop boundary

Open the preserved Phase 4A source in Blender. Via `scripts/blender_bridge.py`, run `build_loft_phase4b.py`, `furnish_loft_phase4b.py`, `bake_export_loft_phase4b.py`, `render_loft_phase4b.py`, then `finalize_loft_phase4b.py`. Build/furnish/bake scripts refuse to replace existing constructed scenes or furnishings automatically. Archive edits before deliberately rebuilding generated scenes. No addon settings changes are needed.

Run `npm test` and `node scripts/capture-loft.mjs` against the local Vite server. The capture helper uses the existing camera controls through DEV-only framing hooks; these hooks are absent from the production bundle. Evidence and hashes are stored under this phase's directory, so earlier phase captures remain available.

**Stop after Phase 4B.** No Phase 4C final polish, Phase 5 behaviors, full content migration, publication or production-domain changes were performed.
