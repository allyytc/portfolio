"""Build the isolated desk vignette in live Blender. Re-runnable, project scene only."""
import bpy
import math
import json
import random
from pathlib import Path
from mathutils import Vector
import numpy as np
import bmesh

ROOT = Path(__file__).resolve().parents[1]
random.seed(21)
for p in ['assets/blender/textures', 'public/models', 'docs/portfolio/evidence']:
    (ROOT / p).mkdir(parents=True, exist_ok=True)
old = bpy.data.scenes.get('PortfolioDesk')
if old:
    for obj in list(old.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.scenes.remove(old)
scene = bpy.data.scenes.new('PortfolioDesk')
bpy.context.window.scene = scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1

def material(name, color, roughness=.55, metallic=0):
    m = bpy.data.materials.new('Studio_' + name)
    m.use_nodes = True
    p = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Metallic'].default_value = metallic
    m.diffuse_color = (*color, 1)
    return m

cream = material('Cream', (.78, .74, .62))
ivory = material('Ivory', (.91, .88, .78), .45)
sage = material('Sage', (.27, .38, .24), .8)
leaf = material('Leaf', (.12, .25, .075), .65)
leaflight = material('LeafLight', (.24, .39, .12), .65)
soil = material('Soil', (.065, .038, .018), .95)
ink = material('Ink', (.028, .052, .031), .7)
brass = material('Brass', (.39, .26, .095), .35, .65)
rubber = material('Rubber', (.055, .067, .052), .85)
paper = material('Paper', (.95, .93, .86), .9)
linen = material('Linen', (.63, .58, .45), .95)
terracotta = material('Terracotta', (.48, .25, .14), .75)
wood = material('Oak', (.58, .34, .17), .5)
wooddark = material('OakEdge', (.29, .16, .071), .5)
screenmat = material('Screen', (.85, .88, .70), .8)
screenp = next(n for n in screenmat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
screenp.inputs['Emission Color'].default_value = (.68, .76, .52, 1)
screenp.inputs['Emission Strength'].default_value = .2

# Original subtle oak grain, shared image map; no third-party texture required.
w = h = 768
y, x = np.mgrid[0:h, 0:w]
grain = (np.sin(y * .71 + np.sin(x * .019) * 5) * .009
         + np.sin(y * .23 + np.sin(x * .009) * 3) * .009
         + np.random.default_rng(21).normal(0, .003, (h, w)))
pixels = np.ones((h, w, 4), dtype=np.float32)
for i, c in enumerate([.68, .46, .27]):
    pixels[:, :, i] = np.clip(c + grain, 0, 1)
img = bpy.data.images.new('Studio_OakGrain', width=w, height=h)
img.pixels.foreach_set(pixels.ravel())
img.filepath_raw = str(ROOT / 'assets/blender/textures/oak-grain.png')
img.file_format = 'PNG'
img.save()
for m in [wood, wooddark]:
    tex = m.node_tree.nodes.new('ShaderNodeTexImage')
    tex.image = img
    p = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    m.node_tree.links.new(tex.outputs['Color'], p.inputs['Base Color'])

groups = {}
for name in ['Static', 'projects_monitor', 'projects_sign', 'printer', 'resume_paper']:
    o = bpy.data.objects.new(name, None)
    scene.collection.objects.link(o)
    groups[name] = o
groups['projects_monitor']['action'] = 'projects'
groups['projects_sign']['action'] = 'projects'
groups['printer']['action'] = 'resume'

def parent(obj, name='Static'):
    obj.parent = groups[name]
    return obj

def finish(obj, mat, bevel=0, group='Static'):
    if mat:
        obj.data.materials.clear()
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Crafted rounded edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
    if obj.type == 'MESH':
        for p in obj.data.polygons:
            p.use_smooth = True
        mod = obj.modifiers.new('Weighted surface normals', 'WEIGHTED_NORMAL')
        mod.keep_sharp = True
    return parent(obj, group)

def box(name, loc, dims, mat, bevel=.015, group='Static'):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, mat, bevel, group)

def cyl(name, loc, radius, depth, mat, group='Static', rotation=None, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    o = bpy.context.object
    o.name = name
    if rotation:
        o.rotation_euler = rotation
    return finish(o, mat, .003, group)

def torus(name, loc, major, minor, mat, group='Static', rotation=None):
    bpy.ops.mesh.primitive_torus_add(major_segments=32, minor_segments=8,
        major_radius=major, minor_radius=minor, location=loc)
    o = bpy.context.object
    o.name = name
    if rotation:
        o.rotation_euler = rotation
    return finish(o, mat, 0, group)

font = bpy.data.fonts.load(str(ROOT / 'assets/source/nunito/Nunito-ExtraBold.ttf'))
def text(name, body, loc, size, mat=ink, group='Static', vertical=True, extrude=.0008):
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = body
    curve.font = font
    curve.align_x = 'CENTER'
    curve.align_y = 'CENTER'
    curve.size = size
    curve.extrude = extrude
    curve.resolution_u = 4
    obj = bpy.data.objects.new(name, curve)
    scene.collection.objects.link(obj)
    obj.location = loc
    if vertical:
        obj.rotation_euler.x = math.pi / 2
    curve.materials.append(mat)
    return parent(obj, group)

def imported(file, name, loc, dims=None, scale=None, rotation=0, group='Static'):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(ROOT / 'assets/source/kenney-furniture-kit' / (file + '.glb')))
    obs = list(set(bpy.data.objects) - before)
    root = bpy.data.objects.new(name, None)
    scene.collection.objects.link(root)
    verts = [o.matrix_world @ Vector(c) for o in obs if o.type == 'MESH' for c in o.bound_box]
    lo = Vector([min(v[i] for v in verts) for i in range(3)])
    hi = Vector([max(v[i] for v in verts) for i in range(3)])
    center = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    for o in obs:
        if not o.parent or o.parent not in obs:
            o.parent = root
            o.location -= center
    if dims:
        root.scale = [dims[i] / (hi[i] - lo[i]) for i in range(3)]
    elif scale:
        root.scale = (scale, scale, scale)
    root.location = loc
    root.rotation_euler.z = rotation
    parent(root, group)
    for o in obs:
        if o.type != 'MESH':
            continue
        o.name = name + '_' + o.name.replace('(Clone)', '')
        for i, m in enumerate(o.data.materials):
            n = m.name.lower()
            replacement = (leaf if 'plant' in n else sage if 'carpet' in n and file == 'chairDesk'
                else paper if 'white' in n else brass if 'metal' in n and file in ['desk', 'sideTableDrawers']
                else cream if 'metal' in n else soil if 'dark' in n and 'wood' in n
                else terracotta if 'wood' in n and 'plant' in file.lower()
                else wood if 'wood' in n else ivory)
            o.data.materials[i] = replacement
        mod = o.modifiers.new('Soft furniture edges', 'BEVEL')
        mod.width = .006
        mod.segments = 3
        for p in o.data.polygons:
            p.use_smooth = True
        o.modifiers.new('Furniture normals', 'WEIGHTED_NORMAL')
    return root, obs

# A miniature open vignette, not a room. Every desk/chair/computer base is reused.
box('Oak plinth', (0, -.1, -.065), (4.05, 2.7, .13), wood, .075)
for i in range(18):
    box('Inset oak floorboard %02d' % i, (-1.9 + i * .222, -.1, .009), (.215, 2.57, .025), wood, .008)
box('Woven chair rug', (.05, -.55, .039), (1.6, 1.48, .025), linen, .065)
# Fine stitched borders, kept restrained.
for x in [-.68, .78]:
    box('Rug stitched border', (x, -.55, .054), (.008, 1.34, .002), ivory, .001)

desk, deskobs = imported('desk', 'OakDesk', (-.22, .3, .04), dims=(2.05, .79, .79))
cabinet, cabobs = imported('sideTableDrawers', 'PrinterCabinet', (1.16, .27, .04), dims=(.62, .64, .74))
# Reuse the source's drawer geometry; cream-painted fronts against an oak shell.
for o in deskobs + cabobs:
    if 'drawer' in o.name.lower():
        for i, m in enumerate(o.data.materials):
            if m == wood:
                o.data.materials[i] = cream

chair, chairparts = imported('chairDesk', 'SageChair', (-.08, -.65, .06), dims=(.64, .64, 1.0), rotation=math.pi + .12)
# Preserve the reusable base/column, replace the coarse seat shell with softly
# upholstered Blender geometry, piping and a cream back frame.
for part in chairparts:
    if part.name.endswith('_chair'):
        bpy.data.objects.remove(part, do_unlink=True)
box('Chair cream back shell', (-.08, -.86, .79), (.56, .12, .52), cream, .06)
box('Chair padded sage back', (-.08, -.935, .79), (.49, .07, .44), sage, .034)
box('Chair back inset seam', (-.08, -.975, .78), (.43, .009, .38), sage, .004)
box('Chair cushioned seat', (-.08, -.66, .49), (.53, .49, .105), sage, .049)
box('Chair seat lower frame', (-.08, -.65, .431), (.54, .48, .035), cream, .016)
for side in [-1, 1]:
    x = -.08 + side * .315
    box('Chair arm upright', (x, -.77, .58), (.04, .05, .23), cream, .017)
    box('Chair curved armrest', (x, -.64, .705), (.075, .32, .045), cream, .022)
for i in range(5):
    angle = i * math.tau / 5
    x, y = -.08 + math.cos(angle) * .27, -.65 + math.sin(angle) * .27
    cyl('Twin caster wheel', (x, y, .102), .045, .056, rubber, rotation=(math.pi / 2, 0, angle))
    cyl('Caster hub', (x, y - .029, .102), .016, .003, brass, rotation=(math.pi / 2, 0, angle))

# Fitted cream drawer pedestal under the adapted desk, with real gaps/pulls.
box('Desk drawer pedestal carcass', (-.89, .31, .395), (.42, .64, .70), cream, .019)
for i in range(3):
    z = .18 + i * .205
    box('Desk inset drawer %d' % i, (-.89, -.021, z), (.38, .024, .184), ivory, .008)
    box('Desk drawer brass pull %d' % i, (-.89, -.043, z + .045), (.105, .021, .014), brass, .005)
monitor, monitorparts = imported('computerScreen', 'MonitorHousing', (-.36, .42, .83), dims=(.78, .21, .57), group='projects_monitor')
for o in monitorparts:
    # The source's dark material is its actual display; retain the physical
    # housing/bezel rather than layering another rectangular panel in front.
    o.data.materials[0] = screenmat
    if len(o.data.materials) > 1:
        o.data.materials[1] = cream
text('Screen greeting', 'Hello, I’m Ally.', (-.36, .294, 1.245), .074, ink, 'projects_monitor')
text('Screen project cue', 'A little space for big ideas.', (-.36, .292, 1.163), .029, ink, 'projects_monitor')
text('Screen open projects', 'EXPLORE PROJECTS  →', (-.36, .291, 1.077), .024, ink, 'projects_monitor')
# Small sage leaves on the original screen artwork, deliberately without a bunny.
for x in [-.65, -.07]:
    cyl('Screen graphic dot', (x, .286, 1.31), .014, .003, sage, 'projects_monitor', (math.pi / 2, 0, 0), 16)

keyboard, _ = imported('computerKeyboard', 'KeyboardHousing', (-.38, .015, .835), dims=(.53, .22, .035))
for row in range(4):
    for col in range(13):
        box('Cream keycap %d-%d' % (row, col), (-.62 + col * .039, -.064 + row * .047, .87), (.032, .035, .011), ivory, .004)
box('Spacebar', (-.38, -.11, .87), (.22, .028, .011), cream, .004)
imported('computerMouse', 'Mouse', (.05, -.01, .838), dims=(.07, .12, .038))
imported('plantSmall2', 'DeskPlant', (-1.03, .43, .83), scale=1.65)
_, plantparts = imported('pottedPlant', 'FloorPlant', (1.65, .65, .04), scale=1.55)
for o in plantparts:
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.0001)
    bm.to_mesh(o.data)
    bm.free()
    if 'pottedPlant' in o.name:
        for i, m in enumerate(o.data.materials):
            if m == terracotta:
                o.data.materials[i] = ivory
        sub = o.modifiers.new('Smooth ceramic planter', 'SUBSURF')
        sub.levels = sub.render_levels = 2
    else:
        solid = o.modifiers.new('Leaf thickness', 'SOLIDIFY')
        solid.thickness = .003
        sub = o.modifiers.new('Soft leaf silhouette', 'SUBSURF')
        sub.levels = sub.render_levels = 2
