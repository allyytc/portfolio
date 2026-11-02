"""Phase 7F: porch roof pitch fix. Rows, underlay and barge boards were rotated the wrong way about Y (opposite slope), exposing the underlay."""
import bpy
s=bpy.data.scenes['MidnightSpruceWorld7E'];bpy.context.window.scene=s;n=0
for o in s.objects:
    if o.name.startswith(('Porch roof shingle row','Porch roof underlay','Porch roof barge')) and o.rotation_euler.y>0:
        o.rotation_euler.y=-o.rotation_euler.y;n+=1
bpy.context.view_layer.update();print('flipped',n)
