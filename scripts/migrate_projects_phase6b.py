"""Lossless source extraction for nine projects and the original design collection."""
from portfolio_source import ROOT,REF,REPO,Node,parse,norm,rich,source
from pathlib import Path
from urllib.parse import unquote,quote
import json,re,ast,hashlib
base=ROOT/'docs/portfolio/reference';out=ROOT/'docs/portfolio/evidence/phase6b';out.mkdir(parents=True,exist_ok=True)
files={f['path']:f for f in json.loads((base/'FILE_MANIFEST.json').read_text())['files']}
js=(base/'projects.js.txt').read_text();tree=parse(base/'projects.html.txt')
def jsstr(s):return ast.literal_eval("'"+s+"'")
galleries={}
for m in re.finditer(r"['\"]([^'\"]+)['\"]\s*:\s*\[(.*?)\n\s*\]",js,re.S):
 items=[]
 for e in re.finditer(r"\{\s*type:\s*'((?:\\.|[^'])*)',\s*src:\s*'((?:\\.|[^'])*)',\s*caption:\s*'((?:\\.|[^'])*)'\s*\}",m[2]):items.append(dict(zip(['type','src','caption'],map(jsstr,e.groups()))))
 if items:galleries[m[1]]=items
prior={r['sourcePath']:'media/'+Path(r['destination']).name for r in json.loads((ROOT/'assets/source/portfolio-media/acquisition.json').read_text())}
assets={}
def asset(path,caption='',alt=None,context='projects.js'):
 original=unquote(path);id=original
 if id in assets:return assets[id]
 external=path.startswith('http');kind='embed' if external else ('video' if original.lower().endswith('.mp4') else 'image')
 src=path if external else prior.get(original,'media/'+original)
 a={'id':id,'kind':kind,'src':src,'originalPath':original,'source':source(context),'rights':'owner-local-rebuild' if kind!='embed' else 'review-required'}
 if caption:a['caption']=caption
 if kind=='image':a['alt']=alt or caption or Path(original).stem
 else:a['title']=caption or Path(original).stem
 if kind=='embed':a['watchURL']=path.replace('/embed/','/watch?v=')
 else:
  assert original in files,original
  a['gitBlob']=files[original]['sha'];a['sourceURL']=f'https://raw.githubusercontent.com/{REPO}/{REF}/'+quote(original,safe='/')
  local=ROOT/'public'/src
  if local.exists():a['sha256']=hashlib.sha256(local.read_bytes()).hexdigest()
  if kind=='video':a['mime']='video/mp4'
  if original.startswith('afterlife-metro/') and 'Nour' in caption:a['credits']=['Game art by Nour Alzahraa Alqattan.']
 assets[id]=a;return a