_, lampparts = imported('lampRoundTable', 'SageDeskLamp', (.35, .52, .83), dims=(.235, .235, .39))
for o in lampparts:
    o.data.materials.clear()
    o.data.materials.append(sage)
imported('books', 'DesignBooks', (.36, .17, .835), scale=1.4)

# Original physical sign: rounded timber, inset edge, two bronze hanging loops.
g = 'projects_sign'
box('Signpost timber', (-1.58, .34, .79), (.09, .095, 1.55), wooddark, .016, g)
box('Signpost foot', (-1.58, .34, .08), (.39, .32, .08), wood, .025, g)
box('Signpost crossbar', (-1.58, .32, 1.63), (1.0, .12, .09), wood, .028, g)
box('Name board', (-1.58, .27, 1.43), (.85, .095, .245), wood, .035, g)
text('Name sign lettering', 'Ally Chen', (-1.58, .214, 1.44), .126, ink, g)
box('Projects board', (-1.58, .25, 1.065), (.88, .11, .27), wood, .035, g)
box('Projects inset face', (-1.58, .189, 1.065), (.79, .014, .19), wood, .025, g)
text('Projects lettering', 'PROJECTS', (-1.58, .173, 1.075), .106, ivory, g, extrude=.0015)
text('Projects subtitle', 'things I’ve made', (-1.58, .172, 1.009), .026, ivory, g)
for x in [-1.87, -1.29]:
    for z in [1.58, 1.24]:
        torus('Bronze sign loop', (x, .24, z), .029, .006, brass, g, (math.pi / 2, 0, 0))

