"""Non-destructive, real imported candidate comparison in live Blender."""
import bpy,sys,math,json,time
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from loft_asset_helpers import import_asset
s=bpy.data.scenes.new('MidnightAssetComparison');bpy.context.window.scene=s;c=s.collection
s.world=bpy.data.worlds.new('Comparison studio');s.world.use_nodes=True;next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.13,.17,.17,1)
base=ROOT/'assets/source/phase7c';stats=[]
def asset(pack,file,name,p,dims):
 folder={'nature-kit':'GLTF format','modular-buildings':'GLB format','survival-kit':'GLB format','fantasy-town-kit':'GLB format'}[pack]
 r,obs=import_asset(base/pack/'Models'/folder/(file+'.glb'),name,p,c,dims=dims)
 tris=0
 for o in obs:
  if o.type=='MESH':o.data.calc_loop_triangles();tris+=len(o.data.loop_triangles)
 stats.append({'name':name,'file':str((base/pack/'Models'/folder/(file+'.glb')).relative_to(ROOT)),'triangles':tris})
 return r,obs
asset('survival-kit','structure','A Survival timber frame',(-4,0,0),(2.6,2,2))
asset('survival-kit','structure-roof','A Survival roof',(-4,0,2),(2.9,2.4,.9))
asset('fantasy-town-kit','wall-wood-window-small','B Timber window',(0,.3,0),(2.5,.25,2.5))
asset('fantasy-town-kit','roof','B Town roof',(0,.3,2.5),(2.8,2,.8)) if (base/'fantasy-town-kit/Models/GLB format/roof.glb').exists() else None
asset('modular-buildings','building-sample-house-a','C Urban modular',(4,0,0),(2.8,2.4,3))
for i,n in enumerate(['tree_pineTallA_detailed','tree_pineRoundA','tree_pineDefaultB']):asset('nature-kit',n,'Tree '+str(i+1),(-4+i*4,5,0),(2.2,2.2,3.8))
bpy.ops.wm.obj_import(filepath=str(base/'easel/Easel/Easel.obj'),forward_axis='NEGATIVE_Y',up_axis='Z');e=bpy.context.object;e.name='Plaggy Easel comparison'
# Normalize the actual sculpted easel for visual inspection.
bpy.context.view_layer.update();lo=Vector([min((e.matrix_world@Vector(v))[i] for v in e.bound_box) for i in range(3)]);hi=Vector([max((e.matrix_world@Vector(v))[i] for v in e.bound_box) for i in range(3)]);e.scale*=2.2/(hi.z-lo.z);bpy.context.view_layer.update();lo2=Vector([min((e.matrix_world@Vector(v))[i] for v in e.bound_box) for i in range(3)]);hi2=Vector([max((e.matrix_world@Vector(v))[i] for v in e.bound_box) for i in range(3)]);e.location-=Vector(((lo2.x+hi2.x)/2,(lo2.y+hi2.y)/2,lo2.z));e.location+=Vector((0,-3,0))
for i,txt in enumerate(['A · Survival timber','B · Fantasy Town','C · Urban modular']):
 curve=bpy.data.curves.new(txt,'FONT');curve.body=txt;curve.size=.27;ob=bpy.data.objects.new(txt,curve);c.objects.link(ob);ob.location=(-5+i*4,-1.6,.03)
bpy.ops.object.camera_add(location=(10,-17,13));cam=bpy.context.object;cam.rotation_euler=(Vector((0,1.5,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=16;s.camera=cam
for p,power,size in [((1,-4,10),1700,8),((-5,4,8),1200,6)]:bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1500;s.render.resolution_y=1000;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(ROOT/'docs/portfolio/evidence/phase7c/asset-comparison.png');s.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/phase7c-asset-comparison.blend'));bpy.ops.render.render(write_still=True)
(ROOT/'docs/portfolio/evidence/phase7c/asset-comparison.json').write_text(json.dumps(stats,indent=2));print(stats)
