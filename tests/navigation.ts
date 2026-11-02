import type { Page } from '@playwright/test'
export async function openQuickView(page:Page,focusRoom=false){
  const trigger=page.getByRole('button',{name:'Studio Menu',exact:false})
  if(await trigger.getAttribute('aria-expanded')!=='true')await trigger.click()
  await page.getByRole('checkbox',{name:'Focus room on selection'}).setChecked(focusRoom)
}
export async function focusDestination(page:Page,name:string,method:'click'|'tap'='click'){
  await openQuickView(page,true)
  await page.getByRole('navigation',{name:'Quick View destinations'}).getByRole('button',{name,exact:true})[method]()
}
export async function directDestination(page:Page,name:string){
  await openQuickView(page)
  await page.getByRole('navigation',{name:'Quick View destinations'}).getByRole('button',{name:`Open ${name}`,exact:true}).click()
}
