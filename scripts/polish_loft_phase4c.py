"""Retain the 4B construction; refine the most visible surfaces and silhouettes."""
import bpy,math,random,json,bmesh
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];random.seed(104)
if bpy.data.scenes.get('PortfolioLoft4C'):raise RuntimeError('Existing refined source preserved.')
source=bpy.data.scenes['PortfolioLoft4B'];scene=bpy.data.scenes.new('PortfolioLoft4C');bpy.context.window.scene=scene
zones={};copies={};materials={}
for col in source.collection.children:
    zone=bpy.data.collections.new(col.name+' 4C');scene.collection.children.link(zone);zones[col.name]=zone
    for o in col.objects:
        cp=o.copy()
        if o.data:cp.data=o.data.copy()
        cp['phase4b_name']=o.name;zone.objects.link(cp);copies[o]=cp
        if cp.type in {'MESH','FONT','CURVE'}:
            for i,m in enumerate(cp.data.materials):
                if m not in materials:materials[m]=m.copy()
                cp.data.materials[i]=materials[m]
for o,cp in copies.items():cp.parent=copies.get(o.parent);cp.matrix_local=o.matrix_local.copy()
scene.world=source.world.copy();scene.camera=copies[source.camera]
roots={o.get('stable_id'):o for o in scene.objects if o.get('stable_id')}
def mfind(prefix):return next(cp for old,cp in materials.items() if old.name.startswith(prefix))
wood=mfind('Loft_Honey oak');darkwood=mfind('Loft_Oak end grain');sage=mfind('Loft_Sage fabric');ivory=mfind('Loft_Warm ivory');linen=mfind('Loft_Linen');blush=mfind('Loft_Muted blush')
def mat(n,c,rough=.7):
    m=bpy.data.materials.new('Polish_'+n);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;return m
sky=mat('Soft exterior sky',(.45,.65,.69),.9);nookcloth=mat('Nook sage upholstery',(.36,.44,.29),.94)
for old,m in materials.items():
    p=m.node_tree.nodes.get('Principled BSDF') if m.use_nodes else None
    if not p:continue
    if 'Cream plaster' in old.name:p.inputs['Base Color'].default_value=(.75,.70,.59,1)
    if any(t in old.name.lower() for t in ['fabric','linen','muted blush','light sage']):
        color=list(p.inputs['Base Color'].default_value);noise=m.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=110
        ramp=m.node_tree.nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].color=tuple([c*.93 for c in color[:3]]+[1]);ramp.color_ramp.elements[1].color=tuple([min(1,c*1.05) for c in color[:3]]+[1])
        m.node_tree.links.new(noise.outputs['Fac'],ramp.inputs[0]);m.node_tree.links.new(ramp.outputs[0],p.inputs['Base Color'])
        bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.0008;m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs[0],p.inputs['Normal']);p.inputs['Roughness'].default_value=.92
    if 'Warm ivory' in old.name:p.inputs['Roughness'].default_value=.47
def addbox(n,loc,dims,m,zone,bevel=.012):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=n;o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for c in list(o.users_collection):c.objects.unlink(o)
    zones[zone].objects.link(o);o.parent=roots['StudioStatic'];o.data.materials.append(m)
    mod=o.modifiers.new('Eased architectural edge','BEVEL');mod.width=bevel;mod.segments=3;return o
softened=[]
for o in scene.objects:
    name=o.get('phase4b_name','')
    if o.type=='FONT':
        o.data.resolution_u=2
        if 'lettering' not in name.lower():o.data.bevel_depth=0;o.data.extrude=min(o.data.extrude,.0005)
        else:o.data.bevel_resolution=1;o.data.bevel_depth=min(o.data.bevel_depth,.0004)
    if o.type=='MESH' and any(t in name for t in ['Reading cushion /','Bed pillow /','Floor cushion /','Soft lounge seat /','Window reading bench /']):
        bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00005);bm.to_mesh(o.data);bm.free()
        for mod in o.modifiers:
            if mod.type=='BEVEL':mod.width=.022;mod.segments=3
        sub=o.modifiers.new('Soft source upholstery silhouette','SUBSURF');sub.levels=sub.render_levels=1
        for p in o.data.polygons:p.use_smooth=True
        softened.append(name)
        if 'Window reading bench' in name:
            for i,m in enumerate(o.data.materials):
                if m==ivory:o.data.materials[i]=nookcloth
    if o.type=='MESH' and name.startswith('Open timber staircase /'):
        for i,m in enumerate(o.data.materials):
            if 'ink' in m.name.lower():o.data.materials[i]=darkwood
    if name.startswith('Stair handrail') and o.type=='CURVE':o.data.bevel_depth=.032
    if name.startswith('Window wall pier') or name.startswith('Window wall header'):
        if o.type=='MESH':
            for i in range(len(o.data.materials)):o.data.materials[i]=wood
    if name.startswith('Experience shelf') and o.type=='EMPTY':o.location.x-=.65
    if o.get('stable_id') in {'ExternalGitHub','ExternalLinkedIn','ExperienceVolume'}:o.location.x-=.65
    if o.get('stable_id')=='UnwrapDisplay':o.location.x+=.12
    if o.type=='MESH' and 'curved leaf' in name:
        o.scale.x*=random.uniform(.85,1.2);o.scale.y*=random.uniform(.85,1.2);o.scale.z*=random.uniform(.88,1.12)
    if o.type=='MESH' and 'trailing' in name.lower():
        so=o.modifiers.new('Leaf back surface','SOLIDIFY');so.thickness=.001
    if o.type=='LIGHT':
        if name=='Soft afternoon':o.data.energy=900;o.data.color=(1,.88,.75)
        if name=='Window fill':o.data.energy=600
        if name=='Loft warm fill':o.data.energy=450
