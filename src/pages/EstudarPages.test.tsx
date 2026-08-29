import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { EstudarIndexPage, EstudarSubjectPage } from './EstudarPages'

describe('EstudarIndexPage', () => {
  it('mostra links para Matemática e Português', () => {
    render(
      <MemoryRouter>
        <EstudarIndexPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
  })

  it('link de Matemática aponta para /estudar/matematica', () => {
    render(
      <MemoryRouter>
        <EstudarIndexPage />
      </MemoryRouter>,
    )
    const matLink = screen.getByText('Matemática').closest('a')
    expect(matLink?.getAttribute('href')).toBe('/estudar/matematica')
  })

  it('link de Português aponta para /estudar/portugues', () => {
    render(
      <MemoryRouter>
        <EstudarIndexPage />
      </MemoryRouter>,
    )
    const portLink = screen.getByText('Português').closest('a')
    expect(portLink?.getAttribute('href')).toBe('/estudar/portugues')
  })
})

describe('EstudarSubjectPage', () => {
  it('mostra tópicos de Matemática', () => {
    render(
      <MemoryRouter initialEntries={['/estudar/matematica']}>
        <EstudarSubjectPage />
      </MemoryRouter>,
    )
    // Verifica que há links para tópicos
    const topicLinks = screen.getAllByRole('link')
    expect(topicLinks.length).toBeGreaterThan(0)
  })

  it('mostra erro para disciplina inválida', () => {
    render(
      <MemoryRouter initialEntries={['/estudar/historia']}>
        <EstudarSubjectPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Disciplina inválida.')).toBeInTheDocument()
  })
})
