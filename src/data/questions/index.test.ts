import { describe, it, expect } from 'vitest'
import {
  allQuestions,
  coverageReport,
  questionsBySubject,
  validateQuestions,
} from './index'
import { mathTopics, portugueseTopics } from '../edital-2026'

describe('Banco de questões — integridade', () => {
  it('todas as questões são válidas (ids únicos, 5 alternativas, resposta correta)', () => {
    const v = validateQuestions()
    expect(v.errors).toEqual([])
    expect(v.ok).toBe(true)
  })

  it('tem pelo menos 200 questões de Matemática', () => {
    expect(questionsBySubject('matematica').length).toBeGreaterThanOrEqual(200)
  })

  it('tem pelo menos 200 questões de Português', () => {
    expect(questionsBySubject('portugues').length).toBeGreaterThanOrEqual(200)
  })

  it('tem pelo menos 400 questões no total', () => {
    expect(allQuestions.length).toBeGreaterThanOrEqual(400)
  })
})

describe('Banco de questões — cobertura do edital', () => {
  it('cobre todos os tópicos de Matemática previstos no edital', () => {
    const coverage = coverageReport().filter((r) => r.subject === 'matematica')
    const covered = new Set(coverage.map((r) => r.topic))
    const missing = mathTopics.filter((t) => !covered.has(t.topic))
    expect(missing, `Tópicos sem cobertura: ${missing.map((t) => t.topic).join(', ')}`).toEqual([])
  })

  it('cobre todos os tópicos de Português previstos no edital', () => {
    const coverage = coverageReport().filter((r) => r.subject === 'portugues')
    const covered = new Set(coverage.map((r) => r.topic))
    const missing = portugueseTopics.filter((t) => !covered.has(t.topic))
    expect(missing, `Tópicos sem cobertura: ${missing.map((t) => t.topic).join(', ')}`).toEqual([])
  })

  it('cada tópico de Matemática tem pelo menos 3 questões', () => {
    const coverage = coverageReport().filter((r) => r.subject === 'matematica')
    const thin = coverage.filter((r) => r.total < 3)
    expect(thin, `Tópicos com <3 questões: ${thin.map((r) => r.topic).join(', ')}`).toEqual([])
  })

  it('cada tópico de Português tem pelo menos 2 questões', () => {
    const coverage = coverageReport().filter((r) => r.subject === 'portugues')
    const thin = coverage.filter((r) => r.total < 2)
    expect(thin, `Tópicos com <2 questões: ${thin.map((r) => r.topic).join(', ')}`).toEqual([])
  })
})
