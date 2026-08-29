import { describe, it, expect } from 'vitest'
import { allQuestions } from './index'
import { getExplanation } from '../../types/exam'

describe('explicações estruturadas — qualidade pedagógica', () => {
  it('todas as questões têm explanationData com short não vazio', () => {
    for (const q of allQuestions) {
      const ed = getExplanation(q)
      expect(ed.short, `${q.id}: short vazio`).toBeTruthy()
      expect(ed.short.length, `${q.id}: short muito curto`).toBeGreaterThanOrEqual(10)
    }
  })

  it('questões de Matemática com cálculo têm steps >= 2', () => {
    const calcTopics = new Set([
      'Adição', 'Subtração', 'Multiplicação', 'Divisão', 'Expressões numéricas',
      'Operações com decimais', 'Operações com frações', 'Transformação de unidades',
      'Média aritmética', 'Perímetro e área', 'Porcentagem', 'MMC e MDC',
      'Volume de paralelepípedos', 'Frações equivalentes', 'Relação fração e decimal',
    ])
    const calcQuestions = allQuestions.filter(
      (q) => q.subject === 'matematica' && calcTopics.has(q.topic),
    )
    expect(calcQuestions.length, 'deve haver questões de cálculo').toBeGreaterThan(0)
    for (const q of calcQuestions) {
      const ed = getExplanation(q)
      expect(ed.steps, `${q.id} (${q.topic}): deve ter steps`).toBeDefined()
      expect(ed.steps!.length, `${q.id}: steps >= 2`).toBeGreaterThanOrEqual(2)
    }
  })

  it('questões de Português têm concept ou optionExplanations', () => {
    const portQuestions = allQuestions.filter((q) => q.subject === 'portugues')
    expect(portQuestions.length).toBeGreaterThan(0)
    for (const q of portQuestions) {
      const ed = getExplanation(q)
      const hasConcept = Boolean(ed.concept)
      const hasOptionExpl = Boolean(ed.optionExplanations && Object.keys(ed.optionExplanations).length > 0)
      expect(
        hasConcept || hasOptionExpl,
        `${q.id} (${q.topic}): deve ter concept ou optionExplanations`,
      ).toBe(true)
    }
  })

  it('nenhuma explicação diz apenas "porque é a resposta correta"', () => {
    const bad = ['porque é a resposta correta', 'porque essa é a resposta', 'a resposta correta é']
    for (const q of allQuestions) {
      const ed = getExplanation(q)
      const lower = ed.short.toLowerCase()
      for (const b of bad) {
        expect(lower, `${q.id}: explicação vazia`).not.toBe(b.toLowerCase())
      }
    }
  })

  it('todas as questões têm hints progressivas (>= 2)', () => {
    for (const q of allQuestions) {
      const ed = getExplanation(q)
      expect(ed.hints, `${q.id}: deve ter hints`).toBeDefined()
      expect(ed.hints!.length, `${q.id}: pelo menos 2 hints`).toBeGreaterThanOrEqual(2)
    }
  })
})
