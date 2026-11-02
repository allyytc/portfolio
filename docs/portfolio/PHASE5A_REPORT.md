# Phase 5A — camera navigation and discoverability

Implemented locally in `allyytc/portfolio`. No commit, push, publication, deployment, original-site request or original-repository change was performed. Phase 5B and Phase 6 remain deferred.

## Preserved foundation and reuse

Before editing, the working navigation, scene, camera, styles, tests and AGENTS instructions were copied into `assets/checkpoints/phase4d-navigation/`; its eight SHA-256 checks pass. All 21 Phase 4D artifact hashes still match, including editable Blender source, exported GLB, packed texture exports and earlier evidence. See [preservation-check.json](evidence/phase5a/preservation-check.json). The served model remains **3,260,508 bytes**; geometry, baked lighting, materials at rest and source files were retained.

The existing Drei 10.7.9 CameraControls wrapper and installed camera-controls 3.1.2 supply damping, orthographic zoom and look-at transitions. The wrapper's exported action constants avoid direct transitive imports. Both are MIT with full notices already retained in `public/licenses/THIRD_PARTY_NOTICES.txt`. No package, animation framework, copied portfolio module, external asset or paid service was added. Phase 2 recommendations remain the architectural reference; no broad research was repeated.

## Navigation behavior

- The landing pose remains position `[9, 9.5, 13]`, target `[0, 1.55, 0]`, responsive span `10.6 × 8.3`. Reset restores target, position, rotation and fitted zoom.
- Desktop background dragging rotates within the selected preset's azimuth/polar bounds. Overview azimuth is approximately 26.7–42.7°, polar 58.4–68.2°. Pan, right/middle drag and first-person movement are disabled. Cameras remain outside the room at fixed orbit distances; orthographic zoom changes magnification rather than moving through furniture.
- Wheel zoom applies after focusing/clicking the canvas, or while holding Ctrl/⌘ over it. Unfocused ordinary wheel gestures scroll the page. Outside-canvas events are untouched. Overview zoom is bounded to 0.82–1.05 of its fit; focus views use 0.9–1.25.
- `setLookAt` and `zoomTo` share the existing 0.35s damping parameter. Completion takes roughly 1–2 seconds depending on distance/tolerance. Orbit input is disabled during transitions; serial/revision guards discard stale completions. Repeated printer requests reset paper-completion bookkeeping, preventing a stalled second action.
- Reset View is always present, including after manual orbit. Focused sections and dialogs provide Back to Studio. HTML Projects/Resume and Contact remain direct, independent of scene navigation/loading.
- On compact/coarse-pointer devices, preset taps work immediately. Touch controls explicitly enable one-finger rotation and two-finger pinch/rotation; otherwise native page scrolling and page pinch remain available. Toggle off to return to page gestures.
- Canvas keyboard: arrows rotate, plus/minus zoom, Home resets. Destination buttons provide every scene action. Keyboard section selection focuses its accessible HTML section after settling. Reduced motion removes camera/paper animation. WebGL/model/decoder failure retains the same destination registry and direct content access; decoder retry remains available.

## Measured targets and interaction registry

`scripts/measure_navigation_phase5a.py` reads `PortfolioLoft4D` without saving or changing it. `src/studio/sceneBounds.json` and [scene-bounds.json](evidence/phase5a/scene-bounds.json) contain source-derived world bounds converted to glTF Y-up. `cameraViews.ts` projects bounding-box corners onto camera right/up axes, applies padding/minimum context spans, and calculates responsive fit.

Validated views:

