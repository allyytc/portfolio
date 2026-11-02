"""Read-only checks; blocked responses are recorded, never called verified."""
from pathlib import Path
import urllib.request,urllib.error,json,re,concurrent.futures
urls=['https://github.com/dubhack26/KO.rbit','https://devpost.com/software/space-battles-aei3wz','https://www.youtube.com/watch?v=Ta64tj6uJc4','https://www.youtube.com/embed/Ta64tj6uJc4']
def check(url):
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (local portfolio link verification)'}),timeout=20) as r:
   body=r.read(65536).decode('utf-8',errors='replace');title=re.search(r'<title[^>]*>(.*?)</title>',body,re.S|re.I)
   return {'url':url,'httpStatus':r.status,'finalURL':r.url,'verification':'resolved' if 200<=r.status<400 else 'blocked','title':re.sub(r'\s+',' ',title[1]).strip() if title else None,'note':'HTTP reachability only; no login, semantic award validation or playback guarantee.'}
 except Exception as e:return {'url':url,'httpStatus':getattr(e,'code',None),'verification':'blocked','note':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(check,urls))
Path('docs/portfolio/evidence/phase6a/link-checks.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps([{'url':r['url'],'httpStatus':r['httpStatus'],'verification':r['verification']} for r in results]))
