"""Shared atlas for fixed zones, separate selectable meshes, three dynamic parts."""
import bpy,math,json,time
from pathlib import Path
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1];evidence=ROOT/'docs/portfolio/evidence/phase4c'
source=bpy.data.scenes['PortfolioLoft4C']
if bpy.data.scenes.get('LoftBaked4C'):raise RuntimeError('Existing bake preserved. Explicitly archive before rebuilding.')
scene=bpy.data.scenes.new('LoftBaked4C');bpy.context.window.scene=scene;copies={};groups=defaultdict(list)
for o in source.objects:
    cp=o.copy()
    if o.data:cp.data=o.data.copy()
    scene.collection.objects.link(cp);copies[o]=cp
for o,cp in copies.items():
    cp.parent=copies.get(o.parent);cp.matrix_local=o.matrix_local.copy()
    if o.type in {'MESH','FONT','CURVE'}:
        ancestor=o
        while ancestor.parent:ancestor=ancestor.parent
        group=ancestor.get('stable_id','StudioStatic');groups[group].append(cp)
scene.world=source.world.copy();scene.camera=copies[source.camera]
scene.render.engine='CYCLES';scene.cycles.samples=96;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX';scene.view_settings.look='None'
scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG'
bpy.context.view_layer.update();merged={}
for name,members in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for cp in members:
        world=cp.matrix_world.copy();cp.parent=None;cp.matrix_world=world;cp.select_set(True)
    bpy.context.view_layer.objects.active=members[0]
    bpy.ops.object.convert(target='MESH');bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);bpy.ops.object.join()
    obj=bpy.context.object;obj.name=name;obj['stable_id']=name
    if name=='StudioStatic':
        decimate=obj.modifiers.new('Measured web geometry reduction','DECIMATE')
        decimate.ratio=.74;decimate.use_collapse_triangulate=True
        bpy.context.view_layer.objects.active=obj
        bpy.ops.object.modifier_apply(modifier=decimate.name)
    # Freeze the same triangles/normals for bake and later atlas reconstruction.
    triangulate=obj.modifiers.new('Bake/export identical triangle topology','TRIANGULATE')
    bpy.context.view_layer.objects.active=obj
    bpy.ops.object.modifier_apply(modifier=triangulate.name)
    if obj.data.has_custom_normals:
        obj.data.normals_split_custom_set([(0,0,0)]*len(obj.data.loops))
    merged[name]=obj
for o in list(scene.objects):
    if o.type=='EMPTY':bpy.data.objects.remove(o,do_unlink=True)
dynamic={'ProjectsMonitor','PrinterBody','ResumePaper'};fixed=[(n,o) for n,o in merged.items() if n not in dynamic]
# Attribute survives Blender join, allowing atlas islands to be split back by ID.
for i,(n,o) in enumerate(fixed):
    attr=o.data.attributes.new('zone_id','INT','FACE')
    for v in attr.data:v.value=i
    for m in o.data.materials:
        if m and m.use_nodes:
            for node in list(m.node_tree.nodes):
                if node.type=='TEX_IMAGE' and not node.inputs['Vector'].is_linked:
                    uv=m.node_tree.nodes.new('ShaderNodeUVMap');uv.uv_map='SurfaceUV';m.node_tree.links.new(uv.outputs['UV'],node.inputs['Vector'])
    if o.data.uv_layers:o.data.uv_layers[0].name='SurfaceUV'
bpy.ops.object.select_all(action='DESELECT')
for _,o in fixed:o.select_set(True)
bpy.context.view_layer.objects.active=fixed[0][1];bpy.ops.object.join();atlas_obj=bpy.context.object;atlas_obj.name='AtlasBakeWorking'
uv=atlas_obj.data.uv_layers.new(name='LoftBakeUV');atlas_obj.data.uv_layers.active=uv;uv.active_render=True
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(70),island_margin=.002,area_weight=.8,correct_aspect=True);bpy.ops.object.mode_set(mode='OBJECT')
image=bpy.data.images.new('Loft4C_BakedDiffuse',width=4096,height=4096,alpha=False);image.colorspace_settings.name='sRGB'
for m in atlas_obj.data.materials:
    if m and m.use_nodes:
        node=m.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;m.node_tree.nodes.active=node
