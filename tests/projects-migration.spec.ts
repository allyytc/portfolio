import { focusDestination } from './navigation'
import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { caseStudies } from '../src/content/catalog'
import { designWork } from '../src/content/design-work'
const evidence='docs/portfolio/evidence/phase6b'
const captures='docs/portfolio/evidence/phase7b/regression'
const ids=['impact-studio','cddc','korbit','er-overwatch','combocraft','lantern','sallys-pos','afterlife-metro','dementia']
async function explorer(page:Page){await page.goto('/');await page.getByRole('button',{name:'Projects',exact:true}).click();await page.getByRole('button',{name:'All projects',exact:true}).click()}
for(const [index,id] of ids.entries())test(`complete source text and working media: ${id}`,async({page})=>{
  const original=await readFile('docs/portfolio/reference/projects.html.txt','utf8')
  await explorer(page)
  const project=caseStudies[id]
  await page.getByRole('button',{name:`View ${project.title} →`,exact:true}).click()
  const article=page.getByRole('article',{name:`${project.title} case study`})
  const expected=await page.evaluate(({original,index})=>{
    const card=new DOMParser().parseFromString(original,'text/html').querySelectorAll('.proj-card')[index]
    return [...card.querySelectorAll('p,li,h4,.proj-card-badge,.proj-detail-status,.thumb-strip-note')].map(n=>n.textContent!.replace(/\s+/g,' ').trim())
  },{original,index})
  const rendered=(await article.innerText()).replace(/\s+/g,' ').trim()
  for(const text of expected)expect(rendered).toContain(text)
  if(id==='lantern'){await expect(article.getByRole('heading',{name:'My Role',exact:true})).toHaveCount(0);await expect(article.getByLabel('Awards')).toHaveCount(0)}
  if(id==='afterlife-metro')await expect(article.getByText('Game art by Nour Alzahraa Alqattan.',{exact:true})).toBeVisible()
  for(const img of await article.locator('img').all()){
    await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(n=>(n as HTMLImageElement).complete&&(n as HTMLImageElement).naturalWidth>0)).toBe(true)
  }
  const sourceJS=await readFile('docs/portfolio/reference/projects.js.txt','utf8')
  const decode=(text:string)=>text.replace(/\\(u[0-9a-fA-F]{4}|['"\\nrt])/g,(_,code:string)=>code[0]==='u'?String.fromCharCode(parseInt(code.slice(1),16)):({n:'\n',r:'\r',t:'\t'} as Record<string,string>)[code]??code)
  for(const section of project.sections.filter(section=>section.source?.path==='projects.js')){
    const key=section.source!.anchor!
    const start=sourceJS.indexOf(`'${key}': [`)
    expect(start).toBeGreaterThanOrEqual(0)
    const raw=sourceJS.slice(start,sourceJS.indexOf('\n  ],',start))
    const captions=[...raw.matchAll(/caption: '((?:\\.|[^'])*)'/g)].map(match=>decode(match[1]))
    const heroOnly=project.heroMediaId && project.media.find(media=>media.id===project.heroMediaId)?.kind==='embed' && section.blocks.every(block=>block.kind==='media' && block.mediaId===project.heroMediaId)
    expect(await article.locator(heroOnly ? '.case-hero-video figcaption' : `[data-case-section="${section.id}"] figcaption`).allTextContents()).toEqual(captions)
  }
  const actualPaths=await article.locator('img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')))
  for(const media of project.media.filter(media=>media.kind==='image'))expect(actualPaths).toContain('/'+media.src)
  for(const link of project.links)await expect(article.getByRole('link',{name:link.label+' ↗',exact:true})).toHaveAttribute('href',link.href)
  if(id==='cddc'){
    await article.getByRole('navigation',{name:'Case study sections'}).getByRole('button',{name:'Upcoming Changes',exact:true}).click()
    await expect(article.getByRole('heading',{name:'Upcoming Changes',exact:true})).toBeFocused()
    await expect.poll(async()=>{
      const head=(await page.locator('.dialog-head').boundingBox())!;const section=(await article.getByRole('heading',{name:'Upcoming Changes',exact:true}).boundingBox())!;return section.y>=head.y+head.height
    }).toBe(true)
  }
  if(['korbit','impact-studio','cddc','afterlife-metro'].includes(id)){
    await article.getByRole('heading',{name:project.title,exact:true}).scrollIntoViewIfNeeded()
    await page.screenshot({path:`${captures}/${id}-desktop.png`,fullPage:true})
  }
  await page.getByRole('button',{name:'Back to Projects',exact:false}).click()
  await expect(page.getByRole('button',{name:`View ${project.title} →`,exact:true})).toBeFocused()
})
test('all source binaries are byte-identical and galleries preserve captions/order, including local event footage',async({page})=>{
  const acquired=JSON.parse(await readFile(`${evidence}/media-acquisition.json`,'utf8'))
  expect(acquired).toHaveLength(94)
  for(const asset of acquired){
    const response=await page.request.get('/'+encodeURI(asset.destination.replace(/^public\//,'')))
    expect(response.ok(),asset.originalPath).toBe(true)
    const bytes=await response.body();expect(createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex')).toBe(asset.gitBlob)
  }
  await explorer(page);await page.getByRole('button',{name:'View ComboCraft →',exact:true}).click()
  const video=page.locator('.case-study video');await expect(video).toHaveAttribute('preload','metadata')
  await video.scrollIntoViewIfNeeded()
  await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).readyState)).toBeGreaterThan(0)
  await video.evaluate(async v=>{const video=v as HTMLVideoElement;video.muted=true;await video.play()})
  await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.05)
  await video.evaluate(v=>(v as HTMLVideoElement).pause())
})
test('design and sticker collections retain original assets, filtering and fullscreen viewing',async({page})=>{
  await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'})
  await focusDestination(page,'Focus Design Work')
  await expect(page.locator('.design-collection .screenshot-gallery img')).toHaveCount(designWork.length)
  await page.getByRole('button',{name:'Graphics',exact:true}).click();await expect(page.locator('.design-collection .screenshot-gallery img')).toHaveCount(11)
  await page.locator('.screenshot-gallery').scrollIntoViewIfNeeded();await page.locator('.screenshot-gallery img').first().evaluate(async n=>{await (n as HTMLImageElement).decode()});for(const img of await page.locator('.screenshot-gallery img').all()){const sizes=await img.evaluate(n=>({image:n.getBoundingClientRect().width,button:n.parentElement!.getBoundingClientRect().width}));expect(sizes.image).toBeLessThanOrEqual(sizes.button)}
  await page.screenshot({path:`${captures}/design-graphics-desktop.png`,fullPage:true})
  for(const img of await page.locator('.design-collection img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(n=>(n as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)}
  await page.getByRole('button',{name:'COE Student Council',exact:true}).click();await expect(page.locator('.design-collection img')).toHaveCount(6)
  await page.getByRole('button',{name:'Engineers’ Week',exact:true}).click();await expect(page.locator('.design-collection img')).toHaveCount(1)
  await page.getByRole('button',{name:/Enlarge image 1:/}).click()
  await expect(page.getByRole('dialog',{name:'Project image viewer'})).toBeVisible()
  await page.getByRole('button',{name:'Show full-size image'}).click();await expect(page.getByRole('dialog',{name:'Project image viewer'})).toHaveClass(/image-lightbox--full/)
  await page.keyboard.press('Escape');await page.getByRole('combobox',{name:'Explore studio sections'}).selectOption('stickers')
  for(const [category,count] of [['BeaverHacks',6],['Innovation Jam',4],['Engineers’ Week',5]] as const){await page.getByRole('button',{name:category,exact:true}).click();await expect(page.locator('.screenshot-gallery img')).toHaveCount(count)}
  await page.screenshot({path:`${captures}/sticker-book-complete.png`,fullPage:true})
})
test('opaque sticky chrome, mobile section navigation and pending Unwrap discovery',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'})
  await explorer(page);await expect(page.getByRole('article')).toHaveCount(10)
  await page.getByRole('button',{name:'View Unwrap →',exact:true}).click()
  await expect(page.getByText('Content pending verification',{exact:true}).first()).toBeVisible();await expect(page.locator('.case-study img')).toHaveCount(3);await expect(page.locator('.case-study iframe')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Development UI',exact:true})).toBeVisible();await page.locator('.case-hero img').evaluate(async n=>{await (n as HTMLImageElement).decode()});await page.getByRole('heading',{name:'Unwrap',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:`${captures}/unwrap-mobile.png`,fullPage:true})
  await page.getByRole('button',{name:'Back to Projects',exact:false}).click();await expect(page.getByRole('button',{name:'View Unwrap →',exact:true})).toBeFocused()
  await page.getByRole('button',{name:'View Corvallis Daytime Drop-In Center Website →',exact:true}).click()
  await page.getByRole('navigation',{name:'Case study sections'}).getByRole('button',{name:'Design Process',exact:true}).click()
  const head=page.locator('.dialog-head');await expect(head).toHaveCSS('background-color','rgb(38, 63, 53)');await expect(page.locator('.dialog-topline')).toHaveCSS('background-color','rgb(38, 63, 53)')
  expect(await page.getByRole('dialog').evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true)
  await page.screenshot({path:`${captures}/ux-mobile-navigation.png`,fullPage:true})
  await page.getByRole('heading',{name:'Corvallis Daytime Drop-In Center Website',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:`${captures}/ux-mobile-overview.png`,fullPage:true})
  await page.keyboard.press('Escape');await focusDestination(page,'Focus Design Work');await page.getByRole('button',{name:'Graphics',exact:true}).click()
  await page.locator('.design-collection .screenshot-gallery img').first().scrollIntoViewIfNeeded();await page.locator('.design-collection .screenshot-gallery img').first().evaluate(async n=>{await (n as HTMLImageElement).decode()});await page.screenshot({path:`${captures}/graphics-mobile.png`,fullPage:true})
})
test('studio landing does not request project/design media or instantiate videos',async({page})=>{
  const media:string[]=[];page.on('request',request=>{if((request.url().includes('/media/')&&!request.url().includes('/media/world/'))||request.url().includes('youtube.com/embed'))media.push(request.url())})
  await page.goto('/');await page.waitForFunction(()=>Boolean(window.__studioMetrics?.triangles));await page.waitForTimeout(250)
  expect(media).toEqual([]);await expect(page.locator('iframe,video')).toHaveCount(0)
  const current=await readFile('src/components/case-study/Media.tsx','utf8');const original=await readFile('assets/checkpoints/phase6a-projects/src/components/case-study/Media.tsx','utf8')
  const player=(s:string)=>s.slice(s.indexOf('export function VideoDemo('),s.indexOf('function ImageLightbox('))
  expect(player(current)).toBe(player(original))
  await writeFile(`${evidence}/landing-and-player.json`,JSON.stringify({landingMediaRequests:media,originalVideoDemoUnchanged:true},null,2))
})
test('Unwrap uses unchanged local development captures and distinguishes verified source from unresolved claims',async({page})=>{
  const project=caseStudies.unwrap
  expect(project.verification.status).toBe('pending');expect(project.awards).toBeUndefined()
  expect(project.links).toEqual([]);expect(project.media).toHaveLength(2)
  for(const asset of project.media){const response=await page.request.get('/'+asset.src);expect(response.ok()).toBe(true);expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(asset.sha256)}
  await explorer(page);await page.getByRole('button',{name:'View Unwrap →',exact:true}).click()
  await expect(page.locator('.case-hero img')).toBeVisible();await page.locator('.case-hero img').evaluate(async n=>{await (n as HTMLImageElement).decode()})
  await expect(page.locator('.case-study')).toContainText('individual role and contributions')
  await expect(page.getByRole('heading',{name:'Planned journey and design direction',exact:true})).toBeAttached()
  await expect(page.getByRole('heading',{name:'My Role',exact:true})).toHaveCount(0)
  await page.screenshot({path:`${captures}/unwrap-desktop.png`,fullPage:true})
})
