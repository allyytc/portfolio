import bpy,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
scene=bpy.data.scenes.get('LoftBaked4D') or bpy.data.scenes['PortfolioLoft4D'];bpy.context.window.scene=scene
scene.cycles.samples=64;scene.render.filepath=str(ROOT/'docs/portfolio/evidence/phase4d/blender-studio.png')
start=time.time();bpy.ops.render.render(write_still=True)
result={'image':scene.render.filepath,'scene':scene.name,'seconds':time.time()-start}
