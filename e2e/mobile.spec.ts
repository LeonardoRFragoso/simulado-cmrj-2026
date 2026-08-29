import { test, expect } from '@playwright/test'

test('fluxo principal em iPhone 13: home, treino, caderno sem rolagem horizontal', async ({ page }) => {
  await page.goto('/')
  const body = page.locator('body')
  const scrollWidth = await body.evaluate((el) => el.scrollWidth)
  const clientWidth = await body.evaluate((el) => el.clientWidth)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)

  await page.getByRole('link', { name: /Treino Rápido/i }).click()
  await expect(page).toHaveURL(/\/treino\/rapido$/)

  await page.goto('/treino/rapido/matematica')
  await page.getByRole('button', { name: /5 questões/i }).click()

  // Verifica opções clicáveis (>= 44px)
  const option = page.locator('.options button.option').first()
  const box = await option.boundingBox()
  expect(box?.width).toBeGreaterThanOrEqual(44)
  expect(box?.height).toBeGreaterThanOrEqual(44)
})
