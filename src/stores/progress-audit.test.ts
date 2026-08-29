import { describe, it, expect, beforeEach } from 'vitest'
import {
  progressStore,
  recordAnswer,
  dueReviews,
  errorBookEntries,
  buildDailyReview,
} from './progress'
import { PROGRESS_SCHEMA_VERSION } from '../types/progress'

beforeEach(() => {
  progressStore.reset()
})

const V1_FIXTURE = {
  schemaVersion: 1,
  nickname: 'Aluno Teste',
  answers: [
    {
      questionId: 'mat-sni-001',
      selected: 'C',
      correct: true,
      subject: 'matematica',
      topic: 'Sistema de numeração indo-arábico',
      difficulty: 'facil',
      context: 'treino-rapido',
      answeredAt: '2026-08-01T10:00:00.000Z',
      timeSpentSeconds: 45,
    },
    {
      questionId: 'port-t1-001',
      selected: 'B',
      correct: false,
      subject: 'portugues',
      topic: 'Informações explícitas',
      difficulty: 'facil',
      context: 'treino-rapido',
      answeredAt: '2026-08-01T10:05:00.000Z',
      timeSpentSeconds: 60,
    },
  ],
  simulados: [],
  essays: [],
  favorites: ['mat-sni-001'],
  mastery: {
    'mat-sni-001': {
      questionId: 'mat-sni-001',
      consecutiveErrors: 0,
      consecutiveCorrect: 1,
      mastered: false,
      lastSeenAt: '2026-08-01T10:00:00.000Z',
    },
    'port-t1-001': {
      questionId: 'port-t1-001',
      consecutiveErrors: 1,
      consecutiveCorrect: 0,
      mastered: false,
      lastSeenAt: '2026-08-01T10:05:00.000Z',
    },
  },
  studyDays: ['2026-08-01'],
  settings: { theme: 'escuro', feedbackMode: 'imediato', reducedMotion: false },
  totalStudySeconds: 105,
}

describe('migração v1 → v2', () => {
  it('preserva answers, simulados, essays, favorites, studyDays, nickname, settings e tempo estudado', () => {
    const res = progressStore.importJSON(JSON.stringify(V1_FIXTURE))
    expect(res.ok).toBe(true)
    const s = progressStore.get()
    expect(s.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION)
    expect(s.nickname).toBe('Aluno Teste')
    expect(s.answers).toHaveLength(2)
    expect(s.favorites).toContain('mat-sni-001')
    expect(s.studyDays).toContain('2026-08-01')
    expect(s.settings.theme).toBe('escuro')
    expect(s.totalStudySeconds).toBe(105)
  })

  it('cria ReviewSchedule a partir de mastery legado', () => {
    const res = progressStore.importJSON(JSON.stringify(V1_FIXTURE))
    expect(res.ok).toBe(true)
    const s = progressStore.get()
    expect(s.reviews['port-t1-001']).toBeDefined()
    expect(s.reviews['port-t1-001']!.status).toBe('revisar')
    expect(s.reviews['port-t1-001']!.totalErrors).toBe(1)
    expect(s.reviews['mat-sni-001']!).toBeDefined()
  })
})

describe('backup / import / restore', () => {
  it('exportar, resetar e importar restaura tudo', () => {
    recordAnswer({
      questionId: 'mat-sni-001',
      selected: 'C',
      correct: true,
      subject: 'matematica',
      topic: 'Sistema de numeração indo-arábico',
      difficulty: 'facil',
      context: 'treino-rapido',
      timeSpentSeconds: 45,
    })
    const json = progressStore.exportJSON()
    progressStore.reset()
    expect(progressStore.get().answers.length).toBe(0)
    const res = progressStore.importJSON(json)
    expect(res.ok).toBe(true)
    expect(progressStore.get().answers.length).toBe(1)
    expect(progressStore.get().totalStudySeconds).toBe(45)
  })

  it('rejeita JSON inválido e não crasha', () => {
    expect(progressStore.importJSON('não-json{').ok).toBe(false)
    expect(progressStore.importJSON('123').ok).toBe(false)
    expect(progressStore.importJSON('null').ok).toBe(false)
  })

  it('aceita backup parcial e preenche defaults', () => {
    const res = progressStore.importJSON(JSON.stringify({ nickname: 'Parcial', answers: [] }))
    expect(res.ok).toBe(true)
    const s = progressStore.get()
    expect(s.nickname).toBe('Parcial')
    expect(s.answers).toEqual([])
    expect(s.favorites).toEqual([])
    expect(s.totalStudySeconds).toBe(0)
  })
})

