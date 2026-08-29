import { test, expect } from '@playwright/test'

test('homepage carrega e mostra regras principais', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Simulado CMRJ 2026/2027' })).toBeVisible()
  await expect(page.getByText('CMRJ • 6º ano • ingresso 2027')).toBeVisible()
  await expect(page.locator('.rules-grid')).toBeVisible()
  await expect(page.locator('.rules-grid').getByText('20')).toHaveCount(2)
  await expect(page.locator('.rules-grid').getByText('270 min')).toBeVisible()
})

test('navegação para modos de estudo', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Treino Rápido/i }).click()
  await expect(page).toHaveURL(/\/treino\/rapido$/)
  await expect(page.getByText(/escolha a disciplina/i)).toBeVisible()
})
