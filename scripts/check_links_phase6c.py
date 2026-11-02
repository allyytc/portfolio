"""Read-only HTTP checks; never send mail, dial phones or execute source code."""
from pathlib import Path
import json,urllib.request,concurrent.futures
root=Path(__file__).resolve().parents[1];out=root/'docs/portfolio/evidence/phase6c';data=json.loads((out/'extracted-content.json').read_text())
links=data['profile']['links']+[l for o in data['organizations'] for l in o['links']]+[l for r in data['profile']['experience'] for l in r.get('links',[])]
def check(url):
 if url.startswith(('mailto:','tel:')):return {'url':url,'verification':'source-verified','note':'Exact original published destination retained; no message sent or telephone call made'}
 if 'allychen-resume2028-pm.pdf' in url:return {'url':url,'verification':'missing-original-replaced','replacement':'public/files/allychen-resume2028.pdf','note':'Known missing original PDF; owner-supplied unchanged replacement used in UI'}
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (local portfolio preservation link check)'}),timeout=20) as r:r.read(2048);return {'url':url,'httpStatus':r.status,'finalURL':r.url,'verification':'resolved','note':'Reachability only; source content claims not independently reverified'}
 except Exception as e:return {'url':url,'httpStatus':getattr(e,'code',None),'verification':'blocked' if getattr(e,'code',None) not in [404,410] else 'missing','note':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:records=list(pool.map(check,sorted({l['href'] for l in links})))
(out/'link-checks.json').write_text(json.dumps(records,indent=2)+'\n');print(json.dumps(records))
