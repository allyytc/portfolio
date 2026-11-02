"""Phase 7F bed pass on PortfolioLoft7D: narrower + longer, white sheets, green blanket, plain wood frame (flat-colour materials; original 4D untouched)."""
import bpy
from mathutils import Matrix,Vector
s=bpy.data.scenes['PortfolioLoft7D'];bpy.context.window.scene=s;bpy.context.view_layer.update()
old=bpy.data.scenes.get('LoftBaked7D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
for coll in (bpy.data.images,bpy.data.materials):
    for d in list(coll):
        if d.name.startswith('Loft7D_'):coll.remove(d)
bed=next(o for o in s.objects if o.name.startswith('Tailored sage loft bed') and o.type=='EMPTY' and o.parent and o.parent.get('stable_id')=='LoftBed')
mesh=next(o for o in s.objects if o.name.startswith('Tailored sage loft bed / bed_double_B'))
# classify faces by their atlas colour BEFORE replacing materials
img=bpy.data.images['furniturebits_texture'];W,H=img.size;px=list(img.pixels);uv=mesh.data.uv_layers.active.data
cls=[]
for p in mesh.data.polygons:
    u=sum(uv[l].uv[0] for l in p.loop_indices)/p.loop_total;v=sum(uv[l].uv[1] for l in p.loop_indices)/p.loop_total
    i=(min(H-1,int(v*H))*W+min(W-1,int(u*W)))*4;r,g,b=px[i:i+3]
    cls.append(1 if min(r,g,b)>=.65 and b-r<.25 else 2 if b>r+.12 else 0)
def mat(n,c,r=.85):
    m=bpy.data.materials.new('7F bed '+n);m.use_nodes=True;p=next(x for x in m.node_tree.nodes if x.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=r;return m
mesh.data.materials.clear()
for m in (mat('frame wood',(.30,.17,.08)),mat('sheets white',(.88,.86,.80)),mat('blanket green',(.13,.30,.15))):mesh.data.materials.append(m)
for p,c in zip(mesh.data.polygons,cls):p.material_index=c
# narrower (x) and longer (y), anchored to the back-right corner so the stair landing stays clear
P=Vector((3.49,2.62,2.51));M=Matrix.Translation(P)@Matrix.Diagonal((.73,1.44,1,1))@Matrix.Translation(-P)
bed.matrix_world=M@bed.matrix_world;bpy.context.view_layer.update()
pts=[mesh.matrix_world@Vector(v) for v in mesh.bound_box]
print('faces',{k:cls.count(k) for k in (0,1,2)},'bbox',[round(min(p[i] for p in pts),2) for i in range(3)],[round(max(p[i] for p in pts),2) for i in range(3)])
