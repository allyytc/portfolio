import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];source=bpy.data.scenes['PortfolioLoft4C'];bpy.context.window.scene=source
old=bpy.data.scenes['LoftBaked4C']
for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
bpy.data.scenes.remove(old)
result={'generated4CBakeCleared':True,'editableSourcePreserved':True}
