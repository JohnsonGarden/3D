import { expect, test } from '@playwright/test'

test('first drive is discoverable and garage restores play', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('BRICK WORLD')).toBeVisible()
  await expect(page.getByLabel('驾驶操作说明')).toBeVisible()
  await expect(page.getByRole('button', { name: /打开车库/ })).toBeVisible()

  await page.getByRole('button', { name: /打开车库/ }).click()
  await expect(page.getByRole('dialog', { name: '我的车库' })).toBeVisible()
  await expect(page.getByText(/尚非照片重建/)).toBeVisible()
  await expect(page.getByLabel('导入 GLB 模型')).toHaveAttribute('type', 'file')
  await page.getByRole('button', { name: /开始驾驶/ }).click()
  await expect(page.getByRole('dialog', { name: '我的车库' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /重置车辆/ })).toBeVisible()
})

test('keyboard garage toggle, local music selector and invalid GLB handling', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('g')
  await expect(page.getByRole('dialog', { name: '我的车库' })).toBeVisible()
  await page.getByLabel('导入 GLB 模型').setInputFiles({
    name: 'not-a-model.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('invalid')
  })
  await expect(page.getByRole('alert')).toContainText('20 MB')
  await page.getByRole('button', { name: '关闭车库' }).click()
  await expect(page.getByLabel('选择背景音乐')).toBeAttached()
  await expect(page.locator('audio')).toHaveCount(0)
})
