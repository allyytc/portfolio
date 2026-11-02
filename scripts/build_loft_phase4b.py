"""Expand the retained 4A source into a zoned loft. No prior scene is replaced."""
import bpy,math,random,json,re,xml.etree.ElementTree as ET
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];random.seed(82)
if bpy.data.scenes.get('PortfolioLoft4B'):raise RuntimeError('Existing loft source preserved; do not overwrite edits.')
source=bpy.data.scenes['PortfolioDesk4A'];scene=bpy.data.scenes.new('PortfolioLoft4B');bpy.context.window.scene=scene
evidence=ROOT/'docs/portfolio/evidence/phase4b';evidence.mkdir(parents=True,exist_ok=True)
zones={}
for n in ['Entrance','Workstation','DesignCorner','CommunityWall','ReadingNook','Loft','Archive','ExternalLinks','PlantsAndDecor','LightingAndCamera']:
    c=bpy.data.collections.new(n);scene.collection.children.link(c);zones[n]=c
def link(o,zone):
    for c in list(o.users_collection):c.objects.unlink(o)
    zones[zone].objects.link(o)
roots={}
def root(name,zone):
    if name not in roots:
        o=bpy.data.objects.new(name,None);zones[zone].objects.link(o);o['stable_id']=name;roots[name]=o
    return roots[name]
root('StudioStatic','Workstation')
def material(name,color,rough=.65,metal=0):
    m=bpy.data.materials.new('Loft_'+name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;m.diffuse_color=(*color,1);return m
cream=material('Cream plaster',(.79,.75,.66),.9);ivory=material('Warm ivory',(.87,.83,.72),.65)
sage=material('Sage fabric',(.27,.38,.25),.93);sageLight=material('Light sage',(.4,.49,.32),.87)
blush=material('Muted blush',(.57,.35,.3),.9);ink=material('Dark sage ink',(.035,.065,.037),.7)
leaf=material('Leaf',(.13,.27,.075),.73);leaflight=material('Leaf light',(.26,.38,.12),.7)
brass=material('Aged brass',(.34,.23,.08),.4,.65);soil=material('Soil',(.055,.032,.014),.95)
paper=material('Book paper',(.89,.86,.76),.9);linen=material('Linen',(.65,.61,.48),.98)
wood=material('Honey oak',(.58,.34,.17),.58);darkwood=material('Oak end grain',(.28,.15,.065),.65)
oak=bpy.data.images.load(str(ROOT/'assets/blender/textures/oak-grain.png'),check_existing=True)
for m in [wood,darkwood]:
    nodes=m.node_tree.nodes;tex=nodes.new('ShaderNodeTexImage');tex.image=oak;coord=nodes.new('ShaderNodeTexCoord');mapping=nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(1.4,1.4,1.4)
    m.node_tree.links.new(coord.outputs['Generated'],mapping.inputs['Vector']);m.node_tree.links.new(mapping.outputs[0],tex.inputs[0])
    p=nodes.get('Principled BSDF');mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=((.68,.58,.43,1) if m==darkwood else (1,.95,.87,1))
    m.node_tree.links.new(tex.outputs['Color'],mix.inputs[1]);m.node_tree.links.new(mix.outputs[0],p.inputs['Base Color'])
    bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.13;bump.inputs['Distance'].default_value=.001;m.node_tree.links.new(tex.outputs['Color'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs[0],p.inputs['Normal'])
def finish(o,m,zone,group='StudioStatic',bevel=0):
    link(o,zone);world=o.matrix_world.copy();o.parent=root(group,zone);o.matrix_world=world;o.data.materials.clear();o.data.materials.append(m)
    if bevel:
        b=o.modifiers.new('Crafted edge','BEVEL');b.width=bevel;b.segments=3
    if o.type=='MESH':
        for p in o.data.polygons:p.use_smooth=True
        b=o.modifiers.new('Surface normals','WEIGHTED_NORMAL');b.keep_sharp=True
    return o
def box(n,p,d,m,zone,bevel=.015,group='StudioStatic'):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,m,zone,group,bevel)
def cylinder(n,p,r,depth,m,zone,group='StudioStatic'):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=r,depth=depth,location=p);o=bpy.context.object;o.name=n;return finish(o,m,zone,group,.005)
def line(n,points,r,m,zone,group='StudioStatic'):
    d=bpy.data.curves.new(n,'CURVE');d.dimensions='3D';d.resolution_u=10;d.bevel_depth=r;d.bevel_resolution=2;s=d.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for p,co in zip(s.bezier_points,points):p.co=co;p.handle_left_type=p.handle_right_type='AUTO'
    o=bpy.data.objects.new(n,d);zones[zone].objects.link(o);o.parent=root(group,zone);d.materials.append(m);return o
