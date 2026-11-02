# Smallest next prototype — desk and signpost

Audit recommendation, 2026-10-26. **Plan only.** No room implementation, model acquisition, Blender edits, package changes, deployment or original-site changes performed in Phase 2. Existing uncommitted foundation work remains intact.

## Decision

Build one tightly framed **desk vignette plus a physical wooden signpost** to test the look, interaction and asset pipeline. Reuse a licensed desk/chair/monitor set, one plant and one lamp; use an existing sign mesh. Do not build the loft, reading nook, community wall, complete room shell, printer, bunny, full foliage system or custom furniture in this slice.

Primary code architecture: selectively adapt Questopia's MIT React/TypeScript/R3F boundaries into the existing Vite scaffold, using Drei CameraControls/events/loaders and CSS/R3F transforms. No GSAP/react-spring mix. Primary assets: exact Kenney Furniture Kit and Survival Kit GLBs in [ASSET_MANIFEST.md](ASSET_MANIFEST.md). If their actual rendered silhouettes fail the reference comparison, pause visual expansion and choose the documented alternate family; do not fill the scene with primitive replacements.

## Minimum composition

- Desk, rolling chair, monitor, keyboard, mouse, one potted plant and one table lamp from the same furniture family. Warm wood / sage / cream material pass; restrained warm light and soft contact shadows.
- One imported signpost with existing boards adapted to **Projects**, **About**, **Contact**. Initial movement limited to a small focus/hover response; no continuous swinging. Keep the support/pivots plausible. Shape/rounding/hardware must be checked against the sign close-up; an arrow/trail sign is not automatically acceptable as final art.
- Exact name and subtitle: **Ally Chen** / **Developer · Designer · Product**. Visible role: **Software Developer Intern @ Impact Studio**. Use approved lettering on existing surfaces or accessible adjacent HTML; do not copy personal labels from reference repos.
- Fixed initial orthographic isometric camera, overview/reset, bounded zoom and a gentle desk-focus transition. Default composition fits both signpost and monitor; no free orbit until hidden sides are proven visually complete.

The supplied sign detail and expanded loft/studio establish wood grain, rounded proportions, physical sign thickness, warm lighting and abundant plant direction. Two attachments were visible, although three were mentioned. The loft bed is context for eventual expansion, not a new requirement for this prototype.

## One vertical interaction slice

1. Monitor and Projects sign both open the same HTML Projects panel. Quick View opens that same panel using the same content record and action.
2. For the smallest pilot, use **Impact Studio Website** from the existing verified inventory, including its actual source link, status and preserved role/context. Do not invent a project or Unwrap content. Clearly label this as a prototype subset, not the completed portfolio migration.
3. About sign and Quick View show the same source-backed education/About excerpt. Contact opens the same source email/links in either mode. Remaining project/event/skills records stay preserved in inventory/snapshots and are deferred for full migration, not deleted or silently excluded from the eventual portfolio.
4. Persistent HTML Resume and Contact remain available before scene loading. Resume opens the honest missing-file status already present; a working download waits for the verified PDF. The printer interaction is deferred, not substituted with fake furniture or a dead URL.
5. One panel at a time; close button, Escape, focus containment/return and inert background. Scene navigation cannot be required to read content or recover from loading errors.

Full Explore/Quick View content parity remains mandatory for the eventual release. Within this deliberately limited pilot, both modes must expose exactly the same selected subset and links; neither gets extra portfolio facts.

## Implementation sequence for the next authorized phase

1. Acquire only selected small GLBs and their licenses, recording source paths/hashes. Inspect each imported object and sign topology; reject unsuitable forms before adding app dependencies or modeling.
2. Assemble and render a single Blender view using those assets. Apply palette/materials, readable labels and a simple warm light setup. Keep model edits minimal. Save an editable `.blend` in this repository.
3. If the composition/silhouettes meet the visual gate below, bake one daytime static assembly as needed and export GLB with semantic node names and separate movable sign/screen parts. Skip baking if a tiny initial PBR render already proves the composition; the documented bake path is available for refinement.
4. Add compatible pinned Three/R3F/Drei packages only when used. Implement the single camera, asset loader, semantic hotspots and shared HTML content panel, adapting only the selected MIT modules and preserving their notices.
5. Verify the acceptance criteria, record actual measurements/screenshots locally, and stop. No room expansion or deployment follows automatically.

