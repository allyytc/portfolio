# Phase 4C refinements and asset provenance

2026-10-27. Local-only work in `allyytc/portfolio`, $0. No new external model or texture pack. Phase 4B Kenney CC0 furniture, Nunito OFL font, Font Awesome CC BY 4.0 brand outlines, and owner media retain their previous source/license records in `PHASE4B_ASSETS.md`. No Unwrap UI, event photo or logo is invented.

Original project refinements: procedural fabric variation, oak-board tonal variants, source-based upholstery smoothing, repeated foliage shape variation, curved folded nook textiles copied from the existing original blanket surface, timber trim and a rear-window sky surface. Source meshes and zone IDs remain editable. Current source: `assets/blender/studio-phase4c.blend`; packed/source atlas: `assets/blender/textures/loft4c-static-baked.png`; web output: `public/models/loft-studio-v4c.glb`.

## Local Draco decoder

Source: already installed `three@0.186.1`, `node_modules/three/examples/jsm/libs/draco/gltf/{draco_decoder.js,draco_decoder.wasm,draco_wasm_wrapper.js}`. Destination: `public/decoders/draco/`. These are the actual matching decoder distribution files; hashes and sizes are recorded in `evidence/phase4c/decoder-manifest.json`. Draco copyright Google; Apache License 2.0, retained in `public/licenses/draco-Apache-2.txt` and existing third-party notices. No CDN request, subscription or new npm dependency is needed. Blender's bundled Draco exporter performs mesh compression; the browser's existing GLTFLoader uses the local decoder path. Model/decoder load failures preserve HTML access through the existing error boundary.

Decoder code licensing is separate from the furniture, icon artwork, font and owner media permissions. Draco compression changes mesh storage, not ownership or content clearance. See `PHASE4C_REPORT.md` for measured size, geometry and runtime comparisons.
