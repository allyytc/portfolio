"""Phase 7F: split roof geometry out of CabinArchitecture/AttachedArtPorch into movable top-level groups (MidnightSpruceWorld7E copy)."""
import bpy
s=bpy.data.scenes['MidnightSpruceWorld7E'];bpy.context.window.scene=s;bpy.context.view_layer.update()
rules=[('CabinRoof',('Roof ','Rear timber rafter x','Rear ridge timber','Visible roof fascia')),('PorchRoof',('Porch roof','Porch rafter'))]
holders={}
for g,_ in rules:
    h=next((o for o in s.objects if o.get('stable_id')==g),None)
    if not h:h=bpy.data.objects.new(g,None);s.collection.objects.link(h);h['stable_id']=g
    holders[g]=h
moved={}
for o in list(s.objects):
    for g,prefixes in rules:
        if o.name.startswith(prefixes) and o.type in('MESH','EMPTY') and o.parent is not holders[g]:
            w=o.matrix_world.copy();o.parent=holders[g];o.matrix_world=w;moved[g]=moved.get(g,0)+1;break
bpy.context.view_layer.update();print(moved)
