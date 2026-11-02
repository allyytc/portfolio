"""Phase 7F: split every remaining baked interior part into its own movable top-level group (PortfolioLoft7D copy)."""
import bpy
s=bpy.data.scenes['PortfolioLoft7D'];bpy.context.window.scene=s;bpy.context.view_layer.update()
old=bpy.data.scenes.get('LoftBaked7D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
for coll in (bpy.data.images,bpy.data.materials):
    for d in list(coll):
        if d.name.startswith('Loft7D_'):coll.remove(d)
rules=[('Keyboard',('Cream keycap','Spacebar','KeyboardHousing','Keyboard')),('DeskLamp',('SageDeskLamp',)),('DeskBooks',('DesignBooks',)),('DeskMouse',('Mouse','ComputerMouse')),
 ('LoftRails',('Loft baluster','Loft handrail','Loft lower rail')),('LoftSupports',('Loft support column','Rear structural')),('RearPlasterWall',('Rear plaster wall',)),('LeftReturnWall',('Left rear return','Left wall skirting')),
 ('ConversationBooks',('Conversation book stack',)),('NookBooks',('Reading stack',)),('WindowLedge',('Broad window ledge',)),
 ('HangingPlants',('Loft trailing planter','Loft cascading pothos','Window pothos','Window cascading pothos')),('FloorPlant2',('Floor monstera','Archive monstera')),
 ('Staircase',('Open timber staircase','Stair ')),('LoftBed',('Tailored sage loft bed',)),('WindowBench',('Window reading bench','Nook base oak face')),
 ('WindowWall',('Window ','Exterior sky depth plane','Broad window ledge')),('LoftDeck',('Loft ','Rear structural')),
 ('DesignDesk',('Design desk','Design seat','Design accent')),('SkillsCabinet',('Skills archive cabinet','Archive box')),('ExperienceShelf',('Experience shelf',)),
 ('WallShelf',('Community display shelf','Shelf timber bracket','Wall shelf books')),('CommunityBoard',('Community oak frame','Community cork inset','Pegboard hole','Community plaque')),
 ('FloorCushion',('Soft nook cushion 2',)),('WallClock',('Studio wall clock','Clock ')),('DeskRug',('Rug stitched border',)),('FloorBoards',('Oak floor','Floor foundation')),('Walls',('Rear plaster wall','Left rear return','Left wall skirting'))]
def group_of(o):
    for g,prefixes in rules:
        if o.name.startswith(prefixes):return g
roots=[o for o in s.objects if o.parent is None and o.get('stable_id') in('StudioStatic','SoftFurnishings')]
holder_names={g for g,_ in rules}
cand=[o for o in s.objects if o.type in('MESH','CURVE','FONT','EMPTY') and o.get('stable_id') not in holder_names and o not in roots and not o.name.startswith(('Community_','Camera','Light','Printer','ResumePaper','ProjectsMonitor'))]
holders={}
for g,_ in rules:
    h=next((o for o in s.objects if o.get('stable_id')==g),None)
    if not h:h=bpy.data.objects.new(g,None);s.collection.objects.link(h);h['stable_id']=g
    holders[g]=h
moved={}
for o in cand:
    g=group_of(o)
    if g and not(o.parent and (group_of(o.parent)==g or o.parent.get('stable_id')==g)):
        w=o.matrix_world.copy();o.parent=holders[g];o.matrix_world=w;moved[g]=moved.get(g,0)+1
bpy.context.view_layer.update();print(moved)
rest={}
for r in roots:
    for c in r.children_recursive:
        if c.type=='MESH':rest[r.get('stable_id')]=rest.get(r.get('stable_id'),0)+1
print('left in',rest)