- **Workstation / Projects:** monitor, desk/chair/printer cabinet bounds, including surrounding desk context; existing three-project dialog opens after focus.
- **Design:** Unwrap display, sticker book and sketchbook; pending-verification label preserved.
- **Community:** eight actual pinboard-frame bounds; a more frontal pose keeps the stairs out of the board's center.
- **Reading / About:** cushioned-bench, pillows and folded-blanket bounds with vertical context for the framed window. Interior-facing pose exposes the bench instead of approaching behind the window wall.
- **Archive:** measured rear shelf/skills volumes; both rear skills and front experience volumes lead here.
- **Printer / Resume:** independent printer and paper bounds; existing paper motion precedes the same byte-identical PDF dialog.
- **External links:** combined GitHub/LinkedIn plaque bounds; real profile links and Contact use accessible confirmation-free section links. No automatic external tab opens during a camera transition.

`src/studio/interactions.ts` is the single registry for stable scene IDs, measured hit zones, labels, focus views, actions and keyboard equivalents. `Studio.tsx` creates padded invisible hitboxes from those entries. The Projects root contains the entire timber post: its whole-root box originally intercepted the other signs, so it now uses separate measured Projects/name-board boxes. The bench and archive have measured zone boxes. Decorations remain inert.

Hovered objects receive a restrained material lift and faint hit-zone tint, contextual label and pointer cursor. Materials are cloned per interactive mesh while textures remain shared. Hidden hitbox materials do not render; only the hovered zone's feedback renders. Clicks after drags over six pixels are rejected, and pointer-down probing prevents object gestures from rotating the camera. Labels disappear on navigation/dialog changes. No permanent labels or added postprocessing cover the room.

## Validation and evidence

`npm run build` passes strict TypeScript and production bundling. The existing large lazy Three/loader chunk warning remains (~972KB raw / 260KB gzip); this phase does not restructure the renderer bundle.

`npm test`: **10 passed (52.4s)** on the final implementation. Scenarios: actual mesh actions/PDF/focus/idle, responsive reduced-motion viewport, failed-model fallback destinations, unavailable WebGL, all named targets and exact reset, decoder failure/retry, bounded drag/zoom/rapid switching/keyboard, actual CDP touch scroll/rotate/pinch, physical design/community/sign/bench/archive/social targets, and repeated/interrupted printer actions. Chrome uses an isolated headless profile. Touch gestures are browser-emulated, not a physical-device performance claim.

Canonical captures, generated by the tests:

- [Default overview](evidence/phase5a/browser-default.png)
- [Workstation](evidence/phase5a/browser-workstation.png)
- [Community](evidence/phase5a/browser-communityPinboard.png)
- [Reading nook](evidence/phase5a/browser-readingNook.png)
- [Alternate bounded orbit](evidence/phase5a/browser-alternate-orbit.png)
- [Design](evidence/phase5a/browser-designCorner.png), [archive](evidence/phase5a/browser-archive.png), [printer](evidence/phase5a/browser-printer.png), [social plaques](evidence/phase5a/browser-externalLinks.png), [touch viewport](evidence/phase5a/browser-touch.png)

Focus screenshots intentionally close Projects/Resume dialogs to expose the camera view; separate `browser-projects.png` / `browser-resume.png` show working dialogs. `browser-externalLinks.png` is the shared social pose with Contact selected, the last registry entry tested.

[Runtime metrics](evidence/phase5a/browser-metrics.json) record active frame intervals, calls, triangles, seven GPU textures, hitbox geometry overhead and no runtime errors for the desktop flow. Demand rendering settles after motion. These host/local diagnostics are not cross-device FPS or download benchmarks.

## Remaining visual gaps and stop boundary

Close-ups expose retained atlas/UV edges, dark window joinery seams, chunky plant leaves, limited fabric detail and low-resolution board thumbnails. The small About plaque is partly hidden by the design table; the visible bench and About entrance sign supply reachable equivalents. Focus cameras crop unrelated room context by design; the default retains the full-room composition. Geometry and lighting remain the Phase 4D baseline, including its sage/cream desk chair. No new modeling or rebaking was performed.

Unwrap content and final community/media migration remain pending verification. Section cards are deliberately minimal; original source inventory and media are preserved. No Phase 5B object choreography or Phase 6 migration was started. Stopped after Phase 5A.
