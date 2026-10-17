import { expect, test } from '@playwright/test'

test('012 steering toward visible right-side kiosk stops truck and R recovers',async({page})=>{
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible({timeout:15000})
  await page.keyboard.down('w')
  await page.keyboard.down('d')
  await expect(page.getByRole('status',{name:'驾驶碰撞提示'})).toContainText('碰撞',{timeout:14000})
  await page.keyboard.up('d')
  await page.keyboard.up('w')
  await page.screenshot({path:'test-results/collision-contact-chromium.png',fullPage:true})
  await page.getByRole('button',{name:/重置车辆/}).click()
  await expect(page.getByRole('status',{name:'驾驶碰撞提示'})).toHaveCount(0)
  await expect(page.getByLabel('驾驶信息')).toContainText('0 km/h')
})
