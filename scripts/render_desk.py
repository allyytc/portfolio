import bpy
import time
scene = bpy.data.scenes['PortfolioDesk']
bpy.context.window.scene = scene
started = time.monotonic()
bpy.ops.render.render(write_still=True)
result = {'image': scene.render.filepath, 'seconds': round(time.monotonic() - started, 2)}