cards=[n for n in tree.walk() if 'proj-card' in n.attrs.get('class','').split()]
ids=['impact-studio','cddc','korbit','er-overwatch','combocraft','lantern','sallys-pos','afterlife-metro','dementia']
projects=[]
labels={'impact-studio-live':'Live Site','impact-studio-homepage':'Wireframes · Homepage','impact-studio-about':'Wireframes · About Us', 'afterlife-metro':'Screenshots'}
for id,card in zip(ids,cards):
 category='in-progress' if id in ids[:2] else 'hackathons' if id in ids[2:6] else 'past-projects'
 style='web-ux' if category=='in-progress' else 'technical' if category=='past-projects' else 'software'
 title=next(norm(n.text()) for n in card.walk() if n.tag=='h3')
 sections=[];links=[];media=[];counter={}
 for b in [n for n in card.walk() if 'proj-detail-block' in n.attrs.get('class','').split()]:
  heading=next((norm(c.text()) for c in b.children if isinstance(c,Node) and c.tag=='h4'),None);blocks=[]
  sid=re.sub(r'[^a-z0-9]+','-',(heading or 'Supporting information').lower()).strip('-');counter[sid]=counter.get(sid,0)+1
  if counter[sid]>1:sid+='-'+str(counter[sid])
  for c in b.children:
   if not isinstance(c,Node):continue
   if c.tag=='p':blocks.append({'kind':'paragraph','content':rich(c)})
   elif c.tag in ('ul','ol'):blocks.append({'kind':'list','items':[rich(li) for li in c.children if isinstance(li,Node) and li.tag=='li'],'ordered':c.tag=='ol'})
   elif c.tag=='a':
    label=norm(c.text()).replace(' →','');href=c.attrs['href'];links.append({'id':f'link-{len(links)}','label':label,'href':href,'kind':'github' if 'github.com' in href else 'devpost' if 'devpost.com' in href else 'demo' if 'youtube' in href else 'live','verification':'not-checked'})
  if blocks:sections.append({'id':sid,**({'title':heading} if heading else {}),'blocks':blocks,'source':source('projects.html',card.attrs.get('id',title))})
 seen=[]
 for node in card.walk():
  key=node.attrs.get('data-gallery')
  if not key or key in seen:continue
  seen.append(key);items=galleries[key];gallery_blocks=[];run=[]
  for item in items:
   a=asset(item['src'],item['caption']);media.append(a)
   if a['kind']=='image':run.append(a['id'])
   else:
    if run:gallery_blocks.append({'kind':'gallery','label':key,'mediaIds':run});run=[]
    gallery_blocks.append({'kind':'media','mediaId':a['id']})
  if run:gallery_blocks.append({'kind':'gallery','label':key,'mediaIds':run})
  label=labels.get(key) or ('Wireframes · '+norm(node.text()) if key.startswith('cddc-') else 'Demo Video' if key.endswith('-demo') else 'Interface' if key.endswith('-interface') else 'Gallery')
  sections.append({'id':key,'title':label,'blocks':gallery_blocks,'source':source('projects.js',key)})
 for i,note in enumerate(n for n in card.walk() if n.attrs.get('class')=='thumb-strip-note'):
  sections.append({'id':'source-note-'+str(i),'blocks':[{'kind':'paragraph','content':[norm(note.text())]}],'source':source('projects.html',title)})
 tags=next(n for n in card.walk() if n.attrs.get('class')=='project-tags')
 p={'id':id,'title':title,'category':category,'presentation':style,'overview':norm(next(n for n in card.walk() if n.attrs.get('class')=='proj-card-desc').text()),'technologies':[norm(n.text()) for n in tags.children if isinstance(n,Node)],'sections':sections,'media':media,'links':links,'source':source('projects.html',card.attrs.get('id',title)),'verification':{'status':'source-preserved','notes':['Original portfolio text retained verbatim; source claims are not independently revalidated.']}}
 badge=next((norm(n.text()) for n in card.walk() if 'proj-card-badge' in n.attrs.get('class','')),None)
 if badge:p['recognition' if id=='lantern' else 'awards']=[badge]
 status=next((norm(n.text()) for n in card.walk() if n.attrs.get('class')=='proj-detail-status'),None)
 if status:p['status']=status
 hero=next((m for m in media if m['kind']=='image'),None) or (next((m for m in media if m['kind']=='embed'),None) if style=='software' else None)
 if hero:p['heroMediaId']=hero['id']
 checks_file=out/'link-checks.json'
 if checks_file.exists():
  checks={r['url']:r for r in json.loads(checks_file.read_text())}
  for link in links:link['verification']=checks.get(link['href'],{}).get('verification','not-checked')
 projects.append(p)
 # KO.rbit stays byte-identical to the approved Phase 6A example.
 if id!='korbit':(ROOT/'src/content/case-studies'/f'{id}.ts').write_text("// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.\nimport type { Project } from '../schema'\nexport const project: Project = "+json.dumps(p,ensure_ascii=False,indent=2)+'\n')
