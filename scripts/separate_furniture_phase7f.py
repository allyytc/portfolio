"""Phase 7F: split baked furniture into independently movable top-level groups on PortfolioLoft7D (original 4D scene untouched).
The existing bake pipeline exports every top-level stable_id group as its own node."""
import bpy
s=bpy.data.scenes['PortfolioLoft7D'];bpy.context.window.scene=s;bpy.context.view_layer.update()
old=bpy.data.scenes.get('LoftBaked7D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
for coll in (bpy.data.images,bpy.data.materials):
    for d in list(coll):
        if d.name.startswith('Loft7D_'):coll.remove(d)
rules=[('DeskPlant',('Desk monstera',)),('DeskChair',('Caster','Chair ','Black stitched seat','SageChair','Twin caster')),
 ('Desk',('OakDesk','Desk ','Desktop','Cream keycap','Keyboard','Drawer','DesignBooks','SageDeskLamp','Mouse','Desk drawer','Spacebar')),
 ('DeskRug',('Woven chair rug',)),('ReadingRug',('Seating woven rug',)),('ReadingArmchair',('Rounded sage lounge chair',)),
 ('ConversationTable',('Conversation low table','Conversation book stack')),('ReadingLamp',('Reading lamp',)),('NookSideTable',('Nook side table','Reading stack')),
 ('EntrancePlant',('Entrance monstera',))]
def group_of(o):
    for g,prefixes in rules:
        if o.name.startswith(prefixes):return g
def top(o):
    while o.parent:o=o.parent
    return o
roots=[o for o in s.objects if o.parent is None and o.get('stable_id') in('StudioStatic','SoftFurnishings')]
cand=[c for r in roots for c in r.children_recursive]
holders={}
for g,_ in rules:
    e=bpy.data.objects.new(g,None);s.collection.objects.link(e);e['stable_id']=g;holders[g]=e
moved={}
for o in cand:
    g=group_of(o)
    if g and not(o.parent and group_of(o.parent)==g):
        w=o.matrix_world.copy();o.parent=holders[g];o.matrix_world=w;moved[g]=moved.get(g,0)+1
bpy.context.view_layer.update();print(moved)
