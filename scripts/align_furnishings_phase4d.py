"""Use measured seat height to remove floating cushions and clarify signs/screens."""
import bpy,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from loft_asset_helpers import import_asset
source=bpy.data.scenes['PortfolioLoft4D'];bpy.context.window.scene=source
if any(o.name.startswith('Nook About plaque') for o in source.objects):raise RuntimeError('Alignment already applied; preserve edits.')
zones={c.name.split(' 4D')[0]:c for c in source.collection.children};static=next(o for o in source.objects if o.get('stable_id')=='StudioStatic')
for o in source.objects:
    if o.type=='EMPTY' and o.name.startswith('Soft nook cushion') and not o.name.startswith('Soft nook cushion 2'):o.location.z=.376
    if o.name.startswith('Cream folded nook blanket'):o.location.z-=.268
    if o.type=='EMPTY' and o.name=='Entrance monstera':o.scale*=.78;o.location.x=-3.5;o.location.y=-2.35
    if o.type=='EMPTY' and o.name=='Design accent':o.location.x=2.62;o.location.y=-1.55
    if o.type=='MESH' and o.name.startswith(('Soft nook cushion 1 /','Soft nook cushion 2 /')):
        color=(.78,.77,.63,1) if o.name.startswith('Soft nook cushion 1') else (.5,.31,.26,1)
        for m in o.data.materials:
            p=m.node_tree.nodes.get('Principled BSDF')
            for link in list(p.inputs['Base Color'].links):m.node_tree.links.remove(link)
            p.inputs['Base Color'].default_value=color;p.inputs['Roughness'].default_value=.92
yucca=next(o for o in source.objects if o.name=='Floor yucca')
for o in list(yucca.children_recursive):bpy.data.objects.remove(o,do_unlink=True)
bpy.data.objects.remove(yucca,do_unlink=True)
import_asset(ROOT/'assets/source/tiny-treats-house-plants/Assets/gltf/monstera_plant_medium_potted.gltf','Floor monstera',(-.12,1.84,.03),zones['PlantsAndDecor'],static,height=.86,rotation=-.5)
# The nook label is mounted on a small crafted plaque, not left in mid-air.
about=next(o for o in source.objects if o.get('stable_id')=='AboutBook')
about.location.y+=.105;about.location.z-=.17
bpy.ops.mesh.primitive_cube_add(size=1,location=(2.41,-.758,.30));plaque=bpy.context.object;plaque.name='Nook About plaque';plaque.dimensions=(.36,.018,.12)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
for c in list(plaque.users_collection):c.objects.unlink(plaque)
zones['ReadingNook'].objects.link(plaque);world=plaque.matrix_world.copy();plaque.parent=about;plaque.matrix_world=world
m=next(m for m in bpy.data.materials if m.name.startswith('Loft_Honey oak') and any(m==slot for o in source.objects if o.type=='MESH' for slot in o.data.materials));plaque.data.materials.append(m)
bevel=plaque.modifiers.new('Plaque edge','BEVEL');bevel.width=.008;bevel.segments=3
old=bpy.data.scenes.get('LoftBaked4D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4d.blend'))
result={'seatHeightMeasured':.3754,'cushionBase':.376,'blanketLowered':.268,'entrySignAndTabletCleared':True,'floorPlant':'approved medium monstera'}