font=bpy.data.fonts.load(str(ROOT/'assets/source/nunito/Nunito-ExtraBold.ttf'))
def text(n,body,p,size=.1,m=ink,zone='Entrance',group='StudioStatic',flat=False):
    d=bpy.data.curves.new(n,'FONT');d.body=body;d.font=font;d.size=size;d.align_x='CENTER';d.align_y='CENTER';d.extrude=.0005;d.resolution_u=2
    o=bpy.data.objects.new(n,d);zones[zone].objects.link(o);o.parent=root(group,zone);o.location=p
    if not flat:o.rotation_euler.x=math.pi/2
    d.materials.append(m);return o
def imported(file,n,p,dims,zone,rotation=0,group='StudioStatic',fabric=sage):
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/source/kenney-furniture-kit'/f'{file}.glb'))
    obs=list(set(bpy.data.objects)-before);bpy.context.view_layer.update();verts=[o.matrix_world@Vector(c) for o in obs if o.type=='MESH' for c in o.bound_box]
    lo=Vector([min(v[i] for v in verts) for i in range(3)]);hi=Vector([max(v[i] for v in verts) for i in range(3)]);center=Vector(((hi.x+lo.x)/2,(hi.y+lo.y)/2,lo.z))
    r=bpy.data.objects.new(n,None);zones[zone].objects.link(r);r.parent=root(group,zone)
    for o in obs:
        link(o,zone)
        if not o.parent or o.parent not in obs:o.parent=r;o.location-=center
        if o.type=='MESH':
            o.name=n+' / '+o.name
            for i,m in enumerate(o.data.materials):
                key=m.name.lower();o.data.materials[i]=(wood if 'wood' in key else fabric if any(t in key for t in ['carpet','fabric','red','blue','green']) else ink if 'dark' in key else ivory)
            for poly in o.data.polygons:poly.use_smooth=True
            mod=o.modifiers.new('Refined source bevel','BEVEL');mod.width=.006;mod.segments=3
            mod=o.modifiers.new('Weighted source normals','WEIGHTED_NORMAL');mod.keep_sharp=True
    r.scale=[dims[i]/max(hi[i]-lo[i],.0001) for i in range(3)];r.location=p;r.rotation_euler.z=rotation
    return r,obs
# Preserve editable workstation hierarchy, applying zone offsets only at roots.
copies={};mats={};work_offset=Vector((-1.65,1.25,0));sign_offset=Vector((-1.7,-1.72,0))
for o in source.objects:
    if o.type not in {'MESH','FONT','CURVE','EMPTY'}:continue
    n=o.get('source_name',o.name)
    if n=='Oak plinth' or n.startswith('Inset oak floorboard'):continue
    ancestor=o
    while ancestor.parent:ancestor=ancestor.parent
    g=ancestor.get('source_name',ancestor.name)
    zone='Entrance' if g=='projects_sign' else 'Workstation'
    cp=o.copy()
    if o.data:cp.data=o.data.copy()
    zones[zone].objects.link(cp);copies[o]=cp;cp['phase4a_source_name']=n
    if cp.type in {'MESH','FONT','CURVE'}:
        for i,m in enumerate(cp.data.materials):
            if m not in mats:mats[m]=m.copy()
            cp.data.materials[i]=mats[m]
        if any(t in n for t in ['SageChair','Chair ','Twin caster','Caster hub']) and cp.type=='MESH':
            chosen=sage if any(t in n for t in ['padded','cushioned','seam']) else ivory if any(t in n for t in ['shell','arm','frame','SageChair']) else ink
            for i in range(len(cp.data.materials)):cp.data.materials[i]=chosen
            for mod in cp.modifiers:
                if mod.type=='BEVEL':mod.segments=5
