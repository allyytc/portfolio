"""Phase 7E loft source pass on PortfolioLoft7D: pinboard clear of the loft deck + controlled wood hierarchy (copies; 4D materials untouched)."""
import bpy
from mathutils import Matrix,Vector
s=bpy.data.scenes['PortfolioLoft7D'];bpy.context.window.scene=s;bpy.context.view_layer.update()
old=bpy.data.scenes.get('LoftBaked7D')
if old:
    for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
    bpy.data.scenes.remove(old)
for coll in (bpy.data.images,bpy.data.materials):
    for d in list(coll):
        if d.name.startswith('Loft7D_'):coll.remove(d)
def bb(o):
    ch=[o]+list(o.children_recursive);pts=[c.matrix_world@Vector(v) for c in ch if c.type=='MESH' for v in c.bound_box]
    return (Vector([min(p[i] for p in pts) for i in range(3)]),Vector([max(p[i] for p in pts) for i in range(3)])) if pts else None
# 1. pinboard group (cards, board, plaque) 0.45 to the left so every card clears the loft
moved=[]
for o in s.objects:
    if o.parent is None and o.type in('EMPTY','MESH'):
        b=bb(o)
        if b and -2.75<(b[0].x+b[1].x)/2<-.5 and 2.25<b[0].y<2.62 and 1.2<b[0].z<2.95 and b[1].z<3.0:
            o.matrix_world=Matrix.Translation((-.45,0,0))@o.matrix_world;moved.append(o.name)
print('moved',moved)
# 2. wood hierarchy via multiply tint on material copies
cache={}
def tinted(m,mult):
    key=(m.name,mult)
    if key in cache:return cache[key]
    n=m.copy();n.name='7E '+m.name+str(mult);p=next(x for x in n.node_tree.nodes if x.type=='BSDF_PRINCIPLED');bc=p.inputs['Base Color']
    if bc.links:
        src=bc.links[0].from_socket;mix=n.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=(*mult,1)
        n.node_tree.links.new(src,mix.inputs[1]);n.node_tree.links.new(mix.outputs[0],bc)
    else:
        v=bc.default_value;bc.default_value=(v[0]*mult[0],v[1]*mult[1],v[2]*mult[2],1)
    cache[key]=n;return n
rules=[('Stair',(.60,.46,.36),('Loft_Honey oak','Loft_Oak end grain','Polish_Oak')),('Open timber',(.60,.46,.36),('Loft_Honey oak','Loft_Oak end grain','Polish_Oak')),
       ('Loft ',(.62,.52,.44),('Loft_Honey oak','Loft_Oak end grain')),('Rear structural',(.60,.5,.42),('Loft_Oak end grain',)),('OakDesk',(.80,.62,.48),('Studio_Oak',)),('Desktop',(.8,.62,.48),('4A_Walnut',)),
       ('Oak floor',(.90,.88,.82),('Polish_Oak',))]
fallback={'Loft_Oak end grain':(.68,.6,.54),'Loft_Honey oak':(1.04,1.0,.9)}
count=0
for o in s.objects:
    if o.type!='MESH':continue
    chain=[];q=o
    while q:chain.append(q.name);q=q.parent
    for i,m in enumerate(o.data.materials):
        if not m or not m.use_nodes or not any(m.name.startswith(k) for k in('Loft_Honey oak','Loft_Oak end grain','Polish_Oak','Studio_Oak.','4A_Walnut')):continue
        mult=None
        for pref,t,mats in rules:
            if any(n.startswith(pref) for n in chain) and any(m.name.startswith(k) for k in mats):mult=t;break
        if mult is None:mult=next((v for k,v in fallback.items() if m.name.startswith(k)),None)
        if mult:o.data.materials[i]=tinted(m,mult);count+=1
print('tinted slots',count)
