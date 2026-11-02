"""Phase 7D patch 2 on PortfolioLoft7D: extend left wall for the hearth, clear the doorway, unify fabric colours, discard the first bake."""
import bpy
from mathutils import Vector, Matrix
s=bpy.data.scenes['PortfolioLoft7D'];src=bpy.data.scenes['PortfolioLoft4D']
# discard the first bake (source scene stays)
old=bpy.data.scenes.get('LoftBaked7D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
for coll in (bpy.data.images,bpy.data.materials):
    for d in list(coll):
        if d.name.startswith('Loft7D_'):coll.remove(d)
def by_src(name):
    return next(o for o in s.objects if o.name.startswith(name.rsplit('.',1)[0]) and o.get('x') is None and o.type!='EMPTY' or o.name==name)
def find(prefix):
    return [o for o in s.objects if o.name.split('.')[0]==prefix.split('.')[0] and o.name.startswith(prefix.split('.')[0])]
wall=next(o for o in s.objects if o.name.startswith('Left rear return'));skirt=next(o for o in s.objects if o.name.startswith('Left wall skirting'))
# Extend the existing plaster return wall forward to y=-2.0 (door opening to the porch stays at the front).
for o,y0,y1 in((wall,.77,-2.0),(skirt,.79,-1.98)):
    c=o.copy();c.data=o.data.copy();s.collection.objects.link(c);c.parent=o.parent;c.matrix_parent_inverse=o.matrix_parent_inverse.copy();c.matrix_basis=o.matrix_basis.copy()
    pts=[o.matrix_world@Vector(v) for v in o.bound_box];ylo=min(p.y for p in pts);yhi=max(p.y for p in pts)
    k=(y0-y1)/(yhi-ylo);pivot=Vector((0,ylo,0))
    # new segment: from y1..y0, same length ratio, aligned with the original's front edge
    c.matrix_world=Matrix.Translation((0,y0-(ylo+ (yhi-ylo)*k)  if False else 0,0))@c.matrix_world
    c.matrix_world=Matrix.Translation((0,ylo,0))@Matrix.Diagonal((1,k,1,1))@Matrix.Translation((0,-ylo,0))@c.matrix_world
    c.matrix_world=Matrix.Translation((0,y1-ylo,0))@c.matrix_world
    c.name=o.name+' hearth extension'
# Clear the porch doorway: monstera moves beside the hearth wall.
pl=next(o for o in s.objects if o.name.startswith('Entrance monstera'))
top=pl
pl.matrix_world=Matrix.Translation((0,2.35,0))@pl.matrix_world
# Palette: deeper sage / walnut fabrics on copies, so the original 4D materials stay untouched.
tints={'Loft_Sage fabric.003':(.11,.20,.15),'Loft_Muted blush.003':(.30,.17,.12),'Loft_Warm ivory.003':(.62,.58,.47)}
cache={}
for o in s.objects:
    if o.type!='MESH':continue
    for i,m in enumerate(o.data.materials):
        if m and m.name in tints:
            if m.name not in cache:
                n=m.copy();n.name='7D '+m.name
                bsdf=next(x for x in n.node_tree.nodes if x.type=='BSDF_PRINCIPLED');bsdf.inputs['Base Color'].default_value=(*tints[m.name],1);cache[m.name]=n
            o.data.materials[i]=cache[m.name]
bpy.context.view_layer.update()
print('patched',len(s.objects))
