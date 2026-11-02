"""Bake static diffuse illumination into an atlas; export unlit static + PBR targets."""
import bpy, json, time, math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=bpy.data.scenes['PortfolioDesk4A']
if bpy.data.scenes.get('DeskBaked4A'):
    raise RuntimeError('Generated bake scene exists. Preserve edits before explicitly removing it and rebaking.')
scene=bpy.data.scenes.new('DeskBaked4A');bpy.context.window.scene=scene
copies={}
for o in source.objects:
    cp=o.copy()
    if o.data: cp.data=o.data.copy()
    scene.collection.objects.link(cp);copies[o]=cp
for o,cp in copies.items():
    cp.parent=copies.get(o.parent);cp.matrix_local=o.matrix_local.copy()
scene.world=source.world.copy();scene.camera=copies[source.camera]
scene.render.engine='CYCLES';scene.cycles.samples=96;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX';scene.view_settings.look='None'
scene.render.resolution_x=1500;scene.render.resolution_y=1100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG'
groups={o.get('source_name'):o for o in source.objects if o.type=='EMPTY'}
names={'Static':'StudioStatic','projects_monitor':'ProjectsMonitor','projects_sign':'ProjectsSign','printer':'PrinterBody','resume_paper':'ResumePaper'}
merged={}
bpy.context.view_layer.update()
# Preserve material UV inputs before adding the separate, non-overlapping bake UV.
for o in list(source.objects)+list(scene.objects):
    if o.type=='MESH' and o.data.uv_layers:
        o.data.uv_layers[0].name='SurfaceUV'
for o in source.objects:
    if o.type not in {'MESH','FONT'}:continue
    for m in o.data.materials:
        if not m or not m.use_nodes:continue
        for n in list(m.node_tree.nodes):
            if n.type=='TEX_IMAGE' and not n.inputs['Vector'].is_linked:
                uv=m.node_tree.nodes.new('ShaderNodeUVMap');uv.uv_map='SurfaceUV';m.node_tree.links.new(uv.outputs['UV'],n.inputs['Vector'])
for group,export_name in names.items():
    members=[]
    for o,cp in copies.items():
        cursor=o
        while cursor.parent:cursor=cursor.parent
        if cursor==groups[group] and cp.type in {'MESH','FONT','CURVE'}:members.append(cp)
    bpy.ops.object.select_all(action='DESELECT')
    for cp in members:
        matrix=cp.matrix_world.copy();cp.parent=None;cp.matrix_world=matrix;cp.select_set(True)
    bpy.context.view_layer.objects.active=members[0]
    bpy.ops.object.convert(target='MESH');bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);bpy.ops.object.join()
    obj=bpy.context.object;obj.name=export_name;obj['action']='projects' if group.startswith('projects') else 'resume' if group in {'printer','resume_paper'} else ''
    merged[group]=obj
for o in list(scene.objects):
    if o.type=='EMPTY':bpy.data.objects.remove(o,do_unlink=True)
static=merged['Static'];bpy.ops.object.select_all(action='DESELECT');static.select_set(True);bpy.context.view_layer.objects.active=static
uv=static.data.uv_layers.new(name='LightBakeUV');static.data.uv_layers.active=uv;uv.active_render=True
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(70),island_margin=.004,area_weight=.6,correct_aspect=True)
bpy.ops.object.mode_set(mode='OBJECT')
image=bpy.data.images.new('Studio4A_StaticDiffuseAtlas',width=2048,height=2048,alpha=False)
image.colorspace_settings.name='sRGB'
for m in static.data.materials:
    if not m or not m.use_nodes:continue
    node=m.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;m.node_tree.nodes.active=node
paper=merged['resume_paper'];paper.hide_render=True
scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=True
scene.render.bake.margin=12
started=time.time();bpy.ops.object.bake(type='DIFFUSE',uv_layer='LightBakeUV');seconds=time.time()-started
paper.hide_render=False
image.filepath_raw=str(ROOT/'assets/blender/textures/studio4a-static-baked.png');image.file_format='PNG';image.save();image.pack()
# Explicit glTF unlit material. Baked direct/indirect light must not be lit again.
unlit=bpy.data.materials.new('Studio4A_Baked_Unlit');unlit.use_nodes=True
nodes=unlit.node_tree.nodes;nodes.clear();tex=nodes.new('ShaderNodeTexImage');tex.image=image
emit=nodes.new('ShaderNodeEmission');emit.inputs['Strength'].default_value=1
out=nodes.new('ShaderNodeOutputMaterial');unlit.node_tree.links.new(tex.outputs['Color'],emit.inputs['Color'])
lightpath=nodes.new('ShaderNodeLightPath');mix=nodes.new('ShaderNodeMixShader');transparent=nodes.new('ShaderNodeBsdfTransparent')
unlit.node_tree.links.new(lightpath.outputs['Is Camera Ray'],mix.inputs[0]);unlit.node_tree.links.new(transparent.outputs[0],mix.inputs[1]);unlit.node_tree.links.new(emit.outputs[0],mix.inputs[2]);unlit.node_tree.links.new(mix.outputs[0],out.inputs['Surface'])
static.data.materials.clear();static.data.materials.append(unlit)
for p in static.data.polygons:p.material_index=0
for layer in list(static.data.uv_layers):
    if layer.name!='LightBakeUV':static.data.uv_layers.remove(layer)
static.data.uv_layers.active_index=0
statistics=[]
bpy.ops.object.select_all(action='DESELECT')
for group,obj in merged.items():
    obj.select_set(True);obj.data.calc_loop_triangles();statistics.append({'node':obj.name,'triangles':len(obj.data.loop_triangles),'materials':len(obj.data.materials)})
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/desk-studio.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_yup=True,export_cameras=False,export_lights=False)
scene.render.filepath=str(ROOT/'docs/portfolio/evidence/phase4a/blender-desk.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4a.blend'))
(ROOT/'docs/portfolio/evidence/phase4a/bake.json').write_text(json.dumps({'atlas':[2048,2048],'pass':'DIFFUSE COLOR + DIRECT + INDIRECT','seconds':seconds,'samples':96,'padding':12,'uv':'LightBakeUV','staticUnlit':True,'excludedMovingPaper':True,'statistics':statistics},indent=2))
result={'bakeSeconds':seconds,'statistics':statistics,'file':bpy.data.filepath}
