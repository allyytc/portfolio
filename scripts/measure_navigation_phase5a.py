"""Read-only scene measurement; no scene geometry or Blender file is saved."""
import bpy,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];s=bpy.data.scenes['PortfolioLoft4D'];bpy.context.window.scene=s;bpy.context.view_layer.update()
def bounds(objects):
    points=[o.matrix_world@Vector(v) for o in objects if o.type in {'MESH','FONT','CURVE'} for v in o.bound_box]
    if not points:return None
    points=[Vector((v.x,v.z,-v.y)) for v in points]
    lo=[min(v[i] for v in points) for i in range(3)];hi=[max(v[i] for v in points) for i in range(3)]
    return {'min':lo,'max':hi,'center':[(lo[i]+hi[i])/2 for i in range(3)],'size':[hi[i]-lo[i] for i in range(3)]}
nodes={}
for o in s.objects:
    if o.get('stable_id'):nodes[o['stable_id']]=bounds([o]+list(o.children_recursive))
def matches(o,prefixes):return any(o.name.startswith(p) or o.get('phase4b_name','').startswith(p) for p in prefixes)
zones={
 'readingNook':['Window reading bench','Soft nook cushion 0','Soft nook cushion 1','Cream folded nook blanket','Window face rail','Window facing stile'],
 'readingBench':['Window reading bench','Soft nook cushion 0','Soft nook cushion 1','Cream folded nook blanket'],
 'projectsBoard':['Projects board','Projects inset face','Projects lettering','Projects subtitle'],
 'nameBoard':['Name board','Name sign lettering'],
 'archive':['Skills archive cabinet','SKILLS bound volume','Archive box'],
 'workstation':['Desk role plaque','MonitorHousing','PrinterCabinet','Chair ','KeyboardHousing'],
}
data={'coordinateSystem':'glTF Y-up','source':'PortfolioLoft4D','nodes':nodes,'zones':{key:bounds([o for o in s.objects if matches(o,names)]) for key,names in zones.items()}}
out=ROOT/'docs/portfolio/evidence/phase5a';out.mkdir(parents=True,exist_ok=True);(out/'scene-bounds.json').write_text(json.dumps(data,indent=2))
(ROOT/'src/studio/sceneBounds.json').write_text(json.dumps(data,indent=2));result={'nodes':len(nodes),'zones':data['zones'],'sourceFile':bpy.data.filepath,'geometryChanged':False}
