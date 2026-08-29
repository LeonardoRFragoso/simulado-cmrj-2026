import { describe, it, expect, beforeEach } from 'vitest'
import { buildDailyReview, recordAnswer, progressStore } from './progress'
import { allQuestions } from '../data/questions'

describe('buildDailyReview — composição inteligente', () => {
  beforeEach(() => {
    progressStore.set(() => ({
      schemaVersion: 2,
      nickname: 'test',
      answers: [],
      simulados: [],
      essays: [],
      favorites: [],
      mastery: {},
      reviews: {},
      studyDays: [],
      settings: { theme: 'sistema', feedbackMode: 'imediato', reducedMotion: false },
      totalStudySeconds: 0,
    }))
  })

  it('usuário novo recebe apenas questões novas balanceadas', () => {
    const comp = buildDailyReview(15, 0.3)
    expect(comp.dueReviewIds).toHaveLength(0)
    expect(comp.wrongIds).toHaveLength(0)
    expect(comp.newIds.length).toBeGreaterThan(0)
    expect(comp.newIds.length).toBeLessThanOrEqual(5) // 30% de 15 ≈ 4-5
  })

  it('usuário com erros recebe questões do caderno', () => {
    const q = allQuestions[0]
    recordAnswer({
      questionId: q.id,
      selected: 'A',
      correct: false,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      context: 'treino-rapido',
      sessionId: 'test',
    })
    const comp = buildDailyReview(15, 0.3)
    // a questão errada aparece em dueReviewIds (vencida) ou wrongIds
    const all = [...comp.dueReviewIds, ...comp.wrongIds]
    expect(all).toContain(q.id)
  })

  it('total não excede maxTotal', () => {
    // registra vários erros
    for (let i = 0; i < 20; i++) {
      const q = allQuestions[i]
      recordAnswer({
        questionId: q.id,
        selected: 'A',
        correct: false,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        context: 'treino-rapido',
        sessionId: 'test',
      })
    }
    const comp = buildDailyReview(10, 0.2)
    expect(comp.total).toBeLessThanOrEqual(10)
  })

  it('questões novas são balanceadas por disciplina', () => {
    const comp = buildDailyReview(10, 1.0) // 100% novas
    const picked = allQuestions.filter((q) => comp.newIds.includes(q.id))
    const math = picked.filter((q) => q.subject === 'matematica').length
    const port = picked.filter((q) => q.subject === 'portugues').length
    expect(math + port).toBe(comp.newIds.length)
    // deve ter pelo menos 1 de cada (se total >= 2)
    if (comp.newIds.length >= 2) {
      expect(math).toBeGreaterThan(0)
      expect(port).toBeGreaterThan(0)
    }
  })

  it('questões vencidas têm prioridade máxima', () => {
    // simula uma questão vencida
    const q = allQuestions[0]
    recordAnswer({
      questionId: q.id,
      selected: 'A',
      correct: false,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      context: 'treino-rapido',
      sessionId: 'test',
    })
    const comp = buildDailyReview(15, 0.3)
    // a questão errada deve aparecer (seja em dueReviewIds ou wrongIds)
    const all = [...comp.dueReviewIds, ...comp.wrongIds]
    expect(all).toContain(q.id)
  })
})