# Individual board tone variation; keep the single authored grain source.
variants=[]
for f in [.93,.98,1.025]:
    m=wood.copy();m.name='Polish_Oak board '+str(f)
    for node in m.node_tree.nodes:
        if node.type=='MIX_RGB' and node.blend_type=='MULTIPLY':
            c=node.inputs[2].default_value;node.inputs[2].default_value=(c[0]*f,c[1]*f,c[2]*f,1)
    variants.append(m)
for o in scene.objects:
    if o.get('phase4b_name','').startswith('Oak floor ') and o.type=='MESH':o.data.materials[0]=random.choice(variants)
# Clear front cutaway is retained; sky appears only in the rear window bay.
addbox('Exterior sky rear window bay',(3.865,1.91,1.72),(.012,1.35,1.67),sky,'ReadingNook',0)
addbox('Window lower timber return',(3.73,1.33,.76),(.11,2.73,.09),wood,'ReadingNook')
addbox('Left wall skirting',(-3.73,1.82,.09),(.075,2.07,.15),darkwood,'Workstation')
addbox('Loft front fascia',(1.75,1.066,2.39),(4.0,.045,.105),darkwood,'Loft')
# Fold the project's existing draped textile mesh onto the nook; no box blanket.
blanket=next(o for o in scene.objects if o.get('phase4b_name')=='Sage draped blanket')
for layer in range(2):
    cp=blanket.copy();cp.data=blanket.data.copy();zones['ReadingNook'].objects.link(cp);cp.name='Folded nook textile layer '+str(layer);cp.parent=roots['StudioStatic']
    lo=Vector([min(v.co[i] for v in cp.data.vertices) for i in range(3)]);hi=Vector([max(v.co[i] for v in cp.data.vertices) for i in range(3)])
    for v in cp.data.vertices:
        v.co=Vector((2.92+(v.co.x-lo.x)/(hi.x-lo.x)*.43-.215,-.08+(v.co.y-lo.y)/(hi.y-lo.y)*.6-.3,.64+layer*.033+(v.co.z-lo.z)/(hi.z-lo.z)*.024))
    cp.data.materials.clear();cp.data.materials.append(linen if layer==0 else blush)
# Small material-aware seam highlights on the existing blanket.
for o in scene.objects:
    if o.get('phase4b_name')=='Sage draped blanket':
        for v in o.data.vertices:v.co.z+=math.sin(v.co.x*12)*.012
# Sunlight is broad enough for soft, readable contact, not a hard spotlight.
for n,p,e,size,c,target in [('Warm side-window sun',(4.9,1.7,4.2),420,1.7,(1,.85,.65),(1.3,.1,.5)),('Nook lamp pool',(3,-.5,1.7),24,.65,(1,.76,.46),(2.8,.1,.5))]:
    d=bpy.data.lights.new(n,'AREA');d.energy=e;d.size=size;d.color=c;o=bpy.data.objects.new(n,d);zones['LightingAndCamera'].objects.link(o);o.location=p;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=True;scene.view_settings.view_transform='AgX';scene.view_settings.look='None';scene.render.film_transparent=True
scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/'docs/portfolio/evidence/phase4c/blender-studio.png')
scene['phase']='4C polish; named camera views prepared, visitor controls remain disabled'
bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4c.blend'))
(ROOT/'docs/portfolio/evidence/phase4c/polish-changes.json').write_text(json.dumps({'sourceObjects':len(scene.objects),'softenedSourceMeshes':softened,'newExternalAssets':False,'defaultCameraPreserved':list(scene.camera.location)},indent=2))
result={'source':scene.name,'objects':len(scene.objects),'softenedMeshes':len(softened),'file':bpy.data.filepath}
