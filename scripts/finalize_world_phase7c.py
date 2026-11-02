"""Keep full editable source, export merged additions and reusable conifer templates."""
import bpy,bmesh,sys,math,random,json
from pathlib import Path
from mathutils import Vector
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'));from loft_asset_helpers import import_asset
base=ROOT/'assets/source/phase7c';evidence=ROOT/'docs/portfolio/evidence/phase7c';source=bpy.data.scenes['MidnightSpruceWorld'];random.seed(74)
# Correct duplicate preview orientation and remove no source assets.
# Export scene copies preserve source components individually editable.
bpy.context.window.scene=source;source.view_layers[0].update()
s=bpy.data.scenes.new('MidnightWorldWeb');bpy.context.window.scene=s
copies={}
for old in source.objects:
 cp=old.copy()
 if old.data:cp.data=old.data.copy()
 s.collection.objects.link(cp);copies[old]=cp
for old,cp in copies.items():cp.parent=copies.get(old.parent);cp.matrix_local=old.matrix_local.copy()
s.view_layers[0].update()
groups=defaultdict(list)
for old,cp in copies.items():
 if cp.type not in {'MESH','CURVE','FONT'}:continue
 ancestor=old
 while ancestor.parent:ancestor=ancestor.parent
 key=ancestor.get('stable_id') or ancestor.name
 groups[key].append(cp)
for key,members in groups.items():
 bpy.ops.object.select_all(action='DESELECT')
 for cp in members:w=cp.matrix_world.copy();cp.parent=None;cp.matrix_world=w;cp.select_set(True)
 bpy.context.view_layer.objects.active=members[0];bpy.ops.object.convert(target='MESH');bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);bpy.ops.object.join();o=bpy.context.object;o.name=key;o['stable_id']=key
for o in list(s.objects):
 if o.type=='EMPTY':bpy.data.objects.remove(o,do_unlink=True)
# Export principled base texture multiply directly: glTF can represent this without unsupported shader graphs.
for m in {m for o in s.objects if o.type=='MESH' for m in o.data.materials}:
 if not m or not m.use_nodes:continue
 p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if p and m.name.startswith('Midnight'):
  for link in list(p.inputs['Base Color'].links):m.node_tree.links.remove(link)
# Original modeled source plants already have compact embedded palette.
bpy.ops.object.select_all(action='DESELECT')
for o in s.objects:
 if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/midnight-cabin-world.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_image_format='JPEG',export_jpeg_quality=88,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
# Three real imported pine styles; refine bough contours in source instead of constructing cone trees.
trees=bpy.data.scenes.new('MidnightTreeLibrary');bpy.context.window.scene=trees;treeObjects=[];treeStats=[]
for i,name in enumerate(['tree_pineRoundA','tree_pineDefaultB','tree_pineTallA_detailed']):
 r,obs=import_asset(base/'nature-kit/Models/GLTF format'/(name+'.glb'),'Spruce'+str(i),(0,0,0),trees.collection,height=1)
 bpy.ops.object.select_all(action='DESELECT')
 for o in obs:
  if o.type=='MESH':w=o.matrix_world.copy();o.parent=None;o.matrix_world=w;o.select_set(True)
 bpy.context.view_layer.objects.active=next(o for o in obs if o.type=='MESH');bpy.ops.object.join();o=bpy.context.object;bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);o.name='Spruce'+str(i)
 # Small controlled edge variation creates scalloped evergreen boughs, source topology stays editable.
 bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.subdivide_edges(bm,edges=list(bm.edges),cuts=2,use_grid_fill=True)
 for v in bm.verts:
  radius=math.hypot(v.co.x,v.co.y)
  if radius>.035:
   v.co.x*=random.uniform(.94,1.06);v.co.y*=random.uniform(.94,1.06);v.co.z+=random.uniform(-.009,.009)
 bm.to_mesh(o.data);bm.free()
 colors=o.data.color_attributes.new(name='SpruceColors',type='FLOAT_COLOR',domain='CORNER')
 for p in o.data.polygons:
  z=sum(o.data.vertices[v].co.z for v in p.vertices)/len(p.vertices)
  radius=max(math.hypot(o.data.vertices[v].co.x,o.data.vertices[v].co.y) for v in p.vertices)
  bark=z<.27 and radius<.10
  color=(.14,.075,.037,1) if bark else (.065+random.random()*.025,.17+random.random()*.045,.125+random.random()*.035,1)
  for li in p.loop_indices:colors.data[li].color=color
  p.use_smooth=False
 m=bpy.data.materials.new('Spruce vertex palette '+str(i));m.use_nodes=True;p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Roughness'].default_value=.95;n=m.node_tree.nodes.new('ShaderNodeVertexColor');n.layer_name='SpruceColors';m.node_tree.links.new(n.outputs['Color'],p.inputs['Base Color']);o.data.materials.clear();o.data.materials.append(m)
 for p in o.data.polygons:p.material_index=0
 treeObjects.append(o);o.data.calc_loop_triangles();treeStats.append({'source':name,'webNode':o.name,'triangles':len(o.data.loop_triangles),'sourceRefinement':'subdivided irregular bough contours, vertex palette; no alpha textures'})