# Essential printer was not downloadable through the audited catalog. Original
# Blender housing, inset scanner lid, output throat, tray, controls and paper.
g = 'printer'
cx, cy, bz = 1.16, .27, .79
box('Printer lower chassis', (cx, cy, bz + .115), (.53, .415, .23), ivory, .045, g)
box('Printer scanner seam', (cx, cy, bz + .235), (.52, .40, .025), sage, .018, g)
box('Printer scanner lid', (cx, cy + .005, bz + .263), (.54, .42, .055), cream, .028, g)
box('Printer top inset', (cx, cy + .012, bz + .295), (.43, .31, .01), ivory, .016, g)
box('Paper output throat', (cx, cy - .209, bz + .117), (.354, .017, .055), ink, .014, g)
box('Output tray lower lip', (cx, cy - .258, bz + .07), (.37, .115, .022), cream, .01, g)
box('Paper feed backing', (cx, cy + .19, bz + .35), (.29, .023, .21), cream, .015, g)
feed = box('Input paper', (cx, cy + .176, bz + .38), (.245, .004, .22), paper, .003, g)
feed.rotation_euler.x = -.12
cyl('Printer power button', (cx + .205, cy - .213, bz + .18), .016, .007, sage, g, (math.pi / 2, 0, 0))
cyl('Printer power status', (cx + .205, cy - .219, bz + .18), .005, .003, ivory, g, (math.pi / 2, 0, 0), 16)
text('Printer wordmark', 'STUDIO / 01', (cx - .03, cy - .216, bz + .19), .018, sage, g)

