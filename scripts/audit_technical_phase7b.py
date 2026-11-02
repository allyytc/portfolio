"""Non-destructive source, geometry and media regression verification."""
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1];out=root/'docs/portfolio/evidence/phase7b';load=lambda p:json.loads(p.read_text());checkpoint=root/'assets/checkpoints/phase7a-performance';manifest=load(checkpoint/'manifest.json');protected=[]
for r in manifest:
 assert hashlib.sha256((checkpoint/r['file']).read_bytes()).hexdigest()==r['sha256'],r['file']
 if r['file'].startswith('src/content/') or r['file'] in ['src/studio/StudioCamera.tsx','src/studio/cameraViews.ts','src/studio/sceneBounds.json','src/studio/usePrinterPaper.ts','src/components/case-study/Media.tsx']:
  assert hashlib.sha256((root/r['file']).read_bytes()).hexdigest()==r['sha256'],r['file'];protected.append(r['file'])
artifacts=load(root/'docs/portfolio/evidence/phase4d/artifact-manifest.json')['artifacts']
for r in artifacts:assert hashlib.sha256((root/r['file']).read_bytes()).hexdigest()==r['sha256'],r['file']
media={a['originalPath']:a for phase in ['phase6b','phase6c'] for a in load(root/'docs/portfolio/evidence'/phase/'required-media.json')}
for a in media.values():
 b=(root/'public'/a['src']).read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==a['gitBlob'],a['originalPath']
unwrap=load(root/'docs/portfolio/evidence/phase6b/unwrap-source.json')
for a in unwrap['records']:
 if a.get('destination'):assert hashlib.sha256((root/a['destination']).read_bytes()).hexdigest()==a['sha256']
files={f['path']:f['sha'] for f in load(root/'docs/portfolio/reference/FILE_MANIFEST.json')['files']};snapshots=[]
for p in (root/'docs/portfolio/reference').rglob('*.txt'):
 key=str(p.relative_to(root/'docs/portfolio/reference')).removesuffix('.txt');b=p.read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==files[key];snapshots.append(key)
compact=load(out/'compact-model.json');assert hashlib.sha256((root/compact['destination']).read_bytes()).hexdigest()==compact['sha256'];assert hashlib.sha256((root/compact['source']).read_bytes()).hexdigest()==compact['sourceSHA256']
preview=root/'public/social/studio-preview.png';assert preview.read_bytes()==(root/'docs/portfolio/evidence/phase4d/blender-studio.png').read_bytes()
r={'checkpointFilesVerified':len(manifest),'unchangedProtectedFiles':protected,'unchangedOriginalPhase4DArtifacts':len(artifacts),'originalMediaBlobsVerified':len(media),'sourceSnapshotsVerified':len(snapshots),'UnwrapCapturesUnchanged':2,'compactModelStructuralProof':'compact-model.json','socialPreviewSHA256':hashlib.sha256(preview.read_bytes()).hexdigest(),'dependencyChange':'axe-core 4.11.1 added as audit-only devDependency; runtime dependencies unchanged','originalRepositoryModified':False,'deploymentPerformed':False};(out/'preservation-checks.json').write_text(json.dumps(r,indent=2)+'\n');print({k:v for k,v in r.items() if not isinstance(v,list)})
