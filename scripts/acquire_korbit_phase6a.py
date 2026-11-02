"""Read-only HTTP GET of five pinned original screenshots; verify before copying."""
from pathlib import Path
import json,hashlib,urllib.request,shutil,concurrent.futures
ROOT=Path(__file__).resolve().parents[1];REF='35ecfec2c43c535ea013e23720ffa6ad73108f10'
manifest={e['path']:e for e in json.loads((ROOT/'docs/portfolio/reference/FILE_MANIFEST.json').read_text())['files']}
paths=['korbit-gal/'+n+'.webp' for n in ['title','cockpit','duel','mars-arena','solar-view']]
def acquire(path):
 url=f'https://raw.githubusercontent.com/allyytc/allyytc.github.io/{REF}/{path}'
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'portfolio-local-preservation'}),timeout=25) as response:data=response.read();status=response.status
 blob=hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
 assert blob==manifest[path]['sha'],path
 assert len(data)==manifest[path]['size'],path
 original=ROOT/'assets/source/portfolio-media/korbit'/Path(path).name;served=ROOT/'public/media'/path
 original.parent.mkdir(parents=True,exist_ok=True);served.parent.mkdir(parents=True,exist_ok=True)
 original.write_bytes(data);shutil.copy2(original,served)
 return {'originalPath':path,'sourceURL':url,'gitBlob':blob,'matchesPinnedBlob':True,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'httpStatus':status,'sourceDestination':str(original.relative_to(ROOT)),'servedDestination':str(served.relative_to(ROOT)),'permission':'Owner-requested local portfolio preservation; no general third-party license inferred'}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:records=list(pool.map(acquire,paths))
(ROOT/'docs/portfolio/evidence/phase6a/media-acquisition.json').write_text(json.dumps(records,indent=2)+'\n')
print(json.dumps({'files':len(records),'bytes':sum(e['bytes'] for e in records),'allGitBlobsVerified':True}))
