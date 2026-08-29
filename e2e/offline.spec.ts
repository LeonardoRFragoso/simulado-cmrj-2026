import { test, expect } from '@playwright/test'

test('service worker registrado e manifest presente', async ({ page }) => {
  await page.goto('/')

  // Aguarda registro do service worker
  const sw = await page.evaluate(() =>
    navigator.serviceWorker.ready.then((r) => r.scope)
  )
  expect(sw).toBeTruthy()

  const response = await page.request.get('/manifest.webmanifest')
  expect(response.status()).toBe(200)
  const manifest = await response.json()
  expect(manifest.short_name).toBeTruthy()
  expect(manifest.icons?.length).toBeGreaterThan(0)
})

test('redação persiste após reload (persistência local)', async ({ page }) => {
  await page.goto('/redacao')
  await page.locator('.proposal-list li button').first().click()
  await page.locator('#essay-title').fill('A História de Ana')
  await page.locator('#essay-text').fill('Ana acordou cedo.')
  await page.getByRole('button', { name: /Salvar/i }).click()

  await page.reload()
  await page.locator('.proposal-list li button').first().click()
  await page.waitForSelector('#essay-title')
  await expect(page.locator('#essay-title')).toHaveValue('A História de Ana')
  await expect(page.locator('#essay-text')).toHaveValue('Ana acordou cedo.')
})
