import { test, expect } from '@playwright/test'

test('simulado oficial não vaza gabarito, explicação ou dicas durante a prova', async ({ page }) => {
  await page.goto('/simulado')
  await page.getByRole('button', { name: /Iniciar simulado oficial/i }).click()
  await page.waitForURL(/\/simulado\/prova$/)

  // A página da prova está carregada
  await expect(page.getByText(/Questão 1 de 40/i)).toBeVisible()

  // Durante a prova não deve haver explicação, dicas nem passo a passo
  await expect(page.locator('.explanation-short')).not.toBeVisible()
  await expect(page.locator('.hints-area')).not.toBeVisible()
  await expect(page.locator('ol.explanation-steps')).not.toBeVisible()
  await expect(page.locator('.correct-answer')).not.toBeVisible()

  // Timer é exibido
  await expect(page.locator('.timer')).toBeVisible()

  // Responde algumas questões e avança
  for (let i = 0; i < 3; i++) {
    const options = page.locator('.options button.option')
    await options.first().click()
    const next = page.getByRole('button', { name: 'Próxima' }).or(page.getByRole('button', { name: 'Finalizar prova' }))
    await next.first().click()
  }

  // Ao longo do simulado continua sem explicação
  await expect(page.locator('.explanation-short')).not.toBeVisible()
})
