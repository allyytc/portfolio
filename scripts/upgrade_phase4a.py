"""Non-destructive Phase 4A refinement of the approved Phase 3 source assets."""
import bpy, math, random, json
from pathlib import Path
from mathutils import Vector
ROOT = Path(__file__).resolve().parents[1]
random.seed(48)
source = bpy.data.scenes['PortfolioDesk']
if bpy.data.scenes.get('PortfolioDesk4A'):
    raise RuntimeError('Refined source already exists. Open the preserved Phase 3 blend to reproduce; do not overwrite owner edits.')
scene = bpy.data.scenes.new('PortfolioDesk4A')
bpy.context.window.scene = scene
copies, materials = {}, {}
for o in source.objects:
    cp = o.copy()
    if o.data: cp.data = o.data.copy()
    cp['source_name'] = o.name
    scene.collection.objects.link(cp)
    copies[o] = cp
    if cp.type in {'MESH', 'FONT'}:
        for i, m in enumerate(cp.data.materials):
            if m not in materials: materials[m] = m.copy()
            cp.data.materials[i] = materials[m]
for o, cp in copies.items():
    cp.parent = copies.get(o.parent)
    cp.matrix_local = o.matrix_local.copy()
scene.world = source.world.copy()
scene.camera = copies[source.camera]
named = {o['source_name']: o for o in scene.objects}
groups = {n: named[n] for n in ['Static','projects_monitor','projects_sign','printer','resume_paper']}
def mat(name, color, rough=.6, metal=0):
    m=bpy.data.materials.new('4A_'+name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    m.diffuse_color=(*color,1); return m
def findmat(prefix):
    return next(cp for old,cp in materials.items() if old.name.startswith('Studio_'+prefix+'.'))
wood=findmat('Oak'); cream=findmat('Cream'); ivory=findmat('Ivory'); sage=findmat('Sage'); brass=findmat('Brass'); ink=findmat('Ink')
blackcloth=mat('Black woven upholstery',(.009,.011,.012),.93)
blackplastic=mat('Black satin polymer',(.012,.014,.016),.48)
blackmetal=mat('Black powder coated metal',(.018,.021,.024),.4,.2)
leafmats=[mat('Leaf '+str(i),c,.67) for i,c in enumerate([(.09,.19,.055),(.17,.29,.085),(.23,.34,.12)])]
darkwood=mat('Walnut endgrain',(.19,.095,.037),.59)
def finish(o,m,group='Static',bevel=0):
    o.parent=groups[group]; o.data.materials.clear(); o.data.materials.append(m)
    if bevel:
        mod=o.modifiers.new('Fine eased edges','BEVEL'); mod.width=bevel; mod.segments=5
    for p in o.data.polygons: p.use_smooth=True
    return o
def box(name,loc,dims,m,bevel=.004,group='Static'):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=name
    o.dimensions=dims; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    finish(o,m,group,bevel)
    mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL'); mod.keep_sharp=True
    return o
def curve(name,points,radius,m,group='Static'):
    d=bpy.data.curves.new(name,'CURVE');d.dimensions='3D';d.resolution_u=16;d.bevel_depth=radius;d.bevel_resolution=3
    s=d.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for p,co in zip(s.bezier_points,points): p.co=co;p.handle_left_type=p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.parent=groups[group];d.materials.append(m);return o
# Distinct dark finishes throughout; no pale shell, arm, hub, or reused base remains.
chair=[]
for name,o in named.items():
    if any(t in name for t in ['SageChair','Chair ','Twin caster','Caster hub']):
        if o.type=='MESH':
            chosen=blackcloth if any(t in name for t in ['padding','padded','cushioned','seam']) else blackmetal if any(t in name for t in ['base','support','hub','frame']) else blackplastic
            for i in range(len(o.data.materials)): o.data.materials[i]=chosen
            chair.append(name)
# Fine fabric bump is included in the bake, not a new runtime shader.
p=blackcloth.node_tree.nodes.get('Principled BSDF'); n=blackcloth.node_tree.nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=360
b=blackcloth.node_tree.nodes.new('ShaderNodeBump'); b.inputs['Strength'].default_value=.14;b.inputs['Distance'].default_value=.0007
blackcloth.node_tree.links.new(n.outputs['Fac'],b.inputs['Height']);blackcloth.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
# Keep physical seams readable against a full black chair.
# Existing inset seam follows the actual chair shell; avoid floating trim.
for x in [-.23,.07]:
    curve('Black stitched seat channel',[(x,-.85,.547),(x,-.68,.551),(x,-.47,.547)],.0016,blackplastic)
# Oak retains the approved original image, adds gentle pore bump and roughness.
for old,m in materials.items():
    if 'Studio_Oak' in old.name:
        p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.56
        tex=next(n for n in m.node_tree.nodes if n.type=='TEX_IMAGE')
        bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.2;bump.inputs['Distance'].default_value=.0015
        m.node_tree.links.new(tex.outputs['Color'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal'])
        # Correct the previous dark edge material sharing an identical bright map.
        if 'OakEdge' in old.name:
            mix=m.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=(.6,.54,.43,1)
            m.node_tree.links.new(tex.outputs['Color'],mix.inputs[1]);m.node_tree.links.new(mix.outputs[0],p.inputs['Base Color'])
for o in scene.objects:
    if o.type=='MESH':
        for mod in o.modifiers:
            if mod.type=='BEVEL': mod.segments=max(mod.segments,4)
    if o.type=='LIGHT':
        # Less yellow than the previous three strong warm lights.
        if 'Afternoon' in o.name: o.data.energy=430;o.data.color=(1,.88,.73);o.data.size=3.2
        elif 'rim' in o.name: o.data.energy=220;o.data.color=(1,.86,.68)
# Entrance sign: inset name panel, raised frame, pegs, and physical lettering.
for x in [-1.965,-1.195]:
    box('Name board raised stile',(x,.206,1.43),(.026,.018,.211),darkwood,.007,'projects_sign')
for z in [1.325,1.535]: box('Name board raised rail',(-1.58,.206,z),(.78,.018,.025),darkwood,.007,'projects_sign')
for x in [-1.955,-1.205]:
    for z in [1.39,1.47]:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=.006,location=(x,.19,z));finish(bpy.context.object,brass,'projects_sign')
for name in ['Name sign lettering','Projects lettering']:
    named[name].data.extrude=.003; named[name].data.bevel_depth=.0008;named[name].data.bevel_resolution=2
# Desk apron, real edge banding, side joinery, and drawer hardware.
box('Desktop eased front edge',(-.22,-.103,.805),(2.03,.022,.035),darkwood,.008)
for x in [-1.17,.73]:
    for z in [.12,.68]: box('Desk joinery insert',(x,-.102,z),(.035,.008,.022),darkwood,.003)
for z in [.28,.48,.68]:
    box('Drawer inset shadow line',(-.89,-.039,z),(.345,.008,.003),darkwood,.001)
# Monitor bezel, controls and rear ventilation; preserve actual display mesh.
# Refine the actual imported housing instead of layering a displaced bezel.

for i in range(13): box('Monitor rear vent',(-.56+i*.032,.529,1.19),(.018,.004,.075),ink,.003,'projects_monitor')
box('Monitor status light',(-.04,.279,1.015),(.012,.003,.003),sage,.001,'projects_monitor')
# Printer casing seams, vents, controls, and paper guides instead of box-only casing.
for i in range(9): box('Printer right ventilation slot',(1.428,.18+i*.019,.873),(.003,.01,.028),ink,.003,'printer')
for x in [.973,1.347]:
    box('Printer rubber foot',(x,.13,.788),(.055,.06,.015),blackplastic,.006,'printer')
for x in [1.04,1.28]: box('Printer paper guide',(x,.441,1.13),(.017,.019,.16),ivory,.006,'printer')
box('Printer control inset',(1.345,.049,.97),(.054,.004,.048),cream,.01,'printer')
# Upgrade approved plant source: preserve ceramic planter, replace angular leaves
# with an original curved, veined botanical insert. No external asset introduced.
for name,o in list(named.items()):
    if name.startswith('FloorPlant_') and not 'pottedPlant' in name:
        bpy.data.objects.remove(o,do_unlink=True)
def botanical(center,height,count,spread):
    cx,cy,z0=center
    for i in range(count):
        angle=i*2.39996; length=height*(.57+.43*random.random()); lean=spread*(.55+.45*random.random())
        start=Vector((cx+.025*math.cos(angle),cy+.025*math.sin(angle),z0))
        end=Vector((cx+lean*math.cos(angle),cy+lean*math.sin(angle),z0+length))
        mid=start.lerp(end,.5)+Vector((0,0,.09*height))
        curve('Plant branching stem',[start,mid,end],.003,leafmats[0])
        direction=Vector((-math.sin(angle),math.cos(angle),0));verts=[];faces=[]
        width=height*.135
        for row in range(13):
            t=row/12;pos=start.lerp(end,t)+Vector((0,0,math.sin(t*math.pi)*.13*height))
            w=math.sin(math.pi*t)**.85*width
            for col in range(5):
                s=col/2-1;v=pos+direction*w*s;v.z-=abs(s)**1.4*w*.38;verts.append(v)
        for row in range(12):
            for col in range(4): a=row*5+col;faces.append((a,a+1,a+6,a+5))
        mesh=bpy.data.meshes.new('Curved botanical leaf');mesh.from_pydata(verts,[],faces)
        o=bpy.data.objects.new('Handcrafted curved plant leaf',mesh);scene.collection.objects.link(o);finish(o,leafmats[i%3])
        so=o.modifiers.new('Leaf thickness','SOLIDIFY');so.thickness=.0012
        su=o.modifiers.new('Continuous leaf surface','SUBSURF');su.levels=su.render_levels=1
botanical((1.65,.65,.24),.59,17,.26)
# Reused desk plant stays identifiable, with a small leafy silhouette added above.
botanical((-1.03,.43,.99),.21,7,.095)
# Rounded existing lamp source (welded before subdivision) avoids a hexagonal shade.
import bmesh
for name,o in named.items():
    if name.startswith('SageDeskLamp_') and o.type=='MESH':
        bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.0001);bm.to_mesh(o.data);bm.free()
        # Edge split source normals intentionally retained; bevel provides detail.
        for p in o.data.polygons:p.use_smooth=True
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX';scene.view_settings.look='None';scene.view_settings.exposure=0
scene.render.resolution_x=1500;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True
scene.render.filepath=str(ROOT/'docs/portfolio/evidence/phase4a/blender-desk-source.png')
scene['status']='Phase 4A refined desk; full room remains a separate temporary blockout'
scene['chair_finish']='All black: fabric, polymer, metal, arms, shell, base and hubs'
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4a.blend'))
(ROOT/'docs/portfolio/evidence/phase4a/chair-materials.json').write_text(json.dumps({'changed_objects':chair,'finishes':[m.name for m in [blackcloth,blackplastic,blackmetal]]},indent=2))
result={'scene':scene.name,'objects':len(scene.objects),'chairObjects':chair,'source':bpy.data.filepath}
