"""Rebuild the 7E fireplace with clipped masonry and stack-sized backing."""
import bpy,math,random
from pathlib import Path
from mathutils import Vector
ROOT=Path('/Users/ally/Github/portfolio')
s=bpy.data.scenes['MidnightSpruceWorld7E'];bpy.context.window.scene=s
hearth=next(o for o in s.objects if o.name.split('.')[0]=='Fireplace' and o.type=='EMPTY');flames=next(o for o in s.objects if o.name.split('.')[0]=='FireEmbers' and o.type=='EMPTY')
for o in list(hearth.children_recursive)+list(flames.children_recursive):bpy.data.objects.remove(o,do_unlink=True)
def M(n):return bpy.data.materials['Midnight '+n]
wood,dark,char=M('warm walnut'),M('weathered dark timber'),M('firebox');mortar=bpy.data.materials['Midnight 7E mortar shadow'];ember=[M('ember '+str(i)) for i in range(5)]
def box(n,p,d,m,parent,bevel=.012,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.rotation_euler=rot;o.parent=parent;o.data.materials.append(m)
    if bevel:b=o.modifiers.new('Edge','BEVEL');b.width=bevel;b.segments=2
    return o
def cyl(n,p,r,h,m,parent,verts=14):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=h,location=p);o=bpy.context.object;o.name=n;o.parent=parent;o.data.materials.append(m)
    for q in o.data.polygons:q.use_smooth=True
    return o
exec((ROOT/'scripts/fireplace_phase7e.py').read_text())
bpy.context.view_layer.update();print('fireplace rebuilt')
