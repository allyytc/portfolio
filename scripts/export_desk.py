import bpy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = bpy.data.scenes['PortfolioDesk']
export_scene = bpy.data.scenes.new('DeskExportTemporary')
bpy.context.window.scene = export_scene
copies = {}
for obj in source.objects:
    if obj.type not in ['MESH', 'FONT', 'EMPTY']:
        continue
    cp = obj.copy()
    if obj.data:
        cp.data = obj.data.copy()
    export_scene.collection.objects.link(cp)
    copies[obj] = cp
for obj, cp in copies.items():
    cp.parent = copies.get(obj.parent)
    cp.matrix_local = obj.matrix_local.copy()
bpy.context.view_layer.update()
names = {'Static': 'StudioStatic', 'projects_monitor': 'ProjectsMonitor',
         'projects_sign': 'ProjectsSign', 'printer': 'PrinterBody', 'resume_paper': 'ResumePaper'}
statistics = []
for source_name, export_name in names.items():
    ancestor = source.objects[source_name]
    members = []
    for original, cp in copies.items():
        cursor = original
        while cursor.parent:
            cursor = cursor.parent
        if cursor == ancestor and cp.type in ['MESH', 'FONT']:
            members.append(cp)
    bpy.ops.object.select_all(action='DESELECT')
    for cp in members:
        world = cp.matrix_world.copy()
        cp.parent = None
        cp.matrix_world = world
        cp.select_set(True)
    bpy.context.view_layer.objects.active = members[0]
    bpy.ops.object.convert(target='MESH')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.join()
    merged = bpy.context.object
    merged.name = export_name
    merged['action'] = 'projects' if source_name.startswith('projects') else 'resume' if source_name in ['printer', 'resume_paper'] else ''
    merged.data.calc_loop_triangles()
    statistics.append({'node': export_name, 'triangles': len(merged.data.loop_triangles), 'materials': len(merged.data.materials)})
for obj in list(export_scene.objects):
    if obj.type == 'EMPTY':
        bpy.data.objects.remove(obj, do_unlink=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(ROOT / 'public/models/desk-studio.glb'),
    export_format='GLB', use_selection=True, use_active_scene=True, export_apply=True, export_extras=True,
    export_yup=True, export_cameras=False, export_lights=False)
(ROOT / 'docs/portfolio/evidence/model-statistics.json').write_text(json.dumps(statistics, indent=2))
bpy.context.window.scene = source
for obj in list(export_scene.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
bpy.data.scenes.remove(export_scene)
result = {'exported': str(ROOT / 'public/models/desk-studio.glb'), 'statistics': statistics}
