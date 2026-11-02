import { focusDestination } from './navigation'
import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { profile } from '../src/content/profile'
import { organizations, events } from '../src/content/community'
const evidence='docs/portfolio/evidence/phase6c'
const captures='docs/portfolio/evidence/phase7b/regression'
async function start(page:Page,destination:string){await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await focusDestination(page,destination)}
async function capture(page:Page,name:string){await page.screenshot({path:`${captures}/${name}.png`,fullPage:true})}
async function images(page:Page){for(const image of await page.getByRole('dialog').locator('img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(n=>(n as HTMLImageElement).complete&&(n as HTMLImageElement).naturalWidth>0)).toBe(true)}}
for(const org of organizations)test(`organization full narrative, dates, original photos and links: ${org.id}`,async({page})=>{
 await start(page,'Focus Community');await page.locator(`#community-card-${org.id}`).click();await expect(page.getByRole('heading',{name:org.title,exact:true})).toBeFocused()
 const source=JSON.parse(await readFile('docs/portfolio/evidence/phase6a/organizations-source.json','utf8'));const key=({esc:'coe','ai-club':'ai',beaverhacks:'bh'} as Record<string,string>)[org.id]??org.id;const original=source[key]
 const story=page.locator('.community-detail');for(const paragraph of original.description)await expect(story).toContainText(paragraph)
 await expect(story).toContainText(original.role);await expect(story).toContainText(original.date)
 expect(await story.locator('.screenshot-gallery').first().locator('img').evaluateAll(nodes=>nodes.map(n=>decodeURI(new URL((n as HTMLImageElement).src).pathname)))).toEqual(org.media.map(a=>'/'+a.src))
 for(const cta of original.ctas??[])await expect(story.getByRole('link',{name:cta.label+' ↗',exact:true})).toHaveAttribute('href','https://allyytc.github.io/'+cta.href)
 await images(page);await page.getByRole('heading',{name:org.title,exact:true}).scrollIntoViewIfNeeded();await capture(page,`organization-${org.id}-desktop`)
 await page.getByRole('button',{name:'Back to Community',exact:false}).click();await expect(page.locator(`#community-card-${org.id}`)).toBeFocused()
})
for(const event of events)test(`complete event story text, gallery order and original artwork: ${event.id}`,async({page})=>{
 await start(page,'Focus Community');await page.locator(`#community-card-${event.id}`).click()
 const source=await readFile(`docs/portfolio/reference/${event.source.path}.txt`,'utf8')
 const original=await page.evaluate(html=>{const doc=new DOMParser().parseFromString(html,'text/html');return [...doc.querySelectorAll('section:not(.section-contact)')].flatMap(section=>[...section.querySelectorAll('p,li,h3')].map(n=>n.textContent!.replace(/\s+/g,' ').trim())).filter(Boolean)},source)
 for(const text of original)await expect(page.locator('.event-story')).toContainText(text)
 for(const section of event.sections)expect(section.blocks.length).toBeGreaterThan(0)
 const expectedPhotos=[...source.matchAll(/var photos\s*=\s*\[([\s\S]*?)\]/g)].flatMap(m=>[...m[1].matchAll(/'([^']+)'/g)].map(p=>p[1]))
 const displayed=await page.locator('.event-story .screenshot-gallery img').evaluateAll(nodes=>nodes.map(n=>decodeURI(new URL((n as HTMLImageElement).src).pathname)))
 for(const path of expectedPhotos)expect(displayed).toContain('/media/'+path)
 // Preserve sequence within each original event/merch carousel, without executing JS.
 let previous=-1;for(const path of expectedPhotos){const at=displayed.indexOf('/media/'+path);expect(at).toBeGreaterThan(previous);previous=at}
 for(const match of source.matchAll(/\{\s*src:\s*'([^']+)'/g))expect(displayed).toContain('/'+event.media.find(a=>a.originalPath===match[1])!.src)
 const gallery=page.locator('.event-story .screenshot-gallery').first();await gallery.getByRole('button').first().click();await expect(page.getByRole('dialog',{name:'Project image viewer'})).toBeVisible();await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');await expect(gallery.getByRole('button').first()).toBeFocused()
 if(event.id==='engineersWeek')await expect(page.getByRole('heading',{name:'Related event graphics',exact:true})).toBeVisible()
 await images(page);await page.getByRole('heading',{name:event.title,exact:true}).scrollIntoViewIfNeeded();await capture(page,`${event.id}-desktop`)
 await page.getByRole('navigation',{name:'Story sections'}).getByRole('link',{name:'My Role',exact:true}).click();await expect(page.getByRole('heading',{name:'My Role',exact:true})).toBeFocused();const heading=await page.getByRole('heading',{name:'My Role',exact:true}).boundingBox();const header=await page.locator('.dialog-head').boundingBox();expect(heading!.y).toBeGreaterThan(header!.y+header!.height-1)
})
test('About, Education and professional timeline preserve full original content and official title',async({page})=>{
 await start(page,'Focus About Me')
 const source=await readFile('docs/portfolio/reference/index.html.txt','utf8')
 const original=await page.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html');return {about:[...d.querySelectorAll('.about-text-col>p')].map(n=>n.textContent!.replace(/\s+/g,' ').trim()),role:[...d.querySelectorAll('.exp-item li')].map(n=>n.textContent!.trim())}},source)
 for(const text of original.about)await expect(page.locator('.about-editorial')).toContainText(text)
 await expect(page.getByRole('region',{name:'Education'})).toContainText('Minor in Business Information Systems');await expect(page.getByRole('region',{name:'Education'})).toContainText('June 2028');await images(page)
 await page.getByRole('heading',{name:'About me',exact:true}).scrollIntoViewIfNeeded();await capture(page,'about-desktop')
 await page.getByRole('button',{name:'Experience →',exact:true}).click()
 await expect(page.getByRole('heading',{name:profile.preferredRole,exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Web Developer Intern',exact:true})).toBeVisible()
 for(const text of original.role)await expect(page.locator('.career-timeline')).toContainText(text)
 await page.getByText('Role context & related work',{exact:true}).click();await capture(page,'experience-desktop')
 await page.getByRole('button',{name:/View Work: Impact Studio/}).click();await expect(page.getByRole('heading',{name:'Impact Studio Website',exact:true})).toBeVisible();await page.getByRole('button',{name:'Back to archive',exact:false}).click();await expect(page.getByRole('button',{name:/View Work: Impact Studio/})).toBeFocused()
})
test('all 40 original skills, exact project associations and Contact use verified destinations',async({page})=>{
 await start(page,'Focus Skills and Experience');await page.getByRole('button',{name:'Skills',exact:true}).click()
 const source=await readFile('docs/portfolio/reference/index.html.txt','utf8');const expected=await page.evaluate(html=>[...new DOMParser().parseFromString(html,'text/html').querySelectorAll('.skills-group')].map(n=>({title:n.querySelector('h3')!.textContent,skills:[...n.querySelectorAll('.skill-tags span')].map(s=>s.textContent)})),source)
 for(const group of expected){await expect(page.getByRole('heading',{name:group.title!,exact:true})).toBeVisible();for(const skill of group.skills)await expect(page.getByRole('button',{name:skill!,exact:true})).toBeVisible()}
 expect(await page.locator('.skill-buttons button').count()).toBe(40);await capture(page,'skills-desktop')
 await page.getByRole('button',{name:'Figma',exact:true}).click();await page.locator('.skill-evidence').getByRole('button',{name:'Impact Studio Website →',exact:true}).click();await expect(page.getByRole('heading',{name:'Impact Studio Website',exact:true})).toBeVisible();await page.getByRole('button',{name:'Back to archive',exact:false}).click()
 await page.keyboard.press('Escape');await page.getByRole('navigation',{name:'Portfolio navigation'}).getByRole('button',{name:'Contact',exact:false}).click()
 for(const link of profile.links.filter(l=>!l.href.includes('allychen-resume')))await expect(page.locator('.contact-card').locator(`a[href="${link.href}"]`)).toBeVisible()
 const pdf=page.getByRole('link',{name:'Open Resume PDF',exact:false});const response=await page.request.get((await pdf.getAttribute('href'))!);expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');await capture(page,'contact-desktop')
})
test('all original media bytes verified; initial landing stays independent of migrated galleries',async({page})=>{
 const records=JSON.parse(await readFile(`${evidence}/media-acquisition.json`,'utf8'));expect(records).toHaveLength(120)
 for(const asset of records){const response=await page.request.get('/'+encodeURI(asset.destination.replace(/^public\//,'')));expect(response.ok()).toBe(true);const bytes=await response.body();expect(createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex')).toBe(asset.gitBlob)}
 const requests:string[]=[];page.on('request',r=>{if(r.url().includes('/media/')&&!r.url().includes('/media/world/'))requests.push(r.url())});await page.goto('/');await page.waitForFunction(()=>Boolean(window.__studioMetrics?.triangles));expect(requests).toEqual([])
 await writeFile(`${evidence}/media-browser-validation.json`,JSON.stringify({verifiedFiles:records.length,initialMediaRequests:requests},null,2))
})
test('mobile community, events, About, archive and Contact are readable; sticker cross-link opens the matching story',async({page})=>{
 await page.setViewportSize({width:390,height:844});await start(page,'Focus Community');await page.locator('.community-card img').first().evaluate(async n=>{await (n as HTMLImageElement).decode()});await capture(page,'community-mobile')
 for(const event of events){await page.locator(`#community-card-${event.id}`).click();await page.locator('.event-hero img').evaluate(async n=>{await (n as HTMLImageElement).decode()});expect(await page.getByRole('dialog').evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);await capture(page,`${event.id}-mobile`);await page.getByRole('button',{name:'Back to Community',exact:false}).click()}
 await page.getByRole('combobox',{name:'Explore studio sections'}).selectOption('about');await images(page);await page.getByRole('heading',{name:'About me',exact:true}).scrollIntoViewIfNeeded();await capture(page,'about-mobile')
 await page.getByRole('combobox',{name:'Explore studio sections'}).selectOption('archive');await capture(page,'experience-mobile');await page.getByRole('button',{name:'Skills',exact:true}).click();await capture(page,'skills-mobile')
 await page.getByRole('combobox',{name:'Explore studio sections'}).selectOption('contact');await capture(page,'contact-mobile')
 await page.getByRole('combobox',{name:'Explore studio sections'}).selectOption('stickers');await page.getByRole('navigation',{name:'Studio event stories'}).getByRole('button').click();await expect(page.getByRole('heading',{name:'Innovation Jam 2026',exact:true})).toBeVisible()
 await page.getByRole('button',{name:'Back to Studio',exact:false}).click();await expect(page.getByRole('dialog')).toHaveCount(0)
})
