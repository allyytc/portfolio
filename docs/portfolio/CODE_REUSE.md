# Code reuse audit

Audited 2026-10-26. Read-only research; no repositories cloned, packages installed, source modules copied, or app files changed. The Phase 2 request authorizes this audit beyond the earlier foundation-only research restriction; implementation and deployment remain out of scope.

## Recommendation

Use **Questopia's React/TypeScript/R3F component architecture as the primary reference**, adapted selectively into the existing Vite app. Use maintained Drei helpers for camera controls, loading, and labels instead of copying its custom input controller. Keep R3F frame updates plus CSS as the only motion mechanisms; do not add react-spring, GSAP, physics, or a second scene engine for the prototype.

This is selective reuse, not a fork of an entire personal portfolio. Copy no project text, resumes, portraits, branded screens, logos, or room textures. MIT code permissions do not establish rights to every bundled artwork or external dependency. Recommended model acquisition is separately recorded in [ASSET_MANIFEST.md](ASSET_MANIFEST.md).

## Reference repositories, ranked

Scores are engineering judgments: visual fit / license confidence / stack compatibility, each 1–5; effort estimates describe adaptation, not measured delivery times. License uncertainty overrides a high visual score. No repo was run or benchmarked.

1. **GlintonLiao/questopia — 4 / 4 code, 2 assets / 5; medium adaptation.** Pinned commit `407d52ff317dc7dfbccfd18a2736c4d86ac65059`. [README](https://github.com/GlintonLiao/questopia/blob/407d52ff317dc7dfbccfd18a2736c4d86ac65059/README.md), [LICENSE](https://github.com/GlintonLiao/questopia/blob/407d52ff317dc7dfbccfd18a2736c4d86ac65059/LICENSE), [package.json](https://github.com/GlintonLiao/questopia/blob/407d52ff317dc7dfbccfd18a2736c4d86ac65059/package.json). MIT, Guotong Liao, 2022; retain copyright and complete MIT notice in substantial copied code. React 19, R3F 9, Drei 10, TypeScript/Vite match this project closely. Its baked room architecture fits, but no `.blend` is supplied and personal artwork/texture ownership is not separately documented. Camera/bake structure also resembles Bruno's unlicensed example; do not assume the MIT header resolves any upstream provenance question. Prefer official helpers over those particular custom systems.

2. **trevsm/3D-Portfolio — 2 / 3 / 3; medium–high adaptation.** Pinned `690c184f6b1db012152676a7207703d7de1a5df3`. [README](https://github.com/trevsm/3D-Portfolio/blob/690c184f6b1db012152676a7207703d7de1a5df3/README.md), [LICENSE](https://github.com/trevsm/3D-Portfolio/blob/690c184f6b1db012152676a7207703d7de1a5df3/LICENSE), [package.json](https://github.com/trevsm/3D-Portfolio/blob/690c184f6b1db012152676a7207703d7de1a5df3/package.json). Root LICENSE and README explicitly say MIT, Trevor Smith, 2022; package metadata says ISC. Treat LICENSE as the explicit source-code grant and preserve its complete notice if copying; record the inconsistency. No separate model/texture license or author-rights statement for individual geometry was found. React 18/R3F 8, older Three, CRA and react-spring need migration. The README's `npm run dev` is not supported by the inspected package scripts (`start` exists). The monochrome low-poly room is less close to the warm detailed references.

3. **Rowobin/3D-Room-Portfolio — 3 / 2 / 2; high adaptation.** Pinned `3c6197d1d838c4e2a6fc688ca773ad02ad70a628`. [README](https://github.com/Rowobin/3D-Room-Portfolio/blob/3c6197d1d838c4e2a6fc688ca773ad02ad70a628/README.md), [main.js](https://github.com/Rowobin/3D-Room-Portfolio/blob/3c6197d1d838c4e2a6fc688ca773ad02ad70a628/main.js). README gives an informal broad reuse invitation, but no standard license, attribution terms, or asset-specific provenance is present. This is more than mere public visibility, but not the clear license evidence required for recommended copying here. Reference only until clarified; no outreach sent. Plain Three/DOM with GSAP calls would require a React rewrite. Global pointerdown selection can activate while beginning a drag; deprecated renderer color APIs need updating.

4. **brunosimon/my-room-in-3d — 4 baked-lighting fit / 1 / 1; high adaptation.** Pinned `5d00b3f870da81f103e901e0d12e20bbcc816834`. [readme](https://github.com/brunosimon/my-room-in-3d/blob/5d00b3f870da81f103e901e0d12e20bbcc816834/readme.md), [source tree](https://github.com/brunosimon/my-room-in-3d/tree/5d00b3f870da81f103e901e0d12e20bbcc816834/src/Experience). No license file or reuse grant found in the complete tree/readme. Do not copy code, shaders, room geometry, baked images, logos, or video. Useful conceptual reference for baking and separating animated props only. Singleton Three/Webpack architecture conflicts with the existing React app.

## Exact implementation candidates

Unless stated otherwise, Questopia paths below resolve under the pinned commit above and carry its root MIT notice. Adaptation estimates are deliberately small slices; accessibility/content work is additional.

### 1. Camera movement and smooth zoom — prefer maintained controls

- Inspected `src/components/CameraRig.tsx`: bounded spherical orbit/pan/radius, wheel zoom, 2.8-second introductory interpolation, delta-based smoothing. It is a narrow-FOV **perspective** camera, not true orthographic isometry. Touch alternative movement is not a verified pinch-zoom implementation. Window touch listeners/preventDefault and per-frame allocations are reasons not to transplant it.
- Recommended reusable implementation: Drei [`src/core/CameraControls.tsx`](https://github.com/pmndrs/drei/blob/master/src/core/CameraControls.tsx), using [`camera-controls`](https://github.com/yomotsu/camera-controls). Both MIT; full notices required if redistributed/copied. Source and [official API](https://drei.docs.pmnd.rs/controls/camera-controls) inspected. Supports perspective and orthographic cameras, smooth transitions and touch mappings; use its `setLookAt` / `zoomTo` transitions, bounds, and reset view. For orthographic zoom use zoom actions, not perspective dolly assumptions.
- Use one orthographic R3F camera at approximately 45° azimuth / 35.3° elevation; fit zoom to aspect ratio. Lock orbit initially; expose focus/overview and zoom buttons. **Fit 5 / license 5 / compatibility 5; low, about 2–4 hours**, including mobile framing. Do not stack OrbitControls or the custom rig on the same camera.

### 2. Clickable objects / raycasting

- Questopia `src/components/Screens.tsx` and `Images.tsx`: cloned GLB primitives with R3F click handlers and stop-propagation; good MIT adaptation candidates. Remove original images/paths, map semantic node names to shared section IDs, and avoid mutating cached shared material instances. **5 / 4 / 5; low, 1–3 hours.** [Screens source](https://github.com/GlintonLiao/questopia/blob/407d52ff317dc7dfbccfd18a2736c4d86ac65059/src/components/Screens.tsx).
- `src/components/InteractionRaycaster.tsx`: exact mesh-name target sets, canvas-relative coordinates and a six-pixel click/drag threshold. Do not copy its multiple delivery paths: callback, global function, and CustomEvent can open the same overlay repeatedly. Avoid scanning the entire scene per click and copying debug globals. Prefer R3F's built-in [events/raycasting](https://r3f.docs.pmnd.rs/api/events); add a drag threshold and semantic hotspot registry. R3F core is MIT. **5 / 5 / 5; lowest maintenance.**

### 3. Labels, highlighting, pointer feedback

- Questopia `src/components/HoverLabels.tsx`: Drei `Html` anchors; reusable after replacing hardcoded positions/text. `InteractiveObjects.tsx`: timed DOM label reveal and named-material color changes; unsuitable unchanged for our shared bake materials. Use one hovered/focused hotspot state, cursor cleanup on unmount, and a local material or modest sign rotation instead of recoloring a whole shared atlas. **4 / 4 / 5; low–medium, 2–4 hours.**
- Drei helpers: [`src/web/Html.tsx`](https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx) and [`src/web/useCursor.tsx`](https://github.com/pmndrs/drei/blob/master/src/web/useCursor.tsx), under [Drei MIT](https://github.com/pmndrs/drei/blob/master/LICENSE). Both paths verified. Labels need keyboard/DOM equivalents; `Html` itself is not an accessibility system.

### 4. Animated physical signs and icons

- No complete licensed wooden hanging-sign/navigation system was found in the four repos. Trevor `src/models/Text.js` animates prebuilt text entrances and `src/models/Computer.js` animates a laptop/hover label; neither supplies the reference sign style. These use react-spring; do not add that framework just to reproduce small transforms. **Reference only: visual 2 / license 3 / compatibility 3; medium.**
- Reuse a licensed detailed sign model from the manifest. Add a single bounded rotation with R3F `useFrame`, delta-aware damping, and invalidation until rest; reduce motion to instant state. Keep large readable typography. Physical raised letters/icons are a later visual refinement; no verified drop-in kit matching the reference exists in this audit. Use text labels initially rather than copying personal logo/icon textures.
- Optional rounded font: [Nunito `ofl/nunito/OFL.txt`](https://github.com/google/fonts/blob/main/ofl/nunito/OFL.txt), SIL OFL 1.1, Nunito Project Authors. License read; no font downloaded. When embedding a font, retain copyright/OFL, do not sell it alone or relicense it, and respect reserved-name rules on modified fonts. Font use does not license unrelated illustrations. Exact chosen font binary must be registered when acquired.

### 5. Portfolio overlays and transitions

- Questopia `src/App.tsx`, `src/components/Overlay.tsx`, relevant `.overlay` rules in `src/index.css`: normal React UI outside Canvas, typed overlay state, project grid, CSS transitions. MIT. **4 / 4 / 5; medium, 3–6 hours** to adapt to a real accessible portfolio panel.
- Reuse component boundaries and a single callback/state path. Remove author contact/project data and global bridge machinery. Supply our inventory-backed shared content instead. Add native dialog behavior or equivalent: labelled panel, Escape, focus containment/return, scroll control, background inertness, reduced motion. Current source does not provide that full contract.
- Trevor `src/components/Overlay.js` closes on button blur; do not carry this into keyboard navigation. Its visual shell adds little beyond Questopia.

### 6. GLB loading / management

- Questopia `Room.tsx`, `Screens.tsx`, `Images.tsx`: Drei `useGLTF`, `useTexture`, memoized scene clones. MIT code; asset rights separate. Prefer packaged GLB materials for the first slice, one centralized asset list, loading errors, and stable named hotspot nodes.
- Official Drei [`src/core/Gltf.tsx`](https://github.com/pmndrs/drei/blob/master/src/core/Gltf.tsx), `src/core/Progress.tsx`, `src/core/Texture.tsx`: MIT; underlying loader is imported through `three-stdlib` ([verified MIT license](https://github.com/pmndrs/three-stdlib/blob/main/LICENSE)), alongside [Three MIT](https://github.com/mrdoob/three.js/blob/dev/LICENSE). Preserve those notices too. **5 / 5 / 5; low, 1–3 hours.** See [useGLTF](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf).
- Resolve URLs with Vite's base path; original absolute `/assets/...` strings are not portable to every subpath. Reuse geometry/textures, clone only when needed, and dispose only materials owned by the component. Do not blindly copy decoder folders from reference repos; decoder/transcoder licenses must be kept separately if later needed.

### 7. Baking and textures

- Questopia `src/components/Room.tsx`, `src/shaders/baked/{vertex,fragment}.glsl`: day/night mix and RGB light masks; `Images.tsx` demonstrates a simpler unlit baked texture. Bruno `src/Experience/Baked.js`, `assets.js`, shader paths are reference only (no license).
- Choose **one warm daytime bake**, standard unlit materials and a separate lit/dynamic sign; defer GLSL/day-night/Leva entirely. Questopia's main custom shader and camera have close structural similarities to Bruno's code, so their upstream provenance is unresolved here. No copied shader is needed. **Fit 5 / license confidence 5 for our own bake and standard MIT materials / compatibility 5; medium art preparation.** Pipeline details in [BLENDER_PIPELINE.md](BLENDER_PIPELINE.md).

### 8. Loading and performance

- Questopia `Experience.tsx` (`ProgressTracker`, DPR cap), `LoadingScreen.tsx`: MIT; useful progress/ready-state boundaries. Remove artificial readiness delay, blocking intro/Enter gate, `Preload all`, and continuous rendering unless visible animation requires it. **4 / 4 / 5; low, 1–2 hours.**
- Use Suspense + an error boundary, accessible HTML already available while WebGL loads, Drei `useProgress`, capped DPR, demand rendering and only selected preload. [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) explains invalidation and shared resources. Performance budgets in the plan are targets, not reference-repo benchmarks.

### 9. Mobile and keyboard

- Questopia `src/hooks/useDeviceDetect.ts`, CSS media queries and CameraRig touch handlers are partial aids, not complete accessible navigation. Rowobin's `main.js` has mobile framing but no equivalent semantic keyboard layer. No audited repo satisfies the requested keyboard/Quick View contract unchanged.
- Reuse library touch camera controls; keep scene gestures scoped to the canvas. Use HTML buttons/links for the same section actions, visible focus, Enter/Space, Escape, reset/zoom controls and persistent Resume/Contact. This small integration remains necessary custom work. **5 / 5 for platform APIs / 5; medium, 3–5 hours** across modal, fallback and touch checks.

## Dependency/license boundary

Later prototype runtime additions only: `three`, `@react-three/fiber`, `@react-three/drei`; `@types/three` for development. CameraControls comes through Drei; if importing `camera-controls` directly, declare it explicitly instead of relying on a transitive dependency. No additions made now.

Registry metadata checked: fiber 9.8.2 accepts React `>=19 <19.4`; Drei 10.7.9 accepts React 19/fiber 9. Current app React 19.3.1 fits those stated peers. Resolve and pin compatible Three/types versions when implementation begins; this audit did not install or test that combination. Native/Expo peer entries are not an instruction to install mobile-native packages for this browser app.

Licenses verified from first-party files: [fiber MIT](https://github.com/pmndrs/react-three-fiber/blob/master/LICENSE), [Drei MIT](https://github.com/pmndrs/drei/blob/master/LICENSE), [Three MIT](https://github.com/mrdoob/three.js/blob/dev/LICENSE), [camera-controls MIT](https://github.com/yomotsu/camera-controls/blob/master/LICENSE). Preserve complete upstream notices on actual redistribution, and retain transitive package notices. These grants cover those code packages, not portfolio photos, models, fonts, screenshots, or trademark rights.

## Import shortlist

First reuse maintained camera/event/loader helpers; selectively adapt Questopia's `Experience`, `Screens`, `HoverLabels`, `LoadingScreen`, and HTML overlay organization with its MIT notice. About 5–8 thin app-specific modules should suffice; no entire repo transplant. Do not copy the other repos' assets or add multiple animation systems. Continue only with the [small prototype](PROTOTYPE_PLAN.md) after this audit is accepted as direction.

## Implemented camera/loader follow-up — Phase 4C/4D

No additional personal-portfolio code was copied. The existing CameraControls/Drei rig now uses typed named presets in `src/studio/cameraViews.ts` and a disabled visitor controller in `StudioCamera.tsx`; smooth transitions, reset and bounded zoom/orbit metadata are prepared for Phase 5. A native installed Three.js `GLTFLoader` / `DRACOLoader` path replaces the older wrapper because decoder rejection otherwise remained suspended. `modelLoader.ts` uses local decoder assets, two workers, the current versioned model cache key and recoverable retry. Six Playwright tests cover existing actions and this failure/camera contract. Three's MIT and Draco's Apache 2.0 notices are retained. No new npm dependency or animation framework was added.


## Phase 5A reuse applied

The existing Drei 10.7.9 `CameraControls` / exported `CameraControlsImpl` wrapper now drives bounded orthographic orbit, zoom, touch gestures and `setLookAt` / `zoomTo` focus transitions. Installed transitive camera-controls 3.1.2 supplies the underlying MIT implementation. No direct transitive import, dependency addition, downloaded portfolio code, animation framework or asset was introduced. Full retained MIT notices remain in `public/licenses/THIRD_PARTY_NOTICES.txt`. Registry, gesture-intent guards, measured framing and request cancellation are local adaptations; see `src/studio/StudioCamera.tsx`, `interactions.ts`, `cameraViews.ts` and `docs/portfolio/PHASE5A_REPORT.md`.
