import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'docs/portfolio/evidence/phase4c';out.mkdir(parents=True,exist_ok=True)
s=bpy.data.scenes['PortfolioLoft4B']
props=bpy.ops.export_scene.gltf.get_rna_type().properties
result={'file':bpy.data.filepath,'scenes':[s.name for s in bpy.data.scenes],'objects':len(s.objects),'dracoAvailable': 'export_draco_mesh_compression_enable' in props.keys(),'nookMeshes':[{'name':o.name,'materials':[m.name for m in o.data.materials],'modifiers':[m.type for m in o.modifiers]} for o in s.objects if o.type=='MESH' and any(t in o.name for t in ['Reading cushion','Window reading bench','Loft bed','Sage draped','Soft lounge'])]}
(out/'initial-inspection.json').write_text(json.dumps(result,indent=2))
