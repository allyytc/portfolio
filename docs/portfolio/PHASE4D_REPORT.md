# Phase 4D — targeted asset replacement and room refinement

2026-10-27 · local `allyytc/portfolio` · branch `main` · $0 spent. No commit, push, publication, original-domain deployment or original-repository write. The unrelated Impact Studio HTML file shown in the editor was not changed. Phase 4C work and its known bake defect were preserved before continuing the owner's Phase 4D request.

## Actual review artifacts

- Editable Blender: `assets/blender/studio-phase4d.blend`; source `PortfolioLoft4D`, baked/export preview `LoftBaked4D`, plus retained earlier scenes and separate versioned files.
- Current browser model: `public/models/loft-studio-v4d.glb`. Earlier `v4c`/`v4b` exports remain recoverable; the app explicitly requests `phase4d-loft` and tests its new IDs.
- [Updated Blender full room](evidence/phase4d/blender-studio.png).
- [Actual browser full room](evidence/phase4d/browser-studio-large.png), [desktop](evidence/phase4d/browser-desktop.png), [mobile](evidence/phase4d/browser-mobile.png).
- Close views: [completed window/reading nook](evidence/phase4d/browser-readingNook.png), [loft bedding](evidence/phase4d/browser-loftBedding.png), [design corner](evidence/phase4d/browser-designCorner.png), [community wall](evidence/phase4d/browser-communityPinboard.png), [workstation](evidence/phase4d/browser-workstation.png), [archive](evidence/phase4d/browser-archive.png).
- [Phase 4C → 4D comparison](evidence/phase4d/before-after-browser.png), [Blender/browser comparison](evidence/phase4d/blender-browser-comparison.png), [actual selected-asset inspection](evidence/phase4d/selected-asset-review.png).
- [Diagnosis and replacement decisions](PHASE4D_DIAGNOSIS.md); [asset/permission register](PHASE4D_ASSETS.md).

These are real Blender/Chrome captures. The room, window and nook appear in the actual default browser view; this is not a source-only improvement or another screenshot of the standalone desk.

## Observable changes and reuse decisions

**Window/nook:** replaced the weak side frame with deep timber reveals, jambs, a wide sill, paired inside/outside joinery, divided lights, brass latches, a lower wall and an original sky surface behind the frame. The dual-facing construction lets the existing isometric camera recognize the window while an interior nook view remains coherent. The source-derived green upholstered bench was moved forward of the glazing sight line; cushions and folded cream textiles now sit at its measured seat height (~0.3754m). A mounted About plaque replaces floating lettering. Books, side table, lamp and a potted pothos complete the zone.

**Bedding/furniture:** replaced the old slab bed and angular lounge chair with inspected KayKit CC0 models. Their authored rounded silhouettes, mattress, headboard, pillows and blanket layers remain actual source geometry. Blue upholstery is selectively recolored to sage while preserving the wood/ivory parts and original atlas UVs. The existing desk, sage/cream ergonomic chair, printer/scanner/paper, shelving and signs remain because they were not the highest-value replacement targets. No primitive block furniture was substituted for licensed models.

**Plants:** replaced repeated custom pointed leaves/cacti with selected Tiny Treats CC0 monstera and pothos models, plus restrained trailing segments. Larger floor plants and smaller desk/archive/window/design accents have different silhouettes, scale and rotation. The reviewed yucca was not retained after its silhouette proved too distracting in this layout; the existing medium monstera was the permitted alternative. Entrance foliage and the design accent were moved to clear sign labels and the Unwrap tablet. The existing single subtle bunny relief remains; no additional character model was added.

**Stairs/materials:** retained the treads and circulation, replaced malformed side strips with architectural timber stringers, kept the warm railing, added restrained trim, and reduced flat ambient fill while preserving broad warm lighting. Procedural cloth/oak variation and source texture mapping from Phase 4C remain. The floor and room structure retain baked direct/indirect contact shading; no bloom stack or new shader library was installed.

**Portfolio zones:** sticker/sketch books, organized pencils and the actual neutral Unwrap tablet remain distinct from the community pinboard and Skills/Experience archive. Real source design/sticker media is preserved. Eight organization/event reservations remain identifiable and separately selectable. No fake event photo, organization logo or Unwrap screenshot was generated. Resume remains the printer's physical action, with direct HTML Resume and Contact access.

## Licenses and source provenance

New source families are the previously audited **KayKit Furniture Bits 1.0** (Kay Lousberg) and **Tiny Treats House Plants 1.0 FREE** (Isa Lousberg), both explicitly CC0 1.0 with optional attribution. Exact pinned URLs / free upload ID, archive-relative paths, sizes and hashes are in the acquisition JSON files under `assets/source/`. Free glTF/BIN/texture files were selected; paid Blender SOURCE/EXTRA files were not acquired. Full licenses and voluntary credits are retained in `public/licenses/` and the accessible asset-credit link.

`PHASE4D_ASSETS.md` distinguishes these permissions from the retained Nunito OFL type, Font Awesome CC BY 4.0 icon artwork, owner portfolio media, and Apache 2.0 Draco decoder. No assets from the unlicensed personal reference-room repositories were copied. Original source files, versions and checkpoints remain available.

## Shading, export and camera preparation

The Phase 4C bake produced black textile patches although its source render was clean. Triangulation/normal correction alone did not solve that defect. Phase 4D therefore uses two explicit shading paths:

- Fixed architecture, signs, foliage and future targets: 4096² Cycles diffuse COLOR + DIRECT + INDIRECT atlas, 96 samples, 24px bleed, glTF unlit material. Runtime light/shadow receiving is disabled on that material to avoid double-lighting.
- `SoftFurnishings`: source-based furniture/textiles with a separate 1024² **COLOR-only** atlas and matte PBR lighting. The light bake's defective shadows are not carried onto the new pillows. The monitor, printer and independent paper retain their PBR/action contract. Paper is hidden during the fixed bake.

