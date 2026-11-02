import bpy,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
scene=bpy.data.scenes['DeskBaked4A'];bpy.context.window.scene=scene
scene.cycles.samples=48
started=time.time();bpy.ops.render.render(write_still=True)
result={'image':scene.render.filepath,'seconds':time.time()-started}
