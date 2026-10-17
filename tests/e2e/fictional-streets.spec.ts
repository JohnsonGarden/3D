import { expect, test } from '@playwright/test'

test('013 webgl world announces three fictional junctions without claiming LA map accuracy',async ({page})=>{
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible({timeout:15000})
  const label=page.locator('.scene-label')
  await expect(label).toContainText('3 个十字路口')
  await expect(label).toContainText('虚构场景')
  await expect(label).toContainText('非真实地图')
  await page.keyboard.down('w')
  await expect.poll(async ()=> Number.parseInt(await page.locator('.hud strong').first().innerText(),10)||0,{timeout:10000}).toBeGreaterThan(0)
  await page.keyboard.up('w')
  await page.screenshot({path:'test-results/013-fictional-streets-chromium.png',fullPage:true})
})
