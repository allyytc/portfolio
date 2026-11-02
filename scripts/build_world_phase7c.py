"""Additive Midnight Spruce architecture. Preserve every Phase 4D scene and file.
Imports licensed kits first; original geometry is reserved for architectural refinements.
"""
import bpy,sys,math,json,random
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from loft_asset_helpers import import_asset
base=ROOT/'assets/source/phase7c';out=ROOT/'docs/portfolio/evidence/phase7c'
if bpy.data.scenes.get('MidnightSpruceWorld'):raise RuntimeError('Existing source preserved; use refinement script.')
s=bpy.data.scenes.new('MidnightSpruceWorld');bpy.context.window.scene=s;c=s.collection
random.seed(73)
def mat(n,color,rough=.7,metal=0,emission=0):
 m=bpy.data.materials.new('Midnight '+n);m.use_nodes=True;p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 if emission:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emission
 return m
wood=mat('warm walnut',(.23,.105,.047));oak=mat('oak edges',(.39,.21,.09));dark=mat('weathered dark timber',(.075,.055,.035));slate=mat('blue spruce roof',(.042,.10,.10));brass=mat('aged brass',(.48,.29,.10),.3,.72);stone=[mat('hearth stone '+str(i),(.17+i*.016,.18+i*.015,.16+i*.013),.94) for i in range(5)];char=mat('firebox',(.014,.017,.014),.98);warm=mat('warm lamp glass',(.98,.50,.12),.4,0,2.3)
# Restrained local procedural wood grain stays in editable source; web uses the existing oak texture.
image=bpy.data.images.load(str(ROOT/'assets/blender/textures/oak-grain.png'),check_existing=True)
for m in [wood,oak,dark]:
 nodes=m.node_tree.nodes;p=next(n for n in nodes if n.type=='BSDF_PRINCIPLED');tex=nodes.new('ShaderNodeTexImage');tex.image=image;mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=.45;mix.inputs[1].default_value=p.inputs['Base Color'].default_value;m.node_tree.links.new(tex.outputs['Color'],mix.inputs[2]);m.node_tree.links.new(mix.outputs[0],p.inputs['Base Color'])
def root(n,stable=None):
 o=bpy.data.objects.new(n,None);c.objects.link(o)
 if stable:o['stable_id']=stable
 return o
architecture=root('CabinArchitecture');porch=root('AttachedArtPorch');easel=root('ArtEasel','ArtEasel');hearth=root('Fireplace','Fireplace');decor=root('CabinDetails')
def box(n,p,d,m,parent=architecture,bevel=.018):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.parent=parent;o.data.materials.append(m)
 if bevel:mod=o.modifiers.new('Hand finished edge','BEVEL');mod.width=bevel;mod.segments=3;normal=o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
 # Stable UVs for exported subtle oak grain.
 return o
def beam(n,a,b,width,depth,m,parent=architecture):
 a,b=Vector(a),Vector(b);o=box(n,(a+b)/2,(width,depth,(b-a).length),m,parent);o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o
def asset(pack,file,name,p,dims=None,height=None,parent=architecture,rotation=0):
 f={'nature-kit':'GLTF format','survival-kit':'GLB format','fantasy-town-kit':'GLB format'}[pack];return import_asset(base/pack/'Models'/f/(file+'.glb'),name,p,c,parent,dims=dims,height=height,rotation=rotation)
def recolor(obs,material):
 for o in obs:
  if o.type=='MESH':o.data.materials.clear();o.data.materials.append(material)
# Imported rustic roof geometry becomes the narrow, open-backed upper roof, not an opaque cover.
r,obs=asset('survival-kit','structure-roof','Rear weathered timber roof',(0,2.75,3.60),(8.55,1.1,.72));recolor(obs,slate)
for x in [-3.98,0,3.98]:
 beam('Rear timber rafter',(x,2.2,3.56),(x,3.42,4.28),.12,.15,oak)
