import { describe, it, expect } from 'vitest'
import { generateOfficialSimulado, pickByTopic, pickRandom, shuffle } from './exam-generator'
import { examRules } from '../data/edital-2026'

describe('exam-generator — geração de simulado', () => {
  it('shuffle é determinístico com mesma seed', () => {
    const a = shuffle([1, 2, 3, 4, 5], 42)
    const b = shuffle([1, 2, 3, 4, 5], 42)
    expect(a).toEqual(b)
    // não perde elementos
    expect(a.sort()).toEqual([1, 2, 3, 4, 5])
  })
  it('generateOfficialSimulado tem 20+20 questões', () => {
    const paper = generateOfficialSimulado(12345)
    expect(paper.math.length).toBe(examRules.mathQuestions)
    expect(paper.portuguese.length).toBe(examRules.portugueseQuestions)
    expect(paper.questions.length).toBe(examRules.mathQuestions + examRules.portugueseQuestions)
    // ids únicos
    const ids = new Set(paper.questions.map((q) => q.id))
    expect(ids.size).toBe(paper.questions.length)
  })
  it('pickByTopic cobre múltiplos tópicos', () => {
    const math = pickByTopic('matematica', examRules.mathQuestions, 99)
    const topics = new Set(math.map((q) => q.topic))
    // com 20 questões e ~29 tópicos, deve cobrir pelo menos 15 tópicos distintos
    expect(topics.size).toBeGreaterThanOrEqual(15)
  })
  it('pickRandom respeita o limite', () => {
    expect(pickRandom('matematica', 5, 7).length).toBe(5)
    expect(pickRandom('portugues', 10, 7).length).toBe(10)
  })
})
