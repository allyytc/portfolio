"""Phase 7F: split the remaining merged world parts into movable top-level groups (MidnightSpruceWorld7E copy)."""
import bpy
s=bpy.data.scenes['MidnightSpruceWorld7E'];bpy.context.window.scene=s;bpy.context.view_layer.update()
for o in s.objects:
    if o.parent is None and o.type=='EMPTY' and o.name.split('.')[0] in('CabinArchitecture','AttachedArtPorch','CabinDetails','ForestGround') and not o.get('stable_id'):o['stable_id']=o.name.split('.')[0]
rules=[('PorchBoards',('Porch continuous deck board','Porch joist')),('PorchFascia',('Porch front fascia','Porch outer fascia','Porch rear fascia')),('PorchPosts',('Porch post',)),
 ('PorchBeams',('Porch wall ledger','Porch outer beam','Porch front beam','Porch rear beam','Porch outer brace')),('PorchRails',('Porch outer top rail','Porch rear top rail','Porch outer baluster','Porch rear baluster')),('PorchSteps',('Porch entry step',)),
 ('RoofShingles',('Roof shingle row','Roof underlay')),('RoofRafters',('Rear timber rafter x',)),('RoofTrim',('Roof eave','Roof ridge cap','Roof barge','Rear ridge timber','Visible roof fascia')),
 ('PorchRoofShingles',('Porch roof shingle','Porch roof underlay')),('PorchRoofFrame',('Porch roof drip','Porch roof barge','Porch rafter')),
 ('Chimney',('Chimney stone','Chimney flue','Chimney stack mortar')),('HearthMantel',('Walnut hearth mantel','Hearth stone corbel')),
 ('PaintSupplies',('Paint jar','Paint pigment','Jar brass lid','Brush ','Brush jar')),('PorchLanternLamp',('Porch lantern',)),('PorchStringLights',('Porch string',)),
 ('PorchSupplyTable',('Porch supply table','Paint jar','Paint pigment','Jar brass lid','Brush ','Brush jar')),('PorchFern',('Porch plant pot','Porch fern frond')),
 ('PorchStool',('Porch oak stool',)),('PorchSketchbook',('Porch source sketchbook',)),('BackWall',('Back walnut shiplap','Walnut corner upright')),
 ('FloorFascia',('Deep front floor fascia','Doorway threshold')),('LeftWallFrame',('Cabin left wall timber cap','Cabin doorway jamb','Cabin doorway header'))]
def group_of(o):
    for g,prefixes in rules:
        if o.name.startswith(prefixes):return g
holders={}
for g,_ in rules:
    h=next((o for o in s.objects if o.get('stable_id')==g),None)
    if not h:h=bpy.data.objects.new(g,None);s.collection.objects.link(h);h['stable_id']=g
    holders[g]=h
moved={}
for o in list(s.objects):
    g=group_of(o)
    if g and o.parent is not holders[g] and not(o.parent and group_of(o.parent)==g):
        w=o.matrix_world.copy();o.parent=holders[g];o.matrix_world=w;moved[g]=moved.get(g,0)+1
bpy.context.view_layer.update();print(moved)