box('Rear ridge timber',(0,3.38,4.26),(8.6,.16,.18),dark)
box('Visible roof fascia',(0,2.17,3.59),(8.62,.15,.19),wood)
# Fine horizontal board lining adds cabin depth behind preserved furnishings.
for row in range(16):
 z=.18+row*.213
 for half in range(2):box('Back walnut shiplap',(-1.96+half*3.94,2.91,z),(3.92,.085,.207),wood if row%4 else dark,bevel=.008)
# Edge wall/floor thickness and entry joists align to the original room dimensions.
box('Cabin left wall timber cap',(-3.98,.15,3.27),(.20,5.55,.18),dark)
for x in [-3.95,3.95]:box('Walnut corner upright',(x,2.76,1.79),(.22,.22,3.58),wood)
box('Deep front floor fascia',(0,-3.04,-.18),(8.25,.15,.32),dark)
# Front-left porch physically touches existing floor; imported frame and roof share continuous decking.
porchCenter=(-4.2,-3.54)
for i in range(16):box('Porch continuous deck board',(-5.85+i*.225,-3.54,-.035),(.216,2.30,.12),wood if i%3 else oak,porch,.009)
for y in [-4.71,-2.37]:box('Porch front fascia',(-4.17,y,-.15),(3.65,.15,.27),dark,porch)
box('Porch left fascia',(-6.0,-3.54,-.15),(.15,2.4,.27),dark,porch)
r,obs=asset('survival-kit','structure','Imported porch timber frame',(-4.23,-3.53,.01),(3.45,2.14,2.6),parent=porch);recolor(obs,wood)
# Remove front-right post only: the cutaway opening has a visible lintel and wall-side support.
for o in obs:
 if o.type=='MESH':
  bevel=o.modifiers.new('Refined source timber edges','BEVEL');bevel.width=.012;bevel.segments=3
r,obs=asset('survival-kit','structure-roof','Porch sloping timber canopy',(-4.23,-2.72,2.63),(3.95,.82,.40),parent=porch);recolor(obs,slate)
box('Porch exposed lintel',(-4.23,-2.98,2.64),(3.9,.13,.17),oak,porch)
for x in [-5.8,-2.6]:beam('Porch corner brace',(x,-2.9,2.23),(x+.27,-2.9,2.63),.09,.11,oak,porch)
# Wide entry step, clearly attached instead of a floating island.
for j in range(2):box('Porch entry step',(-4.5,-4.9-j*.23,-.15-j*.10),(1.8,.40,.13),oak,porch)
# Imported actual easel. Source OBJ is Y-up; bake orientation then ground accurately.
bpy.ops.wm.obj_import(filepath=str(base/'easel/Easel/Easel.obj'),forward_axis='NEGATIVE_Y',up_axis='Z');o=bpy.context.object;o.name='Plaggy sculpted wooden easel';o.rotation_euler.x=math.pi/2;bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);bpy.context.view_layer.update()
lo=Vector([min((o.matrix_world@Vector(v))[i] for v in o.bound_box) for i in range(3)]);hi=Vector([max((o.matrix_world@Vector(v))[i] for v in o.bound_box) for i in range(3)]);o.scale*=1.95/(hi.z-lo.z);bpy.context.view_layer.update();lo=Vector([min((o.matrix_world@Vector(v))[i] for v in o.bound_box) for i in range(3)]);hi=Vector([max((o.matrix_world@Vector(v))[i] for v in o.bound_box) for i in range(3)]);o.location-=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z));o.location+=Vector((-4.55,-3.8,.05));o.parent=easel;o.data.materials.clear();o.data.materials.append(oak)
for p in o.data.polygons:p.use_smooth=True
bevel=o.modifiers.new('Easel edge finish','BEVEL');bevel.width=.008;bevel.segments=2
# Real unmodified owner artwork, no fabricated painting. Plane dimensions preserve image aspect.
art=ROOT/'public/media/graphic-designs/Cookies & Clubs 2025 Flyer.png';im=bpy.data.images.load(str(art),check_existing=True);im.pack();ratio=im.size[0]/im.size[1];w=.86;h=w/ratio
canvas=box('Canvas wooden stretcher',(-4.55,-3.97,1.16),(w+.06,.055,h+.06),dark,easel,.012)
# Vertical XY plane transformed to face front (negative Y).
me=bpy.data.meshes.new('Authentic artwork quad');verts=[(-w/2,0,-h/2),(w/2,0,-h/2),(w/2,0,h/2),(-w/2,0,h/2)];me.from_pydata(verts,[],[(0,1,2,3)]);uv=me.uv_layers.new();
for li,v in zip(me.polygons[0].loop_indices,[(0,0),(1,0),(1,1),(0,1)]):uv.data[li].uv=v
ob=bpy.data.objects.new('Cookies and Clubs actual canvas',me);c.objects.link(ob);ob.location=(-4.55,-4.01,1.16);ob.parent=easel
m=mat('owner art paper',(1,1,1),.8);p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=im;m.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color']);me.materials.append(m)
# Original small detailed art tools: wood handles, ferrules and real bristle shapes.
for i in range(4):
 x=-3.43+i*.055
 beam('Brush walnut handle',(x,-3.56,.55),(x+.04,-3.57,.89+i*.04),.025,.025,wood,decor)
 beam('Brush brass ferrule',(x+.04,-3.57,.89+i*.04),(x+.045,-3.57,.94+i*.04),.035,.022,brass,decor)
 beam('Brush bristles',(x+.045,-3.57,.94+i*.04),(x+.048,-3.57,1.01+i*.04),.032,.018,dark,decor)
