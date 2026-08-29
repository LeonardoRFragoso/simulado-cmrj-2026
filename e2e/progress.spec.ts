import { test, expect } from '@playwright/test'

test('navega dashboard, analytics e domínio sem crashar', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

  await page.goto('/analytics')
  await expect(page.getByRole('heading', { name: 'Analytics Pedagógicos' })).toBeVisible()

  await page.goto('/dominio')
  await expect(page.getByRole('heading', { name: 'Domínio por Assunto' })).toBeVisible()
})

test('plano de estudos e meta diária carregam', async ({ page }) => {
  await page.goto('/plano-de-estudos')
  await expect(page.getByRole('heading', { name: /Plano de Estudos/i })).toBeVisible()

  await page.goto('/meta-diaria')
  await expect(page.getByRole('heading', { name: /Meta Diária/i })).toBeVisible()
})
