# Phase 3 — local desk prototype

2026-10-27 · `allyytc/portfolio` only · $0 spent · nothing committed, pushed or deployed.

## Result and resume integration

The isolated Blender-authored desk scene and local React/TypeScript/R3F prototype are built. The monitor and PROJECTS sign open one shared, readable Projects dialog. Clicking the printer slides its independent paper forward and opens the Resume dialog. Equivalent HTML controls work with keyboard navigation and without the 3D scene.

**The resume-file blocker is resolved.** The owner supplied `/Users/ally/Downloads/allychen-resume2028.pdf` on 2026-10-27. Its one-page rendering was inspected read-only, and the PDF was copied unchanged to `public/files/allychen-resume2028.pdf`. The shared resume record now provides a working PDF link from the animated printer, direct Resume button, and Quick View. Browser checks verify HTTP success, PDF content type, exact served bytes, and keyboard access. No original website files or historical source references were modified.

## Deliverables

- [Editable Blender project](../../assets/blender/desk-studio.blend): packed oak texture and font, separate editable parts, metric scene, fixed isometric camera and Cycles lighting.
- [Web-ready GLB](../../public/models/desk-studio.glb): five semantic roots: `StudioStatic`, `ProjectsMonitor`, `ProjectsSign`, `PrinterBody`, `ResumePaper`.
- [Blender render](evidence/blender-desk.png): direct Cycles render, 1500×1100, transparent background; render time approximately 15 seconds on the connected session.
- [Desktop browser screenshot](evidence/browser-desktop.png), [mobile viewport screenshot](evidence/browser-mobile.png), [Projects dialog](evidence/browser-projects.png), [paper animation](evidence/browser-printing.png), [Resume dialog](evidence/browser-resume.png).
- [Artifact hashes/sizes](evidence/artifact-manifest.json), [mesh statistics](evidence/model-statistics.json), [browser observations](evidence/browser-metrics.json), [bake probe](evidence/bake-probe.json).
- [Asset acquisition and licensing register](PHASE3_ASSET_REGISTER.md); original downloaded files and hashes under `assets/source/`.

Run `npm run dev` and open `http://127.0.0.1:5173/`. The development server binds only to localhost. Build with `npm run build`; verify with `npm test`.

## Reuse and authored work

Reused ten small models from Kenney Furniture Kit 2.0: desk, chair base/support, monitor, keyboard, mouse, two plants, table lamp, books, and side table/drawers. Their included asset-level license is CC0 1.0; voluntary attribution is present. No model/texture/artwork from the four personal reference repositories was imported.

Blender adaptations include coherent oak/sage/cream materials, edge bevels and normals, an upholstered chair/back shell with seams, armrests and caster details, fitted drawer fronts/pulls, individual keycaps and a role plaque. The rounded hanging PROJECTS sign/loops and printer/scanner/controls/curved paper are original Blender work. The audited trail sign was unsuitable for the refined direction; the catalog printer's HTTP download was unavailable. Essential custom Blender work was explicitly allowed in Phase 3, so neither was replaced by crude Three.js furniture. No optional bunny model was acquired or added.

The oak-grain texture and screen/sign/printer lettering are original project work. Nunito is OFL 1.1; the variable font serves the web UI and a weight-800 static instance supplies physical lettering. Copyright/license files are retained. Exact source URLs, acquired paths and SHA-256 values are in the asset register and `acquisition.json` files.

Questopia informed the component architecture; no personal branding, project copy, room shader or entire app was transplanted. Installed Three/R3F/Drei/CameraControls provide the actual rendering, camera, loading, hit testing and soft shadows. Motion uses CameraControls/R3F damping and CSS; no second animation library was added. Upstream code notices are retained under `public/licenses/`.

## Blender integration and bake investigation

The configured connector could not communicate with the installed Blender Lab extension because their wire protocols differ. A small localhost adapter, `scripts/blender_bridge.py`, uses that already-installed extension's null-delimited execute API. All assembly, geometry customization, rendering and export ran inside the live Blender 5.2.1 LTS session. No addon, network or production settings were changed. The original startup scene was preserved separately; only `PortfolioDesk` was rebuilt/exported.

