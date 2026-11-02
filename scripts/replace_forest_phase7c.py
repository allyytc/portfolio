"""Real Quaternius pines, licensed via creator's Poly Pizza listing. No generated cones."""
import bpy,sys,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'docs/portfolio/evidence/phase7c'
s=bpy.data.scenes.new('QuaterniusPineComparison');bpy.context.window.scene=s
before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/source/phase7c/quaternius-pine-trees.glb'));obs=set(bpy.data.objects)-before;bpy.context.view_layer.update()
selected=[];stats=[]
for i,variant in enumerate(['PineTree_1','PineTree_3','PineTree_5']):
 o=next(o for o in obs if o.name.startswith(variant) and o.type=='MESH');w=o.matrix_world.copy();o.parent=None;o.matrix_world=w
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
 lo=Vector([min(v.co[a] for v in o.data.vertices) for a in range(3)]);hi=Vector([max(v.co[a] for v in o.data.vertices) for a in range(3)]);height=hi.z-lo.z;center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
 for v in o.data.vertices:v.co=(v.co-center)/height
 o.location=(i*2.1,0,0);o.name='Spruce'+str(i);o['source_variant']=variant
 for m in o.data.materials:
  if not m or not m.use_nodes:continue
  p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
  if p:p.inputs['Roughness'].default_value=.95
  for n in list(m.node_tree.nodes):
   if n.type=='NORMAL_MAP':
    for link in list(n.outputs[0].links):m.node_tree.links.remove(link)
   if n.type=='TEX_IMAGE' and n.image:
    # Source file remains unmodified; packed web derivative only.
    im=n.image.copy();n.image=im
    if max(im.size)>1024:im.scale(max(1,int(im.size[0]*1024/max(im.size))),max(1,int(im.size[1]*1024/max(im.size))))
    im.pack()
 selected.append(o);o.data.calc_loop_triangles();stats.append({'node':o.name,'source':variant,'triangles':len(o.data.loop_triangles),'materials':len(o.data.materials)})
for o in list(obs):
 if o not in selected:bpy.data.objects.remove(o,do_unlink=True)
# Actual second comparison render, with textured creator geometry.
s.world=bpy.data.worlds.new('Pine comparison world');s.world.use_nodes=True;next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.11,.16,.15,1)
bpy.ops.object.camera_add(location=(5,-7,4));cam=bpy.context.object;cam.rotation_euler=(Vector((2,.1,.5))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=6.5;s.camera=cam
bpy.ops.object.light_add(type='AREA',location=(1,-4,6));bpy.context.object.data.energy=700;bpy.context.object.data.size=5
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1300;s.render.resolution_y=700;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(out/'quaternius-pine-comparison.png');s.view_settings.view_transform='AgX';bpy.ops.render.render(write_still=True)
# Template export at origin; instancing applies documented world placements.
for o in selected:o.location=(0,0,0)
bpy.ops.object.select_all(action='DESELECT')
for o in selected:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/midnight-spruce-trees.glb'),export_format='GLB',use_active_scene=True,use_selection=True,export_apply=True,export_extras=True,export_image_format='AUTO',export_draco_mesh_compression_enable=True)
(out/'quaternius-pines.json').write_text(json.dumps({'sourceURL':'https://poly.pizza/m/w8ZaiYjK8C','creator':'Quaternius','license':'CC0-1.0','actualDownloadedGLBBytes':(ROOT/'assets/source/phase7c/quaternius-pine-trees.glb').stat().st_size,'exportBytes':(ROOT/'public/models/midnight-spruce-trees.glb').stat().st_size,'variants':stats,'normalMaps':'disconnected for small forest props','maxTexture':1024},indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/midnight-spruce-phase7c.blend'));print(stats)
