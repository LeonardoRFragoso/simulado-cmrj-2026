import type { Question, Subject } from '../../types/exam'
import { mathQuestions } from './math-index'
import { portugueseAllQuestions } from './portuguese-index'

export const allQuestions: Question[] = [...mathQuestions, ...portugueseAllQuestions]

export function questionsBySubject(subject: Subject): Question[] {
  return allQuestions.filter((q) => q.subject === subject)
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id)
}

export interface CoverageRow {
  subject: Subject
  topic: string
  total: number
  facil: number
  media: number
  dificil: number
}

export function coverageReport(): CoverageRow[] {
  const map = new Map<string, CoverageRow>()
  for (const q of allQuestions) {
    const key = `${q.subject}|${q.topic}`
    let row = map.get(key)
    if (!row) {
      row = { subject: q.subject, topic: q.topic, total: 0, facil: 0, media: 0, dificil: 0 }
      map.set(key, row)
    }
    row.total += 1
    if (q.difficulty === 'facil') row.facil += 1
    else if (q.difficulty === 'media') row.media += 1
    else row.dificil += 1
  }
  return Array.from(map.values()).sort(
    (a, b) => a.subject.localeCompare(b.subject) || a.topic.localeCompare(b.topic),
  )
}

/** Verifica integridade: ids únicos, 5 alternativas, resposta dentro de A..E, sem duplicatas de texto. */
export function validateQuestions(): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const q of allQuestions) {
    if (ids.has(q.id)) errors.push(`ID duplicado: ${q.id}`)
    ids.add(q.id)
    if (q.options.length !== 5) errors.push(`${q.id}: ${q.options.length} alternativas (esperado 5)`)
    const optIds = q.options.map((o) => o.id)
    if (optIds.join(',') !== 'A,B,C,D,E') errors.push(`${q.id}: ordem/ids de alternativas inválidos`)
    if (!['A', 'B', 'C', 'D', 'E'].includes(q.correctOption)) errors.push(`${q.id}: resposta inválida`)
    const texts = q.options.map((o) => o.text)
    if (new Set(texts).size !== texts.length) errors.push(`${q.id}: alternativas com texto duplicado`)
    const correctText = q.options.find((o) => o.id === q.correctOption)?.text
    if (!correctText) errors.push(`${q.id}: alternativa correta não encontrada`)
  }
  return { ok: errors.length === 0, errors }
}
