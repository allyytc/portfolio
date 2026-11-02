import bpy,sys,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from loft_asset_helpers import import_asset
scene=bpy.data.scenes.new('AssetReview4D');bpy.context.window.scene=scene
col=bpy.data.collections.new('Selected CC0 assets — review');scene.collection.children.link(col)
kit=ROOT/'assets/source/kaykit-furniture-bits/Assets/gltf';plants=ROOT/'assets/source/tiny-treats-house-plants/Assets/gltf'
stats=[]
for file,n,p,dim in [(kit/'bed_double_B.gltf','KayKit bed',(-2,1,0),(2.2,1.4,.7)),(kit/'armchair.gltf','KayKit armchair',(.1,1,0),(.85,.85,.9)),(plants/'monstera_plant_large_potted.gltf','Tiny Treats monstera',(1.7,1,0),None),(plants/'pothos_plant_small_potted.gltf','Tiny Treats pothos',(.1,-.3,0),None)]:
    r,obs=import_asset(file,n,p,col,dims=dim,height=.85 if dim is None else None)
    stats.append({'file':str(file),'meshes':len([o for o in obs if o.type=='MESH']),'triangles':sum(len(o.data.polygons) for o in obs if o.type=='MESH')})
world=bpy.data.worlds.new('Asset review environment');world.use_nodes=True;world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.8,.8,.75,1);world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.7;scene.world=world
d=bpy.data.lights.new('Review softbox','AREA');d.energy=600;d.size=5;o=bpy.data.objects.new('Review softbox',d);col.objects.link(o);o.location=(-3,-4,7);o.rotation_euler=(Vector((0,0,.4))-o.location).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('Asset review camera');o=bpy.data.objects.new('Asset review camera',d);col.objects.link(o);o.location=(6,-9,7);o.rotation_euler=(Vector((-.3,.7,.45))-o.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=6.7;scene.camera=o
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True;scene.view_settings.view_transform='AgX';scene.render.film_transparent=True;scene.render.resolution_x=1500;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
out=ROOT/'docs/portfolio/evidence/phase4d';out.mkdir(parents=True,exist_ok=True);scene.render.filepath=str(out/'selected-asset-review.png');bpy.ops.render.render(write_still=True)
(out/'selected-asset-review.json').write_text(json.dumps(stats,indent=2));result={'image':scene.render.filepath,'assets':stats}
