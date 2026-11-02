"""Phase 7E world patch on MidnightSpruceWorld7E: warm natural stone, chimney height, rafters under shingles."""
import bpy
from mathutils import Vector,Matrix
s=bpy.data.scenes['MidnightSpruceWorld7E'];bpy.context.window.scene=s;bpy.context.view_layer.update()
cols=[(.36,.31,.25),(.33,.29,.24),(.39,.34,.27),(.30,.27,.22),(.42,.37,.30)]
new=[]
for i,c in enumerate(cols):
    m=bpy.data.materials.new('Midnight 7E warm stone %d'%i);m.use_nodes=True;p=next(x for x in m.node_tree.nodes if x.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.95;new.append(m)
for o in s.objects:
    if o.type!='MESH':continue
    for i,m in enumerate(o.data.materials):
        if m and m.name.startswith('Midnight hearth stone '):o.data.materials[i]=new[int(m.name.split()[-1])]
def zc(o):
    pts=[o.matrix_world@Vector(v) for v in o.bound_box];return sum(p.z for p in pts)/8
for o in list(s.objects):
    if o.name.startswith('Chimney stone') and 'cap' not in o.name and zc(o)>3.6:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
    if o.name.startswith(('Chimney stone cap','Chimney flue pot')):o.matrix_world=Matrix.Translation((0,0,-.42))@o.matrix_world
    if o.name.startswith('Rear timber rafter x'):o.matrix_world=Matrix.Translation((0,0,-.1))@o.matrix_world
bpy.context.view_layer.update();print('patched')
