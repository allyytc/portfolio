"""Extract original source as data, never execute its JS/HTML. Only KO.rbit is migrated."""
from pathlib import Path
from html.parser import HTMLParser
import html,json,re,hashlib
ROOT=Path(__file__).resolve().parents[1];REF='35ecfec2c43c535ea013e23720ffa6ad73108f10';REPO='allyytc/allyytc.github.io'
class Node:
 def __init__(self,tag='',attrs=(),parent=None):self.tag=tag;self.attrs=dict(attrs);self.parent=parent;self.children=[]
 def walk(self):
  yield self
  for c in self.children:
   if isinstance(c,Node):yield from c.walk()
 def text(self):return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
def norm(s):return re.sub(r'\s+',' ',html.unescape(s)).strip()
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root]
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs,self.stack[-1]);self.stack[-1].children.append(n)
  if tag not in {'img','br','hr','input','meta','link','source','wbr','area','embed','col','param','track'}:self.stack.append(n)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];return
 def handle_data(self,s):self.stack[-1].children.append(s)
def parse(path):
 p=Parser();p.feed(path.read_text());return p.root
def source(path,anchor=None):
 d={'repository':REPO,'ref':REF,'path':path}
 if anchor:d['anchor']=anchor
 return d
def rich(n):
 out=[]
 for c in n.children:
  if isinstance(c,str):out.append(re.sub(r'\s+',' ',c))
  elif c.tag in ('strong','em'):out.append({'text':norm(c.text()),'emphasis':c.tag})
  elif c.tag=='a':out.append({'text':norm(c.text()),'href':c.attrs.get('href','')})
  else:out.extend(rich(c))
 return out
base=ROOT/'docs/portfolio/reference';tree=parse(base/'projects.html.txt')
card=next(n for n in tree.walk() if n.attrs.get('id')=='project-korbit')
blocks=[n for n in card.walk() if 'proj-detail-block' in n.attrs.get('class','').split()]
sections=[];links=[]
for i,n in enumerate(blocks):
 title=next((norm(c.text()) for c in n.children if isinstance(c,Node) and c.tag=='h4'),None)
 content=[]
 for c in n.children:
  if not isinstance(c,Node):continue
  if c.tag=='p':content.append({'kind':'paragraph','content':rich(c)})
  if c.tag in ('ul','ol'):content.append({'kind':'list','items':[rich(li) for li in c.children if isinstance(li,Node) and li.tag=='li'],'ordered':c.tag=='ol'})
  if c.tag=='a':
   label=norm(c.text()).replace(' →','');links.append({'id':label.lower(),'label':label,'href':c.attrs['href'],'kind':{'GitHub':'github','Devpost':'devpost','Demo':'demo'}[label],'verification':'not-checked'})
 sections.append({'id':['description','my-role','tech-stack','features'][i],'title':title,'blocks':content,'source':source('projects.html','project-korbit')})
js=(base/'projects.js.txt').read_text()
def jsstr(raw):return re.sub(r"\\(['\\])",r'\1',raw)
galleries={}
for m in re.finditer(r"['\"]([^'\"]+)['\"]\s*:\s*\[(.*?)\n\s*\]",js,re.S):
 items=[]
 for e in re.finditer(r"\{\s*type:\s*'((?:\\.|[^'])*)',\s*src:\s*'((?:\\.|[^'])*)',\s*caption:\s*'((?:\\.|[^'])*)'\s*\}",m[2]):items.append(dict(zip(['type','src','caption'],map(jsstr,e.groups()))))
 if items:galleries[m[1]]=items
media=[]
manifest=json.loads((base/'FILE_MANIFEST.json').read_text());files={f['path']:f for f in manifest['files']}
for index,item in enumerate(galleries['korbit-interface']):
 path=item['src'];media.append({'id':f'korbit-image-{index+1}','kind':'image','src':'media/'+path,'originalPath':path,'source':source('projects.js','korbit-interface'),'sourceURL':f'https://raw.githubusercontent.com/{REPO}/{REF}/{path}','gitBlob':files[path]['sha'],'rights':'owner-local-rebuild','alt':item['caption'],'caption':item['caption']})
