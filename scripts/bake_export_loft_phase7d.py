"""Shared atlas for fixed zones, separate selectable meshes, three dynamic parts."""
import bpy,math,json,time
from pathlib import Path
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1];evidence=ROOT/'docs/portfolio/evidence/phase7d'
source=bpy.data.scenes['PortfolioLoft7D']
if bpy.data.scenes.get('LoftBaked7D'):raise RuntimeError('Existing bake preserved. Explicitly archive before rebuilding.')
scene=bpy.data.scenes.new('LoftBaked7D');bpy.context.window.scene=scene;copies={};groups=defaultdict(list)
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
dynamic={'ProjectsMonitor','PrinterBody','ResumePaper','SoftFurnishings'};fixed=[(n,o) for n,o in merged.items() if n not in dynamic]
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
image=bpy.data.images.new('Loft7D_BakedDiffuse',width=4096,height=4096,alpha=False);image.colorspace_settings.name='sRGB'
for m in atlas_obj.data.materials:
    if m and m.use_nodes:
        node=m.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;m.node_tree.nodes.active=node
paper=merged['ResumePaper'];paper.hide_render=True
scene.render.bake.use_pass_color=True;scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.margin=24
start=time.time();bpy.ops.object.bake(type='DIFFUSE',uv_layer='LoftBakeUV');seconds=time.time()-start;paper.hide_render=False
# Phase 7F: furniture is movable, so shadows baked under it would stay behind as black stains. Re-bake the floor-type islands in a second pass with NO furniture in the scene
# (walls stay as shadow casters) using the SAME UVs, then composite those islands over the first bake.
import numpy as np,bmesh
def island_mask(image,atlas_obj,names,fixed):
    W,H=image.size;mesh=atlas_obj.data;zone=mesh.attributes['zone_id'];uv=mesh.uv_layers['LoftBakeUV'].data;wanted={i for i,(n,_) in enumerate(fixed) if n in names}
    mask=np.zeros((H,W),bool)
    for p in mesh.polygons:
        if zone.data[p.index].value not in wanted:continue
        pts=[(uv[l].uv[0]*W,uv[l].uv[1]*H) for l in p.loop_indices]
        for k in range(1,len(pts)-1):
            (x0,y0),(x1,y1),(x2,y2)=pts[0],pts[k],pts[k+1]
            xmin,xmax=int(max(0,min(x0,x1,x2))),int(min(W-1,max(x0,x1,x2)));ymin,ymax=int(max(0,min(y0,y1,y2))),int(min(H-1,max(y0,y1,y2)))
            if xmax<xmin or ymax<ymin:continue
            gx,gy=np.meshgrid(np.arange(xmin,xmax+1)+.5,np.arange(ymin,ymax+1)+.5);den=(y1-y2)*(x0-x2)+(x2-x1)*(y0-y2)
            if abs(den)<1e-9:continue
            a=((y1-y2)*(gx-x2)+(x2-x1)*(gy-y2))/den;b=((y2-y0)*(gx-x2)+(x0-x2)*(gy-y2))/den
            mask[ymin:ymax+1,xmin:xmax+1]|=(a>=-.01)&(b>=-.01)&(1-a-b>=-.01)
    return mask
def rebake_clean_floor(image,atlas_obj,fixed,scene,floor_names,caster_names):
    W,H=image.size;keep_ids={i for i,(n,_) in enumerate(fixed) if n in floor_names|caster_names}
    clean=atlas_obj.copy();clean.data=atlas_obj.data.copy();clean.name='AtlasCleanFloor';scene.collection.objects.link(clean)
    bm=bmesh.new();bm.from_mesh(clean.data);layer=bm.faces.layers.int['zone_id']
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if f[layer] not in keep_ids],context='FACES');bm.to_mesh(clean.data);bm.free()
    flags={o:o.hide_render for o in scene.objects if o.type=='MESH'}
    for o in flags:o.hide_render=True
    clean.hide_render=False
    image2=bpy.data.images.new('Loft7D_CleanFloor',width=W,height=H,alpha=False);image2.colorspace_settings.name='sRGB'
    nodes=[]
    for m in clean.data.materials:
        if m and m.use_nodes:
            n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=image2;m.node_tree.nodes.active=n;nodes.append((m,n))
    bpy.ops.object.select_all(action='DESELECT');clean.select_set(True);bpy.context.view_layer.objects.active=clean
    bpy.ops.object.bake(type='DIFFUSE',uv_layer='LoftBakeUV')
    for m,n in nodes:
        m.node_tree.nodes.remove(n)
        first=next((x for x in m.node_tree.nodes if x.type=='TEX_IMAGE' and x.image==image),None)
        if first:m.node_tree.nodes.active=first
    for o,v in flags.items():
        if o.name in bpy.data.objects:o.hide_render=v
    b1=np.empty(W*H*4,np.float32);image.pixels.foreach_get(b1);b2=np.empty(W*H*4,np.float32);image2.pixels.foreach_get(b2)
    mask=island_mask(image,atlas_obj,floor_names,fixed).reshape(-1)
    a1=b1.reshape(-1,4);a2=b2.reshape(-1,4);a1[mask,:3]=a2[mask,:3]
    image.pixels.foreach_set(a1.reshape(-1));image.update()
    bpy.data.objects.remove(clean,do_unlink=True);bpy.data.images.remove(image2)
    return int(mask.sum())
