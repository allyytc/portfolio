import { focusDestination, openQuickView, directDestination } from './navigation'
import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { OrthographicCamera, Vector3 } from 'three'
import { sceneConfig } from '../src/studio/sceneConfig'
import { readFile, writeFile } from 'node:fs/promises'

test.beforeEach(async ({ context }) => {
  await context.route(/^https:\/\/(github\.com|linkedin\.com|www\.linkedin\.com)\//, route => route.fulfill({ body: '<title>Profile navigation intercepted for local testing</title>', contentType: 'text/html' }))
})

const evidence = 'docs/portfolio/evidence/phase7b/regression'
async function loadStudio(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => (window.__studioMetrics?.triangles ?? 0) > 10_000)
  // Allow the short initial orthographic fit transition to settle before hit tests.
  await page.waitForTimeout(900)
}

async function point(page: Page, world: readonly [number, number, number]) {
  const rect = await page.locator('canvas').boundingBox()
  if (!rect) throw new Error('Missing WebGL canvas')
  const camera = new OrthographicCamera(-rect.width / 2, rect.width / 2, rect.height / 2, -rect.height / 2, .1, 40)
  const actual = await page.evaluate(() => window.__studioCamera!)
  camera.position.fromArray(actual.position)
  camera.lookAt(new Vector3().fromArray(actual.target))
  camera.zoom = actual.zoom
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
  const p = new Vector3(...world).project(camera)
  return { x: rect.x + (p.x + 1) * rect.width / 2, y: rect.y + (1 - p.y) * rect.height / 2 }
}

test('desktop: real mesh targets, independent paper, shared panels, no runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await loadStudio(page)
  const loaded = await page.evaluate(() => window.__studioScene)
  expect(loaded?.version).toBe('phase4d-loft')
  expect(loaded?.targets).toEqual(expect.arrayContaining(['StudioStatic', 'UnwrapDisplay', 'Community_ESC', 'ExternalGitHub', 'ExternalLinkedIn', 'AboutBook', 'SkillsVolume', 'SoftFurnishings']))
  await page.screenshot({ path: `${evidence}/browser-desktop.png`, fullPage: true, animations: 'disabled' })
  const sign = await point(page, sceneConfig.hotspots.sign)
  await page.mouse.move(sign.x, sign.y)
  await expect(page.locator('.hotspot-tooltip')).toBeVisible()
  await page.mouse.click(sign.x, sign.y)
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(3)
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: `${evidence}/browser-projects.png`, fullPage: true, animations: 'disabled' })
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.waitForTimeout(800)
  const monitor = await point(page, sceneConfig.hotspots.monitor)
  await page.mouse.click(monitor.x, monitor.y)
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(800)
  const beforeDrag = await page.evaluate(() => window.__studioCamera!.azimuth)
  await page.mouse.move(monitor.x, monitor.y)
  await page.mouse.down()
  await page.mouse.move(monitor.x + 35, monitor.y + 20)
  await page.mouse.up()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect((await page.evaluate(() => window.__studioCamera!.azimuth))).toBeCloseTo(beforeDrag, 4)
  const printer = await point(page, sceneConfig.hotspots.printer)
  await page.mouse.move(printer.x, printer.y)
  await expect(page.locator('.hotspot-tooltip')).toBeVisible()
  await page.mouse.click(printer.x, printer.y)
  await page.waitForTimeout(200)
  const during = await page.evaluate(() => window.__studioMetrics?.paperProgress)
  expect(during).toBeGreaterThan(0)
  await page.screenshot({ path: `${evidence}/browser-printing.png`, fullPage: true })
  await expect(page.getByRole('heading', { name: 'My resume.' })).toBeVisible()
  const printerPdf = page.getByRole('link', { name: 'Open resume PDF' })
  await expect(printerPdf).toHaveAttribute('href', '/files/allychen-resume2028.pdf')
  const pdf = await page.request.get((await printerPdf.getAttribute('href'))!)
  expect(pdf.ok()).toBe(true)
  expect(pdf.headers()['content-type']).toContain('application/pdf')
  expect(Buffer.compare(await pdf.body(), await readFile('public/files/allychen-resume2028.pdf'))).toBe(0)
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: `${evidence}/browser-resume.png`, fullPage: true, animations: 'disabled' })
  await page.keyboard.press('Escape')
  const keyboardTrigger = page.getByRole('button', { name: 'Projects', exact: true })
  await keyboardTrigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible()
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(keyboardTrigger).toBeFocused()
  const directResume = page.getByRole('button', { name: 'Resume', exact: true })
  await directResume.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('link', { name: 'Open resume PDF' })).toHaveAttribute('href', '/files/allychen-resume2028.pdf')
  await page.keyboard.press('Escape')
  await expect(directResume).toBeFocused()
  await page.waitForFunction(() => (window.__studioMetrics?.paperProgress ?? 1) < .001)
  await expect.poll(async () => {
    const start = await page.evaluate(() => window.__studioMetrics?.frames)
    await page.waitForTimeout(250)
    return (await page.evaluate(() => window.__studioMetrics?.frames)) === start
  }, { timeout: 6000, message: 'Camera and paper must settle into demand-rendered idle' }).toBe(true)
  const metrics = await page.evaluate(() => window.__studioMetrics)
  await writeFile(`${evidence}/browser-metrics.json`, JSON.stringify({ metrics, viewport: { width: 1440, height: 1000 }, renderer: 'isolated headless Chrome on host laptop; not a physical mobile benchmark', runtimeErrors: errors }, null, 2))
  expect(errors).toEqual([])
})