for o,cp in copies.items():
    cp.parent=copies.get(o.parent);cp.matrix_local=o.matrix_local.copy()
    if not o.parent:
        g=o.get('source_name',o.name);cp.location+=(sign_offset if g=='projects_sign' else work_offset)
        if g in {'printer','resume_paper'}:cp.location+=Vector((-.23,-1.0,0))
        group={'Static':'StudioStatic','projects_monitor':'ProjectsMonitor','projects_sign':'ProjectsSign','printer':'PrinterBody','resume_paper':'ResumePaper'}.get(g)
        if group:
            if group=='StudioStatic':
                # Retain source empty locally beneath the common static root.
                cp.parent=roots['StudioStatic']
            else:cp.name=group;roots[group]=cp;cp['stable_id']=group
    if cp.get('phase4a_source_name')=='PrinterCabinet':cp.location+=Vector((-.23,-1.0,0))
    if cp.type=='MESH' and cp.data.uv_layers:cp.data.uv_layers[0].name='SurfaceUV'
# Floor thickness, staggered oak boards and a visible entrance step.
box('Floor foundation',(0,0,-.17),(7.8,5.8,.3),darkwood,'Entrance',.045)
for i in range(26):
    x=-3.75+i*.3
    for j in range(3):
        y=-1.93+j*1.94;box(f'Oak floor {i:02d} {j}',(x,y,-.006),(.293,1.93,.025),wood,'Entrance',.003)
box('Front edge trim',(0,-2.91,-.11),(7.83,.09,.18),wood,'Entrance',.018)
box('Entrance step',(-3.0,-3.08,-.24),(1.5,.45,.16),wood,'Entrance',.025)
# Cutaway walls; right wall contains a real opening rather than a blue rectangle.
box('Rear plaster wall',(0,2.84,2.0),(7.8,.16,4),cream,'Loft',.015)
box('Left rear return',(-3.84,1.82,1.75),(.16,2.1,3.5),cream,'Workstation',.015)
box('Window wall below',(3.84,1.34,.12),(.16,2.9,.24),cream,'ReadingNook',.015)
box('Window wall header',(3.84,1.34,3.05),(.16,2.9,.12),cream,'ReadingNook',.015)
for y in [.02,2.8]:box('Window wall pier',(3.84,y,1.91),(.16,.18,2.3),cream,'ReadingNook',.01)
for x in [-3.7,-.3,3.7]:box('Rear structural post',(x,2.68,2),(.16,.18,4),darkwood,'Loft',.015)
for z in [.14,2.47,3.85]:box('Rear structural beam',(0,2.67,z),(7.6,.2,.16),wood,'Loft',.018)
# Loft over rear/right zone. Front edge ends behind the visible reading nook.
box('Loft deck',(1.75,1.92,2.39),(4.05,1.66,.16),wood,'Loft',.022)
for x in [-.2,3.7]:box('Loft support column',(x,1.16,1.19),(.13,.16,2.38),wood,'Loft',.015)
for i in range(14):box('Loft deck board',(-.18+i*.293,1.92,2.485),(.284,1.64,.025),wood,'Loft',.004)
for x in [1.0,1.58,2.16,2.74,3.32,3.72]:box('Loft baluster',(x,1.09,2.83),(.055,.065,.65),darkwood,'Loft',.009)
box('Loft handrail',(2.36,1.09,3.17),(2.88,.09,.09),wood,'Loft',.02)
box('Loft lower rail',(2.36,1.09,2.6),(2.88,.065,.065),wood,'Loft',.01)
# Open stair source, no solid block mass. Check direction from source bbox.
stairs,stairparts=imported('stairsOpen','Open timber staircase',(.7,-.23,.025),(2.6,.83,2.36),'Loft',rotation=math.pi/2)
line('Stair handrail',[(.88,-1.45,.76),(.88,-.25,1.83),(.88,1.05,3.04)],.025,wood,'Loft')
for y,z in [(-1.44,.03),(-.25,1.05),(1.04,2.35)]:box('Stair rail post',(.88,y,z+.37),(.045,.045,.74),wood,'Loft',.008)
bed,_=imported('bedDouble','Loft bed',(2.2,2.0,2.51),(1.28,2.7,.53),'Loft',rotation=math.pi/2,fabric=sage)
for p,d,f in [((1.55,2.32,3.04),(.6,.4,.18),ivory),((2.2,2.32,3.04),(.6,.4,.18),blush)]:imported('pillow','Bed pillow',p,d,'Loft',fabric=f)
# A tailored curved blanket surface follows the existing mattress, with a sewn hem.
verts=[];faces=[]
for i in range(25):
    x=1.0+i*.1
    for j in range(13):
        y=1.43+j*.066;z=2.99+math.sin(i*.42)*.012+math.sin(j*.7)*.008
        if j<2:z-=.2*(2-j)/2
        verts.append((x,y,z))
