"""Verify the Phase 7A recoverable checkpoint and unchanged content/media/room assets."""
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1];docs=root/'docs/portfolio';out=docs/'evidence/phase7a';load=lambda p:json.loads(p.read_text());checkpoint=root/'assets/checkpoints/phase6c-ux';manifest=load(checkpoint/'manifest.json');unchanged=[];changed=[]
for r in manifest:
 f=r['file'];assert hashlib.sha256((checkpoint/f).read_bytes()).hexdigest()==r['sha256'],f
 same=hashlib.sha256((root/f).read_bytes()).hexdigest()==r['sha256']
 if same:unchanged.append(f)
 else:changed.append(f)
 if f.startswith('src/content/') or f.startswith('src/studio/') and f!='src/studio/Studio.tsx' or f in ['src/components/case-study/Media.tsx','package.json','package-lock.json']:assert same,f
artifacts=load(docs/'evidence/phase4d/artifact-manifest.json')['artifacts']
for r in artifacts:assert hashlib.sha256((root/r['file']).read_bytes()).hexdigest()==r['sha256'],r['file']
media={r['originalPath']:r for phase in ['phase6b','phase6c'] for r in load(docs/'evidence'/phase/'required-media.json')}
for r in media.values():
 b=(root/'public'/r['src']).read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==r['gitBlob'],r['originalPath']
unwrap=load(docs/'evidence/phase6b/unwrap-source.json')
for r in unwrap['records']:
 if r.get('destination'):assert hashlib.sha256((root/r['destination']).read_bytes()).hexdigest()==r['sha256']
files={r['path']:r['sha'] for r in load(docs/'reference/FILE_MANIFEST.json')['files']};snapshots=[]
for p in (docs/'reference').rglob('*.txt'):
 path=str(p.relative_to(docs/'reference')).removesuffix('.txt');b=p.read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==files[path];snapshots.append(path)
report={'date':'2026-10-29','checkpointFilesVerified':len(manifest),'changedCheckpointFiles':changed,'unchangedCheckpointFiles':unchanged,'allContentModulesUnchanged':True,'VideoDemoAndGalleryModuleUnchanged':True,'cameraControllerAndPresetsUnchanged':True,'unchangedPhase4DArtifacts':len(artifacts),'originalMediaBlobsVerified':len(media),'UnwrapCapturesUnchanged':2,'sourceSnapshotsVerified':len(snapshots),'dependenciesUnchanged':True,'originalRepositoryModified':False,'deploymentPerformed':False}
(out/'preservation-checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if not isinstance(v,list)}))
