import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuestionCard } from './QuestionCard'
import type { Question } from '../types/exam'

const baseQuestion: Question = {
  id: 'test-1',
  subject: 'matematica',
  topic: 'Porcentagem',
  statement: 'Quanto é 20% de 125?',
  options: [
    { id: 'A', text: '20' },
    { id: 'B', text: '25' },
    { id: 'C', text: '30' },
    { id: 'D', text: '35' },
    { id: 'E', text: '40' },
  ],
  correctOption: 'B',
  explanation: '20% de 125 = 25.',
  explanationData: {
    short: '20% de 125 é 25, pois 125 × 0,20 = 25.',
    steps: ['Transforme 20% em 0,20.', 'Multiplique 125 por 0,20.', 'O resultado é 25.'],
    tip: 'Também é possível calcular 10% e dobrar.',
    hints: ['Pense no que significa porcentagem.', 'Transforme 20% em número decimal.'],
  },
  difficulty: 'media',
  tags: ['porcentagem'],
  sourceLabel: 'Autoral',
  sourceType: 'original',
}

function renderCard(overrides: Partial<Parameters<typeof QuestionCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <QuestionCard question={baseQuestion} onSelect={() => {}} {...overrides} />
    </MemoryRouter>,
  )
}

describe('QuestionCard — ciclo erro→aprendizado', () => {
  it('mostra "Estudar agora" após erro em modo estudo', () => {
    renderCard({ selected: 'A', showResult: true, studyMode: true })
    expect(screen.getByText('Estudar agora')).toBeInTheDocument()
  })

  it('mostra "Revisar depois" após erro em modo estudo', () => {
    renderCard({ selected: 'A', showResult: true, studyMode: true })
    expect(screen.getByText('Revisar depois')).toBeInTheDocument()
  })

  it('não mostra "Estudar agora" após acerto', () => {
    renderCard({ selected: 'B', showResult: true, studyMode: true })
    expect(screen.queryByText('Estudar agora')).toBeNull()
  })

  it('não mostra "Estudar agora" no simulado oficial (sem studyMode)', () => {
    renderCard({ selected: 'A', showResult: true, studyMode: false })
    expect(screen.queryByText('Estudar agora')).toBeNull()
    expect(screen.queryByText('Revisar depois')).toBeNull()
  })

  it('chama onReviewLater ao clicar "Revisar depois"', () => {
    const onReviewLater = vi.fn()
    renderCard({ selected: 'A', showResult: true, studyMode: true, onReviewLater })
    fireEvent.click(screen.getByText('Revisar depois'))
    expect(onReviewLater).toHaveBeenCalledOnce()
  })

  it('link "Estudar agora" aponta para mini-aula do tópico', () => {
    renderCard({ selected: 'A', showResult: true, studyMode: true })
    const link = screen.getByText('Estudar agora').closest('a')
    expect(link).toBeTruthy()
    expect(link!.getAttribute('href')).toContain('/estudar/matematica/')
    expect(link!.getAttribute('href')).toContain(encodeURIComponent('Porcentagem'))
  })
})
