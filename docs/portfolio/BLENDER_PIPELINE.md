# Blender → GLB → React Three Fiber pipeline

Planned workflow, 2026-10-26. **No Blender commands, scene edits, model imports, bakes or exports were performed.** Use the connected Blender only when the next implementation phase is authorized. Work remains in `allyytc/portfolio`; the original website stays read-only.

## 1. Acquire only the selected reusable parts

Start with the exact CC0 Kenney GLBs in [ASSET_MANIFEST.md](ASSET_MANIFEST.md), not an entire reference repository or asset library. Save original bytes and included license under `assets/source/<pack>/`; record file hashes, source URL, creator, license, dependencies and acquisition date. Keep source archives out of the web bundle. Free glTF imports remain editable in Blender; paid `.blend` tiers are unnecessary.

Suggested future organization (none created in this audit):

```text
assets/source/<pack>/          original selected models and license
assets/blender/studio-desk.blend
assets/blender/textures/       saved bake images and any cleared source maps
public/models/studio-desk-v1.glb
public/models/studio-signpost-v1.glb
public/textures/               only if a bake is intentionally external
public/licenses/              notices for redistributed assets/code/fonts
src/studio/                   lazy-loaded scene and semantic hotspot map
```

Do not copy a reference room's personal screen images, posters, resume, logos, baked artwork or shader files. A texture atlas can contain protected artwork even when its room geometry is otherwise reusable. Keep original portfolio media/credits governed by the existing content inventory.

## 2. Import and inspect before customization

1. Inspect Blender's current session first; do not clear or overwrite unrelated work. Create/save a separate project under this repository and use named collections for source, static furniture, movable signs, screens and cameras.
2. Import glTF 2.0/GLB using Blender's built-in importer. For KayKit `.gltf`, keep its matching `.bin` and shared image URI beside it; prefer this over FBX material reconstruction. Check missing images, scale, axes, normals, dimensions and object hierarchy.
3. Establish consistent metric proportions using desk/chair dimensions as an artistic baseline. Apply transforms on working duplicates when appropriate, leaving original import data intact. glTF/Blender import/export handles axis conversion; do not add a second guessed 90° correction.
4. Inspect topology and materials in rendered/solid view. Check desk drawers, rolling chair, monitor housing and sign silhouette at the actual camera distance. Reject visibly unsuitable furniture rather than replacing it with cubes. The reviewed pack preview is not proof every part meets the references.
5. Preserve readable semantic names: `desk`, `chair`, `monitor_projects`, `sign_projects`, `sign_about`, `sign_contact`. Use named empties for sign pivots and camera targets where useful. Verify names survive export before writing hotspot bindings.

## 3. Customize the reusable geometry sparingly

Adjust existing material colors toward warm wood, sage upholstery, cream plastics and muted brass/green accents. Keep silhouettes and existing detailing; use the same palette and roughness across the set. Avoid remaking furniture, generating a primitive room substitute, or importing multiple unrelated packs just to fill space.

Use the imported sign board(s); inspect whether they are separate objects, loose mesh parts or a joined topology before planning movement. Separate existing parts only as needed, set rotation pivots at their support points and preserve board thickness. A borrowed pointed trail sign may still fail the reference's rounded suspended-board silhouette; flag that result instead of calling it final. Do not assume chains, embossed letters or icons already exist.

Use owner-approved name/subtitle/role copy exactly. For prototype labels, readable owner-authored lettering on existing boards is enough; an OFL-cleared rounded font such as Nunito can later supply Blender text geometry. Preserve its license if the font file is distributed; keep font source out of the runtime when only exported letter geometry is needed. Convert/decimate text carefully so labels do not dominate geometry counts. No personal text from the reference portfolios is reusable portfolio content.

Create the monitor artwork from approved identity/content, not copied screenshots. Keep screen and sign meshes separate from the static bake so hover or small sign motion does not drag a large room material or baked shadow with it.

## 4. Light and bake only after the composition passes

Use **one daytime lighting setup**, not day/night blending. Establish a broad warm window/key light with a neutral fill and a restrained desk lamp; tune light softness and exposure on the actual desk/sign camera. Blender lights are for baking, not an assumption they will render identically after export.

Static furniture workflow:

