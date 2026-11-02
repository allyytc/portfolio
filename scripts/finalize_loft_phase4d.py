import bpy,json,re,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];source=bpy.data.scenes['PortfolioLoft4D'];out=ROOT/'docs/portfolio/evidence/phase4d'
if any(o.get('camera_view_id') for o in source.objects):raise RuntimeError('Named camera markers already exist; preserve edits.')
camera_col=next(c for c in source.collection.children if c.name.startswith('LightingAndCamera'))
views=[]
for name,target,offset,span in re.findall(r'(default|workstation|designCorner|communityPinboard|readingNook|archive|loftBedding): view\(\[([^]]+)\], \[([^]]+)\], \[([^]]+)\]\)',(ROOT/'src/studio/cameraViews.ts').read_text()):
    t=[float(x.strip()) for x in target.split(',')];d=[float(x.strip()) for x in offset.split(',')];extent=[float(x.strip()) for x in span.split(',')];p=[t[i]+d[i] for i in range(3)]
    target_b=Vector((t[0],-t[2],t[1]));position_b=Vector((p[0],-p[2],p[1]))
    marker=bpy.data.objects.new('CameraTarget_'+name,None);camera_col.objects.link(marker);marker.empty_display_type='PLAIN_AXES';marker.empty_display_size=.12;marker.location=target_b;marker['camera_view_id']=name
    data=bpy.data.cameras.new('CameraView_'+name);camera=bpy.data.objects.new('CameraView_'+name,data);camera_col.objects.link(camera);camera.location=position_b;camera.rotation_euler=(target_b-position_b).to_track_quat('-Z','Y').to_euler();data.type='ORTHO';data.ortho_scale=max(extent[0],extent[1]*1800/1400);camera['camera_view_id']=name
    views.append({'id':name,'threePosition':p,'threeTarget':t,'blenderPosition':list(position_b),'blenderTarget':list(target_b),'span':extent,'visitorControlsEnabled':False})
for o in source.objects:
    if o.type=='MESH' and o.data.uv_layers:o.data.uv_layers[0].name='SurfaceUV'
ids=sorted(o.get('stable_id') for o in source.objects if o.get('stable_id'))
assert all(n in ids for n in ['ProjectsMonitor','PrinterBody','ResumePaper','SoftFurnishings','StickerBook','UnwrapDisplay','Community_ESC'])
assert all(bpy.data.scenes.get(n) for n in ['PortfolioLoft4B','PortfolioLoft4C','LoftBaked4C'])
(out/'camera-views.json').write_text(json.dumps(views,indent=2));(out/'final-scene.json').write_text(json.dumps({'scene':source.name,'objects':len(source.objects),'collections':[c.name for c in source.collection.children],'stableIDs':ids,'namedCameraViews':len(views),'priorSourcesPreserved':True,'file':str(ROOT/'assets/blender/studio-phase4d.blend')},indent=2))
bpy.context.window.scene=bpy.data.scenes['LoftBaked4D'];bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4d.blend'),compress=True)
result={'sourceObjects':len(source.objects),'stableIDs':len(ids),'cameraViews':len(views),'file':bpy.data.filepath}
