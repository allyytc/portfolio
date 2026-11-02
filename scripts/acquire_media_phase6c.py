"""Read-only pinned-source acquisition. No media transformation or duplicate destinations."""
from pathlib import Path
import json,hashlib,urllib.request,concurrent.futures
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'docs/portfolio/evidence/phase6c'
files={r['path']:r for r in json.loads((ROOT/'docs/portfolio/reference/FILE_MANIFEST.json').read_text())['files']}
required=json.loads((out/'required-media.json').read_text())
def acquire(a):
 p=ROOT/'public'/a['src'];p.parent.mkdir(parents=True,exist_ok=True)
 def blob(data):return hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
 data=p.read_bytes() if p.exists() else b'';reused=bool(data) and blob(data)==a['gitBlob']
 if not reused:
  with urllib.request.urlopen(urllib.request.Request(a['sourceURL'],headers={'User-Agent':'portfolio-local-preservation'}),timeout=60) as r:data=r.read()
  assert blob(data)==a['gitBlob'],a['originalPath'];assert len(data)==files[a['originalPath']]['size']
  p.write_bytes(data)
 return {'originalPath':a['originalPath'],'sourceURL':a['sourceURL'],'gitBlob':blob(data),'matchesPinned':True,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'destination':str(p.relative_to(ROOT)),'status':'reused verified local file' if reused else 'downloaded verified original','rights':'Owner-requested local rebuild; underlying rights/credits retained, no blanket license inferred'}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:records=list(pool.map(acquire,required))
(out/'media-acquisition.json').write_text(json.dumps(records,indent=2)+'\n')
print(json.dumps({'files':len(records),'bytes':sum(r['bytes'] for r in records),'reused':sum(r['status'].startswith('reused') for r in records),'allGitBlobsVerified':True}))
