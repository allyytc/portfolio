# 3D asset audit and acquisition register

Audited 2026-10-26. **No model, binary buffer, texture pack, font, or Blender file downloaded or added.** Two Kenney ZIP central directories and their license records were read with HTTP byte ranges; no model entries were fetched. Text glTF metadata was inspected for Trevor's room and one KayKit table. One Kenney promotional preview was viewed temporarily outside the repository; it is not licensed portfolio artwork to redistribute.

## Selection and visual standard

Primary prototype family: **Kenney Furniture Kit 2.0**, plus one existing wooden sign. It has exact verified GLB paths, very small entries and clear asset-level CC0 terms. Its inspected preview shows attractive but simple low-poly furniture: this is an interaction/composition candidate, **not already a match for the detailed grain, bevels, textiles and dense foliage in the supplied references**. Avoid promising reference-level fidelity without a render check.

Use KayKit Furniture Bits as the coordinated alternate family if Kenney fails the visual gate; do not mix furniture families indiscriminately. Tiny Treats plants are designed for KayKit scale/specifications and offer a coherent later foliage option. Additional source packs remain optional, not a shopping list to acquire now.

Rating format below: visual suitability / license confidence / GLB compatibility, 1–5; effort is adaptation effort, not a measured benchmark. All visual judgments are provisional except the Kenney pack preview inspection; individual candidate models have not been rendered here.

## Assets already in the four reference repositories

These were examined first. Repository-level code license and asset clearance are separate decisions.

### Questopia — conditional, do not acquire now

