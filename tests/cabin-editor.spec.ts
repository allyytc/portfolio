import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'

declare global { interface Window { __cabinEditor: { store: Record<string, (...args: unknown[]) => unknown>; getState: () => { active: boolean; selectedId: string | null; layout: { objects: Record<string, { position: number[]; rotation: number[]; scale: number }> }; warnings: { text: string }[]; dragging: boolean; undo: unknown[] }; runtime: { pivots: Map<string, { pivot: { position: { x: number } } }> } }; __cabinEditorScreen: (id: string, lift?: number, dx?: number, dz?: number) => { x: number; y: number } | null; __studioCamera: { azimuth: number; view: string; transitioning: boolean } } }

const layoutFile = 'src/studio/layout/layout.json'
const state = (page: Page) => page.evaluate(() => { const s = window.__cabinEditor.getState(); return { active: s.active, selected: s.selectedId, objects: s.layout.objects, warnings: s.warnings.map(w => w.text), dragging: s.dragging, undo: s.undo.length } })
async function openEditor(page: Page) {
  await page.goto('/'); await page.waitForFunction(() => (window.__cabinEditor?.runtime.pivots.size ?? 0) > 5, undefined, { timeout: 30_000 })
  await page.getByRole('button', { name: /Edit Cabin/ }).click(); await page.waitForFunction(() => Boolean(window.__cabinEditorScreen))
  // Tests start from the GLB baseline in memory only, so a saved project layout never changes results (and is restored on disk afterwards).
  await page.evaluate(() => window.__cabinEditor.store.restoreOriginal()); await page.waitForTimeout(200)
}

