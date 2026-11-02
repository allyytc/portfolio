"""Phase 7E world rebuild on a COPY (MidnightSpruceWorld7E) of MidnightSpruceWorld:
masonry fireplace, side-wall porch, finished roof. Original scene and files are untouched.
Blender coordinates: x right, y back, z up. Left cabin wall interior face x=-3.76, exterior cap x=-4.08.
"""
import bpy,sys,math,random
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
src=bpy.data.scenes['MidnightSpruceWorld']
if bpy.data.scenes.get('MidnightSpruceWorld7E'):raise RuntimeError('7E scene exists; preserve it.')
s=bpy.data.scenes.new('MidnightSpruceWorld7E');bpy.context.window.scene=s;c=s.collection
random.seed(75)
def M(n):return bpy.data.materials['Midnight '+n]
def newmat(n,color,rough=.8,metal=0,emit=0):
    m=bpy.data.materials.new('Midnight '+n);m.use_nodes=True;p=next(x for x in m.node_tree.nodes if x.type=='BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
    if emit:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emit
    return m
wood,oak,dark,slate,brass,char=M('warm walnut'),M('oak edges'),M('weathered dark timber'),M('blue spruce roof'),M('aged brass'),M('firebox')
stone=[M('hearth stone '+str(i)) for i in range(5)]
weathered=newmat('7E weathered porch timber',(.17,.12,.08),.92);deck=newmat('7E porch deck oak',(.34,.21,.10),.82)
roofs=[newmat('7E spruce shingle '+str(i),(.045+i*.006,.105+i*.007,.098+i*.006),.9) for i in range(3)]
mortar=newmat('7E mortar shadow',(.08,.08,.07),1);glass=newmat('7E jar glass',(.55,.68,.60),.15);paint=[newmat('7E paint '+n,col,.55) for n,col in(('ochre',(.55,.34,.08)),('sage',(.20,.32,.20)),('rust',(.38,.13,.07)))]
ember=[M('ember '+str(i)) for i in range(5)]
def root(n,stable=None):
    o=bpy.data.objects.new(n,None);c.objects.link(o)
    if stable:o['stable_id']=stable
    return o
arch=None
# ---- 1. copy the kept parts of the Phase 7C world ------------------------------------------------------------------
copies={}
keep_roots={'CabinArchitecture','ForestGround'}
def top(o):
    while o.parent:o=o.parent
    return o
for o in src.objects:
    r=top(o).name;base_name=o.name.split('.')[0]
    chain=[];q=o
    while q:chain.append(q.name);q=q.parent
    porch_keep=r=='AttachedArtPorch' and any(n.startswith(('Porch oak stool','Porch source sketchbook')) for n in chain)
    keep=(r in keep_roots and not o.name.startswith('Rear weathered timber roof')) or r=='ArtEasel' or porch_keep \
        or (o.type=='EMPTY' and base_name in('CabinArchitecture','ForestGround','ArtEasel','AttachedArtPorch'))
    if not keep:continue
    cp=o.copy()
    if o.data and o.type=='MESH':cp.data=o.data.copy()
    c.objects.link(cp);copies[o]=cp
for o,cp in copies.items():
    cp.parent=copies.get(o.parent);cp.matrix_parent_inverse=o.matrix_parent_inverse.copy();cp.matrix_basis=o.matrix_basis.copy()
architecture=next(cp for o,cp in copies.items() if o.name.split('.')[0]=='CabinArchitecture');porch=next(cp for o,cp in copies.items() if o.name.split('.')[0]=='AttachedArtPorch');easel=next(cp for o,cp in copies.items() if o.name.split('.')[0]=='ArtEasel')
hearth=root('Fireplace','Fireplace');flames=root('FireEmbers','FireEmbers');decor=root('CabinDetails')
bpy.context.view_layer.update()
# ---- helpers ------------------------------------------------------------------------------------------------------
def box(n,p,d,m,parent,bevel=.012,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.rotation_euler=rot;o.parent=parent;o.data.materials.append(m)
    if bevel:b=o.modifiers.new('Edge','BEVEL');b.width=bevel;b.segments=2
    return o
def beam(n,a,b,w,d,m,parent):
    a,b=Vector(a),Vector(b);o=box(n,(a+b)/2,(w,d,(b-a).length),m,parent);o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o
def cyl(n,p,r,h,m,parent,verts=14):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=h,location=p);o=bpy.context.object;o.name=n;o.parent=parent;o.data.materials.append(m)
    for q in o.data.polygons:q.use_smooth=True
    return o
# ---- 2. rear roof: continuous shingled panel instead of gappy slats -----------------------------------------------
E,R=Vector((2.12,3.52)),Vector((3.42,4.28));slope=R-E;L=slope.length;th=math.atan2(slope.y,slope.x);N=8
box('Roof underlay deck',(0,(E.x+R.x)/2,(E.y+R.y)/2-.005),(8.7,L+.04,.06),dark,architecture,0,(th,0,0))
for i in range(N):
    t=(i+.5)/N;p=E+slope*t;h=L/N+.05
    box(f'Roof shingle row {i}',(0,p.x,p.y+.05+(.012 if i%2 else 0)),(8.7,h,.045),roofs[i%3],architecture,.006,(th,0,0))
box('Roof eave drip board',(0,E.x-.02,E.y-.02),(8.9,.07,.12),dark,architecture,.008)
box('Roof ridge cap',(0,R.x-.02,R.y+.07),(8.9,.3,.07),dark,architecture,.008)
for sx in(-1,1):box(f'Roof barge board {sx}',(sx*4.34,(E.x+R.x)/2,(E.y+R.y)/2+.01),(.06,L+.12,.16),oak,architecture,.008,(th,0,0))
for x in(-2,2):
    beam(f'Rear timber rafter x{x}',(x,E.x,E.y-.02),(x,R.x,R.y-.04),.12,.12,oak,architecture)
# ---- 3. side-wall art porch ---------------------------------------------------------------------------------------
X0,X1,Y0,Y1=-6.95,-3.95,-3.15,-.05;XM=(X0+X1)/2;YM=(Y0+Y1)/2
n=int((X1-X0)/.222)
for i in range(n):
    box(f'Porch continuous deck board {i}',(X0+.111+i*(X1-X0)/n,YM,-.03),((X1-X0)/n-.012,Y1-Y0,.1),deck,porch,.006)
box('Porch front fascia',(XM,Y0-.025,-.15),(X1-X0+.1,.07,.26),weathered,porch,.008);box('Porch outer fascia',(X0-.025,YM,-.15),(.07,Y1-Y0+.1,.26),weathered,porch,.008);box('Porch rear fascia',(XM,Y1+.025,-.15),(X1-X0+.1,.07,.26),weathered,porch,.008)
for i in range(4):box(f'Porch joist {i}',(X0+.4+i*(X1-X0-.8)/3,YM,-.17),(.1,Y1-Y0,.2),dark,porch,.005)
posts=[(X0+.12,Y0+.12),(X0+.12,Y1-.12),(X1-.14,Y0+.12),(X1-.14,Y1-.12)]
for i,(x,y) in enumerate(posts):box(f'Porch post {i}',(x,y,1.31),(.17,.17,2.65),weathered,porch,.01)
zl,zh=2.74,3.06  # outer eave / wall ledger heights
box('Porch wall ledger beam',(X1+.03,YM,zh-.1),(.14,Y1-Y0+.3,.2),oak,porch,.01)
box('Porch outer beam',(X0+.12,YM,zl-.1),(.18,Y1-Y0+.3,.2),oak,porch,.01);box('Porch front beam',(XM,Y0+.12,zl-.14),(X1-X0,.17,.2),oak,porch,.01);box('Porch rear beam',(XM,Y1-.12,zl-.14),(X1-X0,.17,.2),oak,porch,.01)
for i,y in enumerate([Y0+.12+k*(Y1-Y0-.24)/4 for k in range(5)]):beam(f'Porch rafter {i}',(X1+.03,y,zh-.1),(X0-.12,y,zl-.04),.09,.13,oak,porch)
for x,y in(posts[0],posts[1]):beam('Porch outer brace',(x,y,zl-.62),(x+.55,y,zl-.2),.07,.1,oak,porch)
# shingled lean-to roof (same material family as the main roof)
run=(X1+.03)-(X0-.2);drop=zh-zl;ang=math.atan2(drop,run);rows=9;Ly=Y1-Y0+.5
for i in range(rows):
    t=(i+.5)/rows;x=(X1+.03)-run*t;z=zh+.02-drop*t+.05+(.012 if i%2 else 0)
    box(f'Porch roof shingle row {i}',(x,YM,z),(run/rows+.05,Ly,.045),roofs[(i+1)%3],porch,.006,(0,ang,0))
box('Porch roof underlay',((X1+X0)/2-.08,YM,(zh+zl)/2-.005),(run+.02,Ly,.05),dark,porch,0,(0,ang,0))
box('Porch roof drip board',(X0-.2,YM,zl-.02),(.08,Ly+.05,.11),dark,porch,.008)
for sy in(-1,1):box(f'Porch roof barge {sy}',((X1+X0)/2-.08,YM+sy*(Ly/2),(zh+zl)/2+.02),(run+.05,.05,.14),oak,porch,.008,(0,ang,0))
# outer and rear guard rails (front stays open for steps/easel)
for name,(ax,ay),(bx,by) in(('outer',(X0+.06,Y0+.2),(X0+.06,Y1-.2)),('rear',(X0+.2,Y1-.06),(X1-.2,Y1-.06))):
    a,b=Vector((ax,ay,.92)),Vector((bx,by,.92));beam(f'Porch {name} top rail',a,b,.07,.07,oak,porch)
    cnt=int((b-a).length/.26)
    for k in range(cnt+1):
        q=a.lerp(b,k/cnt);box(f'Porch {name} baluster',(q.x,q.y,.5),(.035,.035,.84),weathered,porch,.004)
# entry steps (outer front) and wall door frame
box('Porch entry step upper',(-5.3,Y0-.17,-.14),(1.5,.34,.12),deck,porch,.01);box('Porch entry step lower',(-5.3,Y0-.5,-.26),(1.5,.34,.12),deck,porch,.01)
box('Cabin doorway jamb',(-3.84,-2.04,1.62),(.15,.15,3.24),oak,architecture,.01);box('Cabin doorway header',(-3.84,-2.58,2.4),(.15,1.2,.16),oak,architecture,.01);box('Doorway threshold',(-3.88,-2.58,.01),(.22,1.1,.03),dark,architecture,.004)
# ---- 4. art station -----------------------------------------------------------------------------------------------
ez=[o for o in easel.children_recursive if o.type=='MESH']
pivot=root('Easel pose',None);pivot.parent=easel
for o in ez:o.parent=pivot
bpy.context.view_layer.update()
pts=[o.matrix_world@Vector(v) for o in ez for v in o.bound_box];ctr=Vector((sum(p.x for p in pts)/len(pts),sum(p.y for p in pts)/len(pts),0))
# face the camera diagonal; place at the porch heart
pivot.matrix_world=Matrix.Translation((-5.55,-1.75,0))@Matrix.Rotation(math.radians(30),4,'Z')@Matrix.Translation(-ctr)
# stool, supply table, sketchbook, sconce -> new positions
def move(prefix,target,rot=None):
    for o in list(porch.children_recursive):
        if o.name.startswith(prefix):
            o.matrix_world=Matrix.Translation(target)@o.matrix_world
def objs(prefix):return [o for o in porch.children_recursive if o.name.startswith(prefix)]
bpy.context.view_layer.update()
def center(os):
    p=[o.matrix_world@Vector(v) for o in os for v in o.bound_box];return Vector((sum(q.x for q in p)/len(p),sum(q.y for q in p)/len(p),min(q.z for q in p)))
stool=objs('Porch oak stool');cs=center(stool)
for o in stool:o.matrix_world=Matrix.Translation(Vector((-5.0,-2.62,.02))-cs)@o.matrix_world
tbl=box('Porch supply table top',(-6.45,-2.55,.62),(.55,.55,.05),deck,decor,.01)
for dx,dy in((-.22,-.22),(.22,-.22),(-.22,.22),(.22,.22)):box('Porch supply table leg',(-6.45+dx,-2.55+dy,.3),(.05,.05,.6),weathered,decor,.004)
sk=objs('Porch source sketchbook');csk=center(sk)
for o in sk:o.matrix_world=Matrix.Translation(Vector((-6.42,-2.72,.645))-csk)@o.matrix_world
for i,(dx,dy) in enumerate(((-.12,.12),(.1,.14),(.14,-.02))):
    px,py=-6.45+dx,-2.55+dy
    cyl('Paint jar',(px,py,.69),.05,.12,glass,decor);cyl('Paint pigment',(px,py,.675),.043,.07,paint[i],decor);cyl('Jar brass lid',(px,py,.755),.052,.02,brass,decor)
for i in range(3):beam('Brush walnut handle',(-6.28+i*.03,-2.38,.65),(-6.25+i*.03,-2.42,.85+i*.02),.022,.022,wood,decor)
cyl('Brush jar',(-6.27,-2.4,.69),.055,.12,glass,decor)
# warm porch light: hanging lantern + string bulbs
lantern=cyl('Porch lantern glass',(X1-.3,Y0+.28,2.2),.07,.2,M('warm lamp glass'),decor);cyl('Porch lantern cap',(X1-.3,Y0+.28,2.33),.09,.03,brass,decor);beam('Porch lantern chain',(X1-.3,Y0+.28,2.34),(X1-.3,Y0+.28,zl-.14),.012,.012,brass,decor)
for k in range(9):
    t=k/8;x=X0+.3+t*(X1-X0-.6);z=zl-.2-math.sin(t*math.pi)*.12
    bpy.ops.mesh.primitive_uv_sphere_add(segments=10,ring_count=6,radius=.035,location=(x,Y0+.2,z));b=bpy.context.object;b.name='Porch string bulb';b.parent=decor;b.data.materials.append(M('warm lamp glass'))
beam('Porch string wire',(X0+.3,Y0+.2,zl-.2),(X1-.3,Y0+.2,zl-.2),.008,.008,dark,decor)
# potted fern (reuse licensed Kenney nature leaves is not needed: modelled pot + sage fronds)
cyl('Porch plant pot',(-6.55,-.55,.2),.17,.34,wood,decor,16)
for k in range(7):
    a=k/7*math.tau;beam('Porch fern frond',(-6.55,-.55,.38),(-6.55+math.cos(a)*.3,-.55+math.sin(a)*.3,.62+.05*(k%2)),.05,.012,M('7E spruce shingle 2'),decor)
# ---- 5. masonry fireplace (separate script so it can be rebuilt on its own) ------------------------------------------
exec((ROOT/'scripts/fireplace_phase7e.py').read_text())
bpy.context.view_layer.update()
print('7E world scene ready',len(s.objects))
