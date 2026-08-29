import { describe, it, expect } from 'vitest'
import { objectiveScore, overallObjectiveScore, isObjectiveApproved } from './scoring'
import { examRules } from '../data/edital-2026'

describe('scoring — nota das objetivas', () => {
  it('nota máxima quando acerta todas', () => {
    expect(objectiveScore(20, 20)).toBe(10)
  })
  it('nota zero quando erra todas', () => {
    expect(objectiveScore(0, 20)).toBe(0)
  })
  it('nota proporcional com 3 casas', () => {
    // 15/20 = 0.75 -> 7.5
    expect(objectiveScore(15, 20)).toBe(7.5)
    // 10/20 = 0.5 -> 5
    expect(objectiveScore(10, 20)).toBe(5)
  })
  it('média objetiva é a média aritmética das duas disciplinas', () => {
    expect(overallObjectiveScore({ matematica: 8, portugues: 6 })).toBe(7)
    expect(overallObjectiveScore({ matematica: 7.5, portugues: 9.5 })).toBe(8.5)
  })
  it('isObjectiveApproved respeita o mínimo do edital', () => {
    expect(isObjectiveApproved(examRules.minimumScorePerObjective)).toBe(true)
    expect(isObjectiveApproved(examRules.minimumScorePerObjective - 0.001)).toBe(false)
  })
})