Source root at pinned commit: [public/assets](https://github.com/GlintonLiao/questopia/tree/407d52ff317dc7dfbccfd18a2736c4d86ac65059/public/assets).

- `model.glb` — 1,947,900 bytes; main baked room, constituent furniture not independently inspected.
- `chairModel.glb` — 991,392 bytes; separate chair.
- `bigScreenModel.glb`, `smallScreenModel.glb` — 1,012 / 1,080 bytes; screen surfaces, **not complete monitor furniture**.
- `archiModelLight.glb`, `imagesModel.glb`, `title.glb`, `coffeeSteamModel.glb` — architecture display, artwork planes, personal title and steam; not general-purpose cozy prop packs.
- `bakedDayTexture.jpg`, `bakedNightTexture.jpg`, `lightMapTexture.jpg`, `imagesDayTexture.jpg` — 7.33 / 6.19 / 5.30 / 4.32 MB approximately; room-specific baked lighting, masks, imagery. Additional `bigScreenImage.jpg` / `smallScreenImage.jpg` are personal screen images.
- Creator/repository: Guotong Liao; root MIT applies to the software and associated documentation. No distinct model/artwork provenance statement or editable `.blend` found. The grant is not asset-specific evidence for every pictured work. Status: located, not downloaded; **asset permission/provenance unresolved, no copying recommended**. Code can be considered separately under [CODE_REUSE.md](CODE_REUSE.md).
- Suitability 4 / 2 / 4; high effort to isolate/recolor/rebake a finished room. No verified printer, wooden navigation signs, vines, or bunny as individual models.

### Trevor Smith — compact geometry, conditional

Pinned [public/models/iso-poly.gltf](https://github.com/trevsm/3D-Portfolio/blob/690c184f6b1db012152676a7207703d7de1a5df3/public/models/iso-poly.gltf), 158,895 bytes, references sibling `iso-poly.bin`, 477,952 bytes. Duplicate copies under `docs/models/` are deployment output, not a second pack. Format: glTF 2.0 + BIN, with `KHR_draco_mesh_compression`; no image array found in this glTF. No `.blend` in the tree.

Verified node/group names include `Desk`, `Chair`, `Computer`, `Lid`, `Hinge`, `Body`, `Hood`, `Blinds`, `Book_01`, `Books.001`, `Frames`, `Room`, `Rug`, `Clock_Body`, `Bin`, `Glasses`, plus personal text and interaction labels. See `src/models/{Static,Chair,Computer,Lamp,Books,Blinds,WallArt}.js` for node-to-geometry associations.

Root LICENSE and README explicitly identify MIT, Trevor Smith 2022; package metadata instead says ISC. There is no separate model/texture provenance or per-model author statement. Retain MIT notices for copied code; **model acquisition remains conditional on resolving coverage/provenance and metadata inconsistency**, rather than assuming a public repository is CC0. No assets downloaded. Suitability 2 / 3 / 3; medium effort, with monochrome materials and old loader dependencies. No printer/bunny/vines/signpost found in named nodes.

### Rowobin — permission wording insufficiently specified

Pinned [public/portfolio_room.glb](https://github.com/Rowobin/3D-Room-Portfolio/blob/3c6197d1d838c4e2a6fc688ca773ad02ad70a628/public/portfolio_room.glb), 684,264 bytes, GLB. `main.js` names `Chair`, `Cactus`, `Book`, `Mug`, `Portfolio`, `Name`, social icons and branded props. Mesh contents were not downloaded/inspected. Creator: Rowobin; README says models were built in Blender and invites broad reuse, but no standard license or specific artwork/trademark terms are supplied. **Reference only pending clear licensing**, not downloaded. Suitability 3 / 2 / 4; moderate extraction/material work.

### Bruno Simon — no license found

Pinned [static/assets](https://github.com/brunosimon/my-room-in-3d/tree/5d00b3f870da81f103e901e0d12e20bbcc816834/static/assets): `roomModel.glb` (276,500 bytes), `topChairModel.glb` (32,936), screen planes `pcScreenModel.glb` / `macScreenModel.glb`, lights/buttons/steam; baked `bakedDay.jpg`, `bakedNeutral.jpg`, `bakedNight.jpg`, `lightMap.jpg`; logos and personal videos. Creator: Bruno Simon. No reuse license found in tree/readme. **Do not copy models, textures, videos or artwork**; no downloads. Suitability 4 / 1 / 4; high visual adaptation and blocked reuse permissions.

## Primary cleared pack — Kenney Furniture Kit 2.0

- Creator: Kenney. [Official asset page](https://kenney.nl/assets/furniture-kit); [creator licensing FAQ](https://kenney.nl/support).
- Exact archive URL discovered on that page: [kenney_furniture-kit.zip](https://kenney.nl/media/pages/assets/furniture-kit/440e0608a4-1677580847/kenney_furniture-kit.zip), 5,130,729 bytes. Do not buy the All-in-1 bundle; the individual pack has a free download.
- Asset-level evidence: archive `License.txt`, checked with byte ranges, identifies Furniture Kit 2.0, CC0 1.0, personal/educational/commercial use; attribution is optional. No separate restriction found for included asset materials. Keep this file with acquired sources anyway; credit “Kenney” voluntarily. Kenney logo/website preview are not necessary assets and must not be imported.
- Exact archive directory prefix **`Models/GLTF format/`**; every filename below is relative to it. GLB, not just a screenshot or sample illustration.
- Status for every entry: archive metadata verified; model binary **not downloaded**; no edits made. Planned originals under `assets/source/kenney-furniture-kit/`; selected customized exports later in `public/models/studio-desk-v1.glb`. These destinations do not exist yet.

Selected models and verified uncompressed entry sizes:

- Desk: `desk.glb` (15,048 bytes), alternate `deskCorner.glb` (17,984). **3 / 5 / 5; low**. Recolor wood, retain existing detailed mesh; inspect drawer/desk silhouette before selection.
- Desk chair: `chairDesk.glb` (39,016). **3 / 5 / 5; low**. Sage upholstery/cream base treatment; existing form is simpler than the reference ergonomic chair.
- Monitor: `computerScreen.glb` (6,404); keyboard `computerKeyboard.glb` (3,476), mouse `computerMouse.glb` (5,868). **3 / 5 / 5; low**. Use real monitor geometry and an owner-authored screen; no copied screen artwork.
- Shelving: `bookcaseOpen.glb` (18,020), `bookcaseOpenLow.glb` (11,520), `bookcaseClosed.glb` (23,132). **3 / 5 / 5; low**. Reuse a family rather than combining unrelated shelf packs.
- Drawers: `sideTableDrawers.glb` (19,072), `cabinetBedDrawer.glb` (16,088). **3 / 5 / 5; low–medium**. Resize only after checking proportions and drawer handles; do not use kitchen appliances as fake printers.
- Windows / shell: `wallWindow.glb` (10,744), `wallWindowSlide.glb` (14,564), `wall.glb` (3,340), `floorFull.glb` (2,260), `paneling.glb` (3,960). **2 / 5 / 5; low–medium**. Later framing only; not the detailed loft/window construction from the reference.
- Plants: `plantSmall1.glb` (8,224), `plantSmall2.glb` (12,996), `plantSmall3.glb` (8,424), `pottedPlant.glb` (7,576). **2 / 5 / 5; low**. First prototype needs one or two; these do not provide verified trailing vines.
- Books: `books.glb` (6,864). Lamp: `lampRoundTable.glb` (6,604), alternate `lampSquareTable.glb` (5,624). **3 / 5 / 5; low**. The rounded table lamp is not already the reference articulated green task lamp.
- Decorations / later nook: `pillow.glb` (5,044), `benchCushion.glb` (12,500), `rugRectangle.glb` (3,188), `radio.glb` (25,020). **2–3 / 5 / 5; low**. `bear.glb` exists, but a bear is not an acceptable substitute for the requested bunny.

## Wooden navigation signs

**Exact-path prototype option: Kenney Survival Kit 2.0.** [Official page](https://kenney.nl/assets/survival-kit); archive [kenney_survival-kit.zip](https://kenney.nl/media/pages/assets/survival-kit/4065a8185b-1712149243/kenney_survival-kit.zip). Directory/license verified with byte ranges: `Models/GLB format/signpost.glb` (5,924 bytes), `Models/GLB format/signpost-single.glb` (4,452). Creator Kenney; asset-level `License.txt` explicitly CC0 1.0, commercial use, no required credit. **2–3 / 5 / 5; medium**: recolor, adjust existing boards, set pivot, and add our labels. It is a starting sign mesh, not verified rounded suspended boards/chains or raised lettering. Not downloaded; proposed source `assets/source/kenney-survival-kit/`, export `public/models/studio-signpost-v1.glb`.

**Potential closer alternative: [Wooden Sign by iPoly3D](https://poly.pizza/m/mxyDWLsKer)**, exact catalog ID `mxyDWLsKer`; individual page states CC0, FBX/glTF. No required copyright attribution under CC0; retain page/creator provenance. **3 / 4 / 4; medium**. Model binary URL, downloaded filename, topology and material layout not yet inspected; not cleared as a physical-reference match. Not downloaded; planned source `assets/source/ipoly3d-wooden-sign/` only if selected. Do not invent a CDN URL or call the catalog ID a repository path.

## Missing items with verified catalog candidates

### Printer

- Recommended acquisition candidate: [Printer by CreativeTrio](https://poly.pizza/m/77K2TCL5Lz), exact ID `77K2TCL5Lz`. Individual model page states **CC0**, FBX/glTF. Attribution optional; preserve creator, exact source URL and included license when acquired.
- **3 / 4 / 4; low–medium**. Recolor cream/sage and check paper slot/body proportions. Not rendered, no triangle/texture claims inferred from unlabeled catalog counters. The actual archive filename, buffers/textures and direct binary URL remain unverified; acquire through that exact model page, then record them before import.
- Status: page verified, **not downloaded**; future source `assets/source/creativetrio-printer/`, export `public/models/studio-printer-v1.glb`. Not needed for the smallest next prototype.
- Rejected alternatives for this phase: [Poly by Google printer](https://poly.pizza/m/7NKDv75jVeg) and [Bruno Oliveira copier](https://poly.pizza/m/bgNnmejxBa-) show attribution licenses. They are not recommended until exact license versions/credit requirements are captured; no need to add attribution complexity when a CC0 candidate exists.

### Bunny figurine

- Recommended acquisition candidate: [Bunny by Quaternius](https://poly.pizza/m/irZjWFARyl), exact ID `irZjWFARyl`. This individual listing states **CC0**, FBX/glTF, animated. Use a static pose as a figurine; do not ship a rig/animation package if unnecessary.
- **3 / 4 / 4; low–medium**. Could be adapted to a cream ceramic ornament; the listing is an animal, not proof of the reference's exact rounded plush/figurine shape. No geometry inspected. Direct binary URL, archive filename, buffers and material/animation contents unverified.
- Status: page verified, **not downloaded**; proposed source `assets/source/quaternius-bunny/`, export `public/models/studio-bunny-v1.glb`. Optional after the desk slice passes.
- Do not infer this license from Quaternius's other packs: the current [Quaternius license page](https://quaternius.com/license.html) displays QAL v1.0 dated 2026-08-28, while some pack pages still show CC0. Preserve the grant attached to the exact downloaded item and check its included terms. Conflicting terms mean hold that download, not silently assume all Quaternius content is CC0.

## Coherent alternate furniture family — KayKit

Creator Kay Lousberg. [Official Furniture Bits page](https://kaylousberg.itch.io/furniture-bits); [official source repository](https://github.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0/tree/96d5930a8dbdb363409bbc2d3341718b00e17c9c). Both root `LICENSE.txt` and `addons/kaykit_furniture_bits/Assets/LICENSE.txt` were read: **CC0 1.0**, commercial use, optional credit. Free tier is sufficient for these files; EXTRA assets and SOURCE `.blend` tier are paid and excluded.

Exact prefix at pinned commit: `addons/kaykit_furniture_bits/Assets/gltf/`. Select only a few glTFs **and their matching `.bin` files**, plus shared `furniturebits_texture.png` (image URI confirmed in `table_medium_long.gltf`). glTF/FBX/OBJ variants exist; import free glTF to Blender instead of buying `.blend` sources.

- `table_medium_long.gltf`, `chair_A_wood.gltf`, `chair_C.gltf` — alternate desk/table and chair silhouettes, **3 / 5 / 4; low–medium**. A table does not add the reference desk's drawer units; inspect before choosing.
- `cabinet_medium.gltf`, `cabinet_small.gltf`, `shelf_A_big.gltf`, `shelf_B_large.gltf` — storage, **3 / 5 / 4; low**.
- `book_set.gltf`, `book_single.gltf`, `lamp_table.gltf`, `lamp_standing.gltf` — accessories, **3 / 5 / 4; low**.
- `cactus_small_A.gltf`, `cactus_medium_B.gltf` — plants, **2 / 5 / 4; low**; cacti do not solve trailing foliage.
- `pictureframe_standing_A.gltf`, `pictureframe_small_A.gltf`, `pillow_A.gltf`, `rug_rectangle_A.gltf`, `armchair.gltf` — decoration/nook, **3 / 5 / 4; low**. Inspect any embedded artwork; use our own approved imagery.

Status all: exact tree paths/license verified, **no model buffers/textures downloaded**. Planned source `assets/source/kaykit-furniture-bits/`; export only if selected. The single gradient atlas is useful for cohesion; arbitrary UV repacking can break its color mapping. No free monitor, printer, rolling desk chair, signpost, bunny or window was verified in this free tree; do not assume EXTRA-tier screenshots are free assets.

## Foliage, textures, stationery and remaining gaps

- **Tiny Treats House Plants** — [official page](https://tinytreats.itch.io/house-plants), creator Isa Lousberg / Tiny Treats. Page verifies free-tier CC0 1.0, OBJ/FBX/glTF, shared gradient atlas, KayKit-compatible specs. No credit required; voluntarily retain creator/source. **4 / 4 / 4; low–medium**. Good foliage-family candidate, but exact free-archive filenames and trailing-vine coverage remain unverified. Status: page checked, no archive/model download; **not an exact-file import shortlist yet**. Paid `.blend` Source tier and collection bundle are excluded. Future source `assets/source/tiny-treats-house-plants/` only after recording the included license and selected filenames. Do not promise a specific ivy mesh not yet found.
- **Optional wood texture** — [Wood Table 001](https://polyhaven.com/a/wood_table_001), photography Dimitrios Savva, processing Rico Cilliers; [Poly Haven asset license](https://polyhaven.com/license): CC0, commercial use and modification, no credit required. Exact asset ID `wood_table_001`; JPG/PNG/EXR maps are listed. **3 / 5 / 4; medium** to soften/recolor this red-brown realistic grain for the reference. Not downloaded; choose small diffuse/roughness maps only if needed, rather than a large all-maps ZIP. File variant/path must be recorded when selected. Website example renders/logos are not covered by the asset grant and must not be copied.
- **Stationery** — books are covered above; no exact cleared pencil cup, pens, notebook/sticker-book model was established. Preserve as a gap. Do not count generic books as a verified sticker book; defer these props instead of modeling substitutes during the prototype.
- **Trailing vines, articulated task lamp, rounded hanging sign hardware, embossed pictograms** — no exact ready-to-import cohesive match verified. These remain visual gaps. Existing sign/plant candidates require inspection and modest adaptation; do not replace missing furniture with primitive meshes or claim exact reference fidelity.
- **User references** — two image attachments were visible in this turn (physical sign close-up and expanded warm loft/studio). The stated third separate reference was not available to inspect. Treat images as style/composition direction, not licensed source textures or models. The expanded bed/loft is not required by the approved initial desk prototype.

## Acquisition rules for the next phase

For any selected file, append the exact download URL, acquisition date, archive-relative path, SHA-256, creator, saved license, source format, dependencies, modifications and export destination before adding it. Keep originals and license files separate from optimized exports. If terms or artwork provenance conflict, leave that item out. CC0 has no attribution requirement, but retain provenance and voluntary credits; it does not grant third-party trademark/personality rights.

Smallest acquisition set is Kenney `desk`, `chairDesk`, `computerScreen`, keyboard, mouse, one plant, one lamp, and Survival `signpost`—all exact GLB paths above. Optional printer/bunny/Tiny Treats acquisitions do not block that slice. The key unresolved risk is final visual fidelity, not access to a basic legally reusable desk set.

## Phase 4A current local artifacts

No new third-party models downloaded. Existing CC0 Kenney furniture and OFL Nunito are reused under the recorded Phase 3 licenses. New original adaptations, the static baked atlas and temporary architecture are registered in `PHASE3_ASSET_REGISTER.md`'s Phase 4A addendum. Current source: `assets/blender/studio-phase4a.blend`; web export: `public/models/desk-studio.glb`; baked map: `assets/blender/textures/studio4a-static-baked.png`. The full-black chair finish is owner-approved. Temporary room architecture is not part of the web model. Detailed furniture, trailing vines and bunny assets remain unacquired; no audit-only recommendation should be mistaken for a downloaded or license-cleared file.

## Phase 4B acquisition and integration status

Historical audit-only statuses above are superseded only by explicit acquisition registers. Additional selected Kenney Furniture Kit models and Font Awesome SVG icons are now downloaded and verified; see `PHASE4B_ASSETS.md` and the source acquisition JSON files for exact paths, hashes, code/artwork license distinctions and modifications. Three owner-authored portfolio design images are source-blob verified; event photographs and unverified logos remain reserved. Current editable source: `assets/blender/studio-phase4b.blend`; current web export: `public/models/loft-studio-v4b.glb`; packed/source atlas: `assets/blender/textures/loft4b-static-baked.png`. All earlier assets and source files remain preserved. The expanded room is integrated; it is no longer the Phase 4A temporary blockout.

## Phase 4D current integration

The previously audited KayKit Furniture Bits and Tiny Treats House Plants candidates are now selectively acquired under verified CC0 terms. Exact pinned/free-tier source files, dependencies, hashes, modifications and saved licenses are in `PHASE4D_ASSETS.md` and `assets/source/{kaykit-furniture-bits,tiny-treats-house-plants}/acquisition.json`. New current source: `assets/blender/studio-phase4d.blend`; model: `public/models/loft-studio-v4d.glb`; fixed atlas `assets/blender/textures/loft4d-static-baked.png`; independent soft-surface color atlas `loft4d-soft-color.png`. Existing owner media, code/font/icon licenses remain unchanged. The reviewed yucca and unused extra pillow/armchair variants are not proof of final integration; final scene/replacement records identify the retained choices. Earlier candidate-only statuses above are historical.


## Phase 5B — existing owner media in HTML galleries

No model, texture pack, artwork or library was downloaded. The three previously acquired source files in `assets/source/portfolio-media/` are copied byte-for-byte to `public/media/`: `innovation-lightbulb.png` (Innovation Jam sticker), `sleeping-beaver.png` (Engineers’ Week sticker), and `startup-hub.png` (Startup Hub social promo). Original paths, pinned URLs, Git blobs, SHA-256 and owner-local-rebuild permission remain in `assets/source/portfolio-media/acquisition.json` and `PHASE4B_ASSETS.md`; public notice: `public/licenses/portfolio-media-NOTICE.txt`. No broad third-party/artwork license is inferred. No event photographs or Unwrap imagery were introduced. All GLB/Blender and existing licensed assets remain unchanged.


## Phase 6A — representative project screenshots

Five original KO.rbit WebP screenshots (183,108 bytes total) are copied unchanged from pinned source to `assets/source/portfolio-media/korbit/` and `public/media/korbit-gal/`. Exact source URLs, Git blobs, SHA-256 and local destinations are in `evidence/phase6a/media-acquisition.json`; permission and third-party-rights limits are documented in `PHASE6A_MEDIA.md`. The source demo remains an on-request YouTube embed with an external watch link; no video is downloaded or rehosted. No model, baked texture, Blender source, new pack or generated portfolio media is added/altered. Remaining source media is tracked for later migration, not copied in bulk.

## Phase 6B — preserved project and design media

94 unique original media files (97,541,234 bytes, eight reused locally) are pinned and Git-blob/SHA-256 verified, with two additional unchanged local Unwrap development captures. Exact sources, formats, provenance, destinations, rights boundaries and statuses are in [PHASE6B_MEDIA.md](PHASE6B_MEDIA.md), `evidence/phase6b/required-media.json`, `media-acquisition.json` and `unwrap-source.json`. No Blender assets or third-party model packs were acquired. Original art credits are retained; no blanket publication license is inferred. Source embeds remain external and click-to-load; no YouTube media was downloaded.

## Phase 6C — authentic profile/community/event media

120 original profile, organization, event, sticker and merchandise files are associated with this phase, 117,532,505 source bytes total. 35 files reuse earlier Phase 6B destinations; 85 additional originals are acquired unchanged. Exact paths, source URLs, formats, original Git blobs, SHA-256, rights boundaries and statuses: [PHASE6C_MEDIA.md](PHASE6C_MEDIA.md), `evidence/phase6c/required-media.json` and `media-acquisition.json`. Across original-source phases, 179 distinct displayed media files are integrated; 65 unreferenced alternate/prototype/utility files remain inventoried without unnecessary download. Two Unwrap development captures and the supplied PDF are separate. No model/Blender assets, generated media, paid assets or new licenses were added.

## Phase 7C research checkpoint — 2026-10-29

Actual imported comparison: `evidence/phase7c/asset-comparison.png`, `asset-comparison.json`; editable temporary scene `assets/blender/phase7c-asset-comparison.blend`. Three architecture candidates and three tree styles were imported and rendered before world construction. Original interior, source assets and exports retained.

### Architecture shortlist

- **Selected modular starting point:** Kenney, [Survival Kit 2.0](https://kenney.nl/assets/survival-kit), CC0 1.0, `assets/source/phase7c/survival-kit/License.txt`. Commercial reuse/modification/distribution allowed; attribution optional, credit retained. Actual free archive downloaded from creator's signed `download-link` endpoint (no donation/payment). `Models/GLB format/structure.glb` (80 triangles), `structure-roof.glb` (188), `structure-floor.glb`, plus `resource-wood.glb`; embedded palette/UVs, editable mesh. Comparison A: open timber supports preserve sight lines; weathered roof adapted into porch canopy. Simple source geometry receives selective bevels/material refinements; not used as a replacement for detailed interior furniture.
- **Selected supporting modular trim:** Kenney, [Fantasy Town Kit 2.0](https://kenney.nl/assets/fantasy-town-kit), CC0 1.0, local pack `License.txt`. Downloaded directly, GLB with embedded colormap; `wall-wood-window-small.glb` (134 triangles in comparison), `roof.glb` (64), `lantern.glb`, `chimney.glb`. Comparison B: useful architectural accents and lantern detail; full opaque walls/roof rejected where they would hide monitor, bed or pinboard. Retint/export only selected geometry.
- **Rejected after actual import:** Kenney, [Modular Buildings](https://kenney.nl/assets/modular-buildings), CC0 1.0 per included `License.txt`, downloaded. `Models/GLB format/building-sample-house-a.glb` (312 triangles). Comparison C: closed urban geometry and modern trim clash with an open timber loft. Not shipped at runtime.
- **Requested candidate unavailable for automatic import:** [Wooden Cabin by Xalkomak](https://sketchfab.com/3d-models/wooden-cabin-b941d5ca24bd433fa752578343f896c1), Sketchfab API metadata verifies CC BY 4.0, commercial use allowed with author/source/license credit and modification disclosure. 18,175 faces / 9,436 vertices reported. Public API metadata says downloadable, but `/v3/models/b941d5ca24bd433fa752578343f896c1/download` returns HTTP 401 without authenticated download credentials. Preview page HTTP403 in local request. Not downloaded/imported or used; editability/formats not verified. No bypass/preview ripping.

### Forest shortlist

- **Selected obtainable family:** Kenney [Nature Kit 2.1](https://kenney.nl/assets/nature-kit), included `License.txt` explicitly CC0 1.0, optional attribution. Actual downloaded free archive 10,537,521 bytes; all candidates from `Models/GLTF format/`. Compared `tree_pineTallA_detailed.glb` (134 triangles), `tree_pineRoundA.glb` (204), `tree_pineDefaultB.glb` (246). The round/default layered silhouettes are most readable against a dark background; recolor to spruce with bark separated by original palette UVs, selectively refine bough edges, share instances. Tall A is less convincing close to camera; reserve for distant silhouettes. Existing authored plants remain inside. `stone_largeA.glb`, `stone_smallFlatA.glb`, `grass_leafsLarge.glb` provide ground accents. Geometry totals/export texture costs must be measured after adaptation. No dense transparent leaf cards/alpha overdraw.
- Quaternius [Ultimate Stylized Nature](https://quaternius.com/packs/ultimatestylizednature.html): creator page explicitly CC0, FBX/OBJ/Blend/glTF and commercial use. Public Drive glTF folder is reachable; initial anonymous listing only returns the first 50 files (birch/dead tree/flowers), no verified spruce files. No conifer downloaded/imported; do not claim this pack is runtime source. Better texture detail is possible if owner later supplies specific compatible files.
- Quaternius [Simple Nature](https://quaternius.com/packs/simplenature.html) and [Ultimate Nature](https://quaternius.com/packs/ultimatenature.html): each individual creator page verified CC0, FBX/OBJ/Blend. Drive listings inspected, not downloaded; flatter styling offers no clear advantage over actual compared trees.
- Quaternius [Medieval Village MegaKit](https://quaternius.com/packs/medievalvillagemegakit.html): page verifies CC0 for free Standard version, OBJ/FBX/glTF; Standard archive 153MB, Pro/Source paid tiers excluded. Not downloaded because compact obtainable kits fit the specific modular use; no license assumption extended to paid files.

### Art station / hearth / materials

- **Selected easel:** [Easel by plaggy](https://opengameart.org/content/easel), creator page explicitly CC0; direct actual file `https://opengameart.org/sites/default/files/Easel.zip`, 235.3KiB advertised. Downloaded/extracted at `assets/source/phase7c/easel/Easel/`: `Easel.obj` and `Easel.DAE`, preview JPG and sculpt TGA. OBJ has no supplied textured materials; import, correct original orientation, refine wood/brass finish and add authentic canvas separately. No mandatory attribution, voluntary credit retained. A real portfolio flyer is mapped with its original aspect, no invented painting or Unwrap screenshot.
- Custom Blender architectural hearth/arch, grate, embers, canvas stretcher and small art tools may be authored after this checkpoint; record separately as original project geometry, not third-party downloaded furniture. Reuse existing real sketchbook/book assets and licensed stool/chair meshes where suitable.
- [Poly Haven](https://polyhaven.com/) is CC0 per official site. Specific files API returned403 here; no texture/model was downloaded, imported or represented as used. Existing wood grain/source materials can be reused without a new texture family. `fireplace` search result is a room HDRI, **not** a verified fireplace mesh; excluded.
- [Art Easel Set Up by reyshapes](https://poly.pizza/m/2ZP3o8hyPA) page lists CC0; not downloaded because plaggy's real editable source is obtainable. [Cabin Shed by CreativeTrio](https://poly.pizza/m/HTx7PZt6Zm) lists CC0/FBX/glTF, 2.7k triangles; automatic local page403, not imported or used.

Research evidence: creator HTML snapshots under `assets/source/phase7c/`; no asset generation services or paid tiers. These permissions cover selected model files, not portfolio art or third-party website photography. Original media attribution/provenance stays unchanged. Runtime paths and measured final costs will be added to `PHASE7C_REPORT.md` after export and validation.

### Phase 7C forest upgrade following actual first-world visual review

The Kenney tree refinements looked overly faceted in the actual browser and are superseded, not accepted as the finished forest. The Quaternius creator's own [Pine Trees listing](https://poly.pizza/m/w8ZaiYjK8C), linked from the [Ultimate Stylized Nature Pack](https://poly.pizza/bundle/Ultimate-Stylized-Nature-Pack-zyIyYd9yGr), explicitly identifies Quaternius and Public Domain CC0. Browser access succeeded where direct page requests failed. The exposed public GLB URL (`https://static.poly.pizza/42a2a958-040d-4ce3-bae5-2332c1282cb5.glb`) returned200 and was saved as `assets/source/phase7c/quaternius-pine-trees.glb` (real five-variant pack; no authenticated files or unlicensed preview ripping). This is the creator's free CC0 downloadable model, not a third-party reupload with inferred permissions. Original creator pack page also independently verifies CC0/commercial usage.

Selected editable nodes `PineTree_1`, `PineTree_3`, `PineTree_5`, with actual bark/leaves images and separate materials. Three normalized templates exported as `public/models/midnight-spruce-trees.glb`; 20 desktop / 13 phone instances share geometry/textures. Original downloaded GLB retained. Derivative textures limited to1024px, bark normal disconnected for forest-scale props. Alpha-masked leaves retain depth writing; only a small curated forest. Actual second comparison: `evidence/phase7c/quaternius-pine-comparison.png`; measured geometry/export costs `quaternius-pines.json`. CC0 requires no credit, but voluntary Quaternius/source/license attribution retained. Kenney nature rocks/leaves remain selected; rejected tree prototypes remain recoverable in the Blender comparison scenes.

## Phase 7E — asset quality and architecture pass (2026-10-29)

**Research outcome.** A search for a downloadable stylized stone fireplace, porch furnishings and further spruce models was not carried out through an automated download: Sketchfab and Poly Pizza downloads need an authenticated session or return 403 to scripted requests (same blockers recorded for 7C), and Poly Haven offers no fireplace mesh. No new third-party model was acquired or used in 7E. This is stated plainly so no asset is assumed.

**What was made instead (all original Blender geometry, no third-party licence):**
- `Fireplace` — individually cut stone blocks, arch voussoirs, walnut mantel, corbels, recessed firebox, grate, logs, flame cones, chimney stack and cap. Source: `scripts/fireplace_phase7e.py`.
- Side-wall art porch — deck boards, joists, posts, ledger/rafters, shingled lean-to roof, rails, steps, supply table, paint jars, lantern and string bulbs. Source: `scripts/build_world_phase7e.py`.
- Rebuilt rear roof (shingle rows, underlay, barge boards, ridge cap).
- Pinboard card photographs are resized derivatives of the owner's already-migrated media in `public/media/world/card-*.jpg` (originals unchanged under `public/media/*`; rights status as recorded in PHASE6C_MEDIA.md). No generated imagery.

**Reused, previously licensed assets (unchanged licences):** plaggy "Easel" (CC0, OpenGameArt), Kenney furniture/survival/nature kits (CC0), Kenney Nature Kit pines (CC0), KayKit/Tiny Treats plants (CC0), Nunito (OFL). The Cookies & Clubs flyer on the easel is the owner's own design from the existing Design collection.

**Files:** `public/models/midnight-cabin-world-7e.glb` (412 KB, new), `public/models/loft-studio-v7d(.compact).glb`; Blender copies `assets/blender/midnight-spruce-phase7e.blend`, `studio-phase7d.blend`. Earlier GLBs retained.
