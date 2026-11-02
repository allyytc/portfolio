# Masonry fireplace flush to the left wall (x=-3.76). Expects globals from build_world_phase7e.py / patch3_world_phase7e.py:
# bpy, math, random, s, hearth, flames, box, cyl, M, wood, dark, char, mortar, ember.
warm=[(.52,.42,.30),(.47,.39,.29),(.56,.46,.33),(.42,.36,.27),(.60,.50,.37)]
stone=[]
for i,c in enumerate(warm):
    m=bpy.data.materials.get('Midnight 7E warm stone %d'%i)
    if not m:
        m=bpy.data.materials.new('Midnight 7E warm stone %d'%i);m.use_nodes=True;p=next(x for x in m.node_tree.nodes if x.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.95
    stone.append(m)
random.seed(76)
xw=-3.76;yc=-1.1;zb=.14;zm=1.5;ztop=3.55;ao=.46;az=.84
box('Hearth broad stone slab',(xw+.45,yc,.07),(.9,1.78,.14),stone[1],hearth,.025)
# mortar backing: only as wide/tall as each masonry section
box('Hearth breast mortar body',(xw+.12,yc,(zb+zm)/2),(.24,1.4,zm-zb),mortar,hearth,0)
box('Chimney stack mortar body',(xw+.12,yc,(zm+ztop)/2),(.24,.86,ztop-zm),mortar,hearth,0)
box('Deep soot firebox back',(xw+.25,yc,.52),(.02,.92,.76),char,hearth,0);box('Firebox floor',(xw+.37,yc,.15),(.28,.92,.02),char,hearth,0)
for sy in(-1,1):box('Firebox side',(xw+.37,yc+sy*.46,.55),(.28,.02,.8),char,hearth,0)
def blocks(ymin,ymax,z0,z1,depth,x0,opening=False,tag='Hearth stone'):
    z=z0;row=0
    while z<z1-.04:
        h=min(random.uniform(.17,.22),z1-z);y=ymin-(random.uniform(.05,.18) if row%2 else 0)
        while y<ymax-.03:
            w=random.uniform(.25,.38);y0=max(y,ymin);y1=min(y+w,ymax)
            if opening and z<az+.03:   # clip around the firebox opening
                if y0<yc-ao<y1:y1=yc-ao-.012
                elif y0<yc+ao<y1:y0=yc+ao+.012
                elif yc-ao<=y0 and y1<=yc+ao:y0=y1
            elif opening and z<az+.62:  # arch zone: leave the ring to the voussoirs
                cy=(y0+y1)/2;cz=z+h/2
                if math.hypot(cy-yc,cz-az)<ao+.34:y0=y1
            if y1-y0>.09:
                box(tag,(x0+depth/2,(y0+y1)/2,z+h/2),(depth,y1-y0-.014,h-.014),random.choice(stone),hearth,.01)
            y+=w
        z+=h;row+=1
blocks(yc-.75,yc+.75,zb,zm,.26,xw+.24,True)
for k in range(9):
    a=math.pi*(k+.5)/9;rr=ao+.11;cy,cz=yc+math.cos(a)*rr,az+math.sin(a)*rr
    o=box('Individually cut arch stone',(xw+.37,cy,cz),(.28,.19,.19),stone[(k%3)+1],hearth,.01);o.rotation_euler=(a-math.pi/2,0,0)
box('Walnut hearth mantel',(xw+.36,yc,zm+.05),(.72,1.8,.1),wood,hearth,.014)
for sy in(-1,1):box('Hearth stone corbel',(xw+.3,yc+sy*.7,zm-.09),(.5,.22,.16),stone[3],hearth,.014)
blocks(yc-.48,yc+.48,zm+.1,ztop,.3,xw+.24,False,'Chimney stone')
box('Chimney stone cap',(xw+.39,yc,ztop+.05),(.5,.66,.08),stone[2],hearth,.02);cyl('Chimney flue pot',(xw+.39,yc,ztop+.2),.11,.22,stone[0],hearth)
for i in range(3):
    o=cyl('Split hearth log',(xw+.37,yc-.18+i*.18,.24+(.07 if i==1 else 0)),.055,.62,dark,hearth,10);o.rotation_euler=(math.pi/2,0,0)
for dy in(-.4,.4):box('Cast iron hearth grate',(xw+.37,yc+dy,.19),(.24,.03,.08),char,hearth,0)
box('Cast iron hearth bar',(xw+.37,yc,.2),(.03,.84,.03),char,hearth,0)
for i,(dy,h) in enumerate(((-.2,.30),(-.05,.44),(.08,.36),(.2,.26),(.0,.22))):
    bpy.ops.mesh.primitive_cone_add(vertices=8,radius1=.09,radius2=.0,depth=h,location=(xw+.37,yc+dy,.36+h/2));f=bpy.context.object;f.name='Amber flame';f.parent=flames;f.data.materials.append(ember[i])
