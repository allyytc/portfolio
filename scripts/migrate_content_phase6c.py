"""Read pinned source as inert data. No original JS is executed."""
from portfolio_source import ROOT,REF,REPO,Node,parse,norm,rich,source
from urllib.parse import unquote,quote
from pathlib import Path
import re,json,hashlib,ast
base=ROOT/'docs/portfolio/reference';out=ROOT/'docs/portfolio/evidence/phase6c'
files={f['path']:f for f in json.loads((base/'FILE_MANIFEST.json').read_text())['files']}
prior={r['originalPath']:r for r in json.loads((ROOT/'docs/portfolio/evidence/phase6b/required-media.json').read_text())}
assets={}
def asset(path,caption='',alt=None,page='index.html'):
 original=unquote(path);assert original in files,original
 a={'id':original,'kind':'image','src':prior.get(original,{}).get('src','media/'+original),'originalPath':original,'source':source(page),'rights':'owner-local-rebuild','gitBlob':files[original]['sha'],'sourceURL':f'https://raw.githubusercontent.com/{REPO}/{REF}/'+quote(original,safe='/'),'caption':caption,'alt':alt or caption or Path(original).stem}
 local=ROOT/'public'/a['src']
 if local.exists():a['sha256']=hashlib.sha256(local.read_bytes()).hexdigest()
 assets[original]=a;return a

def cls(n,c):return c in n.attrs.get('class','').split()
def find(t,c):return next(n for n in t.walk() if cls(n,c))
def paragraphs(n):return [{'kind':'paragraph','content':rich(p)} for p in n.walk() if p.tag=='p' and norm(p.text())]
def section(id,title,blocks,page):return {'id':id,'title':title,'blocks':blocks,'source':source(page,id)}
def external(a,i):
 href=a.attrs['href']
 return {'id':str(i),'label':norm(a.text()),'href':href if re.match(r'^(https?:|mailto:|tel:)',href) else 'https://allyytc.github.io/'+href}
index=parse(base/'index.html.txt');about=find(index,'about-text-col');exp=[]
for i,n in enumerate(n for n in index.walk() if cls(n,'exp-item')):
 exp.append({'id':'impact-studio','title':norm(next(c for c in n.walk() if c.tag=='h3').text()),'organization':norm(find(n,'exp-org').text()),'dates':norm(find(n,'exp-date').text()),'sections':[section('role-responsibilities','Responsibilities',[{'kind':'list','items':[rich(c) for c in n.walk() if c.tag=='li']}],'index.html')],'links':[external(c,j) for j,c in enumerate(n.walk()) if c.tag=='a'],'projectIds':['impact-studio'],'source':source('index.html','experience'),'verification':{'status':'source-preserved'}})
skills=[{'id':'skills-'+str(i),'title':norm(next(c for c in n.walk() if c.tag=='h3').text()),'items':[norm(c.text()) for c in find(n,'skill-tags').walk() if c.tag=='span'],'source':source('index.html','skills')} for i,n in enumerate(n for n in index.walk() if cls(n,'skills-group'))]
contact=[external(n,i) for i,n in enumerate(find(index,'contact-links').walk()) if n.tag=='a']
# Preserve original resume reference in provenance; use the owner's actual supplied replacement PDF in UI.
profile={'name':'Ally Chen','subtitle':'Developer · Designer · Product','preferredRole':'Software Developer Intern @ Impact Studio','about':[section('about-original','About me',paragraphs(about),'index.html')],'education':[{'degree':'B.S. Computer Science','institution':'Oregon State University','minor':'Business Information Systems','graduation':'June 2028','source':source('index.html','about')}],'experience':exp,'skills':skills,'links':contact,'media':[asset('about-photo.jpg','Ally Chen','Ally Chen','index.html'),asset('headshot.jpg','Ally Chen','Ally Chen — original homepage portrait','index.html')],'source':source('index.html'),'verification':{'status':'source-preserved','notes':['Preferred visible role is owner-approved; original Web Developer Intern title and biography wording remain intact.','Only one professional role exists in the authoritative static source. No additional roles or personal interests are invented.']}}
involvement=parse(base/'involvement.html.txt');orgs=json.loads((ROOT/'docs/portfolio/evidence/phase6a/organizations-source.json').read_text());organizations=[]
ids={'coe':'esc','startup':'startup','dfa':'dfa','bh':'beaverhacks','ai':'ai-club'}
associations={'coe':['engineersWeek'],'startup':['innovationJam2026'],'bh':['beaverhacks2026'],'dfa':[],'ai':[]}
for key in ['coe','startup','dfa','bh','ai']:
 o=orgs[key];id=ids[key];organizations.append({'id':id,'title':o['name'],'role':o['role'],'dates':o['date'],'sections':[section(id+'-story','My involvement',[{'kind':'paragraph','content':[p]} for p in o['description']],'involvement.html')],'media':[asset(path,o['name']+' · Photo '+str(i+1),o['name']+' original community photo '+str(i+1),'involvement.html') for i,path in enumerate(o['photos'])],'links':[{'id':str(i),'label':c['label'],'href':'https://allyytc.github.io/'+c['href']} for i,c in enumerate(o.get('ctas',[]))],'eventIds':associations[key],'source':source('involvement.html','clubs-'+key),'verification':{'status':'source-preserved'}})
