"""Update the current item ledger without altering historical Phase 6A evidence."""
from pathlib import Path
from urllib.parse import unquote
import json,hashlib,collections
root=Path(__file__).resolve().parents[1];docs=root/'docs/portfolio';out=docs/'evidence/phase6b'
load=lambda p:json.loads(p.read_text())
ledger=load(docs/'evidence/phase6a/migration-index.json');ledger['phase']='6B';data=load(out/'extracted-content.json');media={m['originalPath']:m for m in load(out/'required-media.json')};projects={p['id']:p for p in data['projects']}
for r in ledger['records']:
 kind=r['kind']
 if kind=='project' and r['id']!='project-unwrap':
  id=r['id'].removeprefix('project-');p=projects[id];r.update(destination=f'src/content/case-studies/{id}.ts → catalog → Projects / Quick View',migrationStatus='complete source migration',mediaStatus=f"{len(p['media'])} ordered image/video/embed references; local files hash-verified",linkVerificationStatus='Original links retained; HTTP results in link-checks.json (Devpost: 403 blocked)',missingInformation='No substantive original project content missing; absent source fields remain omitted',verificationNotes='Original paragraph/list/heading/badge/gallery-caption parity verified by browser tests. Source plans remain plans; source recognition is not converted to an award. KO.rbit data and VideoDemo remain unchanged.')
 elif r['id']=='project-unwrap':
  r.update(originalSource='Local calhacks2026 README, package metadata, components and existing work/screens captures',destination='src/content/case-studies/unwrap.ts → shared project/design discovery',migrationStatus='partial verified source / personal details pending',mediaStatus='2 unchanged existing development UI captures; SHA-256 in unwrap-source.json',linkVerificationStatus='No public project/demo URL supplied; none invented',missingInformation='Individual contributions, research, design rationale, final feature status, approved public links and independently verified outcomes',verificationNotes='Read-only source inspection, not an app/deployment test. Roadmap separated from code observations; no awards or individual role inferred. Screenshot filenames are not deployment proof.')
 elif kind=='category':r.update(migrationStatus='complete',destination='src/content/catalog.ts → projectCategories; shared Projects explorer',missingInformation='None',mediaStatus='Uses shared case-study/design metadata',linkVerificationStatus='Accessible HTML filters and matching studio entry points tested',verificationNotes='Four original categories preserved; Unwrap references one shared case study.')
 elif kind=='design work':
  r.update(migrationStatus='complete source migration',destination='src/content/design-work.ts → DesignGallery',mediaStatus='Original image copied unchanged; shared registry',linkVerificationStatus='No original project URL for this artwork; source associations retained',missingInformation='No source artwork/caption missing',verificationNotes='All 11 original graphics and association captions preserved; third-party publication rights not assumed.')
 elif kind=='media' and r['originalSource'] in media:
  a=media[r['originalSource']];r.update(destination='public/'+a['src'],migrationStatus='complete local copy and runtime association',mediaStatus='Git blob, bytes and SHA-256 verified against pinned source',linkVerificationStatus='Local HTTP response blob verified in browser test',missingInformation='No source bytes missing; third-party publication rights not independently established',verificationNotes=r.get('verificationNotes','')+' Shared binary; no generated replacement or duplicate per gallery.')
 elif kind=='gallery' and r['originalSource'].startswith('projects.js:'):
  r.update(destination='src/content/case-studies/* or design-work.ts → shared media renderer',migrationStatus='complete source migration',mediaStatus='All ordered source items and captions retained; images lightboxed, demos on demand',linkVerificationStatus='All local source bytes verified; original embed URLs retained',missingInformation='No original gallery item missing',verificationNotes='18 project galleries plus 3 sticker collections. Mixed ComboCraft image/video order retained.')
 elif r['id']=='page-projects.html':
  r.update(destination='src/content/case-studies/* + catalog.ts + design-work.ts',migrationStatus='project/design content complete',mediaStatus='94 unique original files shared across projects/design; embeds remain external',linkVerificationStatus='21 unique project/demo URLs checked; 19 resolved, 2 Devpost blocked',missingInformation='Original page chrome intentionally replaced by studio interface',verificationNotes='Source paragraphs, lists, galleries, design titles/captions and original categories retained; original pages remain inert references.')