import os
# EXPERIMENTAL and OFF by default: on the first attempt this second Cycles pass ran for 90+ minutes without finishing. Enable with CABIN_CLEAN_FLOOR_PASS=1 only for debugging.
stained=0 if os.environ.get('CABIN_CLEAN_FLOOR_PASS')!='1' else rebake_clean_floor(image,atlas_obj,fixed,scene,{'FloorBoards','DeskRug','ReadingRug','FloorCushion'},{'Walls','RearPlasterWall','LeftReturnWall','WindowWall'})
image.filepath_raw=str(ROOT/'assets/blender/textures/loft7d-static-baked.png');image.file_format='PNG';image.save();image.pack()
mat=bpy.data.materials.new('Loft7D_Baked_Unlit');mat.use_nodes=True;nodes=mat.node_tree.nodes;nodes.clear();links=mat.node_tree.links
tex=nodes.new('ShaderNodeTexImage');tex.image=image;emit=nodes.new('ShaderNodeEmission');out=nodes.new('ShaderNodeOutputMaterial');lp=nodes.new('ShaderNodeLightPath');mix=nodes.new('ShaderNodeMixShader');trans=nodes.new('ShaderNodeBsdfTransparent')
links.new(tex.outputs['Color'],emit.inputs['Color']);links.new(lp.outputs['Is Camera Ray'],mix.inputs[0]);links.new(trans.outputs[0],mix.inputs[1]);links.new(emit.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],out.inputs['Surface'])
# Color-only atlas for source-based upholstery, lit by PBR in the browser.
soft=merged['SoftFurnishings']
bpy.ops.object.select_all(action='DESELECT');soft.select_set(True);bpy.context.view_layer.objects.active=soft
if soft.data.uv_layers:soft.data.uv_layers[0].name='SurfaceUV'
for m in soft.data.materials:
    if m and m.use_nodes:
        for n in list(m.node_tree.nodes):
            if n.type=='TEX_IMAGE' and not n.inputs['Vector'].is_linked:
                u=m.node_tree.nodes.new('ShaderNodeUVMap');u.uv_map='SurfaceUV';m.node_tree.links.new(u.outputs['UV'],n.inputs['Vector'])
softuv=soft.data.uv_layers.new(name='SoftColorUV');soft.data.uv_layers.active=softuv;softuv.active_render=True
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(70),island_margin=.006,area_weight=.8);bpy.ops.object.mode_set(mode='OBJECT')
softimage=bpy.data.images.new('Loft7D_SoftColor',width=1024,height=1024,alpha=False)
for m in soft.data.materials:
    if m and m.use_nodes:
        n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=softimage;m.node_tree.nodes.active=n
scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=False;scene.render.bake.use_pass_color=True
bpy.ops.object.bake(type='DIFFUSE',uv_layer='SoftColorUV')
softimage.filepath_raw=str(ROOT/'assets/blender/textures/loft7d-soft-color.png');softimage.file_format='PNG';softimage.save();softimage.pack()
softmat=bpy.data.materials.new('Loft7D_Soft_PBR');softmat.use_nodes=True;p=softmat.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.88
n=softmat.node_tree.nodes.new('ShaderNodeTexImage');n.image=softimage;softmat.node_tree.links.new(n.outputs['Color'],p.inputs['Base Color'])
soft.data.materials.clear();soft.data.materials.append(softmat)
for p in soft.data.polygons:p.material_index=0
for layer in list(soft.data.uv_layers):
    if layer.name!='SoftColorUV':soft.data.uv_layers.remove(layer)
soft.data.uv_layers.active_index=0
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
    elif name!='SoftFurnishings':obj['phase5_target']=True
path=ROOT/'public/models/loft-studio-v7d.glb'
bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_yup=True,export_cameras=False,export_lights=False,export_image_format='JPEG',export_jpeg_quality=90,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_draco_position_quantization=16,export_draco_normal_quantization=12,export_draco_texcoord_quantization=14)
scene.render.filepath=str(evidence/'blender-studio.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase7d.blend'),copy=True)
(evidence/'bake-export.json').write_text(json.dumps({'atlas':[4096,4096],'samples':96,'seconds':seconds,'pass':'DIFFUSE COLOR DIRECT INDIRECT','padding':24,'triangulatedBeforeBake':True,'dynamic':sorted(dynamic),'paperHiddenDuringBake':True,'statistics':stats,'glbBytes':path.stat().st_size,'webTextures':'JPEG 90, high quality PNG retained in Blender source','compression':'Draco level 6; position 16, normal 12, UV 14 bits','staticReductionRatio':.74,'softAtlas':[1024,1024],'softPass':'DIFFUSE COLOR ONLY; PBR roughness .88'},indent=2))
result={'stainPixelsRepaired':stained,'bakeSeconds':seconds,'glbBytes':path.stat().st_size,'objects':len(outputs),'triangles':sum(x['triangles'] for x in stats)}
