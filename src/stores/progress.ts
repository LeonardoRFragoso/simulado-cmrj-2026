import type {
  AnswerRecord,
  EssayDraft,
  MasteryEntry,
  ProgressState,
  SimuladoResult,
  SubjectStats,
} from '../types/progress'
import { PROGRESS_SCHEMA_VERSION } from '../types/progress'
import type { Subject } from '../types/exam'

const STORAGE_KEY = 'cmrj-progress-v1'

function emptyState(): ProgressState {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    nickname: '',
    answers: [],
    simulados: [],
    essays: [],
    favorites: [],
    mastery: {},
    studyDays: [],
    settings: { theme: 'sistema', feedbackMode: 'imediato', reducedMotion: false },
    totalStudySeconds: 0,
  }
}

/** Migrações futuras podem ser adicionadas aqui preservando progresso. */
function migrate(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return emptyState()
  const incoming = raw as Partial<ProgressState> & { schemaVersion?: number }
  const base = emptyState()
  // merge defensivo: campos novos assumem default, antigos são preservados
  return {
    ...base,
    ...incoming,
    settings: { ...base.settings, ...(incoming.settings ?? {}) },
    mastery: incoming.mastery ?? {},
    studyDays: incoming.studyDays ?? [],
    answers: incoming.answers ?? [],
    simulados: incoming.simulados ?? [],
    essays: incoming.essays ?? [],
    favorites: incoming.favorites ?? [],
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  }
}

let listeners: Array<() => void> = []
let state: ProgressState = load()

function load(): ProgressState {
  if (typeof localStorage === 'undefined') return emptyState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    return migrate(JSON.parse(raw))
  } catch {
    return emptyState()
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignora falhas de quota/privacidade
  }
  listeners.forEach((l) => l())
}

export const progressStore = {
  get(): ProgressState {
    return state
  },
  subscribe(fn: () => void): () => void {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter((l) => l !== fn)
    }
  },
  set(updater: (s: ProgressState) => ProgressState) {
    state = updater(state)
    persist()
  },
  reset() {
    state = emptyState()
    persist()
  },
  /** Exporta todo o progresso como JSON para backup. */
  exportJSON(): string {
    return JSON.stringify(state, null, 2)
  },
  /** Importa um backup JSON, validando o formato básico. */
  importJSON(json: string): { ok: boolean; error?: string } {
    try {
      const parsed = JSON.parse(json)
      if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'JSON inválido.' }
      state = migrate(parsed)
      persist()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'Não foi possível ler o JSON: ' + (e as Error).message }
    }
  },
}

// ============ Ações de domínio ============

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function recordAnswer(rec: Omit<AnswerRecord, 'answeredAt'>): void {
  progressStore.set((s) => {
    const answeredAt = new Date().toISOString()
    const day = answeredAt.slice(0, 10)
    const studyDays = s.studyDays.includes(day) ? s.studyDays : [...s.studyDays, day]
    const prevMastery: MasteryEntry = s.mastery[rec.questionId] ?? {
      questionId: rec.questionId,
      consecutiveErrors: 0,
      consecutiveCorrect: 0,
      mastered: false,
      lastSeenAt: answeredAt,
    }
    const isCorrect = rec.correct && !rec.annulled
    const nextMastery: MasteryEntry = {
      ...prevMastery,
      lastSeenAt: answeredAt,
      consecutiveErrors: isCorrect ? 0 : prevMastery.consecutiveErrors + 1,
      consecutiveCorrect: isCorrect ? prevMastery.consecutiveCorrect + 1 : 0,
      // considera dominada após 2 acertos consecutivos posteriores
      mastered: isCorrect ? prevMastery.consecutiveCorrect + 1 >= 2 : prevMastery.mastered,
    }
    return {
      ...s,
      answers: [...s.answers, { ...rec, answeredAt }],
      studyDays,
      mastery: { ...s.mastery, [rec.questionId]: nextMastery },
    }
  })
}

export function toggleFavorite(questionId: string): void {
  progressStore.set((s) => ({
    ...s,
    favorites: s.favorites.includes(questionId)
      ? s.favorites.filter((id) => id !== questionId)
      : [...s.favorites, questionId],
  }))
}

export function saveSimulado(result: SimuladoResult): void {
  progressStore.set((s) => ({ ...s, simulados: [...s.simulados, result] }))
}

