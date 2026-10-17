import { expect, test } from '@playwright/test'

const pixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=',
  'base64'
)
const shot = (name: string) => ({name, mimeType:'image/png', buffer:pixelPng})

test('016 local multiview photo selection, replace and clear never claims 3D generation', async ({page})=>{
  await page.goto('/')
  await page.getByRole('button',{name:/打开车库/}).click()
  const garage=page.getByRole('dialog',{name:'我的车库'})
  const picker=garage.getByLabel('选择小车多角度照片')
  await expect(garage.getByText('照片还不能自动生成 3D 模型',{exact:false})).toBeVisible()
  await picker.setInputFiles([shot('front.png'),shot('side.png')])
  await expect(garage.getByText('已选 2 张照片')).toBeVisible()
  await expect(garage.getByRole('img',{name:'照片预览：front.png'})).toBeVisible()
  await expect(garage.getByRole('img',{name:'照片预览：side.png'})).toBeVisible()
  await picker.setInputFiles([shot('rear.png')])
  await expect(garage.getByText('已选 1 张照片')).toBeVisible()
  await expect(garage.getByRole('img',{name:'照片预览：front.png'})).toHaveCount(0)
  await garage.getByRole('button',{name:'清空已选照片'}).click()
  await expect(garage.getByText('尚未选择照片')).toBeVisible()
  await expect(garage.getByLabel('导入 GLB 模型')).toBeAttached()
  await expect(garage.getByRole('button',{name:'选择程序化示例车'})).toBeVisible()
})

test('016 invalid photo selection does not discard a valid previous set',async({page})=>{
  await page.goto('/')
  await page.getByRole('button',{name:/打开车库/}).click()
  const garage=page.getByRole('dialog',{name:'我的车库'})
  const picker=garage.getByLabel('选择小车多角度照片')
  await picker.setInputFiles([shot('front.png')])
  await expect(garage.getByText('已选 1 张照片')).toBeVisible()
  await picker.setInputFiles({name:'fake.heic',mimeType:'image/heic',buffer:Buffer.from('not-an-image')})
  await expect(page.getByRole('alert')).toContainText('支持 JPG、PNG、WebP')
  await expect(garage.getByRole('img',{name:'照片预览：front.png'})).toBeVisible()
})
