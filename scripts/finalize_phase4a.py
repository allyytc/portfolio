import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=bpy.data.scenes['PortfolioDesk4A']
chair=[]
for o in source.objects:
    if o.type=='MESH' and o.data.uv_layers:o.data.uv_layers[0].name='SurfaceUV'
    n=o.get('source_name','')
    if o.type=='MESH' and any(t in n for t in ['SageChair','Chair ','Twin caster','Caster hub']):
        names=[m.name for m in o.data.materials]
        assert all(name.startswith('4A_Black') for name in names),(n,names)
        chair.append({'object':n,'materials':names})
assert bpy.data.scenes.get('PortfolioDesk')
assert bpy.data.scenes.get('RoomBlockout4A_TEMPORARY')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/studio-phase4a.blend'))
(ROOT/'docs/portfolio/evidence/phase4a/final-scene.json').write_text(json.dumps({'file':bpy.data.filepath,'scenes':[s.name for s in bpy.data.scenes],'chair':chair,'originalScenePreserved':True,'blockoutSeparate':True},indent=2))
result={'chairVerifiedAllBlack':len(chair),'file':bpy.data.filepath}
