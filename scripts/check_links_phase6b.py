from pathlib import Path
import json,urllib.request,urllib.error,concurrent.futures
root=Path(__file__).resolve().parents[1];out=root/'docs/portfolio/evidence/phase6b';data=json.loads((out/'extracted-content.json').read_text())
urls=sorted({l['href'] for p in data['projects'] for l in p['links']}|{a['src'] for p in data['projects'] for a in p['media'] if a['kind']=='embed'})
def check(url):
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (local portfolio link verification)'}),timeout=20) as r:r.read(2048);return {'url':url,'httpStatus':r.status,'finalURL':r.url,'verification':'resolved','note':'HTTP reachability, not independent claim verification or playback guarantee'}
 except Exception as e:return {'url':url,'httpStatus':getattr(e,'code',None),'verification':'missing' if getattr(e,'code',None) in [404,410] else 'blocked','note':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(check,urls))
(out/'link-checks.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps({'checked':len(results),'resolved':sum(r['verification']=='resolved' for r in results),'unresolved':[r for r in results if r['verification']!='resolved']}))
