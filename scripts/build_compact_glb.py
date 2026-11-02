"""Derive a phone texture export without touching geometry or original assets."""
from pathlib import Path
import json,struct,hashlib,subprocess,copy
root=Path(__file__).resolve().parents[1];work=root/'assets/optimized/phase7d';work.mkdir(parents=True,exist_ok=True)
p=root/'public/models/loft-studio-v7d.glb';data=p.read_bytes();jlen=struct.unpack_from('<I',data,12)[0];g=json.loads(data[20:20+jlen]);binStart=20+jlen+8;binary=data[binStart:];image=next(i for i in g['images'] if i['name']=='loft7d-static-baked');viewIndex=image['bufferView'];view=g['bufferViews'][viewIndex];old=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];(work/'baked-original.jpg').write_bytes(old)
subprocess.run(['sips','-z','2048','2048',str(work/'baked-original.jpg'),'--out',str(work/'baked-2048.jpg')],check=True,capture_output=True);small=(work/'baked-2048.jpg').read_bytes();updated=copy.deepcopy(g);combined=bytearray();unchanged=0
for i,v in enumerate(g['bufferViews']):
 combined.extend(b'\0'*((-len(combined))%4));chunk=small if i==viewIndex else binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];updated['bufferViews'][i]['byteOffset']=len(combined);updated['bufferViews'][i]['byteLength']=len(chunk);combined.extend(chunk)
 if i!=viewIndex:assert hashlib.sha256(chunk).digest()==hashlib.sha256(binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]).digest();unchanged+=1
updated['buffers'][0]['byteLength']=len(combined);combined.extend(b'\0'*((-len(combined))%4));js=json.dumps(updated,separators=(',',':')).encode();js+=b' '*((-len(js))%4);result=struct.pack('<4sII',b'glTF',2,12+8+len(js)+8+len(combined))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(combined),b'BIN\0')+combined
out=root/'public/models/loft-studio-v7d-compact.glb';out.write_bytes(result)
assert g['nodes']==updated['nodes'] and g['meshes']==updated['meshes'] and g['materials']==updated['materials'] and g['accessors']==updated['accessors']
r={'source':str(p.relative_to(root)),'sourceBytes':len(data),'sourceSHA256':hashlib.sha256(data).hexdigest(),'destination':str(out.relative_to(root)),'bytes':len(result),'sha256':hashlib.sha256(result).hexdigest(),'unchangedGeometryBufferViews':unchanged,'onlyModifiedBufferView':viewIndex,'originalBakedSize':[4096,4096],'phoneBakedSize':[2048,2048],'nodesMeshesMaterialsAccessorsIdentical':True,'estimatedOriginalTextureRGBAWithMipmaps':95070890,'estimatedCompactTextureRGBAWithMipmaps':round((2048*2048+1024*1024)*4*4/3)}
(root/'docs/portfolio/evidence/phase7d/compact-model.json').write_text(json.dumps(r,indent=2)+'\n');print({k:v for k,v in r.items() if 'SHA' not in k and 'sha' not in k})
