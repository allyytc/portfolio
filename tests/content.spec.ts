import { test, expect } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { korbit } from '../src/content/catalog'
import type { Page } from '@playwright/test'
const evidence='docs/portfolio/evidence/phase6a'
const captures='docs/portfolio/evidence/phase7b/regression'
async function openCase(page:Page) {
  await page.goto('/')
  await page.getByRole('button',{name:'Projects',exact:true}).click()
  await page.getByRole('button',{name:'View KO.rbit'}).click()
  await expect(page.getByRole('heading',{name:'KO.rbit',exact:true})).toBeFocused()
}
test('complete representative copy matches original source paragraphs, roles, features, stack, award and gallery order',async({page})=>{
  const html=await readFile('docs/portfolio/reference/projects.html.txt','utf8')
  const js=await readFile('docs/portfolio/reference/projects.js.txt','utf8')
  const manifest=JSON.parse(await readFile('docs/portfolio/reference/FILE_MANIFEST.json','utf8'))
  for(const [name,content] of [['projects.html',html],['projects.js',js]]) {
    const data=Buffer.from(content);const blob=createHash('sha1').update(Buffer.from(`blob ${data.length}\0`)).update(data).digest('hex')
    expect(blob).toBe(manifest.files.find((f:{path:string})=>f.path===name).sha)
  }
  await openCase(page)
  const expected=await page.evaluate(source=>{
    const root=new DOMParser().parseFromString(source,'text/html').querySelector('#project-korbit')!
    const normalize=(v:string)=>v.replace(/\s+/g,' ').trim()
    return {text:[...root.querySelectorAll('p,li,h4,.proj-card-badge')].map(node=>normalize(node.textContent!)),tags:[...root.querySelectorAll('.project-tags span')].map(node=>normalize(node.textContent!)),links:[...root.querySelectorAll('a[href]')].map(node=>node.getAttribute('href'))}
  },html)
  const article=page.getByRole('article',{name:'KO.rbit case study'})
  const text=(await article.innerText()).replace(/\s+/g,' ').trim()
  for(const value of expected.text) expect(text).toContain(value)
  for(const value of expected.tags) await expect(article.getByLabel('Technologies').getByText(value,{exact:true})).toBeVisible()
  const sectionIds=await article.locator('[data-case-section]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-section')))
  expect(sectionIds).toEqual(['description','my-role','tech-stack','features','demo','screenshots'])
  await expect(article.locator('[data-case-section="my-role"] li')).toHaveCount(6)
  await expect(article.locator('[data-case-section="features"] li')).toHaveCount(6)
  for(const href of expected.links) expect(await article.locator('a').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')))).toContain(href)
  const captions=[...js.matchAll(/\{ type: 'image', src: '(korbit-gal\/[^']+)', caption: '([^']+)' \}/g)].map(match=>({src:match[1],caption:match[2]}))
  expect(captions).toHaveLength(5)
  expect(await article.locator('.screenshot-gallery figcaption').allTextContents()).toEqual(captions.map(item=>item.caption))
  await expect(article.locator('iframe')).toHaveCount(0)
  const screenshots=article.locator('.screenshot-gallery img')
  await screenshots.last().scrollIntoViewIfNeeded()
  await expect.poll(()=>screenshots.evaluateAll(nodes=>nodes.every(node=>(node as HTMLImageElement).complete&&(node as HTMLImageElement).naturalWidth>0))).toBe(true)
  const acquisitions=JSON.parse(await readFile(`${evidence}/media-acquisition.json`,'utf8'))
  for(const record of acquisitions) {
    const response=await page.request.get('/'+record.servedDestination.replace(/^public\//,''))
    expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('image/webp')
    const data=await response.body();expect(createHash('sha256').update(data).digest('hex')).toBe(record.sha256)
  }
  await writeFile(`${captures}/case-study-parity.json`,JSON.stringify({sourceTextUnits:expected.text.length,originalTechnologyTags:expected.tags.length,originalRoleItems:6,originalFeatureItems:6,galleryImages:5,allTextPreserved:true,allCaptionsPreserved:true,allLocalImageHashesVerified:true},null,2))
  await article.getByRole('heading',{name:'KO.rbit',exact:true}).scrollIntoViewIfNeeded()
  await page.screenshot({path:`${captures}/case-desktop-top.png`,fullPage:true})
  await article.getByRole('heading',{name:'Tech Stack',exact:true}).scrollIntoViewIfNeeded()
  await page.screenshot({path:`${captures}/case-desktop-details.png`,fullPage:true})
})
test('image lightbox keyboard navigation, video embed, other-project navigation and back focus',async({page})=>{
  await openCase(page)
  const button=page.getByRole('button',{name:/Enlarge image 1:/})
  await button.click()
  const viewer=page.getByRole('dialog',{name:'Project image viewer'})
  await expect(viewer).toBeVisible();await expect(page.getByRole('dialog')).toHaveCount(2)
  await page.keyboard.press('ArrowRight')
  await expect(viewer.locator('figcaption')).toHaveText(korbit.media[1].caption!)
  await page.screenshot({path:`${captures}/image-lightbox.png`,fullPage:true})
  await page.keyboard.press('Escape');await expect(viewer).toHaveCount(0);await expect(button).toBeFocused();await expect(page.getByRole('dialog')).toHaveCount(1)
  await page.route('https://www.youtube.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Embed request verified</title>'}))
  await page.getByRole('button',{name:'Load demo video'}).click()
  const iframe=page.getByTitle('KO.rbit demo - DubHacks 2026',{exact:true})
  await expect(iframe).toHaveAttribute('src','https://www.youtube.com/embed/Ta64tj6uJc4')
  await expect(page.getByRole('link',{name:'Watch on YouTube'})).toHaveAttribute('href','https://www.youtube.com/watch?v=Ta64tj6uJc4')
  await page.getByRole('navigation',{name:'Other projects'}).getByRole('button',{name:'ER Overwatch'}).click()
  await expect(page.getByRole('heading',{name:'ER Overwatch',exact:true})).toBeFocused()
  await page.getByRole('button',{name:'Back to Projects'}).click()
  await expect(page.getByRole('button',{name:'View ER Overwatch'})).toBeFocused()
  await page.getByRole('button',{name:'View KO.rbit'}).click()
  await page.getByRole('button',{name:'Back to Studio'}).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.waitForFunction(()=>window.__studioCamera?.view==='default'&&!window.__studioCamera.transitioning)
})
test('mobile case study remains readable and image viewer closes to the thumbnail',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'})
  await openCase(page)
  expect(await page.getByRole('dialog').evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true)
  await page.screenshot({path:`${captures}/case-mobile-top.png`,fullPage:true})
  const button=page.getByRole('button',{name:/Enlarge image 3:/})
  await button.click();await expect(page.getByRole('dialog',{name:'Project image viewer'})).toBeVisible()
  await page.getByRole('button',{name:'Close image',exact:true}).click();await expect(button).toBeFocused()
  await page.screenshot({path:`${captures}/case-mobile-gallery.png`,fullPage:true})
})
test('missing optional fields do not create blank case-study sections; real technical text supports disclosure',async({page})=>{
  await page.goto('/tests/fixtures/case-study.html')
  await expect(page.getByRole('heading',{name:'Unwrap',exact:true})).toBeVisible()
  await expect(page.getByRole('heading',{name:'Problem',exact:true})).toHaveCount(0)
  await expect(page.getByRole('heading',{name:'Gallery',exact:true})).toHaveCount(0)
  await expect(page.getByRole('heading',{name:'Implementation',exact:true})).toHaveCount(0)
  await expect(page.getByRole('heading',{name:'More projects'})).toHaveCount(0)
  await expect(page.locator('figure,img,video,iframe,.case-awards,.status-pill')).toHaveCount(0)
  await page.getByText('Expand source technical details',{exact:true}).click()
  await expect(page.getByText('React, TypeScript, JavaScript, Vite, Three.js, React Three Fiber',{exact:false})).toBeVisible()
})
test('migration ledger covers every source media file, source page and original project without marking all migrated',async()=>{
  const ledger=JSON.parse(await readFile(`${evidence}/migration-index.json`,'utf8'))
  expect(ledger.records.filter((r:{kind:string})=>r.kind==='media')).toHaveLength(244)
  expect(ledger.records.filter((r:{kind:string})=>r.kind==='page')).toHaveLength(6)
  expect(ledger.records.filter((r:{kind:string})=>r.kind==='organization')).toHaveLength(5)
  expect(ledger.records.filter((r:{kind:string})=>r.kind==='project')).toHaveLength(10)
  expect(ledger.records.filter((r:{kind:string;migrationStatus:string})=>r.kind==='project'&&r.migrationStatus==='complete example').map((r:{title:string})=>r.title)).toEqual(['KO.rbit'])
  for(const item of ledger.records) for(const field of ['originalSource','destination','migrationStatus','mediaStatus','linkVerificationStatus','missingInformation','verificationNotes'])expect(typeof item[field]).toBe('string')
})
