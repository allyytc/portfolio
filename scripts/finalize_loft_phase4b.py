import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];scene=bpy.data.scenes['PortfolioLoft4B']
chair=[]
for o in scene.objects:
    if o.type=='MESH' and o.data.uv_layers:o.data.uv_layers[0].name='SurfaceUV'
    n=o.get('phase4a_source_name','')
    if o.type=='MESH' and any(t in n for t in ['SageChair','Chair ','Twin caster','Caster hub']):
        names=[m.name for m in o.data.materials]
        assert not any('Black' in m for m in names)
        chair.append({'source':n,'materials':names})
scene['furnished4b']=True
assert len(scene.collection.children)==10
assert all(bpy.data.scenes.get(n) for n in ['PortfolioDesk','PortfolioDesk4A','DeskBaked4A','RoomBlockout4A_TEMPORARY'])
ids=sorted(o.get('stable_id') for o in scene.objects if o.get('stable_id'))
evidence={'source':scene.name,'file':bpy.data.filepath,'objects':len(scene.objects),'collections':[c.name for c in scene.collection.children],'stableIDs':ids,'chair':chair,'priorScenesPreserved':True,'camera':list(scene.camera.location),'cameraTarget':[0,0,1.55]}
(ROOT/'docs/portfolio/evidence/phase4b/final-scene.json').write_text(json.dumps(evidence,indent=2))
bpy.context.window.scene=bpy.data.scenes['LoftBaked4B']
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4b.blend'))
result={'sourceObjects':len(scene.objects),'zones':len(scene.collection.children),'stableIDs':len(ids),'chairObjects':len(chair)}
