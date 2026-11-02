"""Non-destructive Cycles bake investigation on a duplicate of the real desk."""
import bpy
import time
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = bpy.data.scenes['PortfolioDesk']
probe = bpy.data.scenes.new('TemporaryStaticBakeProbe')
probe.world = source.world
bpy.context.window.scene = probe
for light in [o for o in source.objects if o.type == 'LIGHT']:
    cp = light.copy()
    cp.data = light.data.copy()
    probe.collection.objects.link(cp)
original = next(o for o in source.objects if o.name.startswith('OakDesk_desk'))
copy = original.copy()
copy.data = original.data.copy()
probe.collection.objects.link(copy)
copy.parent = None
copy.matrix_world = original.matrix_world.copy()
bpy.ops.object.select_all(action='DESELECT')
copy.select_set(True)
bpy.context.view_layer.objects.active = copy
bpy.ops.object.convert(target='MESH')
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=1.1519, island_margin=.025)
bpy.ops.object.mode_set(mode='OBJECT')
image = bpy.data.images.new('DeskStaticDiffuseBakeProbe', width=1024, height=1024)
for i, mat in enumerate(list(copy.data.materials)):
    mat = mat.copy()
    copy.data.materials[i] = mat
    node = mat.node_tree.nodes.new('ShaderNodeTexImage')
    node.image = image
    mat.node_tree.nodes.active = node
probe.render.engine = source.render.engine
probe.cycles.samples = 24
probe.render.bake.margin = 12
start = time.monotonic()
bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR', 'DIRECT', 'INDIRECT'})
image.filepath_raw = str(root / 'assets/blender/textures/desk-bake-probe.png')
image.file_format = 'PNG'
image.save()
report = {'seconds': round(time.monotonic() - start, 2), 'resolution': [1024, 1024],
    'sourceObject': original.name, 'pass': 'Diffuse color + direct + indirect',
    'movingPaperIncluded': False, 'integratedIntoWebExport': False,
    'reason': 'Investigation only: preserves independent paper; final prototype retains coherent PBR materials with soft runtime shadows.'}
(root / 'docs/portfolio/evidence/bake-probe.json').write_text(json.dumps(report, indent=2))
bpy.context.window.scene = source
for o in list(probe.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.data.scenes.remove(probe)
result = report