hero=find(involvement,'involvement-hero-copy')
community={'intro':[norm(p.text()) for p in hero.walk() if p.tag=='p'],'media':asset('DSC00612.JPG','Campus & Community','Ally Chen speaking in a classroom','involvement.html'),'eventCards':[]}
cards=[n for n in involvement.walk() if cls(n,'event-card')]
for n in cards:
 img=next(c for c in n.walk() if c.tag=='img');community['eventCards'].append({'href':n.attrs['href'],'overview':norm(find(n,'event-card-desc').text()),'media':asset(img.attrs['src'],img.attrs.get('alt',''),img.attrs.get('alt'),'involvement.html')})
events=[]
for id,page,title in [('beaverhacks2026','beaverhacks-2026.html','BeaverHacks 2026'),('innovationJam2026','innovation-jam-2026.html','Innovation Jam 2026'),('engineersWeek','eweek.html',"Engineers' Week 2026")]:
 tree=parse(base/(page+'.txt'));raw=(base/(page+'.txt')).read_text();secs=[n for n in tree.walk() if n.tag=='section' and 'section-contact' not in n.attrs.get('class','')];hero=secs[0];heroPath=re.search(r"url\(['\"]([^'\"]+)['\"]\)",hero.attrs['style'])[1];media=[asset(heroPath,title+' · Original event hero',title+' original event hero',page)];overview=norm(next(n for n in hero.walk() if n.tag=='p').text());sections=[]
 for si,sec in enumerate(secs[1:]):
  current=None
  for n in sec.walk():
   if n.tag in ['h2','h3']:
    current=section(f'{id}-section-{len(sections)+1}',norm(n.text()),[],page);sections.append(current)
   elif n.tag=='p' and norm(n.text()):
    if current:current['blocks'].append({'kind':'paragraph','content':rich(n)})
   elif n.tag in ['ul','ol'] and current:current['blocks'].append({'kind':'list','ordered':n.tag=='ol','items':[rich(c) for c in n.children if isinstance(c,Node) and c.tag=='li']})
  # Preserve carousel order from original literal arrays; extract string literals as data only.
  photos=[]
  for script in [n for n in sec.walk() if n.tag=='script']:
   for m in re.finditer(r'var photos\s*=\s*\[(.*?)\]',script.text(),re.S):
    photos.extend(ast.literal_eval('['+m[1]+']'))
  if photos:
   label=next((norm(n.text()) for n in sec.walk() if n.tag=='h2'),'Photos');gallery=[]
   for i,path in enumerate(photos):
    a=asset(path,f'{title} · {label} {i+1}',f'{title} {label.lower()} {i+1}',page);media.append(a);gallery.append(a['id'])
   target=next(s for s in sections if s['title']==label);target['blocks'].append({'kind':'gallery','label':label,'mediaIds':gallery})
 # Artwork shared with Phase 6B. Preserve exact source src/labels in each event, including script-only frames.
 art=[]
 for m in re.finditer(r"\{\s*src:\s*'([^']+)'[^}]*\}",raw):
  path=m[1]
  if path not in files:continue
  if any(a['id']==path for a in art):continue
  label=re.search(r"label:\s*'([^']+)'",m[0]);a=asset(path,label[1] if label else title+' · '+Path(path).stem, label[1] if label else title+' '+Path(path).stem,page);art.append(a)
 for img in [n for n in tree.walk() if n.tag=='img']:
  path=unquote(img.attrs.get('src',''))
  if path not in files or any(a['id']==path for a in media+art):continue
  art.append(asset(path,img.attrs.get('alt',title),img.attrs.get('alt',title),page))
 if art:
  media.extend(art);target=next((s for s in sections if s['title'] in ['Design Showcase','Sticker Designs']),None)
  if target:target['blocks'].append({'kind':'gallery','label':title+' original artwork','mediaIds':[a['id'] for a in art]})
  else:sections.append(section(id+'-artwork','Designs & merchandise',[{'kind':'gallery','label':title+' original artwork','mediaIds':[a['id'] for a in art]}],page))
 media=list({a['id']:a for a in media}.values())
 events.append({'id':id,'title':title,'overview':overview,'heroMediaId':heroPath,'sections':sections,'media':media,'links':[],'organizationIds':[ids[next(k for k,v in associations.items() if id in v)]],'source':source(page),'verification':{'status':'source-preserved'}})
# Additional event gallery images that source markup references (e.g. static tote showcase) are above, not fabricated.
data={'profile':profile,'organizations':organizations,'events':events,'community':community}
(ROOT/'src/content/profile.ts').write_text("import type { Profile, MediaAsset } from './schema'\nexport const profile: Profile & { media: readonly MediaAsset[] } = "+json.dumps(profile,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/content/community.ts').write_text("import type { Organization, Event, MediaAsset } from './schema'\nexport const organizations: readonly Organization[] = "+json.dumps(organizations,ensure_ascii=False,indent=2)+"\nexport const events: readonly (Event & { overview: string; heroMediaId: string })[] = "+json.dumps(events,ensure_ascii=False,indent=2)+"\nexport const communityOverview: { intro: readonly string[]; media: MediaAsset; eventCards: readonly { href: string; overview: string; media: MediaAsset }[] } = "+json.dumps(community,ensure_ascii=False,indent=2)+'\n')
(out/'extracted-content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');required=list(assets.values());(out/'required-media.json').write_text(json.dumps(required,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'roles':len(exp),'skillCategories':len(skills),'skills':sum(len(g['items']) for g in skills),'organizations':len(organizations),'events':len(events),'uniqueMedia':len(required),'newFiles':sum(not (ROOT/'public'/a['src']).exists() for a in required),'totalBytes':sum(files[a['originalPath']]['size'] for a in required)}))