g = 'resume_paper'
groups[g].location = (cx, cy - .218, bz + .117)
v, f = [], []
for i in range(13):
    t = i / 12
    for x in [-.121, .121]:
        v.append((x, -.31 * t, -.055 * t * t))
for i in range(12):
    f.append((i * 2, i * 2 + 1, i * 2 + 3, i * 2 + 2))
mesh = bpy.data.meshes.new('Curved resume sheet')
mesh.from_pydata(v, [], f)
sheet = bpy.data.objects.new('resume_sheet', mesh)
scene.collection.objects.link(sheet)
finish(sheet, paper, 0, g)
mod = sheet.modifiers.new('Paper thickness', 'SOLIDIFY')
mod.thickness = .0012
text('Resume print title', 'RESUME', (0, -.15, -.006), .031, ink, g, vertical=False, extrude=0)
text('Resume print name', 'Ally Chen', (0, -.19, -.013), .019, sage, g, vertical=False, extrude=0)
for i in range(4):
    box('Resume typeset line', (-.012 if i % 2 else 0, -.215 - i * .013, -.021 - i * .003), (.17 if i % 2 == 0 else .146, .002, .0005), sage, 0, g)

# Plaque on the desk preserves the owner-approved current role, also in HTML.
box('Desk role plaque', (-.23, -.112, .756), (.59, .024, .075), wooddark, .009)
text('Desk role label', 'Software Developer Intern @ Impact Studio', (-.23, -.129, .757), .018, ivory)

