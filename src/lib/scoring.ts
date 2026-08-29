import { examRules } from '../data/edital-2026'

/**
 * Nota de uma disciplina objetiva conforme regra do edital CMRJ:
 *   nota = (acertos / total) * 10  (escala 0 a 10.000 com 3 casas)
 * A nota máxima por objetiva é 10,000.
 */
export function objectiveScore(correct: number, total: number): number {
  if (total <= 0) return 0
  const ratio = Math.min(1, Math.max(0, correct / total))
  // três casas decimais, escala 0..10
  return Math.round(ratio * 10000) / 1000
}

/** Média aritmética das duas objetivas (escala 0..10). */
export function overallObjectiveScore(scores: { matematica: number; portugues: number }): number {
  return Math.round(((scores.matematica + scores.portugues) / 2) * 1000) / 1000
}

/** Indica se a nota atinge o mínimo previsto no edital para a objetiva. */
export function isObjectiveApproved(score: number): boolean {
  return score >= examRules.minimumScorePerObjective
}
