import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuestionCard } from './QuestionCard'
import type { Question } from '../types/exam'

const q: Question = {
  id: 'sim-test-001',
  subject: 'matematica',
  topic: 'Adição',
  statement: 'Quanto é 2 + 2?',
  options: [
    { id: 'A', text: '3' },
    { id: 'B', text: '4' },
    { id: 'C', text: '5' },
    { id: 'D', text: '6' },
    { id: 'E', text: '7' },
  ],
  correctOption: 'B',
  explanation: '2 + 2 = 4.',
  explanationData: {
    short: '2 + 2 = 4.',
    steps: ['Some 2 + 2.', 'Resultado: 4.'],
    hints: ['Pense na soma.'],
  },
  difficulty: 'facil',
  tags: ['soma'],
  sourceLabel: 'Original',
  sourceType: 'original',
}

function renderWith(props: Partial<Parameters<typeof QuestionCard>[0]>) {
  return render(
    <MemoryRouter>
      <QuestionCard question={q} onSelect={() => {}} {...props} />
    </MemoryRouter>,
  )
}

describe('P0.9 — Simulado Oficial não vaza respostas', () => {
  it('sem showResult: não mostra explicação', () => {
    renderWith({ selected: 'A' })
    expect(screen.queryByText(/2 \+ 2 = 4/i)).not.toBeInTheDocument()
  })

  it('sem showResult: não mostra "Resposta correta"', () => {
    renderWith({ selected: 'A' })
    expect(screen.queryByText(/Resposta correta/i)).not.toBeInTheDocument()
  })

  it('sem showResult: não marca alternativa correta', () => {
    const { container } = renderWith({ selected: 'A' })
    const correctBtn = container.querySelector('.option.correct')
    expect(correctBtn).toBeNull()
  })

  it('sem studyMode: não mostra botão de dica', () => {
    renderWith({})
    expect(screen.queryByText(/Pedir dica/i)).not.toBeInTheDocument()
  })

  it('sem studyMode: não mostra "Revisar assunto"', () => {
    renderWith({ showResult: true, selected: 'A' })
    expect(screen.queryByText('Revisar assunto')).not.toBeInTheDocument()
  })

  it('sem studyMode: não mostra "Ver passo a passo"', () => {
    renderWith({ showResult: true, selected: 'A' })
    expect(screen.queryByText('Ver passo a passo')).not.toBeInTheDocument()
  })

  it('com showResult mas sem studyMode (resultado do simulado): mostra explicação mas sem ações de estudo', () => {
    renderWith({ showResult: true, selected: 'A' })
    // explicação aparece
    expect(screen.getByText(/2 \+ 2 = 4/i)).toBeInTheDocument()
    // mas ações de estudo não
    expect(screen.queryByText('Revisar assunto')).not.toBeInTheDocument()
    expect(screen.queryByText('Ver passo a passo')).not.toBeInTheDocument()
  })
})
