"""Targeted authored asset replacement; keep the existing workstation and IDs."""
import bpy,sys,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from loft_asset_helpers import import_asset
if bpy.data.scenes.get('PortfolioLoft4D'):raise RuntimeError('Existing 4D source preserved.')
source=bpy.data.scenes['PortfolioLoft4C'];scene=bpy.data.scenes.new('PortfolioLoft4D');bpy.context.window.scene=scene
copies={};zones={};materials={}
for c in source.collection.children:
    name=c.name.replace(' 4C','');col=bpy.data.collections.new(name+' 4D');scene.collection.children.link(col);zones[name]=col
    for o in c.objects:
        cp=o.copy()
        if o.data:cp.data=o.data.copy()
        cp['phase4c_name']=o.name;col.objects.link(cp);copies[o]=cp
        if cp.type in {'MESH','FONT','CURVE'}:
            for i,m in enumerate(cp.data.materials):
                if m not in materials:materials[m]=m.copy()
                cp.data.materials[i]=materials[m]
for o,cp in copies.items():cp.parent=copies.get(o.parent);cp.matrix_local=o.matrix_local.copy()
scene.world=source.world.copy();scene.camera=copies[source.camera]
roots={o.get('stable_id'):o for o in scene.objects if o.get('stable_id')}
soft=bpy.data.objects.new('SoftFurnishings',None);zones['ReadingNook'].objects.link(soft);soft['stable_id']='SoftFurnishings';roots['SoftFurnishings']=soft
def matfind(prefix):return next(cp for old,cp in materials.items() if old.name.startswith(prefix))
wood=matfind('Loft_Honey oak');darkwood=matfind('Loft_Oak end grain');ivory=matfind('Loft_Warm ivory');sage=matfind('Loft_Sage fabric');linen=matfind('Loft_Linen')
def material(n,c,rough=.7):
    m=bpy.data.materials.new('4D_'+n);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;return m