The final fixed bake took 139.61s on this host. Export uses identical triangulated topology and Draco compression (level 6, position 16 / normals 12 / UV 14 bits); the original editable source stays separate from the optimized output. High-quality PNG maps remain packed in Blender; the web textures are JPEG quality 90. Texture anisotropy is capped at the device-supported value up to 4. AgX and neutral exposure remain in both renderers. Dynamic PBR illumination is an approximation of Blender's area lights, so exact tone/shadow parity is not claimed.

The default isometric **orientation/position** is retained. Phase 4D tightens the responsive orthographic span to 10.6 × 8.3 and gives the desktop canvas up to 86vh / 1050px, increasing prominence without applying CSS scaling to the model. Default-view evidence shows the whole room without clipping and immediate HTML navigation.

Named camera data lives in `src/studio/cameraViews.ts`, with the controller in `StudioCamera.tsx`: default, workstation, designCorner, communityPinboard, readingNook, archive, plus a bedding evidence view. Matching named Blender cameras/target empties are saved in the lighting/camera collection. Smooth transition support, reset-to-default, bounded zoom (0.85–1.35) and limited future orbit angles are prepared. **Visitor controls remain disabled**; no Phase 5 navigation UI was introduced. Existing panel zoom, drag rejection and reduced-motion behavior remain intact.

The native installed Three.js GLTF/Draco loader is used because the earlier wrapper left decoder rejection suspended. The local error boundary now clears the current versioned model and decoder on retry. Failure/recovery is tested; there is no CDN decoder dependency.

## Validation and measured performance

- `npm run build`: strict TypeScript + Vite passed. A large lazy-loader chunk warning remains (~962KB raw / 257KB gzip); HTML/content code stays independent of the 3D load.
- `npm test`: **6 passed (25.4s)** against the final export. Actual sign/monitor clicks, printer/paper motion, project/resume panels, exact PDF bytes/MIME, focus/Escape/keyboard controls, drag rejection, mobile/reduced motion, WebGL/model failure, decoder failure/retry, five named camera poses, zoom bounds and exact default reset pass. No visitor orbit/zoom/reset controls appear.
- Final model: **3,260,508 bytes / 223,451 mesh triangles / 25 stable root IDs / 2 embedded images**. Against Phase 4C's 3,482,540 bytes / 338,976 triangles: **6.38% fewer bytes and 34.08% fewer triangles**. The extra root is noninteractive `SoftFurnishings`; all 24 prior identities remain.
- Final sampled runtime: **50 peak draw calls / 265,302 rendered triangles** including shadow passes, 7 GPU textures, 36 geometries; active-frame interval ~16.71ms in isolated headless Chrome on this host. Demand-rendered idle settles. This is not a physical mobile GPU or internet download benchmark; no FPS improvement is claimed from unmatched runs.
- Cold local capture requested the 3,260,508-byte model plus 58,456-byte wrapper and 192,420-byte WASM decoder, all from localhost. Full decoder distribution also retains a JS fallback. Timing is a local diagnostic, not a network guarantee.
- Tradeoff: the new color atlas adds texture memory (~5.3MiB for 1024² RGBA plus mipmaps, theoretical) and the soft PBR surface adds a small draw/shadow cost. The 4096² fixed atlas still dominates texture memory (~85.3MiB with mipmaps). These are not measured VRAM allocations. Geometry/payload improvement is measured; texture-memory improvement is **not** claimed.
- The native loader's upstream default decoder URL constants cause unused decoder variants to be emitted by Vite in addition to the explicitly served optimized local decoder. Actual capture requests only the local optimized files; build-output deduplication remains a packaging optimization, not a required runtime request.

Machine evidence: `size-comparison.json`, `bake-export.json`, `browser-metrics.json`, `loading-resources.json`, `nook-measurements.json`, `camera-views.json`, `final-scene.json`, `artifact-manifest.json` in `evidence/phase4d/`.

## Remaining visual differences and stop boundary

The default browser now visibly contains the window, cushioned nook, new layered bed, rounded lounge chair, varied plants and clearer stair construction. This meaningfully improves the Phase 4C baseline, but it is **not an exact match to the approved reference**. The simple retained floor lamp/cabinet silhouettes, large graphic vine leaves, a few dark frame-joint/atlas edges, limited fabric microdetail and broad plank UV mapping remain below that reference's handcrafted finish. Close-up texel density is finite; the exterior is a stylized sky treatment, not a detailed landscape. The approved conversation reference guided the comparison, but no local image path was supplied for a literal reference-image collage; the required Phase 4C before/after is provided.

Unwrap UI/content and event-photo/logo rights remain unresolved, so their honest reservations remain. They do not justify fabricated media. Complete portfolio migration and new zone/social click actions are deferred.

Reproduce from preserved 4C source using `refine_loft_phase4d.py`, `stage_window_phase4d.py`, the measured alignment step in `align_furnishings_phase4d.py` (its generated-preview cleanup is only needed on a rebuild), `bake_export_loft_phase4d.py`, `render_loft_phase4d.py`, and `finalize_loft_phase4d.py` through the existing Blender bridge. Preserve edits before rebuilding generated scenes. The finalizer adds named camera markers and saves the packed editable source. `capture-refinement.mjs` uses the DEV-only named-camera hook for evidence; it does not add visitor controls.

**Stopped after Phase 4D.** No Phase 5 full navigation, Phase 6 content migration, publication or original-domain change.
