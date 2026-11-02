from pathlib import Path
import bpy,json
r=Path(__file__).resolve().parents[1]
s=bpy.context.scene
info={'file':bpy.data.filepath,'scene':s.name,'scenes':[s.name for s in bpy.data.scenes],'collections':[c.name for c in s.collection.children],'objects':[{ 'name':o.name,'stable':o.get('stable_id'),'type':o.type,'location':list(o.location),'dimensions':list(o.dimensions)} for o in s.objects if o.get('stable_id') or o.type=='CAMERA']}
(r/'docs/portfolio/evidence/phase7c/blender-before.json').write_text(json.dumps(info,indent=2))
print(info)
