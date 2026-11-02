import { chromium } from '@playwright/test'
import { readFile,writeFile } from 'node:fs/promises'
const out='docs/portfolio/evidence/phase4b'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const page=await browser.newPage({viewport:{width:1800,height:1250},deviceScaleFactor:1})
const errors=[];page.on('pageerror',e=>errors.push(e.message))
await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.__studioScene?.version==='phase4b-loft');await page.waitForTimeout(1600)
await page.screenshot({path:`${out}/browser-studio-large.png`,fullPage:true})
// Framing studies use the same loaded scene and renderer, not cropped Blender images.
const zones=[['desk',[-2,1,-1.25],7],['design-corner',[1.8,.7,1.9],7],['community-wall',[-1.6,1.85,-2.5],8],['reading-nook',[2.8,.65,-.3],7]]
for (const [name,target,span] of zones) {
 await page.evaluate(async ({target,span})=>window.__studioFrame(target,span),{target,span})
 await page.waitForTimeout(350)
 await page.screenshot({path:`${out}/browser-${name}.png`,fullPage:true})
}
await writeFile(`${out}/capture-errors.json`,JSON.stringify(errors,null,2))
await page.setContent('<html></html>')
async function comparison(files,labels,name) {
 const imgs=await Promise.all(files.map(async f=>'data:image/png;base64,'+(await readFile(f)).toString('base64')))
 await page.setViewportSize({width:1800,height:1000})
 await page.setContent(`<style>body{margin:0;background:#f8f5ed;color:#344132;font:20px system-ui}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px}h2{font-size:21px;font-weight:500}img{width:100%;height:830px;object-fit:contain}p{margin:0 24px;font-size:15px}</style><main>${imgs.map((src,i)=>`<section><h2>${labels[i]}</h2><img src="${src}"></section>`).join('')}</main><p>Actual captures; reference-level visual parity is not claimed.</p>`)
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await page.screenshot({path:`${out}/${name}`})
}
await comparison(['docs/portfolio/evidence/phase4a/browser-desktop.png',`${out}/browser-studio-large.png`],['Phase 4A / isolated desk','Phase 4B / complete loft'],'before-after-browser.png')
await comparison([`${out}/blender-studio.png`,`${out}/browser-studio-large.png`],['Blender / expanded loft','Actual browser / same exported room'],'blender-browser-comparison.png')
await browser.close()
