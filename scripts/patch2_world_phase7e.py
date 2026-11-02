"""Phase 7E world patch 2: roof lifted clear of the back wall/beams, old rafters removed, stone warmed."""
import bpy
from mathutils import Matrix
s=bpy.data.scenes['MidnightSpruceWorld7E'];bpy.context.window.scene=s;bpy.context.view_layer.update()
for o in list(s.objects):
    if o.name.startswith('Rear timber rafter.'):bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
    if o.name.startswith(('Roof ','Rear timber rafter x','Rear ridge timber','Visible roof fascia')):o.matrix_world=Matrix.Translation((0,0,.3))@o.matrix_world
warm=[(.52,.42,.30),(.47,.39,.29),(.56,.46,.33),(.42,.36,.27),(.60,.50,.37)]
for i,c in enumerate(warm):
    m=bpy.data.materials['Midnight 7E warm stone %d'%i];next(x for x in m.node_tree.nodes if x.type=='BSDF_PRINCIPLED').inputs['Base Color'].default_value=(*c,1)
bpy.context.view_layer.update();print('ok')
