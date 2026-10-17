import { expect, test } from '@playwright/test'

test('013 opt-in frame stats reflect real browser samples and never block driving',async({page})=>{
  // Headless CI can have slow software WebGL frames under two-worker contention.
  // Await actual numeric sampling rather than reducing the 30-frame requirement or
  // accepting a loading-state placeholder as performance evidence.
  test.setTimeout(65_000)
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible({timeout:15000})
  await expect(page.getByRole('region',{name:'性能诊断'})).toHaveCount(0)
  await page.getByRole('button',{name:'显示性能诊断'}).click()
  const panel=page.getByRole('region',{name:'性能诊断'})
  await expect(panel).toBeVisible()
  await expect(panel).toContainText('浏览器动画帧')
  await expect(panel.locator('.performance-values')).toBeVisible({timeout:45_000})
  await expect(panel).toContainText('p95')
  await expect(panel).toContainText('FPS')
  await expect(panel).toContainText('ms')
  await page.getByRole('button',{name:'隐藏性能诊断'}).click()
  await expect(panel).toHaveCount(0)
  await page.keyboard.down('w')
  await expect.poll(async()=>{
    const value=await page.locator('.hud strong').first().innerText()
    return Number.parseInt(value,10)||0
  },{timeout:10000}).toBeGreaterThan(0)
  await page.keyboard.up('w')
})
