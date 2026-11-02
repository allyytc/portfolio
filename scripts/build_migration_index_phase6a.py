"""Preservation ledger, not bulk UI migration. Read source; never execute it."""
from pathlib import Path
from urllib.parse import unquote
import json,re,ast,hashlib
from prepare_content_phase6a import parse,Node,norm,REF,REPO,rich
ROOT=Path(__file__).resolve().parents[1];base=ROOT/'docs/portfolio/reference';out=ROOT/'docs/portfolio/evidence/phase6a'
manifest=json.loads((base/'FILE_MANIFEST.json').read_text());files={e['path']:e for e in manifest['files']}
audit=json.loads((out/'content-audit.json').read_text());records=[]
def record(id,kind,title,src,dest,status='pending',media='Located in pinned source; not copied',links='Source references retained; remote targets not checked',missing='Full migration deferred to Phase 6B/6C',notes='Exact source remains preserved in inert snapshots.'):
 r={'id':id,'kind':kind,'title':title,'originalSource':src,'destination':dest,'migrationStatus':status,'mediaStatus':media,'linkVerificationStatus':links,'missingInformation':missing,'verificationNotes':notes};records.append(r);return r
pages=[p['path'] for p in audit['pages']]
for p in audit['pages']:record('page-'+p['path'],'page',p['path'],p['path'],'docs/portfolio/reference/'+p['path']+'.txt + future content modules','source-preserved / partial UI',notes=f"{len(p['textBlocks'])} static text blocks and {len(p['references'])} DOM references indexed. Embedded script data retained separately; this is not a completed page migration.")
for id,label in [('in-progress','In Progress'),('hackathons','Hackathon Projects'),('past-projects','Past Projects'),('design-work','Design Work')]:record('category-'+id,'category',label,'projects.html#'+id,'src/content/catalog.ts → projectCategories','typed category ready',missing='Remaining records pending')
projects=[('impact-studio','project-impact-studio'),('cddc','project-cddc'),('korbit','project-korbit'),('er-overwatch',None),('combocraft',None),('lantern','project-lantern'),('sallys-pos',None),('afterlife-metro',None),('dementia',None)]
tree=parse(base/'projects.html.txt');cards=[n for n in tree.walk() if 'proj-card' in n.attrs.get('class','').split()];assert len(cards)==9
for (id,anchor),node in zip(projects,cards):
 title=next(norm(n.text()) for n in node.walk() if n.tag=='h3');anchor=anchor or f'card[{title}]';complete=id=='korbit'
 r=record('project-'+id,'project',title,'projects.html#'+anchor,'src/content/case-studies/'+id+'.ts','complete example' if complete else ('prototype subset' if id in ['impact-studio','er-overwatch','sallys-pos'] else 'pending'),'5 verified local screenshots + source demo embed' if complete else 'See per-file and gallery records','GitHub/YouTube resolved; Devpost HTTP 403 blocked' if complete else 'Original URLs preserved; not rechecked','None missing from pinned KO.rbit source' if complete else 'Full text/media migration pending; source is complete')
 r['sourceText']=[norm(n.text()) for n in node.walk() if n.tag in ['p','li']];r['sourceLinks']=[n.attrs['href'] for n in node.walk() if n.tag=='a' and 'href' in n.attrs]
record('project-unwrap','project','Unwrap','Owner-approved future addition','src/content/catalog.ts → unwrap','pending verification','No supplied media','No verified URL','Description, role, status, stack, results, screenshots and demo missing','No invented portfolio facts.')
for id,title,anchor,dest in [('about','About','about','profile.about'),('education','Education','education','profile.education'),('experience-impact','Impact Studio experience','experience','profile.experience'),('contact','Contact and profile links','contact','profile.links')]:record(id,'profile section',title,'index.html#'+anchor,'src/content/profile.ts → '+dest,'Phase 5B subset / schema ready',media='Portraits located; not copied in Phase 6A',missing='Complete exact-copy migration pending; preferred role is owner-approved')
for n in ['Languages','Frameworks & Libraries','Tools & Platforms','Design','Leadership & Soft Skills','Other']:record('skills-'+n,'skill category',n,'index.html#skills','src/content/profile.ts → SkillCategory[]','Phase 5B subset / schema ready',media='Not applicable',missing='Exact-copy profile migration pending')
# Decode only string literals from orgsData; ast.literal_eval never executes JS.
orgtext=(base/'involvement.html.txt').read_text();orgraw=orgtext.split('var orgsData = {',1)[1].split('\n    };',1)[0]
token=r'''("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')'''
orgs={}
for m in re.finditer(r'^      (\w+): \{(.*?)^      \}',orgraw,re.M|re.S):
 body=m[2];data={}
 for key in ['name','role','date']:
  value=re.search(r'\b'+key+r':\s*'+token,body);data[key]=ast.literal_eval(value[1]) if value else None
 for key in ['photos','description']:
  value=re.search(r'\b'+key+r':\s*\[(.*?)\]',body,re.S);data[key]=[ast.literal_eval(s) for s in re.findall(token,value[1])] if value else []
 # Single-line link records preserve both URL and display label.
 data['ctas']=[{'href':ast.literal_eval(a),'label':ast.literal_eval(b)} for a,b in re.findall(r'\{ href:\s*'+token+r', label:\s*'+token+r' \}',body)]
 orgs[m[1]]=data
 record('org-'+m[1],'organization',data['name'],'involvement.html#clubs-'+m[1],'src/content/organizations/'+m[1]+'.ts','Phase 5B overview only',media=f"{len(data['photos'])} ordered source photographs; rights review/migration pending",missing='Full narrative, dates, CTA and photograph migration pending')