test('mobile viewport: no overflow, both content actions available with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await loadStudio(page)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: `${evidence}/browser-mobile.png`, fullPage: true })
  await directDestination(page,'Projects')
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await directDestination(page,'Resume')
  await expect(page.getByRole('heading', { name: 'My resume.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open resume PDF' })).toBeVisible()
  await page.keyboard.press('Escape')
})

test('failed model: direct content survives and retry is available', async ({ page }) => {
  await page.route('**/models/loft-studio-v7d*.glb', route => route.abort())
  await page.goto('/')
  await expect(page.getByText('The studio couldn’t load.')).toBeVisible()
  await page.getByRole('button', { name: 'Projects', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Resume', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'My resume.' })).toBeVisible()
  await page.keyboard.press('Escape')
  for (const name of ['Focus Design Work', 'Focus Community', 'Focus About Me', 'Focus Skills and Experience', 'Focus GitHub', 'Focus LinkedIn', 'Focus Contact']) {
    await focusDestination(page,name)
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
  }
  await focusDestination(page,'Focus GitHub')
  await expect(page.getByRole('link', { name: 'Visit GitHub' })).toHaveAttribute('href', 'https://github.com/allyytc')
})

test('WebGL unavailable: HTML portfolio actions remain usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Projects', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Resume', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'My resume.' })).toBeVisible()
})

test('named navigation: all measured views, repeated requests and exact reset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await loadStudio(page)
  const { fitCamera } = await import('../src/studio/cameraViews')
  const items = [['Focus Projects','workstation'], ['Focus Design Work','designCorner'], ['Focus Community','communityPinboard'], ['Focus About Me','readingNook'], ['Focus Skills and Experience','archive'], ['Focus Resume Printer','printer'], ['Focus GitHub','externalLinks'], ['Focus LinkedIn','externalLinks'], ['Focus Contact','externalLinks']] as const
  for (const [label, name] of items) {
    await focusDestination(page,label)
    await page.waitForFunction(name => window.__studioCamera?.view === name && !window.__studioCamera.transitioning, name)
    const actual = await page.evaluate(() => window.__studioCamera!)
    // Views follow the objects they frame (saved layout), so compare with the app's live retargeted view, not the baked baseline.
    const live = await page.evaluate(n => (window as unknown as { __studioViews: Record<string, { position: number[]; target: number[] }> }).__studioViews[n], name)
    live.position.forEach((v, i) => expect(actual.position[i]).toBeCloseTo(v, 3))
    live.target.forEach((v, i) => expect(actual.target[i]).toBeCloseTo(v, 3))
    if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape')
    await page.screenshot({ path: `${evidence}/browser-${name}.png`, fullPage: true })
  }
  await focusDestination(page,'Focus About Me')
  await page.keyboard.press('Escape')
  await focusDestination(page,'Focus About Me')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Reset View', exact: true }).click()
  await page.waitForFunction(() => window.__studioCamera?.view === 'default' && !window.__studioCamera.transitioning)
  const reset = await page.evaluate(() => window.__studioCamera!)
  const liveDefault = await page.evaluate(() => (window as unknown as { __studioViews: Record<string, { position: number[]; target: number[] }> }).__studioViews.default)
  liveDefault.position.forEach((v, i) => expect(reset.position[i]).toBeCloseTo(v, 3))
  liveDefault.target.forEach((v, i) => expect(reset.target[i]).toBeCloseTo(v, 3))
  const rect = (await page.locator('canvas').boundingBox())!
  expect(reset.zoom).toBeCloseTo(fitCamera('default', rect.width, rect.height), 3)
  await page.screenshot({ path: `${evidence}/browser-default.png`, fullPage: true })
})

