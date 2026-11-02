# Phase 4A visual assessment

Local work on `main`, 2026-10-27. Production repository/domain untouched; no publication or deployment. Phase 3 source, web export, implementation files and before screenshots are preserved under `assets/checkpoints/phase3/` with SHA-256 manifest. Original `PortfolioDesk` and default Blender scenes remain intact. The two supplied Phase 4A requests are identical. Latest owner override: the entire chair is black.

## Diagnosis against the approved loft concept

The actual Phase 3 browser screenshot shows a working desk vignette, not reference-quality furniture or a finished room. The gap is a combination of asset quality and rendering, with geometry/silhouette the largest limitation. Improving shadows alone cannot supply the missing loft, detailed foliage, joinery or soft furniture.

- **Geometry:** the Kenney sources are legally clear and useful starting shapes, but the angular cactus, two blade-like floor leaves, polygonal lamp shade and thin monitor read as low-poly. Bevels help edge highlights but cannot fix those silhouettes. The original printer and sign have readable interactions but lack casing seams and crafted frame details.
- **Materials / UVs:** original 768px authored oak is lawful and coherent, but uniform grain and identical bright maps on both oak and “dark edge” materials flatten the furniture. Original UVs are projection-based, not individually art-directed. Cream/sage surfaces need finish variation. Chair is now owner-directed full black, overriding the earlier cream/sage chair.
- **Lighting:** Phase 3 shipped realtime directional shadows and one contact-shadow pass. Its successful desk-only bake probe was not integrated. It therefore lacked full static indirect illumination and consistent soft object contact shading.
- **Color:** Blender used AgX at exposure 0; the browser used ACES at exposure 1.1. Those are different transforms, so the earlier screenshots cannot establish material parity. Phase 4A uses AgX / exposure 1 in Three (equivalent neutral exposure) and AgX / exposure 0 in Blender.
- **Composition:** a large conventional heading separated the scene from navigation. The new layout gives the scene most of the viewport, retains the identity as small HTML metadata, and leaves Projects, Resume and Contact in HTML navigation.
- **Raster quality:** antialiasing and capped DPR are already enabled. Increasing resolution or adding bloom would not resolve missing asset detail. Keep crisp outlines; do not add postprocessing frameworks.

## Refinement strategy and limitations

Adapt existing licensed desk, chair, monitor, lamp, planter and book sources. Add original sign framing, joinery, printer vents/guides and curved botanical inserts. Keep editable geometry and original material/UV data in the refined source scene. Bake static direct + indirect diffuse color to a separate atlas and export that mesh with an unlit material, so browser lights cannot illuminate it twice. Keep monitor, sign, printer and moving paper as independent PBR targets.

This is a reviewable desk upgrade and a separate temporary architectural layout. It does not meet the supplied concept's full furniture or decoration fidelity. Missing approved assets remain: a cohesive upholstered reading nook, detailed loft/rail/stair assets, trailing vines, a verified bunny model, and the later design/community furnishings. No new external models or paid assets are required for this phase; do not promote structural blockout shapes into final furniture.
