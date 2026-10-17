import { expect, test } from '@playwright/test'

test.use({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true })

test('011 emulated phone has reachable touch buttons and can accelerate with a pointer hold', async ({page}) => {
  await page.goto('/')
  const acceleration=page.getByRole('button',{name:'油门（按住）'})
  const brake=page.getByRole('button',{name:'刹车（按住）'})
  await expect(acceleration).toBeVisible()
  await expect(brake).toBeVisible()
  for (const name of ['左转（按住）','右转（按住）','倒车（按住）']) {
    const button=page.getByRole('button',{name})
    await expect(button).toBeVisible()
    const size=await button.boundingBox()
    expect(size?.height ?? 0).toBeGreaterThanOrEqual(54)
    expect(size?.width ?? 0).toBeGreaterThanOrEqual(54)
  }
  await acceleration.scrollIntoViewIfNeeded()
  const box=await acceleration.boundingBox()
  if (!box) throw new Error('Accelerator unavailable')
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2)
  await page.mouse.down()
  const speed=page.locator('.hud strong').first()
  await expect.poll(async () => {
    const label=await speed.innerText()
    return Number.parseInt(label,10) || 0
  },{timeout:10000}).toBeGreaterThan(0)
  await page.mouse.up()
  await page.screenshot({path:'test-results/touch-driving-mobile-chromium.png',fullPage:true})
  await page.getByRole('button',{name:/打开车库/}).click()
  await expect(page.getByRole('dialog',{name:'我的车库'})).toBeVisible()
  await expect(acceleration).toBeHidden()
  await page.getByRole('button',{name:'关闭车库'}).click()
  await expect(acceleration).toBeVisible()
})

test('011 fine-pointer desktop stays keyboard-first without mobile pad', async ({page}) => {
  await page.setViewportSize({width:1200,height:900})
  await page.emulateMedia({media:'screen'})
  await page.goto('/')
  await expect(page.getByRole('button',{name:'油门（按住）'})).toBeHidden()
  await expect(page.getByLabel('驾驶操作说明')).toBeVisible()
})