for i in range(24):
    for j in range(12):a=i*13+j;faces.append((a,a+13,a+14,a+1))
mesh=bpy.data.meshes.new('Draped blanket');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('Sage draped blanket',mesh);zones['Loft'].objects.link(o);finish(o,sageLight,'Loft');solid=o.modifiers.new('Textile thickness','SOLIDIFY');solid.thickness=.008
line('Blanket sewn hem',[(1+i*.1,1.43,2.79+math.sin(i*.42)*.012) for i in range(25)],.004,ivory,'Loft')
# Defined window frame on the side wall, no opaque pane obscures the interior.
for y in [.05,1.34,2.62]:box('Side window mullion',(3.74,y,1.92),(.14,.085,2.18),wood,'ReadingNook',.01)
for z in [.86,1.92,3.0]:box('Side window transom',(3.73,1.34,z),(.16,2.72,.085),wood,'ReadingNook',.012)
box('Deep window sill',(3.64,1.34,.81),(.43,2.79,.09),wood,'ReadingNook',.02)
# Framed window sky: emission backdrop beyond opening, visible from inside only.
sky=material('Window sky',(.65,.77,.79),.8)
sp=sky.node_tree.nodes.get('Principled BSDF');sp.inputs['Emission Color'].default_value=(.65,.77,.79,1);sp.inputs['Emission Strength'].default_value=.22
# Window intentionally remains clear so the nook is visible from the cutaway camera.
imported('benchCushion','Window reading bench',(2.96,.38,.04),(1.38,1.58,.55),'ReadingNook',rotation=math.pi/2,fabric=ivory)
for p,d,f in [((3.23,.8,.6),(.23,.51,.38),sage),((3.23,.23,.6),(.23,.45,.36),blush)]:imported('pillow','Reading cushion',p,d,'ReadingNook',fabric=f)
imported('tableRound','Nook side table',(2.6,-.8,.04),(.5,.5,.48),'ReadingNook')
imported('books','Reading stack',(2.6,-.8,.53),(.3,.19,.1),'ReadingNook')
imported('lampRoundFloor','Reading lamp',(3.35,-.9,.04),(.35,.35,1.35),'ReadingNook')
text('Reading nook destination','ABOUT',(2.81,-.425,.47),.085,ink,'ReadingNook','AboutBook')
# Design workstation and actual portfolio media, never an invented Unwrap screen.
imported('tableCoffee','Design desk',(1.9,-1.89,.035),(1.65,.85,.6),'DesignCorner')
imported('pillowLong','Design seat',(1.57,-2.4,.055),(.58,.43,.16),'DesignCorner',fabric=blush)
tablet=box('Unwrap tablet housing',(2.35,-1.82,.72),(.58,.055,.43),ink,'DesignCorner',.022,'UnwrapDisplay');tablet.rotation_euler.x=-.22
box('Unwrap neutral screen',(2.35,-1.86,.73),(.51,.008,.35),ivory,'DesignCorner',.012,'UnwrapDisplay')
text('Unwrap verified status','Unwrap',(2.35,-1.872,.79),.071,ink,'DesignCorner','UnwrapDisplay')
text('Unwrap no fabricated UI','Content pending',(2.35,-1.873,.68),.033,ink,'DesignCorner','UnwrapDisplay')
# Modelled bound volumes: covers, inset page blocks, spine and elastic closure.
def notebook(n,p,w,h,cover,group):
    x,y,z=p;box(n+' lower cover',(x,y,z),(w,h,.018),cover,'DesignCorner',.012,group)
    box(n+' pages',(x,y,z+.025),(w-.026,h-.02,.034),paper,'DesignCorner',.007,group)
    box(n+' upper cover',(x,y,z+.047),(w,h,.018),cover,'DesignCorner',.012,group)
    box(n+' spine',(x-w/2+.012,y,z+.024),(.026,h,.062),cover,'DesignCorner',.009,group)
    box(n+' elastic',(x+w*.32,y,z+.059),(.012,h+.01,.004),ink,'DesignCorner',.002,group)
