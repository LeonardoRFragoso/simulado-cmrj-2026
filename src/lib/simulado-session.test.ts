import { describe, expect, it } from 'vitest'
import { accumulateQuestionTime, normalizeQuestionIndex } from './simulado-session'

describe('normalizeQuestionIndex', () => {
  it('migra estado antigo sem índice para a primeira questão', () => {
    expect(normalizeQuestionIndex(undefined, 40)).toBe(0)
  })

  it('preserva um índice válido', () => {
    expect(normalizeQuestionIndex(5, 40)).toBe(5)
  })

  it('normaliza índice negativo para zero', () => {
    expect(normalizeQuestionIndex(-3, 40)).toBe(0)
  })

  it('limita índice acima da quantidade para a última questão', () => {
    expect(normalizeQuestionIndex(99, 40)).toBe(39)
  })

  it('normaliza valores inválidos', () => {
    expect(normalizeQuestionIndex(Number.NaN, 40)).toBe(0)
    expect(normalizeQuestionIndex('5', 40)).toBe(0)
    expect(normalizeQuestionIndex(5, 0)).toBe(0)
  })
})

describe('accumulateQuestionTime', () => {
  it('acumula tempo da mesma questão sem mutar o estado anterior', () => {
    const original = { q1: 4 }
    const next = accumulateQuestionTime(original, 'q1', 3.2)

    expect(next).toEqual({ q1: 7 })
    expect(original).toEqual({ q1: 4 })
  })

  it('ignora navegação com menos de um segundo', () => {
    const original = { q1: 4 }
    expect(accumulateQuestionTime(original, 'q1', 0.4)).toBe(original)
  })
})
