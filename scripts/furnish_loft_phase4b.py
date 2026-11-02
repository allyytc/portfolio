import bpy,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];scene=bpy.data.scenes['PortfolioLoft4B'];bpy.context.window.scene=scene
if scene.get('furnished4b'):raise RuntimeError('Existing furnishings preserved; do not duplicate or replace owner edits.')
zones={c.name:c for c in scene.collection.children};static=next(o for o in scene.objects if o.get('stable_id')=='StudioStatic')
def material(n):return next(m for m in bpy.data.materials if m.name=='Loft_'+n)
wood=material('Honey oak');sage=material('Sage fabric');ivory=material('Warm ivory');blush=material('Muted blush');ink=material('Dark sage ink');linen=material('Linen')
def asset(file,name,loc,dims,fabric=sage,rot=0):
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/source/kenney-furniture-kit'/f'{file}.glb'));obs=list(set(bpy.data.objects)-before);bpy.context.view_layer.update()
    vv=[o.matrix_world@Vector(c) for o in obs if o.type=='MESH' for c in o.bound_box];lo=Vector([min(v[i] for v in vv) for i in range(3)]);hi=Vector([max(v[i] for v in vv) for i in range(3)]);center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
    r=bpy.data.objects.new(name,None);zones['ReadingNook'].objects.link(r);r.parent=static
    for o in obs:
        for c in list(o.users_collection):c.objects.unlink(o)
        zones['ReadingNook'].objects.link(o)
        if o.parent not in obs:o.parent=r;o.location-=center
        if o.type=='MESH':
            o.name=name+' / '+o.name
            for i,m in enumerate(o.data.materials):
                key=m.name.lower();o.data.materials[i]=wood if 'wood' in key else fabric if any(t in key for t in ['carpet','fabric','blue','red','green']) else ivory
            mod=o.modifiers.new('Soft source edges','BEVEL');mod.width=.006;mod.segments=3
            for p in o.data.polygons:p.use_smooth=True
    r.location=loc;r.scale=[dims[i]/(hi[i]-lo[i]) for i in range(3)];r.rotation_euler.z=rot;return r
asset('rugRectangle','Seating woven rug',(-1.32,-1.14,.01),(2.2,1.25,.018),linen)
asset('loungeChairRelax','Soft lounge seat',(-1.9,-1.1,.035),(.78,.78,.68),sage,rot=.15)
asset('tableCoffee','Conversation low table',(-.94,-1.19,.035),(.8,.58,.4))
asset('books','Conversation book stack',(-.93,-1.16,.44),(.27,.18,.09))
asset('pillow','Floor cushion',(-1.15,-1.95,.035),(.56,.5,.16),blush)
asset('books','Wall shelf books',(-2.01,2.34,2.75),(.55,.2,.28))
def box(name,loc,dims,m):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for c in list(o.users_collection):c.objects.unlink(o)
    zones['CommunityWall'].objects.link(o);o.parent=static;o.data.materials.append(m);mod=o.modifiers.new('Eased timber edge','BEVEL');mod.width=.012;mod.segments=3
box('Community display shelf',(-1.98,2.37,2.70),(2.1,.38,.08),wood)
for x in [-2.75,-1.2]:box('Shelf timber bracket',(x,2.57,2.60),(.07,.15,.18),wood)
# Original restrained wall clock: physical face, rim, hands and hour marks.
for radius,depth,m,y in [(.25,.045,wood,2.59),(.219,.008,ivory,2.559)]:
    bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=radius,depth=depth,location=(-2.8,y,3.22),rotation=(math.pi/2,0,0));o=bpy.context.object;o.name='Studio wall clock';o.parent=static
    for c in list(o.users_collection):c.objects.unlink(o)
    zones['CommunityWall'].objects.link(o);o.data.materials.append(m)
for i in range(12):
    a=i*math.pi/6;box('Clock hour tick',(-2.8+math.sin(a)*.185,2.548,3.22+math.cos(a)*.185),(.009,.004,.022),ink)
box('Clock minute hand',(-2.8,2.54,3.285),(.009,.008,.13),ink);hand=None
box('Clock hour hand',(-2.845,2.535,3.22),(.09,.008,.012),ink)
scene['furnished4b']=True
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4b.blend'))
result={'scene':scene.name,'added':'cohesive seating cluster, wall shelf and restrained clock'}