# Explicit per-design records, including stickers and supporting artwork, supplement the original 338-item inventory.
for d in data['designWork']:
 if d['category']=='Graphics':continue
 ledger['records'].append(dict(id='6b-'+d['id'],kind='design collection item',title=d['title'],originalSource=d['source']['path']+'#'+d['source'].get('anchor','design/merch showcase'),destination='src/content/design-work.ts#'+d['id'],migrationStatus='complete source migration',mediaStatus='; '.join('public/'+a['src'] for a in d['media']),linkVerificationStatus='Original View Event links retained where present; all 3 source event targets HTTP 200 (design-link-checks.json)' ,missingInformation='No source artwork missing; supporting labels limited to source filenames when no authored caption exists',verificationNotes=d['association']+' · '+d['category']+'; event/community prose migration deferred to Phase 6C.'))
(out/'migration-index.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
intro='''# Migration checklist — Phase 6B

Nine original projects are completely migrated from pinned original source `35ecfec2c43c535ea013e23720ffa6ad73108f10`. Unwrap has a source-backed partial product case study and two existing development captures; personal contributions, final feature verification and outcomes remain pending. Profile, experience and community/event narratives remain Phase 6C work.

Per-item machine-readable ledger: [Phase 6B index](evidence/phase6b/migration-index.json). Historical [Phase 6A index](evidence/phase6a/migration-index.json) remains unchanged. Media provenance: [media register](PHASE6B_MEDIA.md), [94 original files](evidence/phase6b/media-acquisition.json), [Unwrap local sources](evidence/phase6b/unwrap-source.json). Link checks: [HTTP results](evidence/phase6b/link-checks.json). Validation and discrepancies: [completion report](PHASE6B_REPORT.md).

“Complete source migration” means all available original text/media/captions are represented; it does not assert third-party publication rights, current external service functionality or new career claims. Items still pending below retain their source snapshots. No missing optional content is invented.

'''
lines=[intro]
for kind in dict.fromkeys(r['kind'] for r in ledger['records']):
 lines.append('## '+kind.title()+'\n')
 for r in ledger['records']:
  if r['kind']!=kind:continue
  lines.append(f"- **{r['title']}** — `{r['originalSource']}` → `{r['destination']}`. Status: {r['migrationStatus']}. Media: {r['mediaStatus']}. Links: {r['linkVerificationStatus']}. Missing: {r['missingInformation']}. Notes: {r['verificationNotes']}\n")
(docs/'MIGRATION_CHECKLIST.md').write_text('\n'.join(lines))
# Confirm recoverability and protected current implementation against the Phase 6A checkpoint.
checkpoint=root/'assets/checkpoints/phase6a-projects';manifest=load(checkpoint/'manifest.json');checks=[]
for entry in manifest:
 f=entry['file'];backup=checkpoint/f;expected=entry['sha256'];assert hashlib.sha256(backup.read_bytes()).hexdigest()==expected, f
 if f.startswith('src/studio/') or f in ['src/App.tsx','package.json','package-lock.json','src/content/case-studies/korbit.ts']:
  same=hashlib.sha256((root/f).read_bytes()).hexdigest()==expected;assert same,f;checks.append({'file':f,'unchanged':same})
old=(checkpoint/'src/components/case-study/Media.tsx').read_text();new=(root/'src/components/case-study/Media.tsx').read_text();part=lambda s:s[s.index('export function VideoDemo'):s.index('function ImageLightbox')];assert part(old)==part(new)
snapshots=[]
pinned={r['path']:r['sha'] for r in load(docs/'reference/FILE_MANIFEST.json')['files']}
for p in (docs/'reference').rglob('*.txt'):
 key=str(p.relative_to(docs/'reference')).removesuffix('.txt');b=p.read_bytes();blob=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest();assert blob==pinned[key],key;snapshots.append({'file':key,'gitBlob':blob,'matchesPinned':True})
artifacts=load(docs/'evidence/phase4d/artifact-manifest.json')['artifacts']
for artifact in artifacts:assert hashlib.sha256((root/artifact['file']).read_bytes()).hexdigest()==artifact['sha256'],artifact['file']
(out/'preservation-checks.json').write_text(json.dumps({'checkpointFiles':len(manifest),'checkpointHashesValid':True,'protectedFiles':checks,'VideoDemoFunctionUnchanged':True,'originalSourceSnapshots':snapshots,'phase4DArtifactsUnchanged':len(artifacts),'sceneBinary':'public/models/loft-studio-v4d.glb','sceneBytes':(root/'public/models/loft-studio-v4d.glb').stat().st_size},indent=2)+'\n')
print('Current ledger:',len(ledger['records']),'records. Protected files, checkpoint hashes, 15 source snapshots and Phase 4D artifacts valid.')
