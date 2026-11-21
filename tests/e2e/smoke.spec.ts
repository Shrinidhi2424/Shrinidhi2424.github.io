import { expect, test } from '@playwright/test'

test('load, open the palette, open a project, close it, switch the theme', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.keyboard.press('Control+k')
  const palette = page.locator('dialog[data-palette]')
  await expect(palette).toBeVisible()
  await palette.getByPlaceholder(/search projects/i).fill('ResumeAI')
  await page.keyboard.press('Enter')

  const drawer = page.locator('dialog[aria-labelledby="drawer-title"]')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('heading', { level: 2 })).toHaveText('ResumeAI Pro')
  await expect(page).toHaveURL(/#project-resumeai-pro$/)

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(page).toHaveURL(/#projects$/)

  const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  await page.getByRole('button', { name: /switch to (dark|light) mode/i }).click()
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(before)
})
