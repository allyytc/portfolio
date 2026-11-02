# Phase 7C report — Midnight Spruce Cabin

Status: world-first redesign implemented and visually checked. Phase 8 / deployment NOT started. Original site untouched.

## Done (verified in real browser captures, `evidence/phase7c/`)
- Full-viewport canvas with the cabin as the page; minimal HTML chrome; bottom-left Studio Menu (`menu-open.png`).
- Cutaway cabin with timber structure and roof, plus an attached covered art porch with steps, easel, stool, tray, sconce (`current.png`).
- Real owner artwork on the easel: unmodified `Cookies & Clubs 2025 Flyer.png`, aspect preserved. The Blender export dropped the image, so it is applied at runtime in `src/studio/Studio.tsx`.
- Easel opens the Design panel ("From the art porch", Unwrap featured with its "pending verification" status intact) (`design-focus.png`).
- Masonry hearth with ember glow and restrained flicker light; About interaction unchanged.
- Trees: owner preferred the faceted Kenney Nature Kit pines (CC0, refined in Blender), so they are restored with the original layout (20 desktop / 13 phone instances). The Quaternius export is kept at `assets/source/phase7c/midnight-spruce-trees-quaternius-export.glb`.
- Midnight Spruce tokens in `src/midnight-spruce.css`; asset research and licences in `ASSET_MANIFEST.md`; audit in `PHASE_7C_VISUAL_AUDIT.md`; checkpoint `assets/checkpoints/phase7b-before-7c.tar.gz`.

## Not done / known issues
- The requested Sketchfab Wooden Cabin needs authenticated download (HTTP 401); not used. Cabin is built from CC0 Kenney pieces plus original Blender geometry.
- Porch still shows a visible seam to the cabin floor, and the signpost partly overlaps the porch edge. Needs a Blender pass.
- Mobile: the first-visit hint toast overlaps the zoom/Reset controls.
- Interior reading-nook window and some surfaces remain flat-coloured; no dedicated string lights on the porch.
- Panels use themed chrome but are not yet object-specific (pinboard/archive/book metaphors).
- Not measured: FPS or load-time effects of the new world assets. No performance claims made.
- Missing screenshots from the Stage 16 list: signpost close-up, fireplace and monitor focus, community/archive panels.

## Cabin-wide process note
Vite's dev server returned HTML for the `%26`-encoded filename; use `encodeURI` (leaves `&`) for media with `&` in the name.