brass=material('Window latch brass',(.34,.23,.08),.4)
brass.node_tree.nodes.get('Principled BSDF').inputs['Metallic'].default_value=.65
sky=material('Window atmospheric blue',(.39,.59,.63),.9);cloud=material('Distant cream cloud',(.81,.83,.74),.9)
def box(n,p,d,m,zone,bevel=.012,parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for c in list(o.users_collection):c.objects.unlink(o)
    zones[zone].objects.link(o);o.parent=parent or roots['StudioStatic'];o.data.materials.append(m)
    if bevel:mod=o.modifiers.new('Crafted architectural edge','BEVEL');mod.width=bevel;mod.segments=3
    return o
removed=[]
def remove(o):
    if o not in scene.objects.values():return
    for child in list(o.children):remove(child)
    removed.append(o.name);bpy.data.objects.remove(o,do_unlink=True)
# Replace weak/repeated foliage; keep the other zone collections and their targets.
for name in [o.name for o in zones['PlantsAndDecor'].objects]:
    o=bpy.data.objects.get(name)
    if o:remove(o)
for name in [o.name for o in scene.objects]:
    o=bpy.data.objects.get(name)
    if not o:continue
    n=o.get('phase4b_name','');old=o.get('phase4a_source_name','')
    if old.startswith(('DeskPlant','FloorPlant','Handcrafted curved plant leaf','Plant branching stem')):remove(o);continue
    if n.startswith(('Loft bed','Bed pillow','Sage draped blanket','Blanket sewn hem','Soft lounge seat','Floor cushion')) or o.get('phase4c_name','').startswith('Folded nook textile'):remove(o);continue
    if n.startswith(('Window wall','Side window','Deep window sill')) or o.get('phase4c_name','').startswith(('Exterior sky rear','Window lower timber')):remove(o);continue
    # Authored bench structure stays; its cloth now uses an independent PBR path.
    if n.startswith('Window reading bench') and o.type=='EMPTY':
        world=o.matrix_world.copy();o.parent=soft;o.matrix_world=world
    if n.startswith('Reading cushion') and o.type=='EMPTY':remove(o)
kit=ROOT/'assets/source/kaykit-furniture-bits/Assets/gltf';plants=ROOT/'assets/source/tiny-treats-house-plants/Assets/gltf'
added=[]
def source_asset(file,name,p,dims,zone,parent=None,rotation=0,height=None):
    r,obs=import_asset(file,name,p,zones[zone],parent or roots['StudioStatic'],dims=dims,height=height,rotation=rotation);added.append({'name':name,'source':str(file.relative_to(ROOT)),'zone':zone})
    return r,obs
def sage_atlas(obs):
    for o in obs:
        if o.type!='MESH':continue
        for i,m in enumerate(o.data.materials):
            m=m.copy();o.data.materials[i]=m;p=m.node_tree.nodes.get('Principled BSDF')
            if not p or not p.inputs['Base Color'].is_linked:continue
            origin=p.inputs['Base Color'].links[0].from_socket
            sep=m.node_tree.nodes.new('ShaderNodeSeparateColor');m.node_tree.links.new(origin,sep.inputs[0])
            sub=m.node_tree.nodes.new('ShaderNodeMath');sub.operation='SUBTRACT';m.node_tree.links.new(sep.outputs['Blue'],sub.inputs[0]);m.node_tree.links.new(sep.outputs['Red'],sub.inputs[1])
            mask=m.node_tree.nodes.new('ShaderNodeMath');mask.operation='GREATER_THAN';mask.inputs[1].default_value=.035;m.node_tree.links.new(sub.outputs[0],mask.inputs[0])
            tint=m.node_tree.nodes.new('ShaderNodeMixRGB');tint.blend_type='MULTIPLY';tint.inputs[0].default_value=1;tint.inputs[2].default_value=(1.5,1,.48,1);m.node_tree.links.new(origin,tint.inputs[1])
            mix=m.node_tree.nodes.new('ShaderNodeMixRGB');m.node_tree.links.new(mask.outputs[0],mix.inputs[0]);m.node_tree.links.new(origin,mix.inputs[1]);m.node_tree.links.new(tint.outputs[0],mix.inputs[2]);m.node_tree.links.new(mix.outputs[0],p.inputs['Base Color']);p.inputs['Roughness'].default_value=.88
bed,obs=source_asset(kit/'bed_double_B.gltf','Tailored sage loft bed',(2.15,1.94,2.51),(2.67,1.36,.63),'Loft',soft);sage_atlas(obs)
seat,obs=source_asset(kit/'armchair.gltf','Rounded sage lounge chair',(-1.9,-1.1,.035),(.78,.78,.79),'ReadingNook',soft);sage_atlas(obs)
for i,(p,dim) in enumerate([((3.21,.63,.6),(.23,.47,.36)),((3.21,.12,.6),(.23,.4,.32)),((-1.15,-1.95,.035),(.54,.48,.16))]):
    _,obs=source_asset(kit/('pillow_A.gltf' if i!=1 else 'pillow_B.gltf'),'Soft nook cushion '+str(i),p,dim,'ReadingNook',soft);sage_atlas(obs)
# Existing original curved textile, normalized to a folded stack on the bench.
original=next(o for o in source.objects if o.get('phase4b_name')=='Sage draped blanket')
for layer in range(2):
    cp=original.copy();cp.data=original.data.copy();zones['ReadingNook'].objects.link(cp);cp.parent=soft;cp.name='Cream folded nook blanket '+str(layer)
    lo=Vector([min(v.co[i] for v in cp.data.vertices) for i in range(3)]);hi=Vector([max(v.co[i] for v in cp.data.vertices) for i in range(3)])
    for v in cp.data.vertices:v.co=Vector((2.85+(v.co.x-lo.x)/(hi.x-lo.x)*.45-.225,-.16+(v.co.y-lo.y)/(hi.y-lo.y)*.54-.27,.65+layer*.026+(v.co.z-lo.z)/(hi.z-lo.z)*.025))
    cp.data.materials.clear();cp.data.materials.append(linen)
# Deep right window assembly: real jambs/reveal, sill, glazing bay and hardware.
for y in [-.57,2.64]:
    box('Window reveal jamb',(3.79,y,1.65),(.24,.15,1.64),darkwood,'ReadingNook',.018)
    box('Window facing stile',(3.65,y,1.65),(.07,.19,1.76),wood,'ReadingNook',.015)
for z in [.84,2.46]:
    box('Window reveal rail',(3.79,1.035,z),(.24,3.3,.13),darkwood,'ReadingNook',.015)
    box('Window face rail',(3.65,1.035,z),(.07,3.42,.14),wood,'ReadingNook',.015)
box('Broad window ledge',(3.60,1.035,.77),(.56,3.5,.12),wood,'ReadingNook',.022)
for y in [.5,1.57]:box('Window divided-light mullion',(3.70,y,1.65),(.075,.055,1.52),wood,'ReadingNook',.009)
box('Window horizontal crosspiece',(3.69,1.035,1.65),(.08,3.14,.055),wood,'ReadingNook',.009)
box('Window lower wall cutaway',(3.86,1.035,.38),(.13,3.2,.7),ivory,'ReadingNook')
# The rear exterior panel is behind the frame with real depth; front sight line is open.
box('Exterior sky depth plane',(4.02,1.36,1.66),(.016,2.52,1.42),sky,'ReadingNook',0)
for y in [.47,1.59]:box('Window brass latch',(3.64,y,1.57),(.025,.025,.12),brass,'ReadingNook',.006)
# The nook remains a source-derived upholstered bench with a clearly visible base.
box('Nook base oak face',(3.03,.37,.23),(1.4,1.48,.075),wood,'ReadingNook',.018)
# Fix malformed source stair side strips with structural timber, preserving the treads.
for o in list(scene.objects):
    if o.get('phase4b_name','').startswith('Open timber staircase / Group'):remove(o)
for x in [.36,1.03]:
    start=Vector((x,-1.45,.1));end=Vector((x,1.04,2.29));mid=(start+end)/2
    beam=box('Stair oak stringer',mid,(.075,.12,(end-start).length),darkwood,'Loft',.01);beam.rotation_euler=(end-start).to_track_quat('Z','Y').to_euler()
# Curated botanical replacements from the inspected pack; keep their source UVs.
for file,name,p,h,angle in [
 ('monstera_plant_large_potted','Entrance monstera',(-3.35,-2.0,.03),1.0,.3),
 ('yucca_plant_large_potted','Floor yucca',(-.12,1.84,.03),.92,-.4),
 ('monstera_plant_small_potted','Desk monstera',(-2.67,1.7,.83),.38,.8),
 ('pothos_plant_small_potted','Window pothos',(3.50,.85,.85),.4,.5),
 ('pothos_plant_small_potted','Loft trailing planter',(.05,1.55,2.5),.35,-.5),
 ('monstera_plant_medium_potted','Archive monstera',(-3.12,2.12,1.55),.45,.3),
 ('monstera_plant_small_potted','Design accent',(2.59,-1.86,.65),.31,-.7),
 ('pothos_vine_large_A','Loft cascading pothos',(.05,1.10,1.24),1.25,.1),
 ('pothos_vine_medium_C','Window cascading pothos',(3.59,2.3,1.57),.79,1.2)]:
    source_asset(plants/(file+'.gltf'),name,p,None,'PlantsAndDecor',height=h,rotation=angle)
# Contrast comes from broad warm directional light and lower ambient fill.
bg=scene.world.node_tree.nodes.get('Background');bg.inputs['Strength'].default_value=.35
for o in scene.objects:
    if o.type=='LIGHT':
        n=o.get('phase4b_name','')
        if n=='Soft afternoon':o.data.energy=760
        if n=='Window fill':o.data.energy=460
        if n=='Loft warm fill':o.data.energy=300
        if o.get('phase4c_name','').startswith('Warm side-window sun'):o.data.energy=620;o.data.size=2.2
scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=True;scene.view_settings.view_transform='AgX';scene.view_settings.look='None';scene.render.film_transparent=True
scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG'
out=ROOT/'docs/portfolio/evidence/phase4d';out.mkdir(parents=True,exist_ok=True);scene.render.filepath=str(out/'blender-source-studio.png')
bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4d.blend'))
(out/'source-replacements.json').write_text(json.dumps({'removedWeakSourceObjects':removed,'addedSourceAssets':added,'sourceObjects':len(scene.objects),'stableIDs':sorted(roots),'softShadingSeparate':True},indent=2))
result={'source':scene.name,'objects':len(scene.objects),'newSourceAssets':len(added),'file':bpy.data.filepath}
