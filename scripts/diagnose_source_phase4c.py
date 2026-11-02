import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];s=bpy.data.scenes['PortfolioLoft4C'];bpy.context.window.scene=s
s.render.filepath=str(ROOT/'docs/portfolio/evidence/phase4c/blender-source-diagnostic.png');s.cycles.samples=32
bpy.ops.render.render(write_still=True)
result={'image':s.render.filepath}
