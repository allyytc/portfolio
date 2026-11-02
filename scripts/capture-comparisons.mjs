import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'
const out='docs/portfolio/evidence/phase4a'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const page=await browser.newPage({viewport:{width:1800,height:900},deviceScaleFactor:1})
async function sheet(files,labels,name) {
 const images=await Promise.all(files.map(async f=>'data:image/png;base64,'+(await readFile(f)).toString('base64')))
 await page.setContent(`<style>body{margin:0;background:#f8f5ed;color:#344132;font:22px system-ui}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px}h2{font-size:22px;font-weight:500}img{width:100%;height:740px;object-fit:contain}p{margin:0 24px;font-size:16px;color:#69725e}</style><main>${images.map((src,i)=>`<section><h2>${labels[i]}</h2><img src="${src}"></section>`).join('')}</main><p>Actual captures; different viewport framing. Visual parity with the approved concept is not claimed.</p>`)
 await page.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())))
 await page.screenshot({path:`${out}/${name}`})
}
await sheet(['assets/checkpoints/phase3/docs/portfolio/evidence/browser-desktop.png',`${out}/browser-desktop.png`],['BEFORE / Phase 3 browser','AFTER / Phase 4A browser'],'before-after-browser.png')
await sheet(['assets/checkpoints/phase3/docs/portfolio/evidence/blender-desk.png',`${out}/blender-desk.png`],['BEFORE / Phase 3 Blender','AFTER / Phase 4A Blender'],'before-after-blender.png')
await sheet([`${out}/blender-desk.png`,`${out}/browser-desktop.png`],['Blender / static bake + PBR targets','Browser / AgX + same baked atlas'],'blender-browser-comparison.png')
await browser.close()
