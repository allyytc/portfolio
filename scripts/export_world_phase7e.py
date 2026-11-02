"""Export MidnightSpruceWorld7E to public/models/midnight-cabin-world-7e.glb (same merge/export path as Phase 7C). Original world GLB is kept."""
import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
code=(ROOT/'scripts/finalize_world_phase7c.py').read_text().split('# Three real imported pine styles;')[0]
code=code.replace("bpy.data.scenes['MidnightSpruceWorld']","bpy.data.scenes['MidnightSpruceWorld7E']").replace("new('MidnightWorldWeb')","new('MidnightWorldWeb7E')").replace("midnight-cabin-world.glb","midnight-cabin-world-7e.glb")
exec(code)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/midnight-spruce-phase7e.blend'),copy=True)
print('7E world exported')
