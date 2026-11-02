import bpy
from pathlib import Path

root = Path(__file__).resolve().parents[1]
scene = bpy.data.scenes.get('PortfolioDesk') or bpy.data.scenes.new('PortfolioDesk')
bpy.context.window.scene = scene
report = []
for path in sorted((root / 'assets/source/kenney-furniture-kit').glob('*.glb')):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path))
    imported = list(set(bpy.data.objects) - before)
    report.append({'file': path.name, 'objects': [{
        'name': o.name, 'type': o.type, 'dimensions': list(o.dimensions),
        'vertices': len(o.data.vertices) if o.type == 'MESH' else 0,
        'materials': [{'name': m.name, 'color': list(m.diffuse_color)} for m in o.data.materials] if o.type == 'MESH' else [],
    } for o in imported]})
result = {'scene': scene.name, 'assets': report}
