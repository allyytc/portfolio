import { chromium } from '@playwright/test'
import { readFile,writeFile } from 'node:fs/promises'
const out='docs/portfolio/evidence/phase4c'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const page=await browser.newPage({viewport:{width:1800,height:1250},deviceScaleFactor:1})
const errors=[];page.on('pageerror',e=>errors.push(e.message))
await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.__studioScene?.version==='phase4c-loft');await page.waitForTimeout(1600)
await page.screenshot({path:`${out}/browser-studio-large.png`,fullPage:true})
// Named, bounded camera presets, exercised through DEV-only evidence hooks.
for (const name of ['workstation','designCorner','communityPinboard','readingNook','archive']) {
 await page.evaluate(async name=>window.__studioView(name),name)
 await page.waitForTimeout(150)
 await page.screenshot({path:`${out}/browser-${name}.png`,fullPage:true})
}
await page.evaluate(async ()=>window.__studioView('default'))
await writeFile(`${out}/capture-errors.json`,JSON.stringify(errors,null,2))
await page.setContent('<html></html>')
async function comparison(files,labels,name) {
 const imgs=await Promise.all(files.map(async f=>'data:image/png;base64,'+(await readFile(f)).toString('base64')))
 await page.setViewportSize({width:1800,height:1000})
 await page.setContent(`<style>body{margin:0;background:#f8f5ed;color:#344132;font:20px system-ui}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px}h2{font-size:21px;font-weight:500}img{width:100%;height:830px;object-fit:contain}p{margin:0 24px;font-size:15px}</style><main>${imgs.map((src,i)=>`<section><h2>${labels[i]}</h2><img src="${src}"></section>`).join('')}</main><p>Actual captures; reference-level visual parity is not claimed.</p>`)
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await page.screenshot({path:`${out}/${name}`})
}
await comparison(['docs/portfolio/evidence/phase4b/browser-studio-large.png',`${out}/browser-studio-large.png`],['Phase 4B / construction','Phase 4C / visual refinement'],'before-after-browser.png')
await comparison([`${out}/blender-studio.png`,`${out}/browser-studio-large.png`],['Blender / expanded loft','Actual browser / same exported room'],'blender-browser-comparison.png')
await browser.close()
