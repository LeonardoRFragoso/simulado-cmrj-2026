import { test, expect } from '@playwright/test'

test('treino rápido mostra mensagem motivacional ao final', async ({ page }) => {
  await page.goto('/treino/rapido/matematica/5')

  // Responde todas as 5 questões
  for (let i = 0; i < 5; i++) {
    const options = page.locator('.options button.option')
    await options.first().click()
    if (i < 4) {
      await page.getByRole('button', { name: /Próxima/i }).click()
    } else {
      await page.getByRole('button', { name: /Finalizar/i }).click()
    }
  }

  // Página de resultado carrega com a mensagem motivacional
  await expect(page).toHaveURL(/\/resultado$/)
  await expect(page.locator('.motivational-card')).toBeVisible()
  await expect(page.locator('.motiv-title')).toBeVisible()
  await expect(page.locator('.motiv-message')).toBeVisible()
  await expect(page.locator('.motiv-score-num')).toBeVisible()
  // CTAs presentes
  await expect(page.locator('.motiv-actions .link-btn').first()).toBeVisible()
})

test('mensagem motivacional não promete aprovação', async ({ page }) => {
  await page.goto('/treino/rapido/matematica/5')
  for (let i = 0; i < 5; i++) {
    const options = page.locator('.options button.option')
    await options.first().click()
    if (i < 4) {
      await page.getByRole('button', { name: /Próxima/i }).click()
    } else {
      await page.getByRole('button', { name: /Finalizar/i }).click()
    }
  }
  const cardText = await page.locator('.motivational-card').textContent()
  expect(cardText?.toLowerCase()).not.toContain('aprovação')
  expect(cardText?.toLowerCase()).not.toContain('vaga garantida')
  expect(cardText?.toLowerCase()).not.toContain('fracasso')
  expect(cardText?.toLowerCase()).not.toContain('péssimo')
})