export function addStudyTime(seconds: number): void {
  progressStore.set((s) => ({ ...s, totalStudySeconds: s.totalStudySeconds + Math.max(0, seconds) }))
}

export function upsertEssay(draft: EssayDraft): void {
  progressStore.set((s) => {
    const idx = s.essays.findIndex((e) => e.id === draft.id)
    const essays = idx >= 0
      ? s.essays.map((e) => (e.id === draft.id ? draft : e))
      : [...s.essays, draft]
    return { ...s, essays }
  })
}

export function setNickname(nickname: string): void {
  progressStore.set((s) => ({ ...s, nickname: nickname.slice(0, 40) }))
}

export function updateSettings(patch: Partial<ProgressState['settings']>): void {
  progressStore.set((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
}

// ============ Seletores/estatísticas ============

export function subjectStats(subject: Subject): SubjectStats {
  const s = progressStore.get()
  const list = s.answers.filter((a) => a.subject === subject && !a.annulled)
  const answered = list.length
  const correct = list.filter((a) => a.correct).length
  const byTopic: Record<string, { answered: number; correct: number }> = {}
  for (const a of list) {
    byTopic[a.topic] ??= { answered: 0, correct: 0 }
    byTopic[a.topic].answered += 1
    if (a.correct) byTopic[a.topic].correct += 1
  }
  return { answered, correct, accuracy: answered ? correct / answered : 0, byTopic }
}

export function generalAccuracy(): number {
  const s = progressStore.get()
  const list = s.answers.filter((a) => !a.annulled)
  if (!list.length) return 0
  return list.filter((a) => a.correct).length / list.length
}

export function currentStreak(): number {
  const s = progressStore.get()
  if (!s.studyDays.length) return 0
  const days = [...s.studyDays].sort()
  let streak = 0
  let cursor = todayISODate()
  // conta dias consecutivos até hoje (ou último dia estudado)
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i] === cursor) {
      streak += 1
      const d = new Date(cursor + 'T00:00:00')
      d.setDate(d.getDate() - 1)
      cursor = d.toISOString().slice(0, 10)
    } else if (days[i] < cursor) {
      break
    }
  }
  return streak
}

export function bestStreak(): number {
  const s = progressStore.get()
  if (!s.studyDays.length) return 0
  const days = [...s.studyDays].sort()
  let best = 1
  let cur = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + 'T00:00:00')
    const now = new Date(days[i] + 'T00:00:00')
    const diff = (now.getTime() - prev.getTime()) / 86400000
    if (Math.round(diff) === 1) {
      cur += 1
      best = Math.max(best, cur)
    } else {
      cur = 1
    }
  }
  return best
}

/** Assuntos recomendados para revisar (menor taxa de acerto com pelo menos 1 erro recente). */
export function topicsToReview(limit = 5): { subject: Subject; topic: string; accuracy: number; answered: number }[] {
  const s = progressStore.get()
  const recent = s.answers.filter((a) => !a.annulled).slice(-80)
  const map = new Map<string, { subject: Subject; topic: string; correct: number; answered: number }>()
  for (const a of recent) {
    const key = `${a.subject}|${a.topic}`
    const row = map.get(key) ?? { subject: a.subject, topic: a.topic, correct: 0, answered: 0 }
    row.answered += 1
    if (a.correct) row.correct += 1
    map.set(key, row)
  }
  return Array.from(map.values())
    .filter((r) => r.answered >= 2)
    .map((r) => ({ subject: r.subject, topic: r.topic, accuracy: r.correct / r.answered, answered: r.answered }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit)
}

/** Questões erradas ainda não dominadas. */
export function wrongQuestions(subject?: Subject): AnswerRecord[] {
  const s = progressStore.get()
  const seen = new Set<string>()
  const out: AnswerRecord[] = []
  // percorre do mais recente para manter a última ocorrência
  for (let i = s.answers.length - 1; i >= 0; i--) {
    const a = s.answers[i]
    if (a.annulled) continue
    if (subject && a.subject !== subject) continue
    if (seen.has(a.questionId)) continue
    seen.add(a.questionId)
    const m = s.mastery[a.questionId]
    if (!a.correct && !(m?.mastered)) {
      out.push(a)
    }
  }
  return out
}