video=galleries['korbit-demo'][0]
media.append({'id':'korbit-demo','kind':'embed','src':video['src'],'title':video['caption'],'caption':video['caption'],'watchURL':next(l['href'] for l in links if l['kind']=='demo'),'source':source('projects.js','korbit-demo'),'originalPath':video['src'],'rights':'review-required'})
sections.extend([{'id':'demo','title':'Demo Video','blocks':[{'kind':'media','mediaId':'korbit-demo'}],'source':source('projects.js','korbit-demo')},{'id':'screenshots','title':'Screenshots','blocks':[{'kind':'gallery','label':'KO.rbit screenshots','mediaIds':[m['id'] for m in media if m['kind']=='image']}],'source':source('projects.js','korbit-interface')}])
project={'id':'korbit','title':'KO.rbit','category':'hackathons','overview':norm(next(n for n in card.walk() if n.attrs.get('class')=='proj-card-desc').text()),'awards':[norm(next(n for n in card.walk() if 'proj-card-badge' in n.attrs.get('class','')).text())],'technologies':[norm(n.text()) for n in next(n for n in card.walk() if n.attrs.get('class')=='project-tags').children if isinstance(n,Node)],'heroMediaId':media[0]['id'],'sections':sections,'media':media,'links':links,'source':source('projects.html','project-korbit'),'verification':{'status':'source-preserved','notes':['Full source content; not an independent verification of the original award/technical claims.']}}
for asset in media:
 local=ROOT/'public'/asset['src']
 if asset['kind']=='image' and local.exists():asset['sha256']=hashlib.sha256(local.read_bytes()).hexdigest()
checks_path=ROOT/'docs/portfolio/evidence/phase6a/link-checks.json'
if checks_path.exists():
 checks={e['url']:e for e in json.loads(checks_path.read_text())}
 for link in links:link['verification']=checks.get(link['href'],{}).get('verification','not-checked')
(ROOT/'src/content/case-studies/korbit.ts').write_text("// Generated losslessly from pinned original source. See prepare_content_phase6a.py.\nimport type { Project } from '../schema'\nexport const korbit: Project = "+json.dumps(project,ensure_ascii=False,indent=2)+'\n')
# A preservation index keeps every source paragraph/list/reference, including
# scripts as inert text. It is an audit artifact, never rendered as source HTML.
page_inventory=[]
for name in ['index.html','projects.html','involvement.html','beaverhacks-2026.html','innovation-jam-2026.html','eweek.html']:
 t=parse(base/(name+'.txt'));nodes=list(t.walk())
 page_inventory.append({'path':name,'source':source(name),'headings':[{'id':n.attrs.get('id'),'level':n.tag,'text':norm(n.text())} for n in nodes if n.tag in ['h1','h2','h3','h4','h5']],'textBlocks':[{'tag':n.tag,'text':norm(n.text())} for n in nodes if n.tag in ['p','li','figcaption'] and norm(n.text())],'references':[{'tag':n.tag,**n.attrs} for n in nodes if any(a in n.attrs for a in ['href','src','poster','data-gallery'])],'embeddedScripts':[n.text() for n in nodes if n.tag=='script' and not n.attrs.get('src')]})
audit={'repository':REPO,'ref':REF,'pages':page_inventory,'projectGalleries':galleries,'completeSnapshots':'docs/portfolio/reference/*.txt','originalMediaCount':244}
(ROOT/'docs/portfolio/evidence/phase6a/content-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'KO.rbit':{'sections':len(sections),'roleItems':len(sections[1]['blocks'][0]['items']),'features':len(sections[3]['blocks'][0]['items']),'images':5,'embeds':1},'pages':[{'path':p['path'],'textBlocks':len(p['textBlocks']),'references':len(p['references'])} for p in page_inventory],'projectGalleries':list(galleries)},indent=2))
