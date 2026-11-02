# Desk studio prototype

`Studio.tsx` loads the Blender-authored `public/models/desk-studio.glb`, uses one orthographic CameraControls instance, native R3F hit testing, contextual HTML labels, soft shadows and a separate animated paper node. No visible furniture is constructed from Three.js primitives.

The five semantic export roots are `StudioStatic`, `ProjectsMonitor`, `ProjectsSign`, `PrinterBody`, and `ResumePaper`. Both Projects targets invoke the same callback as the accessible Quick View button; the printer animates the paper before invoking the same Resume panel. HTML content and native dialogs are outside the lazy-loaded WebGL boundary.

Camera orientation is fixed deliberately. Demand rendering runs for camera/paper transitions and settles at idle. Dev-only metrics support local validation; they are not a physical mobile benchmark. Default font/model/texture URLs are local and Vite-base aware.

Editable source: `assets/blender/desk-studio.blend`. Rebuild/export/render scripts and provenance are linked from `docs/portfolio/PHASE3_REPORT.md`. The complete room remains out of scope.
