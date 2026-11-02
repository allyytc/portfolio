"""Separate clay architectural study. No blockout geometry enters the web GLB."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
if bpy.data.scenes.get('RoomBlockout4A_TEMPORARY'):
    raise RuntimeError('Blockout already exists; preserve owner changes instead of duplicating it.')
scene=bpy.data.scenes.new('RoomBlockout4A_TEMPORARY');bpy.context.window.scene=scene
def mat(name,c):
    m=bpy.data.materials.new('BLOCKOUT_'+name);m.diffuse_color=(*c,1);m.use_nodes=True
    m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1);return m
clay=mat('unresolved structure',(.56,.58,.54));floor=mat('floor study',(.67,.61,.5));beam=mat('timber locations',(.30,.24,.18))
sage=mat('reserved content zone',(.27,.38,.29));cream=mat('wall mass',(.78,.76,.69));ink=mat('labels',(.045,.075,.05))
def box(name,loc,dims,m):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name='TEMP '+name;o.dimensions=dims
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
    bevel=o.modifiers.new('Blockout edge only','BEVEL');bevel.width=.015;bevel.segments=2
    o['status']='TEMPORARY ARCHITECTURAL BLOCKOUT — not final asset';return o
font=bpy.data.fonts.load(str(ROOT/'assets/source/nunito/Nunito-ExtraBold.ttf'))
def label(body,loc,size=.17,floor_label=False):
    d=bpy.data.curves.new('Layout label','FONT');d.body=body;d.font=font;d.size=size;d.align_x='CENTER';d.extrude=.0001
    o=bpy.data.objects.new('TEMP label '+body,d);scene.collection.objects.link(o);o.location=loc
    if not floor_label:o.rotation_euler.x=math.pi/2
    d.materials.append(ink);return o
box('floor',(0,0,-.12),(8.8,6.6,.24),floor)
box('back wall',(0,3.24,2.05),(8.8,.16,4.1),cream)
box('left wall',(-4.32,0,2.05),(.16,6.6,4.1),cream)
for x in [-4.1,-.2,4.1]:box('main timber post',(x,3.1,2.1),(.15,.18,4.2),beam)
for z in [2.55,4.12]:box('back timber beam',(0,3.07,z),(8.6,.2,.18),beam)
box('left header',(-4.17,0,4.12),(.2,6.4,.18),beam)
# Partial deck / inspection cutaway keeps the reading nook visible below.
box('loft rear deck cutaway',(1.93,2.75,2.6),(4.2,.95,.16),clay)
box('loft front rim',(1.93,1.3,2.6),(4.2,.16,.18),beam)
for x in [-.15,4.0]:box('loft side rim',(x,2.0,2.6),(.14,1.55,.18),beam)
for x in [1.8,2.9,4.0]:box('loft railing placeholder',(x,1.3,2.98),(.055,.055,.65),clay)
box('loft rail top',(2.9,1.3,3.3),(2.3,.07,.07),clay)
for i in range(12):
    h=(i+1)*2.52/12;box('stair tread %02d'%i,(.61,-1.81+i*.265,h/2),(.92,.265,h),clay)
label('LOFT / DECK CUTAWAY',(1.9,2.68,2.7),.17,True)
# Window opening location represented by an inset luminous surface, not a real cut.
window=mat('window reserved opening',(.59,.72,.74))
box('window reserved opening',(2.65,3.135,1.36),(2.0,.025,1.55),window)
for x in [1.61,3.69]:box('window jamb',(x,3.10,1.36),(.07,.08,1.68),beam)
for z in [.55,2.17]:box('window sill header',(2.65,3.09,z),(2.14,.1,.07),beam)
box('window mullion',(2.65,3.08,1.36),(.055,.08,1.55),beam)
# Refined actual desk, copied with finished materials for scale comparison.
desk=bpy.data.scenes['DeskBaked4A'];offset=Vector((-1.95,-.55,.05))
for o in desk.objects:
    if o.type=='MESH':
        cp=o.copy();cp.data=o.data.copy();cp.name='Workstation '+o.name;scene.collection.objects.link(cp);cp.location+=offset
box('reading nook reserved volume',(2.8,1.6,.24),(1.72,.86,.48),sage)
label('ABOUT / READING NOOK',(2.8,1.12,.55),.12)
box('design corner reserved footprint',(2.88,-1.66,.035),(1.8,1.5,.04),sage)
label('DESIGN / UNWRAP',(2.88,-1.7,.065),.16,True)
box('community pinboard reservation',(-1.7,3.13,1.65),(1.9,.035,1.18),sage)
label('COMMUNITY',(-1.7,3.10,1.65),.18)
box('archive reserved volume',(-3.63,1.62,.6),(.9,1.3,1.2),clay)
label('ARCHIVE',(-3.63,.94,1.23),.13)
label('WORKSTATION',(-1.9,-2.25,.065),.16,True)
label('TEMPORARY ROOM STUDY',(0,-3.12,.045),.23,True)
camdata=bpy.data.cameras.new('Blockout isometric');cam=bpy.data.objects.new('Blockout isometric',camdata);scene.collection.objects.link(cam)
cam.location=(10,-14,11);target=Vector((0,.25,1.35));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();camdata.type='ORTHO';camdata.ortho_scale=13;scene.camera=cam
for loc,energy,size in [((-3,-6,10),1600,7),((6,2,8),1000,5)]:
    d=bpy.data.lights.new('Blockout softbox','AREA');d.energy=energy;d.size=size;o=bpy.data.objects.new('Blockout softbox',d);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
scene.world=desk.world.copy();scene.render.engine='CYCLES';scene.cycles.samples=40;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX';scene.view_settings.look='None'
scene.render.resolution_x=1700;scene.render.resolution_y=1250;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/'docs/portfolio/evidence/phase4a/room-blockout.png')
scene['status']='TEMPORARY ONLY. Open loft inspection cutaway; window is a location marker, not a finished opening.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4a.blend'))
bpy.ops.render.render(write_still=True)
result={'scene':scene.name,'image':scene.render.filepath,'webExported':False,'loft':'inspection cutaway to show reading nook'}
