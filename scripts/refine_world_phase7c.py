"""Refine actual camera discrepancies; source edits only in new Phase 7C scenes."""
import bpy,sys,math,json,random
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
s=bpy.data.scenes['MidnightSpruceWorld'];bpy.context.window.scene=s
for o in s.objects:
 if o.name=='Cookies and Clubs actual canvas':o.location.y=-4.29
 if o.name=='Canvas wooden stretcher':o.location.y=-4.25
 if o.name=='Fireplace':o.location=Vector((-.65,-1.10,0))
 if o.name=='FireEmbers':o.location=Vector((-.65,-1.10,0))
 if o.name.startswith('Back walnut shiplap'):o.location.y=2.73
# A repeatable provenance-preserving directory relocation at the porch entrance.
source=bpy.data.scenes['PortfolioLoft4D'];entrance=next(c for c in source.collection.children if c.name.startswith('Entrance'))
prefixes=('Signpost','Name board','Name sign','Projects board','Projects inset','Projects lettering','Projects subtitle','Bronze sign loop','ABOUT','COMMUNITY','CONTACT','Subtle bunny sign relief')
parents={}
for tag in ['ProjectsSign','AboutSign','CommunitySign','ContactSign']:
 root=bpy.data.objects.new('Porch '+tag,None);root['stable_id']=tag;s.collection.objects.link(root);parents[tag]=root
root=bpy.data.objects.new('Porch directory timber',None);s.collection.objects.link(root)
for old in entrance.objects:
 if old.type not in {'MESH','FONT','CURVE'} or not old.name.startswith(prefixes):continue
 ancestor=old
 while ancestor.parent:ancestor=ancestor.parent
 parent=parents.get(ancestor.get('stable_id'),root)
 cp=old.copy();cp.data=old.data.copy();s.collection.objects.link(cp);cp.parent=None;cp.matrix_world=old.matrix_world.copy();cp.location+=Vector((.9,-2.4,0));cp.parent=parent;cp.name='Relocated directory '+old.name
# Compact web export derived from retained component scene.
exec((ROOT/'scripts/finalize_world_phase7c.py').read_text().split('# Three real imported pine styles;')[0].replace("new('MidnightWorldWeb')","new('MidnightWorldWebRefined')"))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/midnight-spruce-phase7c.blend'))
print('Refined source and additive export saved.')