1. Keep the original materials/UVs on source duplicates. Create a non-overlapping bake UV layout for the static group, with texel density based on camera visibility. Do not overwrite a gradient/palette UV layout used to color a source asset; bake from that material into a separate UV set/image.
2. Create an initial 2048² atlas and make its Image Texture node the active bake target in **every** material slot being baked. Ensure the intended UV map is the bake/render UV. Include padding (start around 8–16 pixels, inspect mip seams). Use separate atlases only where needed; a second 4K atlas is not automatically better.
3. In Cycles, bake a test patch first, then a Combined color-and-light result suitable for a fixed material appearance. Configure contributions deliberately; avoid relying on view-dependent reflections/transmission to survive camera movement. Keep glass, glossy/emissive screens, and movable signs separate. A color-only diffuse bake is a different product and will not contain the desired lighting/shadows.
4. Save the generated images explicitly to `assets/blender/textures/`, save the `.blend`, and inspect the atlas and model for empty/overlapping regions, seams and missing textures. Do not assume unsaved image datablocks are safely preserved.
5. Display the full baked color/light result with an **unlit** glTF material (`KHR_materials_unlit`) or assign an owned `MeshBasicMaterial` to the named static meshes at runtime. Inspect exported material JSON or reload it to confirm unlit behavior. Do not bake lighting into base color and then illuminate it again with PBR lights.

Moving signs/props use simple glTF-compatible PBR materials and restrained runtime lighting. Their baked shadows must not be frozen into a surface where movement makes the shadow visibly wrong. For the first slice, a tiny hover movement or material response is preferable to large swinging furniture.

Color management: color/baked maps use sRGB interpretation; roughness, normal and mask maps are data, not sRGB colors. A GLB loaded through GLTFLoader already configures embedded texture orientation. Only externally loaded bake images assigned to glTF UVs generally require `flipY = false`; do not blanket-flip every imported GLB texture. Compare the same viewpoint in Blender and browser before adjusting tone mapping/exposure.

This is a proposed reproducible recipe, not a completed bake. Blender UI labels/export behavior vary by installed version; verify the current session version before implementing.

## 5. Export the smallest practical GLB

- Export selected, required meshes/materials/UVs only. Keep static desk assembly and animated sign assembly separate if it improves iteration; avoid one file per tiny object once the composition stabilizes. Embed the selected textures for reliable portable GLBs.
- Use export-compatible materials. Blender procedural wood does not become a glTF procedural shader; bake it or use cleared image maps. Include required modifiers after checking appearance, retain sign pivots and semantic node names, and exclude hidden source collections, unused cameras/lights and unneeded animal rigs/animations.
- Start without Draco/Meshopt/KTX2. The selected Kenney entries are small, so decoder overhead may outweigh savings. Add compression only after measuring the composed export and preserving codec licenses/local decoder assets. A geometry compressor does not shrink a large JPEG atlas's decoded GPU memory.
- Reload the GLB into a separate verification collection/file, and inspect it in the browser with the actual loader. Verify node names, bounds, UVs, images, unlit/static versus PBR/dynamic separation, camera fit and material colors. Never overwrite the editable source with an optimized export.

## 6. Integrate with minimal reusable code

Use Questopia's small-component architecture and official R3F/Drei helpers, as selected in [CODE_REUSE.md](CODE_REUSE.md). `useGLTF` loads versioned local asset URLs resolved using Vite's base path. Preserve node names in one typed hotspot registry; do not hardcode arbitrary `Cube349` names throughout app code.

Cache models/textures; clone scene objects when placing multiple instances and clone a material only when that instance needs independent mutation. Dispose component-owned material overrides on unmount without disposing globally cached geometry/textures still in use elsewhere. No second global raycaster/event bus or animation framework is necessary.

Use CameraControls with an orthographic camera, focus/overview targets, smooth zoom and canvas-scoped gestures. Keep R3F native click/hover handlers and one shared HTML panel action. Stop propagation for overlays; reject clicks after dragging. Demand rendering must be invalidated during camera/sign transitions and allowed to sleep afterwards.

Keep progress, retry/error status, Resume, Contact and Quick View outside the lazy-loaded WebGL boundary. A missing model or context loss must not blank the portfolio. Both navigation modes select the same content records; loading the scene must never become a condition for accessing a resume/status or contact link.

## 7. Validation and later optimization

Record actual GLB bytes, texture dimensions, visible triangles, draw calls, peak memory where available, load timing and frame pacing. Use the prototype plan's modest budgets as gates, not claims that a model has been benchmarked. Inspect desktop, narrow phone, reduced motion, keyboard, loading failure and WebGL-disabled behavior before expanding the room.

