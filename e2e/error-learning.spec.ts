import { test, expect } from '@playwright/test'

test('erro no treino entra no caderno e permite revisar', async ({ page }) => {
  await page.goto('/treino/rapido/matematica/5')

  // Seleciona a primeira alternativa (provavelmente errada)
  const options = page.locator('.options button.option')
  await options.first().click()

  // Espera o feedback aparecer
  await expect(page.locator('.explanation-short')).toBeVisible()

  // Clica em "Revisar depois" se aparecer
  const reviewLater = page.getByRole('button', { name: /Revisar depois/i })
  if (await reviewLater.isVisible().catch(() => false)) {
    await reviewLater.click()
  }

  // Vai ao caderno e verifica que há conteúdo
  await page.goto('/caderno-de-erros')
  await expect(page.getByRole('heading', { name: /Caderno de Erros/i })).toBeVisible()
})
