import type { Question, Subject } from '../types/exam'
import { allQuestions, questionsBySubject } from '../data/questions'
import { examRules } from '../data/edital-2026'

/** Embaralhamento determinístico com seed (Fisher–Yates). */
export function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr]
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export interface SimuladoPaper {
  id: string
  seed: number
  math: Question[]
  portuguese: Question[]
  /** ordem unificada das 40 objetivas */
  questions: Question[]
}

/**
 * Gera um simulado oficial: 20 de Matemática + 20 de Português,
 * distribuindo por tópicos do edital e respeitando as regras centralizadas.
 */
export function generateOfficialSimulado(seed: number = Date.now()): SimuladoPaper {
  const math = pickByTopic('matematica', examRules.mathQuestions, seed)
  const portuguese = pickByTopic('portugues', examRules.portugueseQuestions, seed + 1)
  return {
    id: `sim-${seed}`,
    seed,
    math,
    portuguese,
    questions: [...math, ...portuguese],
  }
}

/** Seleciona `count` questões cobrindo o máximo de tópicos possível. */
export function pickByTopic(subject: Subject, count: number, seed: number): Question[] {
  const pool = questionsBySubject(subject)
  // agrupa por tópico e embaralha dentro de cada grupo
  const byTopic = new Map<string, Question[]>()
  for (const q of pool) {
    const arr = byTopic.get(q.topic) ?? []
    arr.push(q)
    byTopic.set(q.topic, arr)
  }
  const topics = shuffle(Array.from(byTopic.keys()), seed)
  const result: Question[] = []
  // primeira passada: 1 de cada tópico (round-robin) até preencher
  const queues = topics.map((t) => shuffle(byTopic.get(t)!, seed + t.length))
  let i = 0
  while (result.length < count && queues.some((q) => q.length)) {
    const queue = queues[i % queues.length]
    if (queue.length) result.push(queue.shift()!)
    i++
  }
  return result.slice(0, count)
}

export function pickRandom(subject: Subject, count: number, seed: number = Date.now()): Question[] {
  return shuffle(questionsBySubject(subject), seed).slice(0, count)
}

export function pickBySubjectTopic(subject: Subject, topic: string, count?: number, seed: number = Date.now()): Question[] {
  const pool = allQuestions.filter((q) => q.subject === subject && q.topic === topic)
  const shuffled = shuffle(pool, seed)
  return count ? shuffled.slice(0, count) : shuffled
}

export function pickByIds(ids: string[]): Question[] {
  const map = new Map(allQuestions.map((q) => [q.id, q]))
  return ids.map((id) => map.get(id)).filter((q): q is Question => Boolean(q))
}