assert len(orgs)==5
(out/'organizations-source.json').write_text(json.dumps(orgs,ensure_ascii=False,indent=2)+'\n')
for id,title,page in [('beaverhacks2026','BeaverHacks 2026','beaverhacks-2026.html'),('innovationJam2026','Innovation Jam 2026','innovation-jam-2026.html'),('engineersWeek',"Engineers' Week 2026",'eweek.html')]:record('event-'+id,'event',title,page,'src/content/events/'+id+'.ts','Phase 5B overview only','Ordered carousel/design source references preserved; media pending','Source links retained','Full narrative/gallery migration deferred')
# Every named JS array containing source media becomes an ordered gallery record.
# Bracket scanning respects quoted strings; expressions are not evaluated.
def arrays(text):
 start_pattern=r'''(?:\b(?:var|let|const)\s+([\w]+)\s*=\s*|['"]?([\w-]+)['"]?\s*:\s*)\['''
 for m in re.finditer(start_pattern,text):
  pos=m.end();depth=1;quote=None;escape=False
  while pos<len(text) and depth:
   c=text[pos]
   if quote:
    if escape:escape=False
    elif c=='\\':escape=True
    elif c==quote:quote=None
   elif c in ['"',"'",'`']:quote=c
   elif c=='[':depth+=1
   elif c==']':depth-=1
   pos+=1
  raw=text[m.end():pos-1];paths=[]
  for literal in re.finditer(token,raw):
   try:value=ast.literal_eval(literal[0])
   except (ValueError,SyntaxError):continue
   if isinstance(value,str) and (unquote(value) in files or re.match(r'https://(?:www\.)?youtube.com/embed/',value)):paths.append(value)
  if paths:yield {'name':m[1] or m[2],'line':text.count('\n',0,m.start())+1,'paths':paths,'raw':raw}
galleries=[]
for page in ['projects.js','involvement.html','beaverhacks-2026.html','innovation-jam-2026.html','eweek.html']:
 text=(base/(page+'.txt')).read_text()
 for g in arrays(text):
  id=f"{page}:{g['name']}:{g['line']}";galleries.append({'id':id,'source':page,**g})
  complete=page=='projects.js' and g['name'] in ['korbit-demo','korbit-interface']
  record('gallery-'+id,'gallery',g['name'],f"{page}:L{g['line']}",'src/content/case-studies/korbit.ts' if complete else 'future MediaAsset[] / CaseStudySection gallery block','complete example' if complete else 'source-preserved / pending',media=f"{len(g['paths'])} ordered references retained",links='KO.rbit source assets verified' if complete else 'Source-tree references checked; remote targets not checked',missing='None in pinned source' if complete else 'Gallery migration/rights review pending')
# Design cards preserve their exact title, organization/category and image reference.
for i,n in enumerate(n for n in tree.walk() if 'design-gallery-item' in n.attrs.get('class','').split()):
 title=next(norm(c.text()) for c in n.walk() if c.attrs.get('class')=='design-gallery-title');category=next(norm(c.text()) for c in n.walk() if c.attrs.get('class')=='design-gallery-cat');image=next(c.attrs['src'] for c in n.walk() if c.tag=='img')
 r=record(f'design-{i+1}','design work',title+' — '+category,'projects.html#design-graphics','src/content/design-work.ts → DesignWork[]','Phase 5B subset only' if 'Startup%20Hub%20-%20insta' in image else 'pending',media=unquote(image),missing='Complete design showcase migration pending');r['caption']=category;r['originalImage']=image
mediafiles=[f for f in manifest['files'] if re.search(r'\.(png|jpg|jpeg|webp|heic|svg|mp4)$',f['path'],re.I)]
assert len(mediafiles)==244,len(mediafiles)
media_sources={p:[] for p in files}
for page in pages+['projects.js']:
 text=(base/(page+'.txt')).read_text()
 for path in files:
  from urllib.parse import quote
  if path in text or quote(path,safe='/()') in text or quote(path,safe='/') in text:media_sources[path].append(page)
