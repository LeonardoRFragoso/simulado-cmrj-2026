import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuestionCard } from './QuestionCard'
import type { Question } from '../types/exam'

const baseQuestion: Question = {
  id: 'test-001',
  subject: 'matematica',
  topic: 'Adição',
  subtopic: 'Soma simples',
  statement: 'Quanto é 3 + 5?',
  options: [
    { id: 'A', text: '7' },
    { id: 'B', text: '8' },
    { id: 'C', text: '9' },
    { id: 'D', text: '10' },
    { id: 'E', text: '6' },
  ],
  correctOption: 'B',
  explanation: '3 + 5 = 8.',
  explanationData: {
    short: '3 + 5 = 8.',
    concept: 'Adição junta quantidades.',
    steps: ['Some 3 + 5.', 'Resultado: 8.'],
    hints: ['Pense na soma.', 'Use os dedos se precisar.'],
  },
  difficulty: 'facil',
  tags: ['soma'],
  sourceLabel: 'Original',
  sourceType: 'original',
}

function renderCard(overrides: Partial<Parameters<typeof QuestionCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <QuestionCard
        question={baseQuestion}
        onSelect={() => {}}
        {...overrides}
      />
    </MemoryRouter>,
  )
}

describe('QuestionCard — UX pedagógica', () => {
  it('mostra explicação curta após resposta', () => {
    renderCard({ selected: 'B', showResult: true, studyMode: true })
    expect(screen.getByText(/3 \+ 5 = 8/i)).toBeInTheDocument()
  })

  it('mostra resposta correta quando o usuário erra', () => {
    renderCard({ selected: 'A', showResult: true, studyMode: true })
    expect(screen.getByText(/Resposta correta: B/i)).toBeInTheDocument()
  })

  it('não mostra "Revisar assunto" fora do modo de estudo', () => {
    renderCard({ selected: 'A', showResult: true })
    expect(screen.queryByText('Revisar assunto')).not.toBeInTheDocument()
  })

  it('mostra botão "Ver passo a passo" em modo de estudo após resposta', () => {
    renderCard({ selected: 'B', showResult: true, studyMode: true })
    expect(screen.getByText('Ver passo a passo')).toBeInTheDocument()
  })

  it('revela passo a passo ao clicar', () => {
    renderCard({ selected: 'B', showResult: true, studyMode: true })
    expect(screen.queryByText('Some 3 + 5.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Ver passo a passo'))
    expect(screen.getByText('Some 3 + 5.')).toBeInTheDocument()
    expect(screen.getByText('Resultado: 8.')).toBeInTheDocument()
  })

  it('não mostra dicas antes de responder', () => {
    renderCard({ studyMode: true })
    expect(screen.queryByText(/Pedir dica/i)).toBeInTheDocument() // botão aparece
    expect(screen.queryByText('Dica 1')).not.toBeInTheDocument() // mas conteúdo não
  })

  it('revela dica progressivamente ao clicar', () => {
    const onHintUsed = vi.fn()
    renderCard({ studyMode: true, onHintUsed })
    const btn = screen.getByText(/Pedir dica/i)
    fireEvent.click(btn)
    expect(screen.getByText('Dica 1')).toBeInTheDocument()
    expect(screen.getByText('Pense na soma.')).toBeInTheDocument()
    expect(onHintUsed).toHaveBeenCalledWith(1)
  })

  it('não mostra botão de dica fora do modo de estudo', () => {
    renderCard()
    expect(screen.queryByText(/Pedir dica/i)).not.toBeInTheDocument()
  })

  it('não mostra dica após resposta (showResult)', () => {
    renderCard({ studyMode: true, showResult: true, selected: 'B' })
    expect(screen.queryByText(/Pedir dica/i)).not.toBeInTheDocument()
  })

  it('não vaza explicação sem showResult (simulado)', () => {
    renderCard({ selected: 'A' })
    expect(screen.queryByText(/3 \+ 5 = 8/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Resposta correta/i)).not.toBeInTheDocument()
  })
})