notebook('Sticker collection',(1.62,-1.9,.65),.46,.38,sage,'StickerBook')
text('Sticker cover title','STICKERS',(1.62,-1.91,.712),.05,ivory,'DesignCorner','StickerBook',True)
notebook('Sketchbook',(1.12,-1.88,.65),.38,.43,linen,'Sketchbook')
for i in range(4):
    line('Design pencil',[(1.02+i*.035,-1.8,.715),(1.02+i*.035,-1.56,.715)],.005,[sage,blush,ink,wood][i],'DesignCorner','Sketchbook')
# Media texture is owner source artwork; labels never imply a fake event photograph.
def image_surface(n,path,p,dims,zone,group,flat=False):
    img=bpy.data.images.load(str(ROOT/'assets/source/portfolio-media'/path),check_existing=True);img.pack()
    m=material(n+' image',(1,1,1),.85);tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=img;pbr=m.node_tree.nodes.get('Principled BSDF');m.node_tree.links.new(tex.outputs['Color'],pbr.inputs['Base Color'])
    bpy.ops.mesh.primitive_plane_add(size=1,location=p);o=bpy.context.object;o.name=n
    o.scale=(dims[0],dims[1],1)
    if not flat:o.rotation_euler.x=math.pi/2
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);finish(o,m,zone,group)
image_surface('Actual sleeping beaver sticker','sleeping-beaver.png',(1.57,-1.8,.715),(.1,.1),'DesignCorner','StickerBook',True)
# Pegboard crafted from frame, cork and repeated dowel holes; independent slots.
box('Community oak frame',(-1.6,2.58,1.84),(2.08,.13,1.17),wood,'CommunityWall',.025)
cork=material('Cork',(.48,.32,.15),.95)
box('Community cork inset',(-1.6,2.5,1.84),(1.94,.025,1.04),cork,'CommunityWall',.01)
for row in range(5):
    for col in range(12):
        o=cylinder('Pegboard hole',(-2.5+col*.16,2.481,1.43+row*.2),.008,.004,darkwood,'CommunityWall');o.rotation_euler.x=math.pi/2
