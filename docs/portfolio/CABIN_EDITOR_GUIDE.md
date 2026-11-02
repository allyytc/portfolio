# Cabin editor guide (development only)

The editor lets you reposition furniture visually instead of guessing coordinates. It exists **only** in the local dev server (`npm run dev`). It is not in `npm run build` output, and the save endpoint only exists while the dev server runs.

## Open it
1. `npm run dev`, open http://127.0.0.1:5173.
2. Click **Edit Cabin** (top centre, marked DEV). A panel opens on the right. While edit mode is on, clicking scene objects selects them instead of opening portfolio panels (the header, Studio Menu and camera controls still work).

## Select
- Click an object in the scene, or pick it from the grouped, searchable list. Selected objects get a yellow outline; red outlines mean a warning (see below).
- Click empty space or press **Esc** to deselect; **Esc** again exits Edit Cabin.
- Greyed entries are not in the scene; 🔒 entries are locked (fireplace): press **Unlock** to move them.
- Clicking something not in the list (floor, walls, stairs, shelves, bed…) shows "locked architecture" — see *Blender-only items*.

## Move, rotate, scale
- **Move / Rotate / Scale** buttons choose the gizmo. Floor furniture moves on the ground plane (tick **Height** to lift); wall cards move in the wall plane; rotation is around the vertical axis (tick **Full rotation** for X/Z). **World/Local** switches gizmo orientation. Scale uses the centre cube (uniform) and is clamped to safe bounds.
- Dragging a gizmo handle never orbits the camera; dragging empty space orbits as normal (limits of the current camera preset still apply).
- Numeric fields show/accept offsets from the baked GLB placement (metres, degrees); press Enter or leave the field to apply.
- Keyboard (when focus is not in a text box): arrows = move X/Z · PageUp/PageDown = height · `[` `]` = rotate · `-` `=` = scale · **Shift** = fine (×0.2) · ⌘/Ctrl+Z = undo · ⌘/Ctrl+Shift+Z = redo.
- **Snap** toggles grid snapping (move 0.01–0.25 m, rotate 5–90°, scale 0.05). Surface snapping is **not** implemented; use Height + numbers for items on tables.
- **Reset object** returns the selected object to its last saved placement. **Undo/Redo** keep 50 steps.

## Free camera (dev only)
Entering Edit Cabin turns on **Free camera 360°** (checkbox in the panel): unlimited orbit, much wider zoom (wheel works without focusing the canvas), and right-drag to pan. Turning it off (or exiting edit mode) restores the normal bounded camera. Production builds never get this.

## Review from different directions
Review buttons (Overview, Workstation, Reading nook, Art porch, Community) use the normal camera presets. Camera destinations are translated by the offset of the object they frame (desk → workstation, printer → printer, hearth → reading nook, easel → design, cards → community, plaques → links), so views never point at an old position. Hit boxes and tooltips are rebuilt from the moved geometry; the printer paper animation moves with the printer (along its own forward axis).

## Warnings
Non-destructive, nothing is forced. You get warnings for: major furniture overlapping major furniture (intentional pairs such as desk/printer/chair-under-desk, rugs and small props are exempt), floor furniture outside the cabin floor or porch deck, floor furniture intersecting the stairs or the left/back/window walls (the hearth is allowed to touch its wall), outdoor objects (signpost) inside the cabin, and sinking below the floor.

## Save permanently
Layout is stored as **offsets from the baked placement** in `src/studio/layout/layout.json` (versioned, sorted keys, 4 decimals, so diffs are small). The app applies this file at start-up in production as well, so edits survive refresh, build and deploy.
- **Save layout to project** posts the layout to the dev-only endpoint `/__cabin-layout`, which validates object ids and numeric bounds, accepts localhost only, and writes **only** `src/studio/layout/layout.json`. Then `git add/commit` it yourself — nothing is committed or deployed automatically.
- If the endpoint is unavailable: **Copy JSON** / **Download**, replace `layout.json`, commit.
- **Import…** accepts a pasted layout (validated; bad ids or out-of-range numbers are rejected). **Revert unsaved** returns to the last saved layout; **Restore baseline** sets every object back to its original GLB position (press Save to make that permanent).
- To restore a previous layout from git: `git checkout -- src/studio/layout/layout.json`.

## What can move
**Everything in the registry (`src/studio/layout/registry.ts`) — nothing is locked.** Interior: floor boards, walls, loft deck/rails/posts, loft bed, staircase, window wall, window bench + cushions, desk + monitor, printer, chair, rugs, armchair, tables, lamps, plants, design desk, skills cabinet, experience shelf, wall shelf, pinboard backing and its eight cards, clock, books, plaques and entrance trim. World: main roof, porch roof, back wall boards, floor fascia, left wall frame, porch deck/posts/rails, stool, sketchbook, supply table, lantern + string lights, fern, easel + canvas, fireplace + flames, ground/rocks, the whole spruce forest, and the signpost.

Moving large shell pieces (floor, walls, stairs) can obviously break the room; collision warnings only watch floor furniture, and their stair/wall reference boxes do not follow moved shell pieces. Use **Revert unsaved** / **Restore baseline** if you wander off.

### Known limits (honest)
- **Baked shadows stay behind.** Furniture lighting/contact shadows are baked into the shared atlas; moved baked furniture leaves its soft shadow on the floor/rug. Small moves are fine; large moves of the desk or chair show it. Fixing this needs a per-object bake.
- Moving baked furniture does not change its baked lighting, and unlit baked pieces don't respond to the fireplace light (the warm glow pools are parented to the hearth, lamp and porch group so they follow).
- No automatic surface snapping, no physics, no multi-select.
- Collision boxes are axis-aligned bounding boxes, so rotated or L-shaped furniture can over- or under-warn.

## Add or split an editable object
Pieces that are still merged inside one group (for example the small items inside `StudioStatic`, which now only holds the entrance step and front trim) can be split with `scripts/separate_all_phase7f.py` / `separate_world_phase7f.py` (add a rule, rebake or re-export).

1. In Blender (`PortfolioLoft7D` for interior, `MidnightSpruceWorld7E` for world pieces) put the object's meshes under a new **top-level empty with a `stable_id`** (see `scripts/separate_furniture_phase7f.py`); re-run `bake_export_loft_phase7d.py` (interior) or `export_world_phase7e.py` (world); keep original `.blend` files.
2. Add an entry to `editableObjects` in `registry.ts` (`id`, `label`, `group`, `nodes: [stable_id]`, `kind`, optional `exempt`, `overlaps`, `locked`, `scale`, `view`). Runtime-built Three objects can be referenced by name with a `#Name` selector.
3. Optionally add the id to the camera `anchors` in `layout/apply.ts` if a camera view should follow it.
4. Move it in the editor and Save.
