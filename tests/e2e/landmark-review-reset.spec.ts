import { expect, test } from '@playwright/test'
import { tinyTruckGlb } from './tiny-glb.fixture.ts'

test('021 switching GLB and clearing photos resets review',async({page})=>{
  await page.goto('/')
  await page.getByRole('button',{name:/打开车库/}).click()
  const garage=page.getByRole('dialog',{name:'我的车库'})
  const photo={name:'photo.png',mimeType:'image/png',buffer:Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=','base64')}
  await garage.getByLabel('选择小车多角度照片').setInputFiles(photo)
  await garage.getByLabel('导入 GLB 模型').setInputFiles({
    name:'reset.glb',mimeType:'model/gltf-binary',buffer:tinyTruckGlb()
  })
  const panel=garage.getByRole('region',{name:'手动结构特征核对'})
  await panel.getByRole('checkbox').first().check()
  await garage.getByRole('button',{name:'选择程序化示例车'}).click()
  await expect(panel).toHaveCount(0)
  await garage.getByRole('button',{name:'选择车辆：reset.glb'}).click()
  await expect(panel).toContainText('已勾选 0/5 项')
  await garage.getByRole('button',{name:'清空已选照片'}).click()
  await expect(panel).toHaveCount(0)
  await garage.getByLabel('选择小车多角度照片').setInputFiles(photo)
  await expect(panel).toContainText('已勾选 0/5 项')
})
