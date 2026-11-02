import bpy
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
source = bpy.data.scenes.get('PortfolioDesk')
result = {'file': bpy.data.filepath, 'version': bpy.app.version_string,
    'scenes': [s.name for s in bpy.data.scenes], 'targetPresent': bool(source)}
if source:
    result.update({'objects': len(source.objects), 'engine': source.render.engine,
        'viewTransform': source.view_settings.view_transform, 'look': source.view_settings.look,
        'exposure': source.view_settings.exposure,
        'camera': list(source.camera.location), 'orthoScale': source.camera.data.ortho_scale,
        'meshObjects': sum(o.type == 'MESH' for o in source.objects),
        'materials': sorted({m.name for o in source.objects if o.type == 'MESH' for m in o.data.materials}),
        'uvExamples': [{'name':o.name,'uv':[uv.name for uv in o.data.uv_layers]} for o in source.objects if o.type=='MESH'][:8]})
(root/'docs/portfolio/evidence/phase4a').mkdir(parents=True,exist_ok=True)
(root/'docs/portfolio/evidence/phase4a/initial-scene.json').write_text(json.dumps(result,indent=2))