bpy.ops.object.select_all(action='DESELECT')
for o in treeObjects:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/midnight-spruce-trees.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_draco_mesh_compression_enable=True)
# Documented small world: shared models, clear front approach and camera corridors.
layout=[]
for i,(x,y,h) in enumerate([(-8.2,-1.8,4.8),(-7.8,1.3,5.8),(-6.8,4.5,6.4),(-4.9,5.7,5.8),(-2.3,6.2,6.6),(.3,6.8,7.0),(2.9,6.3,6.1),(5.4,5.4,6.4),(6.9,3.3,5.6),(7.9,.8,5.1),(8.8,-1.9,3.9),(-9.5,3.8,6.8),(-7.9,7.2,6.2),(-4.3,8.5,7.5),(-.6,9,7.8),(3.3,9.1,7.1),(7.2,7.5,6.7),(9.8,4.5,6.9),(-8.6,-5.8,2.7),(7.6,-5.1,2.2)]):
 layout.append({'kind':i%3,'position':[x,-.34,-y],'height':h,'rotation':round(i*2.399,3),'background':i>=11 and i<18})
(ROOT/'src/studio/forestLayout.json').write_text(json.dumps(layout,indent=2));(evidence/'tree-refinement.json').write_text(json.dumps(treeStats,indent=2))
# Actual Blender preview uses the same interior export scene and same added geometry.
preview=bpy.data.scenes.new('MidnightSprucePreview');bpy.context.window.scene=preview
for old in list(source.objects)+list(bpy.data.scenes['LoftBaked4D'].objects):
 if old.type not in {'MESH','CURVE','FONT'}:continue
 cp=old.copy();preview.collection.objects.link(cp);cp.parent=None;cp.matrix_world=old.matrix_world.copy()
for placement in layout:
 old=treeObjects[placement['kind']];cp=old.copy();preview.collection.objects.link(cp);cp.location=(placement['position'][0],-placement['position'][2],-.34);cp.scale=(placement['height'],)*3;cp.rotation_euler.z=placement['rotation']
preview.world=source.world.copy()
for p,power,color,size in [((-3,-6,8),950,(1,.70,.39),6),((2,5,9),1600,(.37,.65,.78),7),((-5,-3,3),95,(1,.53,.21),2),((2.7,1.0,1.1),65,(1,.32,.08),1)]:
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.color=color;o.data.size=size;o.rotation_euler=(Vector((0,0,1.4))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(11,-17,12));cam=bpy.context.object;cam.rotation_euler=(Vector((-.65,-.4,1.35))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=16;preview.camera=cam
preview.render.engine='CYCLES';preview.cycles.samples=32;preview.cycles.use_denoising=True;preview.render.resolution_x=1600;preview.render.resolution_y=1050;preview.render.resolution_percentage=100;preview.render.image_settings.file_format='PNG';preview.render.filepath=str(evidence/'blender-midnight-world.png');preview.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/midnight-spruce-phase7c.blend'));bpy.ops.render.render(write_still=True)
print({'worldBytes':(ROOT/'public/models/midnight-cabin-world.glb').stat().st_size,'treeBytes':(ROOT/'public/models/midnight-spruce-trees.glb').stat().st_size,'trees':treeStats})