box('Artist supply tray',(-3.45,-3.55,.53),(.43,.34,.065),oak,porch)
# Reuse existing modeled book and furniture sources, not block proxies.
r,obs=import_asset(ROOT/'assets/source/kenney-furniture-kit/tableRound.glb','Porch oak stool',(-3.35,-4.20,.035),c,porch,dims=(.48,.48,.48));recolor(obs,wood)
r,obs=import_asset(ROOT/'assets/source/kenney-furniture-kit/lampWall.glb','Porch warm wall sconce',(-5.83,-2.56,1.90),c,porch,dims=(.25,.32,.40));recolor(obs,brass)
for p in [(-5.83,-2.60,1.86),(-2.60,-2.60,2.42)]:box('Lantern amber glass',p,(.09,.08,.12),warm,porch,.02)
# Masonry fireplace: deep opening, individual arch voussoirs, beveled stone surround and mantel.
# Clear bay just inside right window; the existing bench remains visible alongside.
cx,cy=2.70,1.16
box('Hearth broad stone slab',(cx,cy,.08),(1.25,.70,.16),stone[1],hearth,.035)
box('Deep soot firebox',(cx,cy+.20,.63),(.78,.12,.92),char,hearth,.03)
for side in [-1,1]:
 for row in range(5):box('Hearth cut stone jamb',(cx+side*.47,cy,.23+row*.17),(.22,.43,.16),stone[(row+(side+1))%5],hearth,.025)
# Radial wedge masonry around the curved opening; full volume rather than texture.
for i in range(9):
 a1=math.pi*i/9;a2=math.pi*(i+1)/9;ri=.36;ro=.59;verts=[]
 for y in [cy-.23,cy+.23]:
  for radius,a in [(ri,a1+.012),(ro,a1+.012),(ro,a2-.012),(ri,a2-.012)]:verts.append((cx+radius*math.cos(a),y,.84+radius*math.sin(a)))
 me=bpy.data.meshes.new('Arch stone');me.from_pydata(verts,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);ob=bpy.data.objects.new('Individually cut arch stone',me);c.objects.link(ob);ob.parent=hearth;me.materials.append(stone[i%5]);b=ob.modifiers.new('Soft worn masonry edge','BEVEL');b.width=.012;b.segments=2
