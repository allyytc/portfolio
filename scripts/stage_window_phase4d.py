"""Resolve the default-view occlusions observed in the source render."""
import bpy
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];scene=bpy.data.scenes['PortfolioLoft4D'];bpy.context.window.scene=scene
if scene.get('window_staging'):raise RuntimeError('Window staging already applied; preserve edits.')
zones={c.name.split(' 4D')[0]:c for c in scene.collection.children};roots={o.get('stable_id'):o for o in scene.objects if o.get('stable_id')}
wood=next(m for m in bpy.data.materials if m.name.startswith('Loft_Honey oak') and any(m==slot for o in scene.objects if o.type=='MESH' for slot in o.data.materials))
def box(n,p,d):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for c in list(o.users_collection):c.objects.unlink(o)
    zones['ReadingNook'].objects.link(o);o.parent=roots['StudioStatic'];o.data.materials.append(wood);m=o.modifiers.new('Exterior-facing window joinery','BEVEL');m.width=.009;m.segments=3
for y in [-.57,2.64]:box('Window exterior stile',(4.075,y,1.65),(.065,.16,1.75))
for z in [.84,2.46]:box('Window exterior rail',(4.075,1.035,z),(.065,3.36,.14))
for y in [.5,1.57]:box('Window exterior divided light',(4.08,y,1.65),(.065,.055,1.49))
box('Window exterior transom',(4.08,1.035,1.65),(.065,3.14,.055))
for o in scene.objects:
    n=o.name;old=o.get('phase4b_name','')
    if (old.startswith('Window reading bench') and o.type=='EMPTY') or (n.startswith('Soft nook cushion') and o.type=='EMPTY' and not n.startswith('Soft nook cushion 2')) or n.startswith('Cream folded nook blanket') or n.startswith('Nook base oak face'):
        o.location.x-=.4;o.location.y-=.45
    if old.startswith(('Nook side table','Reading stack')) and o.type=='EMPTY':o.location.y-=.35
    if o.get('stable_id')=='AboutBook':o.location.x-=.4;o.location.y-=.45
# Source vines contain large leaves; use a small cascading cluster at natural leaf scale.
for o in list(scene.objects):
    if o.type=='EMPTY' and o.name.startswith(('Loft cascading pothos','Window cascading pothos')):
        o.scale*=.32
        o.location.z=2.08 if o.name.startswith('Loft') else 2.02
        # One linked second segment gives a restrained cascade instead of giant leaves.
        copies={}
        for original in [o]+list(o.children_recursive):
            cp=original.copy()
            if original.data:cp.data=original.data
            zones['PlantsAndDecor'].objects.link(cp);copies[original]=cp
        for original,cp in copies.items():cp.parent=copies.get(original.parent,original.parent);cp.matrix_local=original.matrix_local.copy()
        copies[o].location.z-=.31;copies[o].rotation_euler.z+=.8
bpy.context.view_layer.update();scene.camera.data.ortho_scale=10.9
scene['window_staging']='Dual-facing framed window; nook moved forward of the glazing sight line'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4d.blend'))
result={'windowFaces':2,'nookShift':[-.4,-.45,0],'vines':'natural leaf scale'}
