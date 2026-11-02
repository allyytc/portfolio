# Phase 7F report — visual furniture editor + cinematic polish

No deployment; original site untouched. Checkpoint before edits: `assets/checkpoints/phase7d-before-7e.tar.gz` (pre-7E source) plus git state; the 7F pipeline only adds files and rebakes a copy scene. Evidence: `evidence/phase7f/`. Usage: `CABIN_EDITOR_GUIDE.md`.

## Audit (what could move before)
Independent GLB nodes already existed for printer, monitor, community cards, books, plaques, easel and the world nodes; **desk, chair, rugs, armchair, tables, lamp and plants were baked into `StudioStatic`/`SoftFurnishings`** and had to be separated in Blender (`scripts/separate_furniture_phase7f.py` on the `PortfolioLoft7D` copy; rebaked, original 4D scene and files retained). Architecture, loft, stairs, shelves, bed, porch structure, roof, terrain stay locked and are listed in the registry.

## Delivered
- **Dev-only editor** (`src/studio/editor/*`, lazy-loaded behind `import.meta.env.DEV`; Vite `apply:'serve'` save plugin). Click/list selection, outline, drei `TransformControls` move/rotate/scale, world/local, snapping, numeric fields, keyboard nudging, undo/redo, reset, import/export, restore baseline, exit.
- **Typed registry + versioned layout** (`layout/registry.ts`, `layout/layout.json`): offsets from baked placements, applied at runtime in production, validated, diff-friendly.
- **Sync:** pivots wrap each unit; hit boxes recomputed after edits; camera presets translate with their anchor objects; paper animation moves with the printer; tooltips use event points.
- **Warnings:** overlap, outside floor/porch, wall/stairs intersection, below floor — non-destructive, with intentional-overlap allow-lists.
- **Review mode:** object list + five camera review buttons.
- **Lighting:** cooler layered haze/hemisphere/moon fill outside; warm additive light pools parented to the hearth, desk lamp and porch group; stronger flickering hearth light and porch light. No new shadow-casting lights.
- No furniture was re-placed: `layout.json` is intentionally empty (baseline), so the user's later edits are never overwritten.

## Verified (actually run)
`tests/cabin-editor.spec.ts` — 6/6 pass: click+list selection, keyboard move/rotate/scale, undo/redo, deselect/exit; real mouse gizmo drag moves the object **without rotating the camera** and orbit works again after; collision/bounds warnings; export → restore → import and rejection of unknown ids / out-of-range numbers; save writes only `layout.json`, survives reload, a moved printer still opens Resume; save endpoint rejects invalid layouts; production server has no Edit Cabin button, no `__cabinEditor`, and the endpoint does not accept writes. `grep` of `dist/` finds no editor strings. Production build passes.

## Not done / honest gaps
- **Baked shadows stay behind** when baked furniture moves (see guide) — the main limitation; needs per-object bakes.
- Armchair left the dynamic soft-furnishings group so it is now baked (slightly paler sage, no live fire light).
- No surface snapping or multi-select; AABB collision only.
- Reading-nook and porch "polish" is limited to lighting and a verified-working editor: the armchair was not auto-angled because the user's own saved layout must not be overwritten — use the editor.
- Pre-existing Playwright failures from earlier phases (see final summary) are separate from the editor.