# Original graphics and sticker arrays; original categories/captions are retained.
designs=[]
for i,n in enumerate(n for n in tree.walk() if 'design-gallery-item' in n.attrs.get('class','').split()):
 title=next(norm(c.text()) for c in n.walk() if c.attrs.get('class')=='design-gallery-title');caption=next(norm(c.text()) for c in n.walk() if c.attrs.get('class')=='design-gallery-cat');img=next(c for c in n.walk() if c.tag=='img');a=asset(img.attrs['src'],caption,img.attrs.get('alt'),'projects.html')
 designs.append({'id':'graphic-'+str(i+1),'title':title,'category':'Graphics','association':caption,'media':[a],'source':source('projects.html','design-graphics'),'verification':{'status':'source-preserved'}})
for key,category in [('ew','Engineers’ Week'),('ij','Innovation Jam'),('bh','BeaverHacks')]:
 raw=re.search(r"'sticker-carousel-"+key+r"':\s*\[(.*?)\]",js,re.S)[1]
 for i,m in enumerate(re.finditer(r"\{ src: '([^']+)', label: '([^']+)'",raw)):
  a=asset(m[1],f'{category} 2026 · {m[2]}',f'{category} {m[2]} sticker')
  block=next(n for n in tree.walk() if n.attrs.get('id')=='sticker-carousel-'+key)
  event_link=next(n for n in block.walk() if n.tag=='a' and n.attrs.get('href'))
  designs.append({'id':f'sticker-{key}-{i+1}','links':[{'id':'event','label':norm(event_link.text()),'href':'https://allyytc.github.io/'+event_link.attrs['href']}],'title':m[2],'category':'Stickers','association':category,'media':[a],'source':source('projects.js','sticker-carousel-'+key),'verification':{'status':'source-preserved'}})
# Design/merch showcases already displayed on event pages; no community prose migration.
for page,category,prefixes in [('innovation-jam-2026.html','Innovation Jam',['ij-stickers/','ij-tote.png']),('beaverhacks-2026.html','BeaverHacks',['bh-merch/']),('eweek.html','Engineers’ Week',[])]:
 text=(base/(page+'.txt')).read_text();paths=[]
 for match in re.finditer(r'''["']([^"']+\.(?:png|jpg|JPG|jpeg|webp))["']''',text):
  path=unquote(match[1])
  if any(path.startswith(prefix) for prefix in prefixes) and path in files and path not in paths:paths.append(path)
 for path in paths:
  if any(d['media'][0]['originalPath']==path for d in designs):continue
  title=Path(path).stem.replace('-',' ')
  # Labels come from source filenames/nearby category, not invented design claims.
  a=asset(path,category+' · '+title,category+' '+title,page)
  designs.append({'id':'design-'+hashlib.sha1(path.encode()).hexdigest()[:10],'title':title,'category':'Merchandise' if path.startswith('bh-merch/') or path=='ij-tote.png' else 'Event materials','association':category,'media':[a],'source':source(page),'verification':{'status':'source-preserved','notes':['Source image retained; descriptive caption is limited to original filename and event association.']}})
(ROOT/'src/content/design-work.ts').write_text("import type { DesignWork } from './schema'\nexport const designWork: readonly (DesignWork & { association: string })[] = "+json.dumps(designs,ensure_ascii=False,indent=2)+'\n')
(out/'extracted-content.json').write_text(json.dumps({'projects':projects,'designWork':designs},ensure_ascii=False,indent=2)+'\n')
required=[a for a in assets.values() if a['kind']!='embed']
(out/'required-media.json').write_text(json.dumps(required,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'projects':len(projects),'graphics':sum(d['category']=='Graphics' for d in designs),'stickers':sum(d['category']=='Stickers' for d in designs),'supportingDesigns':sum(d['category'] not in ['Graphics','Stickers'] for d in designs),'uniqueLocalMedia':len(required),'bytes':sum(files[a['originalPath']]['size'] for a in required)}))