labels=[('Engineering Student Council','ESC'),('Startup Hub','StartupHub'),('Design for America','DFA'),('BeaverHacks','BeaverHacks'),('AI Club','AIClub'),('BeaverHacks 2026','BeaverHacks2026'),('Innovation Jam 2026','InnovationJam2026'),('Engineers’ Week','EngineersWeek')]
for i,(label,ident) in enumerate(labels):
    x=-2.29+(i%4)*.46;z=2.065-(i//4)*.43;group='Community_'+ident
    box(label+' frame',(x,2.46,z),(.405,.035,.34),ivory,'CommunityWall',.009,group)
    box(label+' reserved photo',(x,2.437,z+.016),(.355,.008,.25),sageLight,'CommunityWall',.005,group)
    text(label+' reserved label',label.replace('Engineering Student Council','Eng. Council'),(x,2.428,z-.105),.027,ink,'CommunityWall',group)
    text(label+' pending image','MEDIA RESERVED',(x,2.427,z+.025),.019,ivory,'CommunityWall',group)
    roots[group]['content_status']='reserved; no fabricated event photo or organization logo'
image_surface('Actual Startup Hub design','startup-hub.png',(-1.83,2.425,2.08),(.33,.23),'CommunityWall','Community_StartupHub')
image_surface('Actual Innovation Jam sticker','innovation-lightbulb.png',(-1.37,2.425,1.65),(.19,.19),'CommunityWall','Community_InnovationJam2026')
# Archive clear physical destinations, distinct from Resume.
imported('bookcaseOpen','Skills archive cabinet',(-3.17,2.06,.035),(.85,.52,1.5),'Archive')
imported('bookcaseOpenLow','Experience shelf',(1.65,-2.57,.035),(1.45,.35,.63),'Archive')
for i,(label,group,x,z) in enumerate([('SKILLS','SkillsVolume',-3.2,.85),('EXPERIENCE','ExperienceVolume',1.62,.4)]):
    for j in range(5):
        box(label+' bound volume',(x-.23+j*.105,1.91 if i==0 else -2.58,z),(.075,.25,.3),[sage,ivory,blush,linen,wood][j],'Archive',.007,group)
    text(label+' spine label',label,(x,1.765 if i==0 else -2.765,z-.05),.051,ink,'Archive',group)
imported('cardboardBoxClosed','Archive box',(-3.16,2.05,.22),(.52,.3,.22),'Archive')
# Additional signs share the suspended boards' warm timber / cream lettering.
for i,(label,ident) in enumerate([('ABOUT','AboutSign'),('COMMUNITY','CommunitySign'),('CONTACT','ContactSign')]):
    z=.73-i*.245;box(label+' hanging sign',(-3.28,-1.49,z),(.88,.09,.2),wood,'Entrance',.025,ident)
    text(label+' raised label',label,(-3.28,-1.543,z),.064,ivory,'Entrance',ident)
# Social plaques: actual licensed SVG outlines converted to shallow relief curves.
def svg_relief(file,name,center,size,mat,zone,group):
    svg=ET.parse(ROOT/'assets/source/fontawesome'/file).getroot();vb=[float(x) for x in svg.attrib['viewBox'].split()];path=next(e.attrib['d'] for e in svg.iter() if e.tag.endswith('path'))
    tokens=re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?',path)
    curves=[];points=[];pos=Vector((0.,0.));start=pos.copy();lastcontrol=None;cmd=None;i=0
    def pair(a):return Vector((a[0],a[1]))
    while i<len(tokens):
        if tokens[i].isalpha():cmd=tokens[i];i+=1
        low=cmd.lower();relative=cmd.islower()
        if low=='z':
            if points:curves.append(points);points=[]
            pos=start.copy();cmd=None;continue
        count={'m':2,'l':2,'c':6,'s':4,'h':1,'v':1,'a':7}[low];a=list(map(float,tokens[i:i+count]));i+=count;origin=pos.copy()
        if low in {'m','l'}:
            end=pair(a)+(origin if relative else Vector((0,0)));pos=end;points.append(pos.copy())
            if low=='m':start=pos.copy();cmd='l' if relative else 'L'
            lastcontrol=None
        elif low in {'h','v'}:
            axis=0 if low=='h' else 1;pos[axis]=pos[axis]+a[0] if relative else a[0];points.append(pos.copy());lastcontrol=None
        elif low in {'c','s'}:
            if low=='c':c1=pair(a[:2]);c2=pair(a[2:4]);end=pair(a[4:]);c1+=(origin if relative else Vector((0,0)))
            else:c1=2*origin-lastcontrol if lastcontrol is not None else origin;c2=pair(a[:2]);end=pair(a[2:])
            c2+=(origin if relative else Vector((0,0)));end+=(origin if relative else Vector((0,0)))
            for k in range(1,9):
                t=k/8;points.append((1-t)**3*origin+3*(1-t)**2*t*c1+3*(1-t)*t*t*c2+t**3*end)
            pos=end;lastcontrol=c2
        elif low=='a':
            # The selected LinkedIn glyph uses circular arcs for its dot only.
            rx,ry,angle,large,sweep,x,y=a;end=Vector((x,y))+(origin if relative else Vector((0,0)))
            delta=end-origin;mid=(origin+end)/2;r=max(rx,delta.length/2);normal=Vector((-delta.y,delta.x)).normalized();height=math.sqrt(max(0,r*r-delta.length_squared/4));center2=mid+normal*height*(1 if large!=sweep else -1)
            aa=math.atan2(origin.y-center2.y,origin.x-center2.x);bb=math.atan2(end.y-center2.y,end.x-center2.x);s=(bb-aa)%(2*math.pi)
            if not sweep:s=s-2*math.pi
            for k in range(1,17):t=aa+s*k/16;points.append(center2+Vector((r*math.cos(t),r*math.sin(t))))
            pos=end;lastcontrol=None
    if points:curves.append(points)
    d=bpy.data.curves.new(name,'CURVE');d.dimensions='2D';d.fill_mode='BOTH';d.extrude=.002;d.resolution_u=1
    scale=size/max(vb[2:]);
    for outline in curves:
        s=d.splines.new('POLY');s.points.add(len(outline)-1)
        for p,v in zip(s.points,outline):p.co=((v.x-vb[2]/2)*scale,(vb[3]/2-v.y)*scale,0,1)
        s.use_cyclic_u=True
    o=bpy.data.objects.new(name,d);zones[zone].objects.link(o);o.parent=root(group,zone);o.location=center;o.rotation_euler.x=math.pi/2;d.materials.append(mat)
blue=material('LinkedIn blue',(.008,.18,.39),.5)
for x,ident,filename,background,foreground in [(1.24,'ExternalGitHub','github.svg',ivory,ink),(1.94,'ExternalLinkedIn','linkedin-in.svg',blue,ivory)]:
    box(ident+' plaque',(x,-2.61,.94),(.57,.12,.57),background,'ExternalLinks',.055,ident)
    svg_relief(filename,ident+' relief',(x,-2.678,.94),.38,foreground,'ExternalLinks',ident)
    roots[ident]['destination']='https://github.com/allyytc' if ident=='ExternalGitHub' else 'https://linkedin.com/in/allyychen/'
# Reuse the original curved 4A leaf mesh/stem family as linked botanical clusters.
leaves=[o for o in source.objects if o.name.startswith('Handcrafted curved plant leaf')]
def plant(n,p,scale=.7):
    x,y,z=p;imported('plantSmall1',n+' ceramic planter',(x,y,z),(.24*scale,.24*scale,.2*scale),'PlantsAndDecor')
    origin=Vector((1.65,.65,.24))
    for original in leaves[:17]:
        cp=original.copy();cp.data=original.data.copy();zones['PlantsAndDecor'].objects.link(cp);cp.parent=root('StudioStatic','Workstation');cp.name=n+' curved leaf';cp.location=Vector((x,y,z+.12*scale))-origin*scale;cp.scale=(scale,)*3
def vine(n,p,length=.8):
    x,y,z=p;points=[(x+.055*math.sin(i*.75),y-.02*i,z-i*length/12) for i in range(13)];line(n+' trailing stem',points,.006,leaf,'PlantsAndDecor')
    for i in range(1,13):
        px,py,pz=points[i];side=(-1)**i
        # Curved, closed leaf surface with a raised center ridge.
        vv=[(px,py,pz),(px+side*.075,py-.026,pz+.025),(px+side*.12,py-.03,pz-.035),(px+side*.035,py-.018,pz-.065),(px+side*.055,py-.055,pz-.018)]
        me=bpy.data.meshes.new('Vine leaf');me.from_pydata(vv,[],[(0,1,4),(1,2,4),(2,3,4),(3,0,4)]);ob=bpy.data.objects.new(n+' leaf',me);zones['PlantsAndDecor'].objects.link(ob);finish(ob,leaf if i%3 else leaflight,'PlantsAndDecor');sub=ob.modifiers.new('Organic leaf','SUBSURF');sub.levels=sub.render_levels=2
for n,p,s in [('Loft shelf plant',(.17,2.36,2.5),.65),('Window plant',(3.48,-.65,.88),.6),('Entrance plant',(-3.5,-2.55,.03),.85),('Archive plant',(-3.15,2.1,1.55),.5),('Shelf plant',(2.43,-2.56,.7),.55),('Bedside plant',(3.36,2.25,2.55),.5)]:plant(n,p,s)
vine('Loft hanging vine',(-.2,1.13,2.5),1.25);vine('Window hanging vine',(3.56,2.3,3),1.2);vine('Front shelf vine',(2.48,-2.74,.76),.58)
# One small original bunny relief on entrance board, not a borrowed character.
for center,r in [((-3.56,-1.555,1.44),.04),((-3.58,-1.555,1.505),.018),((-3.54,-1.555,1.505),.018)]:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=r,location=center);o=bpy.context.object;o.name='Subtle bunny sign relief';o.scale.y=.22
    if r<.02:o.scale.z=1.9
    finish(o,ivory,'Entrance',group='ProjectsSign')
