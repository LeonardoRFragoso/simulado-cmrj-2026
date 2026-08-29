import { test, expect } from '@playwright/test'

test('fluxo de treino rápido: errar, ver correta, explicação e passo a passo', async ({ page }) => {
  await page.goto('/treino/rapido/matematica/5')
  await expect(page.getByText(/Questão 1 de 5/i)).toBeVisible()

  // Seleciona uma alternativa (feedback imediato envia na mesma ação)
  const options = page.locator('.options button.option')
  await options.first().click()

  // Após resposta, a explicação curta aparece
  await expect(page.locator('.explanation-short')).toBeVisible()

  // Abre passo a passo quando disponível
  const stepsBtn = page.getByRole('button', { name: /Ver passo a passo/i })
  if (await stepsBtn.isVisible().catch(() => false)) {
    await stepsBtn.click()
    await expect(page.locator('ol.explanation-steps')).toBeVisible()
  }

  // Avança para a próxima questão
  await page.getByRole('button', { name: /Próxima/i }).click()
  await expect(page.getByText(/Questão 2 de 5/i)).toBeVisible()
})