prior_media={e['sourcePath']:e for e in json.loads((ROOT/'assets/source/portfolio-media/acquisition.json').read_text())}
for f in mediafiles:
 path=f['path'];complete=path.startswith('korbit-gal/');assoc=media_sources[path]
 status='complete example' if complete else 'pending'
 r=record('media-'+path,'media',path,path,'public/media/'+path if complete else 'future MediaAsset registry + public/media/'+path,status,'Local, byte-verified' if complete else 'Present in source tree; not migrated in Phase 6A','Pinned Git blob + local HTTP verified' if complete else 'Pinned source-tree presence verified; no remote asset GET in Phase 6A','None' if complete else 'Local copy/rights/alt-caption association review pending','Referenced by: '+', '.join(assoc) if assoc else 'Unassigned/root/alternate source asset; preserve without inferring a new association.')
 if path in prior_media:
  local='public/media/'+Path(prior_media[path]['destination']).name
  r.update(destination=local,migrationStatus='Existing Phase 5B subset',mediaStatus='Local prior owner artwork, unchanged',missingInformation='Full collection/context migration pending')
 r['sourceGitBlob']=f['sha'];r['sourceBytes']=f['size'];r['referencedBy']=assoc
 # Preserve explicit ordered gallery memberships, including encoded filenames.
 r['galleryMemberships']=[{'id':g['id'],'positions':[i for i,p in enumerate(g['paths']) if unquote(p)==path]} for g in galleries if path in map(unquote,g['paths'])]
for name in ['Hero','About','Projects','Involvement','Skills','Contact']:
 record('prototype-'+name,'reference component',name+' prototype','app/src/components/'+name+'.tsx','docs/portfolio/reference/app/src/components/'+name+'.tsx.txt','source-preserved only','Media references retained in inert source','Conflicting prototype links retained, not promoted','Reconcile source/prototype discrepancies before later migration','Prototype is historical reference, not authority over static source or approved role label.')
record('resume-original','missing original asset','Original resume reference','allychen-resume2028-pm.pdf','src/content/resume.ts + public/files/allychen-resume2028.pdf','owner-supplied replacement already active','Original missing from pinned tree; owner PDF retained unchanged','Local owner PDF tested','No source copy of original -pm filename','Historical missing reference is preserved; no original file/config changed.')
ledger={'repository':REPO,'ref':REF,'phase':'6A','records':records,'galleryArrays':galleries,'missingOrAmbiguous':['Unwrap content/UI assets not supplied','Original -pm resume missing; owner-supplied updated PDF already active','Prototype/static conflicts remain in CONTENT_INVENTORY.md','Rights and exact captions for later photographs/art need review','Devpost blocks automated verification with HTTP 403'],'schemaTypes':['Project','ProjectCategory','CaseStudySection','MediaAsset','Experience','Organization','Event','DesignWork','SkillCategory','Profile','ExternalLink']}
(out/'migration-index.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
md=['# Migration checklist — Phase 6A','',f'Source: `{REPO}` at `{REF}`. All six pages and their script-driven data remain preserved. Only KO.rbit is fully migrated; all other destinations below are planned unless explicitly labeled as existing subsets.','', 'Complete per-item fields (source, destination, migration, media, links, missing information and notes): [migration-index.json](evidence/phase6a/migration-index.json). Exact text/reference audit: [content-audit.json](evidence/phase6a/content-audit.json). Organization narratives and ordered photos: [organizations-source.json](evidence/phase6a/organizations-source.json).','', '## Status key','', '- Complete example: original KO.rbit text, media order/captions and links are represented in typed data and readable UI.','- Prototype subset / overview: Phase 5B content remains usable, but is not counted as a complete migration.','- Source-preserved / pending: exact text/media references retained; runtime content migration deferred to 6B/6C.','', '## Item-by-item mapping','']
for kind in ['page','category','profile section','skill category','project','organization','event','design work','gallery','media','reference component','missing original asset']:
 md+=['### '+kind.title(),'']
 for r in records:
  if r['kind']==kind:md.append(f"- **{r['title']}** — `{r['originalSource']}` → `{r['destination']}`. Status: {r['migrationStatus']}. Media: {r['mediaStatus']}. Links: {r['linkVerificationStatus']}. Missing: {r['missingInformation']}. Notes: {r['verificationNotes']}")
 md+=['']
md+=['## Verification queue','']+['- '+s for s in ledger['missingOrAmbiguous']]+['','No full Phase 6B/6C migration, scene rebuild, original-site modification or deployment is included.']
(ROOT/'docs/portfolio/MIGRATION_CHECKLIST.md').write_text('\n'.join(md)+'\n')
print(json.dumps({'records':len(records),'originalMedia':len(mediafiles),'galleryArrays':len(galleries),'organizations':len(orgs),'completeProject':'KO.rbit'}))
