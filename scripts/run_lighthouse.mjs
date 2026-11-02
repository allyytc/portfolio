import {spawnSync} from 'node:child_process';
const targets=[['baseline','http://127.0.0.1:4173'],['after','http://127.0.0.1:4174']].filter(([label])=>!process.argv[2]||label===process.argv[2]);
for(let run=1;run<=3;run++)for(const [label,url] of targets){
 const result=spawnSync('npm',['--cache','assets/audit-tools/npm-cache','exec','--yes','--package=lighthouse@13.6.0','--','lighthouse',url,'--quiet','--chrome-flags=--headless --no-sandbox','--only-categories=performance,accessibility,seo','--output=json',`--output-path=docs/portfolio/evidence/phase7b/${label}-lighthouse-${run}.json`],{env:{...process.env,CHROME_PATH:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'},stdio:'pipe'});if(result.status!==0){console.error(result.stderr.toString().slice(-1500));process.exit(1)}console.log(`${label} Lighthouse ${run}/3 saved`)
}
