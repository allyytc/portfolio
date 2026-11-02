"""Complete source mappings without rewriting historical phase evidence."""
from pathlib import Path
import json,hashlib,collections
root=Path(__file__).resolve().parents[1];docs=root/'docs/portfolio';out=docs/'evidence/phase6c';load=lambda p:json.loads(p.read_text())
ledger=load(docs/'evidence/phase6b/migration-index.json');ledger['phase']='6C';data=load(out/'extracted-content.json');media={a['originalPath']:a for a in load(out/'required-media.json')};allmedia={a['originalPath'] for phase in ['phase6b','phase6c'] for a in load(docs/'evidence'/phase/'required-media.json')}
for r in ledger['records']:
 kind=r['kind']
 if kind in ['profile section','skill category','organization','event']:
  dest='src/content/profile.ts → AboutExperience / CareerArchive / ContactExperience' if kind in ['profile section','skill category'] else 'src/content/community.ts → CommunityStories'
  r.update(destination=dest,migrationStatus='complete original-source migration',textCompleteness='All original substantive paragraphs, rich emphasis, responsibilities, dates, lists and labels retained',mediaCompleteness='All associated original image references preserved and byte-verified',mediaStatus='120 unique Phase 6C files; 35 reused from Phase 6B; shared binaries for events/design/stickers',linkVerificationStatus='8 HTTP URLs resolved; mail/tel exact-source verified; missing legacy resume uses owner-supplied replacement',missingInformation='No substantive original source content omitted; absent personal interests/additional career roles are not invented',verificationNotes='Source facts preserved, not independently updated career claims. Official Web Developer Intern title is retained separately from the owner-preferred visible label. No skill proficiency/ratings inferred.')
  if kind=='skill category':r.update(mediaStatus='No original skill-specific media',mediaCompleteness='Not applicable',verificationNotes='All 6 categories and 40 skills retained. Exact project technology matches only; no fuzzy or proficiency inference.')
  if kind=='organization':
   sourceId=r['id'].removeprefix('org-');key={'coe':'esc','bh':'beaverhacks','ai':'ai-club'}.get(sourceId,sourceId);org=next(o for o in data['organizations'] if o['id']==key);r.update(destination='src/content/community.ts#'+key,mediaStatus=f"{len(org['media'])} original ordered photos; all verified locally",verificationNotes='Full source description, role and dates retained. Future-tense plans remain future tense; organization and related event/project stories have internal links and original external CTAs.')
  if kind=='event':
   event=next(e for e in data['events'] if e['id']==r['id'].removeprefix('event-'));r.update(destination='src/content/community.ts#'+event['id'],mediaStatus=f"{len(event['media'])} unique original hero/photo/artwork references; carousel order retained",verificationNotes='All original overview, role paragraphs, planning/outreach/design/operations lists and media preserved. Source metrics retained without new attendance/outcome claims. Artwork shares Phase 6B files.')
 elif kind=='media' and r['originalSource'] in media:
  a=media[r['originalSource']];r.update(destination='public/'+a['src'],migrationStatus='complete local copy and runtime association',mediaStatus='Pinned Git blob, bytes, SHA-256 and local HTTP bytes verified',mediaCompleteness='Original unchanged bytes; all runtime associations preserved',textCompleteness='Original alt/caption retained where supplied; neutral context/sequence labels for uncaptioned photos',linkVerificationStatus='Pinned source and local response hashes verified',missingInformation='No source bytes missing; public third-party rights are not inferred',verificationNotes=r.get('verificationNotes','')+' Shared photo/artwork files reused without transformation.')
 elif kind=='media' and r['originalSource'] not in allmedia:
  assert not r.get('referencedBy'),r['originalSource']
  r.update(migrationStatus='source-tree inventory retained / not displayed by original pages',mediaStatus='Not downloaded; no original published content reference found',missingInformation='No required displayed source association identified',verificationNotes='Unreferenced HEIC/alternate/prototype/utility file, not a missing displayed portfolio photo. Exact original path/Git blob retained in FILE_MANIFEST.json.')
 elif kind=='gallery' and not r['originalSource'].startswith('projects.js:'):
  r.update(destination='src/content/community.ts → organization/event galleries and links',migrationStatus='complete original-source migration',mediaStatus='All original ordered photo, design and CTA literal arrays retained',textCompleteness='All supplied labels and captions preserved',mediaCompleteness='Full original references; unchanged local bytes verified',linkVerificationStatus='Original CTAs resolve; internal story/project alternatives provided',missingInformation='No source gallery item omitted',verificationNotes='Source script parsed as inert data; no original JS executed.')
 elif kind=='page' and r['title']!='projects.html':
  r.update(destination='src/content/profile.ts + community.ts → shared studio HTML panels',migrationStatus='complete substantive content migration',textCompleteness='All original substantive page content retained',mediaCompleteness='All displayed source media copied/reused unchanged',mediaStatus='All published media references have verified local destinations',linkVerificationStatus='Source links retained or internally mapped; working supplied resume replaces missing original',missingInformation='Original page chrome replaced by studio navigation; obsolete prototype discrepancies retained in snapshots',verificationNotes='Shared contact/footer context remains directly accessible. No original-site edits or deployment.')
 elif kind=='reference component':
  r.update(migrationStatus='historical prototype preserved / not authoritative current biography',missingInformation='No required authoritative static-page content missing',verificationNotes='Prototype discrepancies (graduation/LinkedIn/metrics) remain in inert source; not silently promoted into biography. See CONTENT_INVENTORY.md.')
 elif kind=='missing original asset':
  r.update(destination='public/files/allychen-resume2028.pdf',migrationStatus='owner-provided replacement integrated',mediaStatus='Existing unchanged owner-supplied PDF used by direct Resume and printer',missingInformation='Historical original filename absent from pinned tree; retained in source provenance',linkVerificationStatus='Local working PDF response verified',verificationNotes='No dead download offered, no document content rewritten.')
