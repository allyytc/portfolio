# Phase 7E report — asset quality and architectural polish

No deployment; original site untouched. Checkpoint before edits: `assets/checkpoints/phase7d-before-7e.tar.gz`. Evidence: `evidence/phase7e/` (01 default hero … 09 Studio Menu). Compare against `evidence/phase7d/` and the supplied earlier screenshots.

## Before → after
| Area | Before (7D) | 7E |
|---|---|---|
| Porch | Deep platform at the front-left corner, long edge pointing away from the wall | Runs along the left exterior wall: shared floor level, wall ledger beam, shingled lean-to roof tied under the wall cap, posts/rafters/rails, steps. Easel rotated to face the camera, supply table with paint jars and sketchbook, stool, lantern + string bulbs, warm porch light. |
| Fireplace | Arch topped by stacked grey boxes | Original masonry model: cut stone courses, arch voussoirs, firebox, walnut mantel + corbels, hearth slab, chimney stack and cap; flush with the extended plaster wall; flame flicker + warm point light (reduced-motion and low-power modes stay static). |
| Community wall | Blank frames; shelf hid part of the plaque; last card behind loft | Eight real photographs (resized derivatives of migrated originals) each with a large caption (Eng. Council, Startup Hub, Design for America, BeaverHacks, AI Club, BeaverHacks 2026, Innovation Jam, Engineers’ Week); wall shifted left so all cards clear the loft; COMMUNITY plaque above. Individual click targets kept. |
| Roof | Gappy slat strip, stray wedge blocks, beam and plaster poking through | Continuous shingled panel with underlay, drip board, ridge cap and barge boards, lifted clear of the back wall and beams. |
| Materials | Floor, stairs, desk, rails all the same orange | Stairs and loft structure deeper walnut, desk richer, floor medium oak, shelves/furniture honey, plaster parchment, roof desaturated spruce, stone warm natural, upholstery moss, brass accents. |
| Forest | Large faceted trees close to the cabin | New layered layout: small foreground accents, mid-size side trees well away from the porch, tallest trees at the back; none overlap the cabin or porch from the default camera. Same instanced Kenney pines (no new assets). |
| Signpost | Overlapped porch steps | Moved clear of the porch, same readable boards, same click targets. |

## Interaction anchors preserved
Stable ids ProjectsMonitor/PrinterBody/ResumePaper/Community_*/ArtEasel/Fireplace/AboutBook and the four sign ids are unchanged. Design camera view retargeted to the new porch; reading-nook view retargeted to the new hearth.

## Pipeline (non-destructive)
`build_world_phase7e.py` → `fireplace_phase7e.py` → `patch*_world_phase7e.py` → `export_world_phase7e.py` build/export a copy scene (`MidnightSpruceWorld7E`); `patch4_loft_phase7d.py` + `bake_export_loft_phase7d.py` rebake the loft copy (`PortfolioLoft7D`). Phase 7C/4D scenes and GLBs are retained.

## Honest gaps
- No third-party fireplace, porch furniture or tree asset was downloaded (see ASSET_MANIFEST 7E); the replacements are original Blender geometry. Trees are still the faceted Kenney pines, only re-laid out.
- Floor and furniture are better separated but the floor is still fairly orange; further grading would need another bake.
- The first-visit hint toast still overlaps the zoom controls on phones.
- Easel focus screenshot is a zoomed crop of the default view (opening Design also opens its panel).
- Playwright suite status is in the final summary; the suite's helper was updated because it referenced the pre-7C "Quick View" button.
