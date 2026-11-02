"""Acquire selected, creator-linked public CC0 files only. No scraping auth assets."""
from pathlib import Path
import urllib.request,re,json,hashlib
r=Path(__file__).resolve().parents[1];base=r/'assets/source/phase7c';s=(base/'quaternius-gltf-drive.html').read_text()
items=dict((name.split(' ')[0],uid) for uid,name in re.findall(r'data-id="([^"]+)"[^>]+data-tooltip="([^"]+)"',s))
print([k for k in items if any(w in k.lower() for w in ['pine','fir','fern','license'])])
for name in ['PineTree_1.gltf','PineTree_1.bin','PineTree_2.gltf','PineTree_2.bin','PineTree_3.gltf','PineTree_3.bin']:
 if name not in items:continue
 try:
  u='https://drive.google.com/uc?export=download&id='+items[name];raw=urllib.request.urlopen(u,timeout=20).read()
  dest=base/'quaternius-stylized';dest.mkdir(exist_ok=True);(dest/name).write_bytes(raw);print(name,len(raw))
 except Exception as e:print(name,e)
