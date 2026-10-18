import { expect, test } from '@playwright/test'
import { tinyTruckGlb } from './tiny-glb.fixture.ts'

test('021 manual model review is explicitly confirmed and session-only', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button',{name:/打开车库/}).click()
  const garage=page.getByRole('dialog',{name:'我的车库'})
  const panel=garage.getByRole('region',{name:'手动结构特征核对'})
  await expect(panel).toHaveCount(0)
  await garage.getByLabel('选择小车多角度照片').setInputFiles({
    name:'photo.png',mimeType:'image/png',buffer:Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=','base64')
  })
  await garage.getByLabel('导入 GLB 模型').setInputFiles({
    name:'review.glb',mimeType:'model/gltf-binary',buffer:tinyTruckGlb()
  })
  await expect(panel.getByRole('checkbox')).toHaveCount(5)
  const confirm=panel.getByRole('button',{name:'确认本次人工结构核对'})
  await expect(confirm).toBeDisabled()
  for(let i=0;i<4;i++) await panel.getByRole('checkbox').nth(i).check()
  await expect(confirm).toBeEnabled()
  await confirm.click()
  await expect(panel).toContainText('本次会话已人工核对 4/5 项')
  await garage.getByRole('button',{name:'选择程序化示例车'}).click()
  await expect(panel).toHaveCount(0)
})