test('local Draco decoder failure preserves direct portfolio access', async ({ page }) => {
  let blocked = true
  await page.route('**/decoders/draco/**', route => blocked ? route.abort() : route.continue())
  await page.goto('/')
  await expect(page.getByText('The studio couldn’t load.')).toBeVisible()
  await page.getByRole('button', { name: 'Resume', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Open resume PDF' })).toBeVisible()
  await page.keyboard.press('Escape')
  blocked = false
  await page.getByRole('button', { name: 'Try the studio again' }).click()
  await page.waitForFunction(() => (window.__studioMetrics?.triangles ?? 0) > 10_000)
  await expect(page.getByText('The studio couldn’t load.')).toHaveCount(0)
})

test('bounded orbit, intended wheel zoom, rapid switching and keyboard reset', async ({ page }) => {
  await loadStudio(page)
  const canvas = page.locator('canvas')
  const box = (await canvas.boundingBox())!
  const start = await page.evaluate(() => window.__studioCamera!)
  // Empty upper-left room background; no interactive geometry at this point.
  await page.mouse.move(box.x + 50, box.y + 180)
  await page.mouse.down(); await page.mouse.move(box.x + 450, box.y + 260, { steps: 12 }); await page.mouse.up()
  await page.waitForTimeout(1000)
  const orbit = await page.evaluate(() => window.__studioCamera!)
  expect(Math.abs(orbit.azimuth - start.azimuth)).toBeGreaterThan(.01)
  const { cameraViews } = await import('../src/studio/cameraViews')
  expect(orbit.azimuth).toBeGreaterThanOrEqual(cameraViews.default.orbit.azimuth[0] - .001)
  expect(orbit.azimuth).toBeLessThanOrEqual(cameraViews.default.orbit.azimuth[1] + .001)
  expect(orbit.polar).toBeGreaterThanOrEqual(cameraViews.default.orbit.polar[0] - .001)
  expect(orbit.polar).toBeLessThanOrEqual(cameraViews.default.orbit.polar[1] + .001)
  await page.screenshot({ path: `${evidence}/browser-alternate-orbit.png`, fullPage: true })
  await page.mouse.wheel(0, -5000); await page.waitForTimeout(900)
  const near = await page.evaluate(() => window.__studioCamera!)
  expect(near.zoom).toBeCloseTo(near.maxZoom, 1)
  await page.mouse.wheel(0, 5000); await page.waitForTimeout(900)
  const far = await page.evaluate(() => window.__studioCamera!)
  expect(far.zoom).toBeCloseTo(far.minZoom, 1)
  await canvas.focus(); await page.keyboard.press('Home')
  await page.waitForFunction(() => !window.__studioCamera?.transitioning)
  await expect.poll(async () => (await page.evaluate(() => window.__studioCamera!)).zoom).toBeCloseTo(start.zoom, 1)
  // An unfocused canvas must not steal ordinary wheel scrolling.
  await page.getByRole('button', { name: 'Projects', exact: true }).focus()
  await page.mouse.move(box.x + 50, box.y + 180); await page.mouse.wheel(0, 250)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(30)
  await page.evaluate(() => window.scrollTo(0, 0))
  await focusDestination(page,'Focus Projects')
  await focusDestination(page,'Focus Community')
  await focusDestination(page,'Focus About Me')
  await page.waitForFunction(() => window.__studioCamera?.view === 'readingNook' && !window.__studioCamera.transitioning)
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'About me', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await openQuickView(page,true);await page.getByRole('button', { name: 'Focus Design Work', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Design work · Unwrap' })).toBeVisible()
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true)
})

test('real touch input: native page scrolling, opt-in rotation and pinch', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await loadStudio(page)
  await openQuickView(page);await page.evaluate(()=>window.scrollTo(0,0))
  const session = await context.newCDPSession(page)
  const canvas = page.locator('canvas')
  const rect = (await canvas.boundingBox())!
  const x = rect.x + 60, y = rect.y + rect.height * .6
  const touch = async (type: string, points: {x:number;y:number;id:number}[]) => session.send('Input.dispatchTouchEvent', { type, touchPoints: points })
  const original = await page.evaluate(() => window.__studioCamera!)
  await touch('touchStart', [{x,y,id:0}])
  for(let i=1;i<=6;i++) await touch('touchMove', [{x,y:y-i*18,id:0}])
  await touch('touchEnd', [])
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(20)
  expect((await page.evaluate(() => window.__studioCamera!)).azimuth).toBeCloseTo(original.azimuth, 4)
  await page.evaluate(() => window.scrollTo(0,0))
  await page.getByRole('button', { name: 'Touch controls off' }).tap()
  await expect(canvas).toHaveCSS('touch-action', 'none')
  await touch('touchStart', [{x,y,id:0}])
  for(let i=1;i<=6;i++) await touch('touchMove', [{x:x+i*22,y,id:0}])
  await touch('touchEnd', [])
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.__studioCamera!)).azimuth-original.azimuth)).toBeGreaterThan(.01)
  const beforeZoom = (await page.evaluate(() => window.__studioCamera!)).zoom
  await touch('touchStart', [{x:140,y,id:0},{x:220,y,id:1}])
  for(let i=1;i<=6;i++) await touch('touchMove', [{x:140-i*5,y,id:0},{x:220+i*5,y,id:1}])
  await touch('touchEnd', [])
  await expect.poll(async () => (await page.evaluate(() => window.__studioCamera!)).zoom).toBeGreaterThan(beforeZoom)
  await focusDestination(page,'Focus Community','tap')
  await expect(page.getByRole('heading', { name: 'Community & involvement' })).toBeVisible()
  await page.screenshot({ path: `${evidence}/browser-touch.png`, fullPage: true })
  await context.close()
})