A non-destructive Cycles test baked diffuse color plus direct/indirect light on a duplicate of the actual desk: 1024² image, about 2.2 seconds. The moving paper was not part of that scene. Saved result: `assets/blender/textures/desk-bake-probe.png`. This proves the basic static bake route, not a finished whole-vignette light atlas.

The shipped GLB retains PBR materials and soft runtime shadows, with ContactShadows beneath the plinth. No frozen paper shadow was baked onto the desk or tray. A full static atlas remains a possible visual refinement; it was not silently represented as already integrated.

Reproduce through the running Blender bridge:

```sh
python3 scripts/blender_bridge.py scripts/build_desk.py --timeout 180
python3 scripts/blender_bridge.py scripts/export_desk.py --timeout 180
python3 scripts/blender_bridge.py scripts/render_desk.py --timeout 180
# Optional separate bake investigation:
python3 scripts/blender_bridge.py scripts/bake_probe.py --timeout 180
```

Source inputs/fonts already live in the repository; no asset redownload is needed. `build_desk.py` only rebuilds the named project scene and preserves unrelated scenes. The original portfolio repository is never a script target.

## Verification and observations

- Strict TypeScript and production build pass. Vite reports a large lazy 3D dependency chunk; it is not loaded as part of the initial HTML-only navigation shell.
- Four Playwright scenarios cover actual mesh clicks on sign/monitor/printer, shared real content, independently moving paper, drag rejection, focus containment/return, Escape, reduced-motion mobile layout without horizontal overflow, model-fetch failure, and unavailable WebGL. Desktop checks also confirm rendering eventually settles at idle. Normal desktop flow has no captured runtime errors.
- Native desktop screenshot capture failed through ScreenCaptureKit, so evidence was captured in a separate isolated headless Chrome instance. Saved Blender and browser images were inspected directly, including desktop/mobile composition and dialog readability. Tests do not operate the owner's existing browser tabs.
- GLB: **3,986,224 bytes** (~3.8 MiB), **92,379 logical model triangles**, 29 material primitives across five roots, one embedded 768² oak image. Packed Blender project: 971,696 bytes at export time. Artifact hashes are recorded separately.
- The browser test observed peak 59 draw calls and 184,760 submitted triangles, including shadow/offscreen passes; these are not a second model triangle count. Six GPU textures and 30 geometries include helper render targets/geometry. Active-frame pacing was roughly 17 ms in isolated host Chrome, not a hardware-independent FPS guarantee or a physical-phone benchmark.
- The proposed Phase 2 3 MB model/texture target was exceeded to retain modeled lettering, rounded edges and chair details without adding codec overhead. The triangle/draw-call targets were met in the observed desktop run. The lazy Three/Drei chunk is approximately 1.02 MB minified / 271 KB gzip; the HTML app chunk is approximately 231 KB / 73 KB gzip. No external HDRI, paid API or remote hotlinked model is needed.
- All 15 pinned original portfolio source snapshots were re-hashed and remain unchanged. All prior inventory, project/event/experience information remains preserved. Only three existing real projects are shown in this deliberately limited prototype; full migration and Unwrap content remain out of scope.

## Visual comparison and bounded improvements

The miniature composition now has rounded wood edges, sage/cream upholstery, visible keyboard keys, inset drawer fronts, a physical hanging sign, printer seams/controls and a separate paper sheet. Stock angular chair surfaces and thin sign text were revised after the first render. The monitor uses its actual imported display/bezel, and the role plaque was moved off the keyboard. No complete room, walls, bed, loft, reading nook or community corner was constructed.

Compared with the supplied refined reference, the prototype is intentionally much smaller and less densely decorated. Remaining visual mismatches: foliage and the lamp retain simpler source silhouettes, the printer stand has open legs rather than the reference's full cabinetry, and browser PBR shading has less soft indirect light than the Cycles render. Small physical lettering becomes tiny at phone widths, so large HTML equivalents remain available. The wood is subtle stylized grain, not the reference's more varied natural joinery/textiles. These differences are visible in the saved evidence; no claim of an exact reference-quality match or production-ready mobile performance is made.

The most useful bounded refinements would be a complete static lighting atlas with movable paper excluded, then one more detailed approved plant/lamp treatment if requested. Do not expand into the full room or deploy automatically.
