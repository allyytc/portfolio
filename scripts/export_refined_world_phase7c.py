import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
exec((ROOT/'scripts/finalize_world_phase7c.py').read_text().split('# Three real imported pine styles;')[0].replace("new('MidnightWorldWeb')","new('MidnightWorldWebFinal')"))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/midnight-spruce-phase7c.blend'))