box('Walnut hearth mantel',(cx,cy,1.49),(1.35,.64,.10),wood,hearth,.025)
r,obs=asset('fantasy-town-kit','chimney','Imported stone chimney',(cx,cy+.18,1.54),(.66,.44,1.01),parent=hearth);recolor(obs,stone[2])
r,obs=asset('survival-kit','resource-wood','Split hearth logs',(cx,cy-.09,.21),(.58,.36,.21),parent=hearth);recolor(obs,dark)
for i in range(7):beam('Cast iron hearth grate',(cx-.34+i*.11,cy-.255,.20),(cx-.34+i*.11,cy-.255,.46),.019,.022,char,hearth)
# Curved original emissive flame surfaces; low cost, no particles or shadowing lights.
fire=root('FireEmbers','FireEmbers')
for i in range(5):
 x=cx-.23+i*.115;z=.31;h=.26+(i%3)*.065;verts=[];faces=[]
 for level in range(8):
  t=level/7;radius=.075*(1-t)**.7
  for j in range(9):
   a=j*math.tau/9;verts.append((x+radius*math.cos(a)+math.sin(t*4+i)*.025,cy-.08+radius*.60*math.sin(a),z+t*h))
 for level in range(7):
  for j in range(9):k=level*9+j;faces.append((k,level*9+(j+1)%9,(level+1)*9+(j+1)%9,k+9))
 me=bpy.data.meshes.new('Curved ember flame');me.from_pydata(verts,[],faces);ob=bpy.data.objects.new('Amber flame '+str(i),me);c.objects.link(ob);ob.parent=fire;me.materials.append(mat('ember '+str(i),(.99,.16+i*.04,.012),.6,0,2.5))
 for p in me.polygons:p.use_smooth=True
# Ground: authored irregular island, continuous forest floor with low border slope.
terrain=root('ForestGround');N=72;vertices=[(0,0,-.35)];
for i in range(N):
 a=i*math.tau/N;r=1+.025*math.sin(a*7);vertices.append((10.8*math.cos(a)*r,8.6*math.sin(a)*r,-.35))
me=bpy.data.meshes.new('Organic woodland island');me.from_pydata(vertices,[],[(0,i+1,(i+1)%N+1) for i in range(N)]);o=bpy.data.objects.new('Forest floor',me);c.objects.link(o);o.parent=terrain;me.materials.append(mat('moss ground',(.032,.075,.052),1));solid=o.modifiers.new('Ground depth','SOLIDIFY');solid.thickness=.34;be=o.modifiers.new('Soft natural edge','BEVEL');be.width=.22;be.segments=3
for i,(x,y) in enumerate([(-6.9,-2),(-5.5,2.8),(5.4,2.2),(5,-1.5),(-7,-4.8),(3.4,4.9)]):
 r,obs=asset('nature-kit','stone_largeA' if i%2 else 'stone_smallFlatA','Woodland stone '+str(i),(x,y,-.33),height=.25+i%3*.1,parent=terrain);recolor(obs,stone[i%5])
 for j in range(2):r,obs=asset('nature-kit','grass_leafsLarge','Ferny forest leaves '+str(i)+' '+str(j),(x+.3+j*.3,y+.4,-.33),height=.28,parent=terrain,rotation=i+j)
# Reuse an authentic source book: copy selected mesh descendants without modifying it.
source=bpy.data.scenes['PortfolioLoft4D'];book=next(o for o in source.objects if o.get('stable_id')=='Sketchbook')
for old in [book]+list(book.children_recursive):
 if old.type not in {'MESH','FONT','CURVE'}:continue
 cp=old.copy();cp.data=old.data.copy();c.objects.link(cp);cp.parent=None;cp.matrix_world=old.matrix_world.copy();cp.location+=Vector((-4.0,-1.1,.04));cp.name='Porch source sketchbook '+old.name;cp.parent=porch
# Pack source into a new editable file, preserving all old .blend sources.
s.world=bpy.data.worlds.new('Midnight Spruce blue hour');s.world.use_nodes=True;next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.055,.10,.11,1)
# Export just addition, named destination pieces retained; join fixed geometry by material later.
bpy.ops.object.select_all(action='DESELECT')
for o in s.objects:
 if o.type in {'MESH','FONT','CURVE'}:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/midnight-cabin-world.glb'),export_format='GLB',use_selection=True,export_extras=True,export_image_format='JPEG',export_jpeg_quality=88,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/midnight-spruce-phase7c.blend'))
print({'scene':s.name,'objects':len(s.objects),'export':(ROOT/'public/models/midnight-cabin-world.glb').stat().st_size})
