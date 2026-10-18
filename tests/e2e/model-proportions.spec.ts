import { expect, test } from '@playwright/test'
import { tinyTruckGlb } from './tiny-glb.fixture.ts'

test('020 manual ratios update and disappear on photo clear or sample selection',async({page})=>{
 const writes:string[]=[]
 page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url())})
 await page.goto('/')
 await page.getByRole('button',{name:/打开车库/}).click()
 const garage=page.getByRole('dialog',{name:'我的车库'})
 const report=garage.getByRole('region',{name:'手动 GLB 比例核对'})
 const photo={name:'front.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=','base64')}
 await garage.getByLabel('选择小车多角度照片').setInputFiles(photo)
 await garage.getByLabel('实物车长（cm）').fill('12')
 await garage.getByLabel('实物车宽（cm）').fill('6')
 await garage.getByLabel('实物车高（cm）').fill('6')
 await expect(report).toHaveCount(0)
 await garage.getByLabel('导入 GLB 模型').setInputFiles({name:'manual-review.glb',mimeType:'model/gltf-binary',buffer:tinyTruckGlb()})
 await expect(report).toContainText('外接框比例接近')
 await garage.getByLabel('实物车高（cm）').fill('2')
 await expect(report).toContainText('比例存在偏差')
 await garage.getByRole('button',{name:'清空已选照片'}).click()
 await expect(report).toHaveCount(0)
 await garage.getByLabel('选择小车多角度照片').setInputFiles(photo)
 await garage.getByRole('button',{name:'选择程序化示例车'}).click()
 await expect(report).toHaveCount(0)
 await page.reload()
 await page.getByRole('button',{name:/打开车库/}).click()
 await expect(page.getByRole('region',{name:'手动 GLB 比例核对'})).toHaveCount(0)
 expect(writes).toEqual([])
})
