# Phase 3 acquired assets

## Owner-supplied resume — 2026-10-27

- Supplied path: `/Users/ally/Downloads/allychen-resume2028.pdf`; creator/content owner: Ally Chen, provided explicitly to finish this portfolio integration. This is owner-provided content, not a CC0 asset or a grant for unrelated reuse.
- Destination: `public/files/allychen-resume2028.pdf`; served through the shared `src/content/resume.ts` record for printer, direct Resume, and Quick View.
- One-page, unencrypted, tagged Letter PDF; rendered and inspected read-only. No content, metadata, links or formatting edited. Exact source/copy hash is recorded in `evidence/artifact-manifest.json`.
- This resolves the Phase 3 resume-file blocker. The original live repository's historical missing PDF reference is unchanged.

Acquisition date: 2026-10-27. All sources stay in this repository. This register supersedes the audit's historical “not downloaded” statuses only for the files listed here.

## Kenney Furniture Kit 2.0

- Creator: Kenney; source https://kenney.nl/assets/furniture-kit.
- Exact archive: https://kenney.nl/media/pages/assets/furniture-kit/440e0608a4-1677580847/kenney_furniture-kit.zip.
- License: CC0 1.0, personal/commercial use and modification; attribution optional. Retain archive `License.txt` locally and in web credits.
- Selected archive prefix: `Models/GLTF format/`.
- Files: `desk.glb`, `chairDesk.glb`, `computerScreen.glb`, `computerKeyboard.glb`, `computerMouse.glb`, `plantSmall2.glb`, `pottedPlant.glb`, `lampRoundTable.glb`, `books.glb`, `sideTableDrawers.glb`.
- Destination: `assets/source/kenney-furniture-kit/`. Exact hashes recorded after acquisition in `acquisition.json`.
- Planned modifications: scale/proportions, sage/cream/wood materials, bevels and normals, replace personal screen with original approved lettering, assemble detailed desk vignette. Exports: `public/models/desk-studio.glb`, editable `assets/blender/desk-studio.blend`.

## Original Blender adaptations

The rounded wooden PROJECTS sign, its inset face/bronze loops, and the printer/scanner/paper are original Blender geometry for this project. The pointed Survival sign was not selected for the art direction; the audited Poly Pizza printer page could not be downloaded through the available HTTP path (403). No uncertain repository model was substituted. Existing chair base/support geometry was retained while the coarse seat/back were replaced with rounded upholstered parts, piping, armrests and caster details. The reused desk gained an inset drawer pedestal, pulls, keycaps and a small role plaque. No bunny was acquired or added.

The original wood-grain PNG, screen lettering, sign lettering, rug details and printer markings are original project work. `scripts/build_desk.py` reproduces these adaptations in Blender. The 768² wood image and font are packed in the editable `.blend`; the GLB embeds its texture.

## Fonts

Acquired Nunito: Google Fonts / Nunito Project Authors, SIL OFL 1.1, source `https://github.com/google/fonts/tree/main/ofl/nunito`. `OFL.txt` is retained with source and in `public/licenses/`. Exact binary URL and hashes are in `assets/source/nunito/acquisition.json`. A weight-800 static instance was produced using fontTools for readable Blender lettering; the variable original serves the web UI. No font is sold alone or relicensed. Font geometry and owner-approved text are original scene output, not copied portfolio branding.

## Code dependencies

No personal portfolio source module or shader was copied verbatim. Questopia's architecture informed the component boundaries, while the implementations reuse installed R3F/Drei/CameraControls/Three APIs. Runtime license notices are retained in `public/licenses/THIRD_PARTY_NOTICES.txt` and neighboring upstream license files. `stats-gl` is an unused optional Drei export dependency, not an imported prototype feature; its package declares MIT but its upstream repository/package has no root license text. No Stats source or assets were vendored into project code. Mediapipe/Draco optional package notices are included; neither service/model assets nor compression decoder downloads are used by this scene.

## Phase 4A adaptation addendum — 2026-10-27

No additional external assets acquired. All Kenney and Nunito source/license/attribution records above still apply. Original project modifications add curved leaf inserts/stems, raised sign framing/pegs, joinery/edge banding, printer vents/guides/feet, monitor vents/status detail, and fully black chair finishes. These are editable in `assets/blender/studio-phase4a.blend` alongside the retained original scene. No models or shaders were copied from the audited personal portfolios.

Original baked texture: `assets/blender/textures/studio4a-static-baked.png` (2048²), derived from licensed furniture plus project-authored geometry/materials, not a newly downloaded texture. Web export remains `public/models/desk-studio.glb`. The separate clay architectural study is labelled temporary and is not part of that export. See `PHASE4A_REPORT.md` for evidence and limits. No bunny, paid pack, or unverified artwork was added.