paper=merged['ResumePaper'];paper.hide_render=True
scene.render.bake.use_pass_color=True;scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.margin=24
start=time.time();bpy.ops.object.bake(type='DIFFUSE',uv_layer='LoftBakeUV');seconds=time.time()-start;paper.hide_render=False
image.filepath_raw=str(ROOT/'assets/blender/textures/loft4c-static-baked.png');image.file_format='PNG';image.save();image.pack()
mat=bpy.data.materials.new('Loft4C_Baked_Unlit');mat.use_nodes=True;nodes=mat.node_tree.nodes;nodes.clear();links=mat.node_tree.links
tex=nodes.new('ShaderNodeTexImage');tex.image=image;emit=nodes.new('ShaderNodeEmission');out=nodes.new('ShaderNodeOutputMaterial');lp=nodes.new('ShaderNodeLightPath');mix=nodes.new('ShaderNodeMixShader');trans=nodes.new('ShaderNodeBsdfTransparent')
links.new(tex.outputs['Color'],emit.inputs['Color']);links.new(lp.outputs['Is Camera Ray'],mix.inputs[0]);links.new(trans.outputs[0],mix.inputs[1]);links.new(emit.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],out.inputs['Surface'])
# Reconstitute each named fixed destination with its unique atlas UVs.
mesh=atlas_obj.data;ids=mesh.attributes['zone_id'];uvs=mesh.uv_layers['LoftBakeUV'];by_id=defaultdict(list)
for p in mesh.polygons:by_id[ids.data[p.index].value].append(p)
outputs={n:o for n,o in merged.items() if n in dynamic}
for i,(name,_) in enumerate(fixed):
    polys=by_id[i];oldverts=sorted({v for p in polys for v in p.vertices});mapping={v:j for j,v in enumerate(oldverts)}
    me=bpy.data.meshes.new(name+' baked geometry');me.from_pydata([mesh.vertices[v].co for v in oldverts],[],[tuple(mapping[v] for v in p.vertices) for p in polys]);me.materials.append(mat);layer=me.uv_layers.new(name='LoftBakeUV')
    for old,new in zip(polys,me.polygons):
        new.use_smooth=old.use_smooth
        for src,dst in zip(old.loop_indices,new.loop_indices):layer.data[dst].uv=uvs.data[src].uv
    obj=bpy.data.objects.new(name,me);scene.collection.objects.link(obj);obj['stable_id']=name;obj['baked']=True;outputs[name]=obj
bpy.data.objects.remove(atlas_obj,do_unlink=True)
stats=[];bpy.ops.object.select_all(action='DESELECT')
for name,obj in outputs.items():
    obj.select_set(True);obj.data.calc_loop_triangles();stats.append({'node':name,'triangles':len(obj.data.loop_triangles),'materials':len(obj.data.materials),'baked':name not in dynamic})
    if name in {'ProjectsMonitor','ProjectsSign'}:obj['action']='projects'
    elif name in {'PrinterBody','ResumePaper'}:obj['action']='resume'
    else:obj['phase5_target']=True
path=ROOT/'public/models/loft-studio-v4c.glb'
bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_yup=True,export_cameras=False,export_lights=False,export_image_format='JPEG',export_jpeg_quality=90,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_draco_position_quantization=16,export_draco_normal_quantization=12,export_draco_texcoord_quantization=14)
scene.render.filepath=str(evidence/'blender-studio.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4c.blend'))
(evidence/'bake-export.json').write_text(json.dumps({'atlas':[4096,4096],'samples':96,'seconds':seconds,'pass':'DIFFUSE COLOR DIRECT INDIRECT','padding':24,'triangulatedBeforeBake':True,'dynamic':sorted(dynamic),'paperHiddenDuringBake':True,'statistics':stats,'glbBytes':path.stat().st_size,'webTextures':'JPEG 90, high quality PNG retained in Blender source','compression':'Draco level 6; position 16, normal 12, UV 14 bits','staticReductionRatio':.74},indent=2))
result={'bakeSeconds':seconds,'glbBytes':path.stat().st_size,'objects':len(outputs),'triangles':sum(x['triangles'] for x in stats)}