# Lighting and matching orthographic camera. Windows remain clear cutaway geometry.
scene.world=source.world.copy();bg=next(n for n in scene.world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs['Color'].default_value=(.78,.8,.72,1);bg.inputs['Strength'].default_value=.5
for name,pos,energy,size,color in [('Soft afternoon',(-3,-4,8),1100,5,(1,.88,.7)),('Window fill',(5,-1,5),800,4,(.88,.94,1)),('Loft warm fill',(0,4,7),650,4,(1,.86,.65))]:
    d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.size=size;d.color=color;o=bpy.data.objects.new(name,d);zones['LightingAndCamera'].objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,1.3))-o.location).to_track_quat('-Z','Y').to_euler()
camdata=bpy.data.cameras.new('Loft isometric');cam=bpy.data.objects.new('Loft isometric',camdata);zones['LightingAndCamera'].objects.link(cam);cam.location=(9,-13,9.5);target=Vector((0,0,1.55));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();camdata.type='ORTHO';camdata.ortho_scale=11.2;scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True;scene.view_settings.view_transform='AgX';scene.view_settings.look='None'
scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(evidence/'blender-studio.png')
for img in bpy.data.images:
    if img.source=='FILE' and not img.packed_file:
        try:img.pack()
        except RuntimeError:pass
scene['phase']='4B construction; Phase 4C polish and Phase 5 behaviors deferred'
scene['chair']='sage upholstery, cream shell/frame/armrests; supersedes 4A black'
bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4b.blend'))
centers={name:list(o.matrix_world.translation) for name,o in roots.items()}
(evidence/'source-scene.json').write_text(json.dumps({'scene':scene.name,'objects':len(scene.objects),'collections':list(zones),'roots':centers,'camera':list(cam.location),'target':list(target)},indent=2))
result={'scene':scene.name,'objects':len(scene.objects),'source':bpy.data.filepath,'rootNames':list(roots)}