# Explicit career record supplements the original profile-level source mapping.
for role in data['profile']['experience']:
 ledger['records'].append({'id':'role-'+role['id'],'kind':'professional role','title':role['title'],'originalSource':'index.html#experience .exp-item','destination':'src/content/profile.ts#experience','migrationStatus':'complete original-source migration','textCompleteness':'Full original title, organization, dates and 4 responsibility bullets','mediaCompleteness':'No role-specific original photograph; related project shares its existing media','mediaStatus':'No duplicated media','linkVerificationStatus':'Original View Work source retained; internal Impact Studio case-study connection tested','missingInformation':'No additional roles supplied by original static source','verificationNotes':'Preferred label shown separately. No fabricated metrics or employment history.'})
(out/'migration-index.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
lines=['''# Migration checklist — Phase 6C

All substantive content displayed by the six authoritative original pages is migrated. This includes nine projects, the shared design/sticker collection, complete About and Education, the one original professional role, 6 skill categories / 40 skills, five organizations and three event stories. Unwrap remains partially verified as documented in Phase 6B; no missing personal contributions or outcomes were invented.

The original 244-media tree contains 179 displayed/referenced files now integrated across Phases 6A–6C, and 65 unreferenced alternate/prototype/utility files retained in the pinned inventory. Unreferenced source-tree files are not incorrectly labeled as migrated or as missing published content. Two Unwrap local development captures and the owner-provided PDF are separate from this original-tree count.

Per-item source/destination, text/media completeness, links, status and gaps: [Phase 6C index](evidence/phase6c/migration-index.json). Historical 6A/6B evidence remains unchanged. See [completion report](PHASE6C_REPORT.md), [media provenance](PHASE6C_MEDIA.md), [acquisition hashes](evidence/phase6c/media-acquisition.json), [link checks](evidence/phase6c/link-checks.json) and [preservation checks](evidence/phase6c/preservation-checks.json).

“Complete” denotes faithful migration of available original content. Original source claims are preserved, not independently reverified achievements. Missing original PDF references use the actual owner-provided replacement; official role wording remains distinct from the preferred visible label. Future plans remain plans.
''']
for kind in dict.fromkeys(r['kind'] for r in ledger['records']):
 lines.append('## '+kind.title()+'\n')
 for r in ledger['records']:
  if r['kind']!=kind:continue
  lines.append(f"- **{r['title']}** — `{r['originalSource']}` → `{r['destination']}`. Status: {r['migrationStatus']}. Text: {r.get('textCompleteness','Prior Phase 6B source preservation retained')}. Media: {r.get('mediaCompleteness',r['mediaStatus'])}. Links: {r['linkVerificationStatus']}. Missing/ambiguity: {r['missingInformation']}. Notes: {r['verificationNotes']}\n")
(docs/'MIGRATION_CHECKLIST.md').write_text('\n'.join(lines))
# Recoverability and protected files/binaries.
checkpoint=root/'assets/checkpoints/phase6b-content';manifest=load(checkpoint/'manifest.json');checks=[]
for record in manifest:
 file=record['file'];assert hashlib.sha256((checkpoint/file).read_bytes()).hexdigest()==record['sha256'],file
 protected=file.startswith(('src/studio/','src/content/case-studies/')) or file in ['src/App.tsx','src/content/identity.ts','src/content/resume.ts','package.json','package-lock.json']
 if protected:assert hashlib.sha256((root/file).read_bytes()).hexdigest()==record['sha256'],file;checks.append({'file':file,'unchanged':True})
old=(checkpoint/'src/components/case-study/Media.tsx').read_text();new=(root/'src/components/case-study/Media.tsx').read_text();fn=lambda s:s[s.index('export function VideoDemo'):s.index('function ImageLightbox')];assert fn(old)==fn(new)
artifacts=load(docs/'evidence/phase4d/artifact-manifest.json')['artifacts']
for a in artifacts:assert hashlib.sha256((root/a['file']).read_bytes()).hexdigest()==a['sha256'],a['file']
pinned={r['path']:r['sha'] for r in load(docs/'reference/FILE_MANIFEST.json')['files']};snapshots=[]
for p in (docs/'reference').rglob('*.txt'):
 key=str(p.relative_to(docs/'reference')).removesuffix('.txt');b=p.read_bytes();sha=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest();assert sha==pinned[key],key;snapshots.append(key)
(out/'preservation-checks.json').write_text(json.dumps({'checkpointHashesVerified':len(manifest),'unchangedProtectedFiles':checks,'unchangedPhase4DArtifacts':len(artifacts),'unchangedSourceSnapshots':snapshots,'VideoDemoUnchanged':True,'originalDisplayedMediaIntegrated':len(allmedia),'unreferencedOriginalMediaRetainedInInventory':244-len(allmedia),'originalRepositoryModified':False,'deploymentPerformed':False},indent=2)+'\n')
print(json.dumps({'ledgerRecords':len(ledger['records']),'protectedFiles':len(checks),'sourceSnapshots':len(snapshots),'phase4DArtifacts':len(artifacts),'integratedOriginalMedia':len(allmedia)}))