test.describe('development cabin editor', () => {
  let original = ''
  test.beforeEach(async () => { original = await readFile(layoutFile, 'utf8') })
  test.afterEach(async () => { await writeFile(layoutFile, original) })

  test('select by click and list, keyboard move/rotate/scale, undo/redo, deselect and exit', async ({ page }) => {
    await openEditor(page)
    const registered = await page.evaluate(() => [...window.__cabinEditor.runtime.pivots.keys()])
    expect(registered).toEqual(expect.arrayContaining(['desk', 'printer', 'deskChair', 'readingArmchair', 'easel', 'fireplace', 'communityEsc', 'signpost', 'roofShingles', 'porchRoofShingles', 'floorBoards', 'rearPlasterWall', 'staircase', 'loftBed', 'windowWall', 'porchBoards', 'porchPosts', 'keyboard', 'chimney', 'terrain', 'forest']))
    const chair = await page.evaluate(() => window.__cabinEditorScreen('deskChair', .5))
    await page.mouse.click(chair!.x, chair!.y)
    expect((await state(page)).selected).toBe('deskChair')
    await page.keyboard.press('ArrowRight'); await page.keyboard.press(']'); await page.keyboard.press('=')
    let s = (await state(page)).objects.deskChair
    expect(s.position[0]).toBeCloseTo(.05, 3); expect(s.rotation[1]).toBeCloseTo(15, 2); expect(s.scale).toBeCloseTo(1.05, 3)
    await page.keyboard.press('Control+z'); expect((await state(page)).objects.deskChair.scale).toBeCloseTo(1, 3)
    await page.keyboard.press('Control+Shift+z'); expect((await state(page)).objects.deskChair.scale).toBeCloseTo(1.05, 3)
    await page.getByRole('button', { name: 'Reading armchair' }).click(); expect((await state(page)).selected).toBe('readingArmchair')
    await page.keyboard.press('Escape'); expect((await state(page)).selected).toBeNull()
    await page.keyboard.press('Escape'); expect((await state(page)).active).toBe(false)
    s = (await state(page)).objects.deskChair; expect(s).toBeTruthy()
  })

  test('gizmo drag moves the object without rotating the camera; orbit works again afterwards', async ({ page }) => {
    await openEditor(page)
    await page.evaluate(() => window.__cabinEditor.store.select('readingArmchair')); await page.waitForTimeout(400)
    const az0 = await page.evaluate(() => window.__studioCamera.azimuth)
    const from = (await page.evaluate(() => window.__cabinEditorScreen('readingArmchair', 0, .6, 0)))!, to = (await page.evaluate(() => window.__cabinEditorScreen('readingArmchair', 0, 1.2, 0)))!
    await page.mouse.move(from.x - 2, from.y - 2); await page.mouse.move(from.x, from.y); await page.waitForTimeout(150)
    await page.mouse.down(); await page.mouse.move(to.x, to.y, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(300)
    const s = await state(page)
    expect(s.objects.readingArmchair.position[0]).toBeGreaterThan(.4); expect(s.dragging).toBe(false)
    expect(Math.abs((await page.evaluate(() => window.__studioCamera.azimuth)) - az0)).toBeLessThan(1e-4)
    await page.mouse.move(900, 150); await page.mouse.down(); await page.mouse.move(980, 150, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(500)
    expect(Math.abs((await page.evaluate(() => window.__studioCamera.azimuth)) - az0)).toBeGreaterThan(1e-4)
  })

  test('collision/bounds warnings, export/import round trip and bad import rejection', async ({ page }) => {
    await openEditor(page)
    await page.evaluate(() => window.__cabinEditor.store.setPlacement('deskChair', { position: [2.2, 0, 0], rotation: [0, 0, 0], scale: 1 }))
    expect((await state(page)).warnings.join(' ')).toContain('Desk chair intersects the loft stairs')
    await page.evaluate(() => window.__cabinEditor.store.setPlacement('deskChair', { position: [9, 0, 0], rotation: [0, 0, 0], scale: 1 }))
    expect((await state(page)).warnings.join(' ')).toContain('outside the cabin floor')
    await page.evaluate(() => window.__cabinEditor.store.setPlacement('deskChair', { position: [.2, 0, .1], rotation: [0, 10, 0], scale: 1 }))
    const text = await page.evaluate(() => window.__cabinEditor.store.exportText() as string)
    expect(JSON.parse(text).version).toBe(1)
    await page.evaluate(() => window.__cabinEditor.store.restoreOriginal()); expect(Object.keys((await state(page)).objects)).toHaveLength(0)
    expect(await page.evaluate(t => window.__cabinEditor.store.importText(t), text)).toBe(true)
    expect((await state(page)).objects.deskChair.position[0]).toBeCloseTo(.2, 3)
    expect(await page.evaluate(() => window.__cabinEditor.store.importText('{"version":1,"objects":{"nope":{"position":[0,0,0],"rotation":[0,0,0],"scale":1}}}'))).toBe(false)
    expect(await page.evaluate(() => window.__cabinEditor.store.importText('{"version":1,"objects":{"desk":{"position":[99,0,0],"rotation":[0,0,0],"scale":1}}}'))).toBe(false)
  })

  test('save writes only layout.json, survives reload, and camera/hit targets follow a moved printer', async ({ page }) => {
    await openEditor(page)
    await page.evaluate(() => window.__cabinEditor.store.setPlacement('printer', { position: [.4, 0, .3], rotation: [0, 0, 0], scale: 1 }))
    await page.evaluate(() => window.__cabinEditor.store.save()); await page.waitForTimeout(600)
    const written = JSON.parse(await readFile(layoutFile, 'utf8'))
    expect(Object.keys(written.objects)).toEqual(['printer']); expect(written.objects.printer.position[0]).toBeCloseTo(.4, 3)
    await page.reload(); await page.waitForFunction(() => Boolean(window.__cabinEditor)); await page.waitForTimeout(1500)
    expect((await state(page)).objects.printer.position[2]).toBeCloseTo(.3, 3)
    await page.getByRole('button', { name: /Studio Menu/ }).click()
    await page.getByRole('navigation', { name: 'Quick View destinations' }).getByRole('button', { name: /Resume/ }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('delete hides an object, is undoable, persists through save/reload, and deleted objects are not clickable', async ({ page }) => {
    await openEditor(page)
    await page.evaluate(() => window.__cabinEditor.store.select('printer'))
    await page.keyboard.press('Delete')
    let s = await state(page); expect((s.objects.printer as { hidden?: boolean }).hidden).toBe(true)
    expect(await page.evaluate(() => window.__cabinEditor.runtime.pivots.get('printer')!.pivot.visible)).toBe(false)
    await page.keyboard.press('Control+z'); s = await state(page); expect(s.objects.printer).toBeUndefined()
    await page.keyboard.press('Control+Shift+z'); expect(((await state(page)).objects.printer as { hidden?: boolean }).hidden).toBe(true)
    expect(await page.evaluate(() => window.__cabinEditor.store.importText('{"version":1,"objects":{"desk":{"position":[0,0,0],"rotation":[0,0,0],"scale":1,"hidden":"yes"}}}'))).toBe(false)
    await page.evaluate(() => window.__cabinEditor.store.save()); await page.waitForTimeout(600)
    expect(JSON.parse(await readFile(layoutFile, 'utf8')).objects.printer.hidden).toBe(true)
    await page.reload(); await page.waitForFunction(() => (window.__cabinEditor?.runtime.pivots.size ?? 0) > 5); await page.waitForTimeout(1200)
    expect(await page.evaluate(() => window.__cabinEditor.runtime.pivots.get('printer')!.pivot.visible)).toBe(false)
    // Restore from the list, then the printer is visible again.
    await page.getByRole('button', { name: /Edit Cabin/ }).click(); await page.evaluate(() => window.__cabinEditor.store.select('printer'))
    await page.getByRole('button', { name: 'Restore', exact: true }).click()
    expect(await page.evaluate(() => window.__cabinEditor.runtime.pivots.get('printer')!.pivot.visible)).toBe(true)
  })

  test('save endpoint rejects invalid layouts and writes nothing', async ({ request }) => {
    const bad = await request.post('/__cabin-layout', { data: '{"version":1,"objects":{"../../etc":{"position":[0,0,0],"rotation":[0,0,0],"scale":1}}}', headers: { 'Content-Type': 'application/json' } })
    expect((await bad.json()).ok).toBe(false)
    expect(await readFile(layoutFile, 'utf8')).toBe(original)
  })
})

test('production build contains no editor UI or layout writer', async ({ page, request }) => {
  await page.goto('http://127.0.0.1:4174/'); await page.waitForTimeout(1500)
  await expect(page.getByRole('button', { name: /Edit Cabin/ })).toHaveCount(0)
  expect(await page.evaluate(() => Boolean((window as unknown as Record<string, unknown>).__cabinEditor))).toBe(false)
  const response = await request.post('http://127.0.0.1:4174/__cabin-layout', { data: '{}', headers: { 'Content-Type': 'application/json' } })
  expect(response.ok() && (await response.text()).includes('"ok":true')).toBe(false)
})