test('physical design, community, reading, archive and social targets share HTML actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await loadStudio(page)
  const bounds = JSON.parse(await readFile('src/studio/sceneBounds.json', 'utf8'))
  const entries = [['UnwrapDisplay','Explore My Designs','designCorner'], ['Community_ESC','Engineering Student Council','communityPinboard'], ['AboutSign','About Me','readingNook'], ['readingBench','About Me','readingNook'], ['SkillsVolume','Skills & Experience','archive'], ['ExternalGitHub','GitHub','externalLinks'], ['ExternalLinkedIn','LinkedIn','externalLinks'], ['ContactSign','Contact Ally','externalLinks']] as const
  for (const [id,label,view] of entries) {
    const center = (id === 'readingBench' ? [2.6, .73, .15] : bounds.nodes[id].center) as [number,number,number]
    const p = await point(page, center)
    await page.mouse.move(p.x,p.y)
    await expect(page.locator('.hotspot-tooltip')).toContainText(label)
    await expect(page.locator('body')).toHaveCSS('cursor','pointer')
    await page.mouse.click(p.x,p.y)
    await page.waitForFunction(view => window.__studioCamera?.view === view && !window.__studioCamera.transitioning,view)
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.getByRole('button',{name:'Reset View',exact:true}).click()
    await page.waitForFunction(()=>window.__studioCamera?.view === 'default' && !window.__studioCamera.transitioning)
  }
})

test('repeated printer requests settle; interrupted print cannot open a stale panel', async ({ page }) => {
  await loadStudio(page)
  await focusDestination(page,'Focus Resume Printer'); await page.waitForTimeout(650); await focusDestination(page,'Focus Resume Printer')
  await expect(page.getByRole('heading',{name:'My resume.'})).toBeVisible()
  await page.getByRole('dialog').getByRole('button',{name:'Back to Studio'}).click()
  await page.waitForFunction(()=>window.__studioCamera?.view==='default' && !window.__studioCamera.transitioning)
  await focusDestination(page,'Focus Resume Printer'); await focusDestination(page,'Focus Design Work')
  await page.waitForFunction(()=>window.__studioCamera?.view==='designCorner' && !window.__studioCamera.transitioning)
  await expect(page.getByRole('heading',{name:'Design work · Unwrap'})).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button',{name:'Reset View',exact:true}).click()
  await page.getByRole('button',{name:'Dismiss camera hint'}).click()
  await expect(page.locator('.camera-hint')).toHaveCount(0)
})
