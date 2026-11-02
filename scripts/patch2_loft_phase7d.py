"""Phase 7D patch 3 on PortfolioLoft7D: printer stand visible beside the desk end; shelf raised clear of the Community plaque."""
import bpy
from mathutils import Matrix,Vector
s=bpy.data.scenes['PortfolioLoft7D']
old=bpy.data.scenes.get('LoftBaked7D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
for coll in (bpy.data.images,bpy.data.materials):
    for d in list(coll):
        if d.name.startswith('Loft7D_'):coll.remove(d)
def mv(prefix,delta):
    for o in s.objects:
        if o.name.startswith(prefix) and not o.name.endswith('extension') :
            o.matrix_world=Matrix.Translation(delta)@o.matrix_world;return o.name
    raise RuntimeError(prefix)
for n in ['PrinterBody.008','ResumePaper.008','PrinterCabinet_sideTableDrawers.005','PrinterCabinet_drawerLeft.005','PrinterCabinet_drawerRight.005']:
    o=s.objects[n];o.matrix_world=Matrix.Translation((.5,-.3,0))@o.matrix_world
for n in ['Community display shelf.003','Shelf timber bracket.006','Shelf timber bracket.007']:
    o=s.objects[n];o.matrix_world=Matrix.Translation((0,0,.55))@o.matrix_world
ws=next(o for o in s.objects if o.name.startswith('Wall shelf books') and o.type=='EMPTY');ws.matrix_world=Matrix.Translation((0,0,.55))@ws.matrix_world
s.objects['Community plaque lettering'].location.z=2.68;s.objects['Community plaque board'].location.z=2.68
print('ok')
