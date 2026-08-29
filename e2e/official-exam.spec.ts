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

test('posição atual e contadores permanecem sincronizados após navegação e reload', async ({ page }) => {
  await page.goto('/simulado')
  await page.getByRole('button', { name: /Iniciar simulado oficial/i }).click()
  await page.waitForURL(/\/simulado\/prova$/)

  // Responde as cinco primeiras questões e chega à questão 6.
  for (let i = 0; i < 5; i++) {
    await page.locator('.options button.option').first().click()
    await page.getByRole('button', { name: 'Próxima' }).click()
  }

  await expect(page.locator('.sim-progress')).toHaveText('5/40 respondidas')
  await expect(page.locator('.question-card .counter')).toHaveText('Questão 6 de 40')
  await expect(page.locator('.question-nav span')).toHaveText('Questão 6 de 40')

  // A posição atual deve sobreviver ao reload junto com respostas e cronômetro.
  await page.reload()
  await expect(page.locator('.sim-progress')).toHaveText('5/40 respondidas')
  await expect(page.locator('.question-card .counter')).toHaveText('Questão 6 de 40')
  await expect(page.locator('.question-nav span')).toHaveText('Questão 6 de 40')

  // Navegação pela grade também deve atualizar a mesma fonte de verdade.
  await page.getByRole('button', { name: 'Grade' }).click()
  await page.locator('.grade-cells button').nth(39).click()
  await expect(page.locator('.question-card .counter')).toHaveText('Questão 40 de 40')
  await expect(page.locator('.question-nav span')).toHaveText('Questão 40 de 40')
})
