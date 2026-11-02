import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { openQuickView, directDestination } from './navigation'
const evidence='docs/portfolio/evidence/phase7b/regression'
async function ready(page:Page){await page.goto('/');await page.waitForFunction(()=>Boolean(window.__studioMetrics?.triangles))}
async function shot(page:Page,name:string){const panel=page.locator('.portfolio-dialog[open]');const inPanel=await panel.count()>0;if(inPanel)await expect(panel).toHaveCSS('opacity','1');await page.screenshot({path:`${evidence}/${name}.png`,fullPage:!inPanel,animations:'disabled'})}
test('collapsed Quick View keeps the studio clear; every direct destination works without moving camera',async({page})=>{
 await ready(page);const trigger=page.getByRole('button',{name:'Studio Menu',exact:false});await expect(trigger).toHaveAttribute('aria-expanded','false');await expect(page.getByRole('navigation',{name:'Quick View destinations'})).toBeHidden();await expect(page.locator('.studio-destinations,.action-card')).toHaveCount(0);await shot(page,'home-desktop')
 const initial=await page.evaluate(()=>window.__studioCamera!)
 await openQuickView(page);await expect(page.getByRole('navigation',{name:'Quick View destinations'}).getByRole('button')).toHaveCount(11);await shot(page,'quick-view-expanded')
 for(const [destination,title] of [['Projects','Selected projects.'],['Design','Design work · Unwrap'],['Community','Community & involvement'],['About','About me'],['Experience','Skills & experience'],['Skills','Skills & experience'],['Resume','My resume.'],['Contact','Get in touch'],['Sticker book','The sticker book'],['GitHub','Around the web'],['LinkedIn','Around the web']]){
  await directDestination(page,destination);await expect(page.locator('#panel-title')).toHaveText(title);await expect(trigger).toHaveAttribute('aria-expanded','false');if(destination==='Skills')await expect(page.getByRole('button',{name:'Skills',exact:true})).toHaveAttribute('aria-pressed','true')
  const current=await page.evaluate(()=>window.__studioCamera!);current.position.forEach((v,i)=>expect(v).toBeCloseTo(initial.position[i],3));await page.keyboard.press('Escape');await expect(trigger).toBeFocused()
 }
})
test('Quick View keyboard, Escape, outside click and header access have stable focus',async({page})=>{
 await ready(page);const trigger=page.getByRole('button',{name:'Studio Menu',exact:false});await trigger.focus();await page.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Tab');await expect(page.getByRole('checkbox',{name:'Focus room on selection'})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false')
 await trigger.click();await page.getByRole('heading',{name:'Ally Chen’s creative studio'}).evaluate(n=>document.querySelector('.site-header')!.dispatchEvent(new MouseEvent('click',{bubbles:true})));await expect(trigger).toHaveAttribute('aria-expanded','false')
 for(const name of ['Resume','Contact']){await page.getByRole('navigation',{name:'Portfolio navigation'}).getByRole('button',{name,exact:false}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape')}
})
test('case-study return restores list scroll; sticky back and section navigation do not overlap headings',async({page})=>{
 await ready(page);await directDestination(page,'Projects');await page.getByRole('button',{name:'All projects',exact:true}).click();const card=page.getByRole('button',{name:"View Afterlife Metro →",exact:true});await card.scrollIntoViewIfNeeded();const before=await page.getByRole('dialog').evaluate(n=>n.scrollTop);await card.click();await page.getByRole('button',{name:'Back to Projects',exact:false}).click();await expect(card).toBeFocused();expect(await page.getByRole('dialog').evaluate(n=>n.scrollTop)).toBeCloseTo(before,0)
 await page.getByRole('button',{name:'View Corvallis Daytime Drop-In Center Website →',exact:true}).click();await page.getByRole('navigation',{name:'Case study sections'}).getByRole('button',{name:'Design Process',exact:true}).click();await expect.poll(async()=>{const h=await page.getByRole('heading',{name:'Design Process',exact:true}).boundingBox();const n=await page.getByRole('navigation',{name:'Case study sections'}).boundingBox();return Math.abs(h!.y-n!.y-n!.height-20)}).toBeLessThan(35)
 const heading=await page.getByRole('heading',{name:'Design Process',exact:true}).boundingBox();const nav=await page.getByRole('navigation',{name:'Case study sections'}).boundingBox();expect(heading!.y).toBeGreaterThanOrEqual(nav!.y+nav!.height-1);await expect(page.getByRole('button',{name:'Back to Projects',exact:false})).toBeInViewport();await shot(page,'project-sticky-navigation')
 await page.keyboard.press('Escape');await directDestination(page,'Community');await page.getByRole('button',{name:'Organizations',exact:true}).click();await page.locator('#community-card-esc').click();await page.getByRole('button',{name:"Engineers' Week 2026 →",exact:true}).click();await page.getByRole('button',{name:'Back to Community',exact:false}).click();await expect(page.locator('#community-card-esc')).toBeFocused();await expect(page.getByRole('button',{name:'Organizations',exact:true})).toHaveAttribute('aria-pressed','true')
})
test('desktop content evidence preserves media and distinct layouts',async({page})=>{
 await ready(page);await directDestination(page,'Projects');await page.getByRole('button',{name:'View KO.rbit →',exact:true}).click();await page.locator('.case-hero img').evaluate(async n=>{await (n as HTMLImageElement).decode()});await shot(page,'projects-desktop');await page.keyboard.press('Escape')
 await directDestination(page,'Design');await page.getByRole('button',{name:'View Unwrap →',exact:true}).click();await page.locator('.case-hero img').evaluate(async n=>{await (n as HTMLImageElement).decode()});await shot(page,'unwrap-desktop');await page.keyboard.press('Escape')
 await directDestination(page,'Community');await page.locator('.community-card').first().scrollIntoViewIfNeeded();await page.locator('.community-card img').first().evaluate(async n=>{await (n as HTMLImageElement).decode()});await shot(page,'community-desktop');await page.keyboard.press('Escape')
 await directDestination(page,'Experience');await shot(page,'experience-desktop')
})
test.describe('touch layouts',()=>{
test.use({hasTouch:true})
test('mobile and tablet direct navigation stays legible and touch friendly',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await ready(page);await shot(page,'home-mobile');await openQuickView(page);await shot(page,'navigation-mobile');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 const menu=page.getByRole('navigation',{name:'Quick View destinations'});for(const button of await menu.getByRole('button').all()){const rect=await button.boundingBox();expect(rect!.height).toBeGreaterThanOrEqual(44)}
 await menu.getByRole('button',{name:'Open Skills',exact:true}).tap();await expect(page.getByRole('heading',{name:'Languages',exact:true})).toBeVisible();expect(await page.getByRole('dialog').evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);await shot(page,'skills-mobile');await page.keyboard.press('Escape')
 await page.setViewportSize({width:820,height:1180});await openQuickView(page);await shot(page,'navigation-tablet');await page.getByRole('navigation',{name:'Quick View destinations'}).getByRole('button',{name:'Open Projects',exact:true}).click();await shot(page,'projects-tablet')
})

})
