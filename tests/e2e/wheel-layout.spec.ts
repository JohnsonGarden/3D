import { expect, test } from '@playwright/test'
import { tinyTruckGlb } from './tiny-glb.fixture.ts'

test('022 manual axle form validates and resets on photo changes',async({page})=>{
 await page.goto('/')
 await page.getByRole('button',{name:/打开车库/}).click()
 const garage=page.getByRole('dialog',{name:'我的车库'})
 const panel=garage.getByRole('region',{name:'手动轮组测量交接'})
 await expect(panel).toHaveCount(0)
 const photo={name:'view.png',mimeType:'image/png',
   buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=','base64')}
 await garage.getByLabel('选择小车多角度照片').setInputFiles(photo)
 await garage.getByLabel('导入 GLB 模型').setInputFiles({
   name:'car.glb',mimeType:'model/gltf-binary',buffer:tinyTruckGlb()
 })
 await garage.getByLabel('实物车长（cm）').fill('10.4')
 await garage.getByLabel('实物车宽（cm）').fill('3.1')
 await garage.getByLabel('实物车高（cm）').fill('4.7')
 await panel.getByLabel('车轴中心距车身前端（cm）').fill('8,2')
 await panel.getByLabel('轮胎总数').fill('4')
 await panel.getByRole('button',{name:'导出轮组测量 JSON'}).click()
 await expect(panel.getByRole('alert')).toContainText('递增')
 await garage.getByLabel('选择小车多角度照片').setInputFiles({...photo,name:'next.png'})
 await expect(panel.getByLabel('车轴中心距车身前端（cm）')).toHaveValue('')
 await panel.getByLabel('车轴中心距车身前端（cm）').fill('2.4,5.6,7.2,8.8')
 await panel.getByLabel('轮胎总数').fill('14')
 const download=page.waitForEvent('download')
 await panel.getByRole('button',{name:'导出轮组测量 JSON'}).click()
 expect((await download).suggestedFilename()).toBe('brickworld-wheel-layout.json')
})
