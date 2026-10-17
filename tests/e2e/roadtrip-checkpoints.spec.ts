import { expect, test } from '@playwright/test'

test('014 playable road trip earns gate 1, R preserves progress, journey restart clears it',async({page})=>{
  await page.goto('/')
  const trip=page.getByRole('region',{name:'公路旅行进度'})
  await expect(trip).toContainText('0 / 3')
  await expect(trip).toContainText('城市出发')
  await expect(page.locator('canvas')).toBeVisible({timeout:15000})
  await page.keyboard.down('w')
  await expect(trip).toContainText('1 / 3',{timeout:14000})
  await page.keyboard.up('w')
  await expect(trip).toContainText('彩色街区')
  await page.getByRole('button',{name:/重置车辆/}).click()
  await expect(trip).toContainText('1 / 3')
  await page.getByRole('button',{name:'重新开始旅程'}).click()
  await expect(trip).toContainText('0 / 3')
  await expect(trip).toContainText('城市出发')
  await expect(page.getByLabel('驾驶信息')).toContainText('0 km/h')
})
