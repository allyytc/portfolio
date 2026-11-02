"""Phase 7D patch 4 on PortfolioLoft7D: printer sits on the desk (visible, in the workstation); stand removed; desk plant to the floor."""
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
def bb(o):
    ch=[o]+list(o.children_recursive);pts=[c.matrix_world@Vector(v) for c in ch if c.type=='MESH' for v in c.bound_box]
    return Vector([min(p[i] for p in pts) for i in range(3)]),Vector([max(p[i] for p in pts) for i in range(3)])
for o in list(s.objects):
    if o.name.startswith('PrinterCabinet'):bpy.data.objects.remove(o,do_unlink=True)
body=next(o for o in s.objects if o.name.startswith('PrinterBody'));paper=next(o for o in s.objects if o.name.startswith('ResumePaper'))
lo,hi=bb(body);pivot=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z));target=Vector((-2.68,1.52,.83))
M=Matrix.Translation(target)@Matrix.Diagonal((.8,.8,.8,1))@Matrix.Translation(-pivot)
for o in (body,paper):o.matrix_world=M@o.matrix_world
pl=next(o for o in s.objects if o.name.startswith('Desk monstera') and o.type=='EMPTY' or o.name.startswith('Desk monstera /'))
top=pl
while top.parent and top.parent.type=='EMPTY' and not top.parent.name.startswith('StudioStatic'):top=top.parent
l,h=bb(top);c=Vector(((l.x+h.x)/2,(l.y+h.y)/2,l.z))
top.matrix_world=Matrix.Translation((-3.35,1.3,0))@Matrix.Diagonal((1.35,1.35,1.35,1))@Matrix.Translation(-c)@top.matrix_world
print('printer bbox',[round(v,2) for v in bb(body)[0]],[round(v,2) for v in bb(body)[1]],'plant',top.name)
