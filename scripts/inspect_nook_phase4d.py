import bpy,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];s=bpy.data.scenes['PortfolioLoft4D'];bpy.context.window.scene=s;bpy.context.view_layer.update();rows=[]
for o in s.objects:
    n=o.get('phase4b_name','')
    if o.type=='MESH' and n.startswith('Window reading bench'):
        data=o.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
        for i,m in enumerate(data.materials):
            z=[(o.matrix_world@data.vertices[v].co).z for p in data.polygons if p.material_index==i for v in p.vertices]
            if z:rows.append({'object':o.name,'material':m.name,'minZ':min(z),'maxZ':max(z)})
        o.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh_clear()
    if o.type=='EMPTY' and o.name.startswith(('Soft nook cushion','Floor yucca')):rows.append({'object':o.name,'location':list(o.location)})
result={'measurements':rows};(ROOT/'docs/portfolio/evidence/phase4d/nook-measurements.json').write_text(json.dumps(result,indent=2))