# Set sensible UVs on generated geometry for the original oak image.
for o in list(scene.objects):
    if o.type == 'MESH' and any(m in [wood, wooddark] for m in o.data.materials):
        bpy.ops.object.select_all(action='DESELECT')
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.cube_project(cube_size=1)
        bpy.ops.object.mode_set(mode='OBJECT')

# Render-only lighting. Web uses matching broad area-like directional lights.
def area(name, loc, energy, size, color, target):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.shape, data.size, data.color = energy, 'DISK', size, color
    o = bpy.data.objects.new(name, data)
    scene.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector(target) - o.location).to_track_quat('-Z', 'Y').to_euler()
    return o
area('Afternoon softbox', (-3, -4, 6), 500, 4, (1, .83, .62), (0, 0, .5))
area('Cool window fill', (3, 2, 4), 250, 3, (.82, .91, 1), (0, 0, .7))
area('Warm rim', (0, 3, 4), 350, 2.5, (1, .77, .46), (0, 0, .8))
world = bpy.data.worlds.new('Studio cream environment')
world.use_nodes = True
next(n for n in world.node_tree.nodes if n.type == 'BACKGROUND').inputs['Color'].default_value = (.78, .76, .68, 1)
next(n for n in world.node_tree.nodes if n.type == 'BACKGROUND').inputs['Strength'].default_value = .45
scene.world = world
camdata = bpy.data.cameras.new('Studio_Isometric')
cam = bpy.data.objects.new('Studio_Isometric', camdata)
scene.collection.objects.link(cam)
cam.location = (4, -6, 4.25)
target = Vector((-.1, .0, .72))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
camdata.type = 'ORTHO'
camdata.ortho_scale = 5.25
scene.camera = cam
scene.render.resolution_x = 1500
scene.render.resolution_y = 1100
scene.render.resolution_percentage = 100
try:
    scene.render.engine = 'CYCLES'
except TypeError:
    pass
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = True
scene.render.filepath = str(ROOT / 'docs/portfolio/evidence/blender-desk.png')
scene.view_settings.view_transform = 'AgX'
scene['asset_notes'] = 'CC0 Kenney furniture + original sign/printer details; see PHASE3_ASSET_REGISTER.md'
bpy.context.view_layer.update()
img.pack()
font.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'assets/blender/desk-studio.blend'))
result = {'scene': scene.name, 'objects': len(scene.objects), 'file': bpy.data.filepath,
          'camera': list(cam.location), 'target': list(target), 'ready': True}
