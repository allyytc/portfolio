"""Phase 7D: spatial/readability corrections applied to a COPY of PortfolioLoft4D (original scene untouched)."""
import bpy
from mathutils import Vector, Matrix
src=bpy.data.scenes['PortfolioLoft4D']
if bpy.data.scenes.get('PortfolioLoft7D'):raise RuntimeError('PortfolioLoft7D already exists; preserve it.')
new=bpy.data.scenes.new('PortfolioLoft7D');bpy.context.window.scene=new
cps={}
for o in src.objects:
    cp=o.copy()
    if o.data and o.type in {'MESH','FONT','CURVE'}:cp.data=o.data.copy()
    new.collection.objects.link(cp);cps[o]=cp
for o,cp in cps.items():
    cp.parent=cps.get(o.parent);cp.matrix_parent_inverse=o.matrix_parent_inverse.copy();cp.matrix_basis=o.matrix_basis.copy()
new.world=src.world;new.camera=cps[src.camera]
def C(name):return cps[src.objects[name]]
def drop(name):
    o=C(name);bpy.data.objects.remove(o,do_unlink=True)
# 1. Remove awkward book labels and tiny unreadable wall/screen text.
for n in ['SKILLS spine label.002','EXPERIENCE spine label.002','Reading nook destination.002','Screen project cue.004']:drop(n)
for o in list(src.objects):
    if o.type=='FONT' and (o.name.endswith('pending image.002') or o.name.endswith('reserved label.002')):drop(o.name)
# 2. Monitor: one bold heading and one short call to action.
g=C('Screen greeting.004');g.data.body='Hi, I’m Ally';g.data.size=.105;g.data.extrude=.0015;g.location.z=1.2
cta=C('Screen open projects.004');cta.data.body='PROJECTS  →';cta.data.size=.062;cta.data.extrude=.0015;cta.location.z=1.04
# 3. Community wall: one large plaque instead of eight tiny captions.
ink=bpy.data.materials['Loft_Dark sage ink.003'];paper=bpy.data.materials['Loft_Book paper.003']
tc=bpy.data.curves.new('Community plaque text','FONT');tc.body='COMMUNITY';tc.size=.17;tc.extrude=.004;tc.align_x='CENTER';tc.align_y='CENTER';tc.font=g.data.font;tc.materials.append(ink)
t=bpy.data.objects.new('Community plaque lettering',tc);new.collection.objects.link(t);t.location=(-1.6,2.40,2.53);t.rotation_euler=(1.5708,0,0)
me=bpy.data.meshes.new('Community plaque board');w,h,d=1.5,.30,.04
v=[(-w/2,-d/2,-h/2),(w/2,-d/2,-h/2),(w/2,d/2,-h/2),(-w/2,d/2,-h/2),(-w/2,-d/2,h/2),(w/2,-d/2,h/2),(w/2,d/2,h/2),(-w/2,d/2,h/2)]
me.from_pydata(v,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);me.materials.append(paper)
pl=bpy.data.objects.new('Community plaque board',me);new.collection.objects.link(pl);pl.location=(-1.6,2.43,2.53)
# 4. Narrower loft bed anchored to the back-right corner, leaving the landing clear.
bed=C('Tailored sage loft bed');P=Vector((3.49,2.62,2.51))
M=Matrix.Translation(P)@Matrix.Diagonal((.74,.74,1,1))@Matrix.Translation(-P)
bed.matrix_world=M@bed.matrix_world
# 5. Printer station joins the workstation: stand, printer and paper move together to the desk-end/back wall.
delta=Vector((.0,1.68,0))
for n in ['PrinterBody.004','ResumePaper.004','PrinterCabinet_sideTableDrawers.004','PrinterCabinet_drawerLeft.004','PrinterCabinet_drawerRight.004']:
    o=C(n);o.matrix_world=Matrix.Translation(delta)@o.matrix_world
bpy.context.view_layer.update()
print('PortfolioLoft7D ready',len(new.objects))