Test dark seams at lower texture resolution, bake double-lighting, sign hit areas, readable wood/sign lettering and unwanted atlas tint changes. Prune genuinely invisible faces only after locking permitted camera views; removing backfaces prematurely can break later zoom/orbit views. No need for night mode, postprocessing bloom, physics, cloth, advanced foliage shaders or full room modeling to validate the first desk slice.

## Technical references and access limits

- [R3F events](https://r3f.docs.pmnd.rs/api/events), [Drei CameraControls](https://drei.docs.pmnd.rs/controls/camera-controls), [Drei useGLTF](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf), [R3F performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance): inspected first-party documentation; library source/license files also checked.
- [Blender Cycles baking manual](https://docs.blender.org/manual/en/latest/render/cycles/baking.html) and [glTF export manual](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html): direct access was blocked during this audit; indexed official baking documentation confirmed UV/active-image bake targets. The workflow above is an implementation proposal and must be checked in the installed version, not presented as a tested session.
- [Khronos unlit extension](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_unlit/README.md): standard material route for preserving a fully baked appearance.
- Questopia's inspected README/`Room.tsx`/`Images.tsx` illustrate baking and loading separation; its day/night shaders and room textures are not copied by this pipeline.

## Implemented Phase 4A pipeline

See `PHASE4A_REPORT.md` and `scripts/bake_export_phase4a.py`: editable `PortfolioDesk4A` → converted export copies → one static diffuse atlas with independent bake UV → glTF unlit static mesh + four independent PBR interaction nodes. Never apply realtime light/shadows to the baked static mesh. Hide the moving paper during the bake; retain it separately for animation. Blender camera-ray emission avoids relighting the preview; the exported `KHR_materials_unlit` extension is verified in JSON. AgX is now used in both renderers; PBR light parity still requires calibration. Room blockout remains a separate temporary scene and is not a web asset.

## Implemented Phase 4B extension

`PortfolioLoft4B` retains 10 editable zone collections; `LoftBaked4B` contains 24 independent export meshes. `scripts/bake_export_loft_phase4b.py` preserves per-zone face IDs while packing fixed geometry into one 4096² diffuse atlas, then splits the meshes back by stable ID and keeps the resulting UVs. All fixed surfaces/future targets use the same glTF unlit material; monitor, printer and independent paper remain PBR. The moving paper is excluded from baking. GLB JPEG quality 90 keeps the atlas smaller; PNG remains packed in the Blender source. `src/studio/sceneConfig.ts` records the exported coordinate convention, room camera and existing hit points. Stable glTF extras, rather than Blender name suffixes, identify interactions. Rebuild and validation commands are in `PHASE4B_REPORT.md`; no addon settings or hosting changes are required.

## Phase 4D shading and source refinements

Use the recorded `refine_loft_phase4d.py` → window staging → measured alignment → bake/export → render → finalizer sequence. The earlier bake defect on thin textiles remains documented in the Phase 4C handoff. Fixed surfaces use a shared 4096² diffuse-light atlas with glTF unlit shading. `SoftFurnishings` instead uses a separate 1024² COLOR-only bake feeding a matte PBR material; no defective fixed shadow is copied onto the new pillows. Both preserve source gradient UVs before bake UV creation. The source-based assets and architectural frame remain editable, earlier .blend files remain unchanged, and native Draco compression is decoded locally. `PHASE4D_REPORT.md` records limits, measured triangle/payload changes and reproduction details. Seven named camera/target pairs are saved in Blender to match the TS presets; they are excluded from web mesh export.

## Phase 7B — non-destructive phone export

Keep `assets/blender/studio-phase4d.blend` and `public/models/loft-studio-v4d.glb` as the editable/detailed originals. The published GLB already uses Draco, consolidated materials and a baked atlas. After any approved detailed export, run `python3 scripts/build_compact_glb.py` on macOS: it extracts the baked JPEG, uses free `sips` to resize 4096² to 2048², and repacks `public/models/loft-studio-v4d-compact.glb` with updated buffer offsets. It does not decimate, merge interactive objects, change UVs/normals/transforms/materials or modify the `.blend`. The second 1024² texture stays unchanged.

Verify `evidence/phase7b/compact-model.json`, structural equality and all geometry buffer hashes; inspect actual phone/default/focus views against the detailed export before adopting a new variant. Tests load the compact asset on a fresh phone viewport, retain one chosen asset per session and check required baked/PBR textures before showing the room. Original credits carry over to the derivative. The committed compact web export lets ordinary builds run without Blender or `sips`; only rebuilding that derivative requires the local image utility. No compression/upload/cloud service is involved.
