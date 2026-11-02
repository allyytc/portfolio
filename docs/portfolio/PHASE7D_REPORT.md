# Phase 7D report — spatial correction, readability and proportion

No deployment; original site untouched. Evidence: `evidence/phase7d/` (01 default hero … 09 mobile).

## Changes
| Request | Result |
|---|---|
| Fireplace anchored to a wall | Plaster left return wall extended forward in `PortfolioLoft7D` (door gap to the porch kept); hearth rotated to face the room and set flush against it. Armchair/rug/low table form the reading group in front of it. |
| Printer in workstation | Printer (80% scale) now sits on the desk's left end beside the monitor. The earlier back-wall stand was hidden behind the stairs, so it was removed; plant moved to the floor. |
| Porch on the side wall | Art porch + easel moved to the left side of the cabin, continuous with the floor; real Cookies & Clubs flyer remains on the easel. |
| Signpost in front field | New runtime signpost (`src/studio/worldLayout.ts`): canvas-textured boards, parchment on dark walnut, Ally Chen header + Projects / About / Community / Contact. Old sign meshes hidden. Keeps the same stable ids/click targets. |
| Readability | Monitor: "Hi, I'm Ally" + "PROJECTS →" only. Community wall: eight tiny captions replaced by one large COMMUNITY plaque (shelf raised to clear it); card names stay in hover tooltips and panels. Book spine/"ABOUT" labels removed. |
| Loft bed | Scaled to 74% on both axes, anchored to the back-right corner; landing is clear. |
| Palette | Chair/cushion materials deepened on copies; soft furnishings tinted moss at runtime. Original 4D materials untouched. |
| Footprint | Not enlarged: moving the printer, sign and hearth removed the crowding, so no new floor area was needed. |

## Pipeline (non-destructive)
`scripts/edit_loft_phase7d.py`, `patch_*`, `patch2_*`, `patch3_*` edit a **copy** (`PortfolioLoft7D`) of `PortfolioLoft4D`; `bake_export_loft_phase7d.py` bakes and exports `public/models/loft-studio-v7d.glb` (3.06 MB) and `build_compact_glb.py` derives the phone texture variant (2.47 MB, geometry buffers byte-identical). Editable copy: `assets/blender/studio-phase7d.blend`. The v4d files and Phase 4D scene are retained. `sceneBounds.json` updated for the moved printer/workstation.

## Known gaps
- Hearth chimney is still a blocky stone stack; it could use a refined Blender pass.
- Screenshots 02–07 are zoomed crops of the default view; the camera-focus views for fireplace/easel were updated (`cameraViews.ts`) but not separately captured because opening a destination also opens its content panel.
- Signpost has no dedicated keyboard stop of its own; the Studio Menu/Quick View remain the keyboard equivalents.
- Mobile framing of the repositioned porch and sign was captured (`09-mobile.png`) but not tuned further.
- Full Playwright suite result: see the final message (test labels reference the old sign/printer locations only if a test fails).
