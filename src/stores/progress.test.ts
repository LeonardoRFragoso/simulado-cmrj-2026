import { describe, it, expect, beforeEach } from 'vitest'
import {
  progressStore,
  recordAnswer,
  toggleFavorite,
  subjectStats,
  currentStreak,
  wrongQuestions,
  topicsToReview,
} from './progress'
import { PROGRESS_SCHEMA_VERSION } from '../types/progress'

beforeEach(() => {
  progressStore.reset()
})

describe('progressStore — persistência e domínio', () => {
  it('inicia com estado vazio e schema versionado', () => {
    const s = progressStore.get()
    expect(s.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION)
    expect(s.answers).toEqual([])
    expect(s.favorites).toEqual([])
  })
  it('recordAnswer registra resposta, atualiza mastery e studyDays', () => {
    recordAnswer({
      questionId: 'q1',
      selected: 'A',
      correct: true,
      subject: 'matematica',
      topic: 'Adição',
      difficulty: 'facil',
      context: 'treino-rapido',
    })
    const s = progressStore.get()
    expect(s.answers).toHaveLength(1)
    expect(s.studyDays.length).toBe(1)
    expect(s.mastery['q1'].consecutiveCorrect).toBe(1)
    expect(s.mastery['q1'].mastered).toBe(false) // precisa de 2 acertos
  })
  it('questão é dominada após 2 acertos consecutivos', () => {
    recordAnswer({ questionId: 'q2', selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    recordAnswer({ questionId: 'q2', selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    expect(progressStore.get().mastery['q2'].mastered).toBe(true)
  })
  it('toggleFavorite adiciona e remove', () => {
    toggleFavorite('q3')
    expect(progressStore.get().favorites).toContain('q3')
    toggleFavorite('q3')
    expect(progressStore.get().favorites).not.toContain('q3')
  })
  it('subjectStats agrega por disciplina e tópico', () => {
    recordAnswer({ questionId: 'q1', selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    recordAnswer({ questionId: 'q2', selected: 'B', correct: false, subject: 'matematica', topic: 'Frações', difficulty: 'media', context: 'treino-rapido' })
    const st = subjectStats('matematica')
    expect(st.answered).toBe(2)
    expect(st.correct).toBe(1)
    expect(st.byTopic['Adição'].correct).toBe(1)
  })
  it('wrongQuestions lista erros não dominados', () => {
    recordAnswer({ questionId: 'q1', selected: 'B', correct: false, subject: 'portugues', topic: 'Ortografia', difficulty: 'media', context: 'treino-rapido' })
    expect(wrongQuestions().length).toBe(1)
    // dominada após 2 acertos -> sai da lista
    recordAnswer({ questionId: 'q1', selected: 'A', correct: true, subject: 'portugues', topic: 'Ortografia', difficulty: 'media', context: 'treino-rapido' })
    recordAnswer({ questionId: 'q1', selected: 'A', correct: true, subject: 'portugues', topic: 'Ortografia', difficulty: 'media', context: 'treino-rapido' })
    expect(wrongQuestions().length).toBe(0)
  })
  it('questão anulada não conta como erro nem em wrongQuestions', () => {
    recordAnswer({ questionId: 'past-2025-6', selected: 'A', correct: false, subject: 'matematica', topic: 'Questão anulada', difficulty: 'media', context: 'prova-anterior', annulled: true })
    expect(subjectStats('matematica').answered).toBe(0)
    expect(wrongQuestions().length).toBe(0)
  })
  it('currentStreak conta dias consecutivos', () => {
    // simula 3 dias consecutivos incluindo hoje
    const today = new Date()
    const days = [0, 1, 2].map((d) => {
      const dt = new Date(today)
      dt.setDate(dt.getDate() - d)
      return dt.toISOString().slice(0, 10)
    })
    progressStore.set((s) => ({ ...s, studyDays: days }))
    expect(currentStreak()).toBe(3)
  })
  it('topicsToReview sugere assuntos com menor acerto', () => {
    for (let i = 0; i < 5; i++) {
      recordAnswer({ questionId: `qA${i}`, selected: 'A', correct: false, subject: 'matematica', topic: 'Frações', difficulty: 'media', context: 'treino-rapido' })
    }
    for (let i = 0; i < 5; i++) {
      recordAnswer({ questionId: `qB${i}`, selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    }
    const review = topicsToReview(5)
    expect(review[0].topic).toBe('Frações')
    expect(review[0].accuracy).toBe(0)
  })
  it('export/import JSON preserva progresso', () => {
    recordAnswer({ questionId: 'q1', selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    toggleFavorite('q1')
    const json = progressStore.exportJSON()
    progressStore.reset()
    expect(progressStore.get().answers).toHaveLength(0)
    const res = progressStore.importJSON(json)
    expect(res.ok).toBe(true)
    expect(progressStore.get().answers).toHaveLength(1)
    expect(progressStore.get().favorites).toContain('q1')
  })
  it('importJSON rejeita JSON inválido', () => {
    const res = progressStore.importJSON('not-json{')
    expect(res.ok).toBe(false)
  })
})
