import { test, expect } from '@playwright/test'

test('redação: planejamento, texto e reload persistem', async ({ page }) => {
  await page.goto('/redacao')

  // Seleciona a primeira proposta
  await page.locator('.proposal-list li button').first().click()

  // Preenche planejamento
  await page.locator('#plan-mainCharacter').fill('João')
  await page.locator('#plan-setting').fill('uma praça no centro')

  // Preenche título e texto
  await page.locator('#essay-title').fill('A Aventura de João')
  await page.locator('#essay-text').fill('João estava na praça quando encontrou um gato.')

  // Salva
  await page.getByRole('button', { name: /Salvar/i }).click()

  // Recarrega, reseleciona a proposta e verifica persistência do título e texto
  await page.reload()
  await page.locator('.proposal-list li button').first().click()
  await page.waitForSelector('#essay-title')
  await expect(page.locator('#essay-title')).toHaveValue('A Aventura de João')
  await expect(page.locator('#essay-text')).toHaveValue('João estava na praça quando encontrou um gato.')
})