Estimated effort: roughly 1–2 focused days for the small interaction/visual slice if the selected assets work; **not a quote for reference-quality full-room production**. Asset rejection, lettering, rebaking and mobile testing may extend this. The audit made no performance or visual-fidelity measurements on running candidate scenes.

## Acceptance criteria

### Visual gate

- Imported furniture is visibly modeled furniture, not boxes used as substitutes. Desk/chair/monitor geometry remains coherent and matches the chosen family; no placeholder room is passed off as finished.
- At overview and focused desk angles, show wood, sage and cream consistently with soft lighting. Preserve sign readability and physical board thickness; no floating generic UI buttons pretending to be the final hanging sign.
- Owner name/subtitle/current role are exact and readable. Screen content and poster/label imagery are owner-authored or source-approved, with credits retained.
- Review 1440×900 and approximately 390×844 views. No clipped signpost, tiny required text, obstructed hotspots or stretched furniture. Compare against the supplied references and explicitly record the remaining low-poly/detail gap before expanding.
- If reference-like sign shape/material quality cannot be reached by modest asset adaptation, record a bounded art gap. Do not start custom furniture modeling or falsely claim fidelity.

### Behavior and accessibility gate

- Clicking/tapping monitor or Projects sign invokes exactly one panel action. Dragging does not activate it; hidden/occluded objects do not unexpectedly receive clicks through the panel.
- Pointer cursor/hover feedback and equivalent keyboard focus are visible. Enter/Space can open the HTML equivalents, Escape closes the panel, and focus returns to its invoker.
- Quick View and scene actions share state/content; Resume/status and Contact work with WebGL disabled or still loading. A failed model fetch yields a retry/error message and functioning HTML content.
- Touch gestures are canvas-scoped; ordinary document scrolling and panel scrolling still work. No hover-only control is essential.
- Reduced motion removes camera fly-ins and sign motion. Overview/reset and zoom controls remain reachable, camera limits prevent losing the desk, and resizing refits without recreating content state.

### Engineering/performance gate

- `npm run build` passes; no unused runtime libraries, remote hotlinked models, copied source resumes/photos, or missing license files.
- Initial targets, to be measured: combined prototype model/texture payload ≤3 MB, ≤100k visible triangles, ≤60 draw calls, and capped DPR around 1–1.5 on mobile. These are proposed budgets, not audited source measurements; report any justified deviation.
- Target smooth desktop interaction (~50–60 FPS) and usable mobile interaction (≥30 FPS on a documented test device). Record viewport/device and actual frame timing rather than calling it mobile-ready from desktop emulation alone.
- Demand rendering sleeps when camera/sign motion settles. No all-library preload, large night textures, postprocessing stack, physics loop or speculative decoder/transcoder installation.
- Editable Blender file, selected source provenance, optimized exports and captured verification evidence stay in `allyytc/portfolio`; no original-domain deployment, push or hosting configuration.

## Deferred decisions and blockers

No blocker to a licensed desk/sign interaction trial. Resume PDF remains missing; Unwrap is pending content verification. Detailed trailing foliage, rounded hanging-sign hardware/raised icons and stationery still lack exact verified matching files; no custom placeholders are authorized to hide those gaps. Individual printer/bunny listings are licensed candidates but still need binary/topology inspection before use.

**Next step:** implement only this licensed desk-and-signpost slice when the user starts the prototype phase, then review its actual render before committing to the larger room.

## Phase 4B completed boundary

The authorized complete loft construction now renders from `models/loft-studio-v4b.glb`; see `PHASE4B_REPORT.md` for full-room/zone evidence and acceptance checks. The desk interactions and native HTML navigation remain the working prototype behaviors. New zone, community, archive and social meshes are separately named but their Phase 5 actions are deferred. Latest chair direction is sage/cream. Stop after this phase: no Phase 4C final polish, content migration, publication or original-site changes.

## Phase 4D stop boundary

The refined room is integrated from `loft-studio-v4d.glb`; current evidence and licenses are in `PHASE4D_REPORT.md`. Named camera poses and existing monitor/printer/HTML actions are verified. New zone/social interactions remain deferred. Stop before Phase 5 full navigation and Phase 6 content migration; do not deploy or alter the original site.