describe('repetição espaçada — intervalos exatos', () => {
  it('erro → revisão imediata (nextReviewAt = answeredAt, intervalDays = 0)', () => {
    recordAnswer({
      questionId: 'q1',
      selected: 'A',
      correct: false,
      subject: 'matematica',
      topic: 'Adição',
      difficulty: 'facil',
      context: 'treino-rapido',
    })
    const r = progressStore.get().reviews['q1']
    expect(r!.intervalDays).toBe(0)
    expect(r!.status).toBe('revisar')
    expect(r!.nextReviewAt).toBe(r!.lastReviewedAt)
  })

  it('1º, 2º, 3º, 4º, 5º acertos consecutivos geram +1, +3, +7, +14, +30 dias', () => {
    const intervals: number[] = []
    for (let i = 0; i < 5; i++) {
      recordAnswer({
        questionId: 'q-spaced',
        selected: 'B',
        correct: true,
        subject: 'matematica',
        topic: 'Adição',
        difficulty: 'facil',
        context: 'treino-rapido',
      })
      intervals.push(progressStore.get().reviews['q-spaced']!.intervalDays)
    }
    expect(intervals).toEqual([1, 3, 7, 14, 30])
  })

  it('6º acerto permanece em +30 dias e dominado', () => {
    for (let i = 0; i < 5; i++) {
      recordAnswer({
        questionId: 'q-spaced2',
        selected: 'B',
        correct: true,
        subject: 'matematica',
        topic: 'Adição',
        difficulty: 'facil',
        context: 'treino-rapido',
      })
    }
    recordAnswer({
      questionId: 'q-spaced2',
      selected: 'B',
      correct: true,
      subject: 'matematica',
      topic: 'Adição',
      difficulty: 'facil',
      context: 'treino-rapido',
    })
    const r = progressStore.get().reviews['q-spaced2']
    expect(r!.intervalDays).toBe(30)
    expect(r!.mastered).toBe(true)
    expect(r!.status).toBe('dominado')
  })

  it('erro após acerto zera nível (reinicia sequência)', () => {
    recordAnswer({ questionId: 'q-spaced3', selected: 'B', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    recordAnswer({ questionId: 'q-spaced3', selected: 'B', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    recordAnswer({ questionId: 'q-spaced3', selected: 'B', correct: false, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    const r = progressStore.get().reviews['q-spaced3']
    expect(r!.intervalDays).toBe(0)
    expect(r!.consecutiveCorrect).toBe(0)
    expect(r!.status).toBe('revisar')
  })
})

describe('caderno de erros e fluxo erro → aprendizado', () => {
  it('primeiro erro cria entrada no caderno com status revisar', () => {
    recordAnswer({
      questionId: 'q-caderno',
      selected: 'A',
      correct: false,
      subject: 'matematica',
      topic: 'Adição',
      difficulty: 'facil',
      context: 'treino-rapido',
    })
    const entries = errorBookEntries()
    expect(entries.length).toBe(1)
    expect(entries[0]!.errorCount).toBe(1)
    expect(entries[0]!.status).toBe('revisar')
  })

  it('acerto após erro sobe o nível e mantém histórico de erros', () => {
    recordAnswer({ questionId: 'q-caderno2', selected: 'A', correct: false, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    recordAnswer({ questionId: 'q-caderno2', selected: 'B', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    const entries = errorBookEntries()
    expect(entries.length).toBe(1)
    expect(entries[0]!.correctAfterError).toBe(1)
    expect(entries[0]!.status).toBe('novo')
    expect(entries[0]!.errorCount).toBe(1)
    // 2 acertos consecutivos depois do erro => em-aprendizado
    recordAnswer({ questionId: 'q-caderno2', selected: 'B', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    const entries2 = errorBookEntries()
    expect(entries2[0]!.status).toBe('em-aprendizado')
  })
})

describe('tempo de estudo por questão', () => {
  it('recordAnswer acumula timeSpentSeconds em totalStudySeconds', () => {
    recordAnswer({
      questionId: 'q-time',
      selected: 'A',
      correct: true,
      subject: 'matematica',
      topic: 'Adição',
      difficulty: 'facil',
      context: 'treino-rapido',
      timeSpentSeconds: 90,
    })
    recordAnswer({
      questionId: 'q-time2',
      selected: 'A',
      correct: true,
      subject: 'portugues',
      topic: 'Ortografia',
      difficulty: 'facil',
      context: 'treino-rapido',
      timeSpentSeconds: 30,
    })
    expect(progressStore.get().totalStudySeconds).toBe(120)
  })
})

describe('revisão do dia — composição', () => {
  it('prioriza vencidas, depois erros, depois novas, sem duplicatas', () => {
    recordAnswer({ questionId: 'q-due', selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    progressStore.set((s) => ({
      ...s,
      reviews: {
        ...s.reviews,
        'q-due': { ...s.reviews['q-due']!, nextReviewAt: '2020-01-01T00:00:00.000Z' },
      },
    }))
    recordAnswer({ questionId: 'q-wrong', selected: 'A', correct: false, subject: 'portugues', topic: 'Ortografia', difficulty: 'facil', context: 'treino-rapido' })

    const review = buildDailyReview(10)
    expect(review.dueReviewIds).toContain('q-due')
    // Erro é revisão imediata, então q-wrong também fica na fila vencida
    expect(review.dueReviewIds).toContain('q-wrong')
    const all = [...review.dueReviewIds, ...review.wrongIds, ...review.newIds]
    expect(new Set(all).size).toBe(all.length)
  })

  it('dueReviews retorna questões com nextReviewAt no passado', () => {
    recordAnswer({ questionId: 'q-due2', selected: 'A', correct: true, subject: 'matematica', topic: 'Adição', difficulty: 'facil', context: 'treino-rapido' })
    progressStore.set((s) => ({
      ...s,
      reviews: {
        ...s.reviews,
        'q-due2': { ...s.reviews['q-due2']!, nextReviewAt: '2020-01-01T00:00:00.000Z' },
      },
    }))
    expect(dueReviews().length).toBe(1)
    expect(dueReviews()[0]!.questionId).toBe('q-due2')
  })
})
