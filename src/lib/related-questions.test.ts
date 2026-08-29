import { describe, it, expect } from 'vitest'
import { getRelatedQuestions } from './exam-generator'
import { allQuestions } from '../data/questions'

describe('getRelatedQuestions', () => {
  it('retorna questões relacionadas (mesmo tópico tem prioridade)', () => {
    const q = allQuestions[0]
    const related = getRelatedQuestions(q.id, 5)
    expect(related.length).toBeGreaterThan(0)
    expect(related.length).toBeLessThanOrEqual(5)
    // não inclui a própria questão
    expect(related.find((r) => r.id === q.id)).toBeUndefined()
  })

  it('todas as relacionadas são da mesma disciplina', () => {
    const q = allQuestions[0]
    const related = getRelatedQuestions(q.id, 5)
    for (const r of related) {
      expect(r.subject).toBe(q.subject)
    }
  })

  it('retorna vazio para ID inexistente', () => {
    expect(getRelatedQuestions('inexistente', 5)).toHaveLength(0)
  })

  it('respeita o count solicitado', () => {
    const q = allQuestions.find((x) => x.subject === 'matematica')!
    const related = getRelatedQuestions(q.id, 3)
    expect(related.length).toBeLessThanOrEqual(3)
  })

  it('questões do mesmo tópico aparecem primeiro', () => {
    const q = allQuestions.find((x) => x.subject === 'matematica' && x.topic === 'Adição')!
    const related = getRelatedQuestions(q.id, 10)
    if (related.length > 1) {
      const sameTopic = related.filter((r) => r.topic === q.topic)
      // se há questões do mesmo tópico, elas devem estar no topo
      if (sameTopic.length > 0) {
        expect(related[0].topic).toBe(q.topic)
      }
    }
  })
})
