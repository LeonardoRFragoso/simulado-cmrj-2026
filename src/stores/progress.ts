import type {
  AnswerRecord,
  EssayDraft,
  MasteryEntry,
  ProgressState,
  ReviewSchedule,
  SimuladoResult,
  SubjectStats,
  DailyGoal,
  StudyPlanConfig,
} from '../types/progress'
import { PROGRESS_SCHEMA_VERSION } from '../types/progress'
import type { Subject, Question } from '../types/exam'
import { allQuestions } from '../data/questions'

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
    reviews: {},
    studyDays: [],
    settings: { theme: 'sistema', feedbackMode: 'imediato', reducedMotion: false },
    totalStudySeconds: 0,
  }
}

/**
 * Migra o estado preservando progresso existente.
 * v1 → v2: adiciona `reviews` (repetição espaçada) derivado de `mastery` legado.
 * Campos antigos (mastery) são preservados para auditoria histórica.
 */
function migrate(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return emptyState()
  const incoming = raw as Partial<ProgressState> & { schemaVersion?: number }
  const base = emptyState()
  const merged: ProgressState = {
    ...base,
    ...incoming,
    settings: { ...base.settings, ...(incoming.settings ?? {}) },
    mastery: incoming.mastery ?? {},
    reviews: incoming.reviews ?? migrateMasteryToReviews(incoming.mastery ?? {}),
    studyDays: incoming.studyDays ?? [],
    answers: incoming.answers ?? [],
    simulados: incoming.simulados ?? [],
    essays: incoming.essays ?? [],
    favorites: incoming.favorites ?? [],
    dailyGoal: incoming.dailyGoal,
    studyPlan: incoming.studyPlan,
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  }
  return merged
}

/** Migra entradas mastery (v1) para ReviewSchedule (v2). */
function migrateMasteryToReviews(mastery: Record<string, MasteryEntry>): Record<string, ReviewSchedule> {
  const reviews: Record<string, ReviewSchedule> = {}
  for (const [qid, m] of Object.entries(mastery)) {
    reviews[qid] = {
      questionId: qid,
      lastReviewedAt: m.lastSeenAt,
      nextReviewAt: m.mastered ? undefined : new Date().toISOString(),
      intervalDays: 0,
      reviewLevel: m.consecutiveCorrect >= 2 ? 2 : 0,
      totalErrors: m.consecutiveErrors,
      totalCorrect: m.consecutiveCorrect,
      consecutiveCorrect: m.consecutiveCorrect,
      mastered: m.mastered,
      status: m.mastered ? 'dominado' : m.consecutiveErrors > 0 ? 'revisar' : 'novo',
    }
  }
  return reviews
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
  /** Importa um backup JSON, validando o formato básico e migrando se necessário. */
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

/** Intervalos da repetição espaçada em dias, por nível. */
const SPACED_INTERVALS = [0, 1, 3, 7, 14, 30]

/** Atualiza a agenda de revisão espaçada após uma resposta. */
function updateReviewSchedule(qid: string, isCorrect: boolean, answeredAt: string): ReviewSchedule {
  const prev = state.reviews[qid]
  const base: ReviewSchedule = prev ?? {
    questionId: qid,
    intervalDays: 0,
    reviewLevel: 0,
    totalErrors: 0,
    totalCorrect: 0,
    consecutiveCorrect: 0,
    mastered: false,
    status: 'novo',
  }
  if (isCorrect) {
    const newLevel = Math.min(base.reviewLevel + 1, SPACED_INTERVALS.length - 1)
    const intervalDays = SPACED_INTERVALS[newLevel]
    const next = new Date(answeredAt)
    next.setDate(next.getDate() + intervalDays)
    const mastered = newLevel >= 4 // +30 dias = dominado
    return {
      ...base,
      lastReviewedAt: answeredAt,
      nextReviewAt: next.toISOString(),
      intervalDays,
      reviewLevel: newLevel,
      totalCorrect: base.totalCorrect + 1,
      consecutiveCorrect: base.consecutiveCorrect + 1,
      mastered,
      status: mastered ? 'dominado' : newLevel >= 2 ? 'em-aprendizado' : 'novo',
    }
  }
  // Erro: revisar novamente hoje/próxima sessão
  return {
    ...base,
    lastReviewedAt: answeredAt,
    nextReviewAt: answeredAt, // vence imediatamente
    intervalDays: 0,
    reviewLevel: 0,
    totalErrors: base.totalErrors + 1,
    consecutiveCorrect: 0,
    mastered: false,
    status: 'revisar',
  }
}

export function recordAnswer(rec: Omit<AnswerRecord, 'answeredAt'>): void {
  progressStore.set((s) => {
    const answeredAt = new Date().toISOString()
    const day = answeredAt.slice(0, 10)
    const studyDays = s.studyDays.includes(day) ? s.studyDays : [...s.studyDays, day]
    const isCorrect = rec.correct && !rec.annulled
    // mantém mastery legado atualizado (compatibilidade)
    const prevMastery: MasteryEntry = s.mastery[rec.questionId] ?? {
      questionId: rec.questionId,
      consecutiveErrors: 0,
      consecutiveCorrect: 0,
      mastered: false,
      lastSeenAt: answeredAt,
    }
    const nextMastery: MasteryEntry = {
      ...prevMastery,
      lastSeenAt: answeredAt,
      consecutiveErrors: isCorrect ? 0 : prevMastery.consecutiveErrors + 1,
      consecutiveCorrect: isCorrect ? prevMastery.consecutiveCorrect + 1 : 0,
      mastered: isCorrect ? prevMastery.consecutiveCorrect + 1 >= 2 : prevMastery.mastered,
    }
    // atualiza agenda de revisão espaçada (schema v2)
    const prevReview = s.reviews[rec.questionId]
    const nextReview = updateReviewSchedule(rec.questionId, isCorrect, answeredAt)
    void prevReview // mantém referência para possível auditoria
    return {
      ...s,
      answers: [...s.answers, { ...rec, answeredAt }],
      studyDays,
      mastery: { ...s.mastery, [rec.questionId]: nextMastery },
      reviews: { ...s.reviews, [rec.questionId]: nextReview },
      totalStudySeconds: s.totalStudySeconds + Math.max(0, rec.timeSpentSeconds ?? 0),
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

export function setDailyGoal(goal: DailyGoal): void {
  progressStore.set((s) => ({ ...s, dailyGoal: goal }))
}

export function setStudyPlan(plan: StudyPlanConfig): void {
  progressStore.set((s) => ({ ...s, studyPlan: plan }))
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

/** Questões erradas ainda não dominadas (usa reviews v2). */
export function wrongQuestions(subject?: Subject): AnswerRecord[] {
  const s = progressStore.get()
  const seen = new Set<string>()
  const out: AnswerRecord[] = []
  for (let i = s.answers.length - 1; i >= 0; i--) {
    const a = s.answers[i]
    if (a.annulled) continue
    if (subject && a.subject !== subject) continue
    if (seen.has(a.questionId)) continue
    seen.add(a.questionId)
    const r = s.reviews[a.questionId]
    if (!a.correct && !(r?.mastered)) {
      out.push(a)
    }
  }
  return out
}

// ============ Repetição espaçada ============

/** Questões com revisão vencida (nextReviewAt <= agora). */
export function dueReviews(): { questionId: string; schedule: ReviewSchedule }[] {
  const s = progressStore.get()
  const now = new Date().toISOString()
  return Object.values(s.reviews)
    .filter((r) => !r.mastered && r.nextReviewAt && r.nextReviewAt <= now)
    .map((r) => ({ questionId: r.questionId, schedule: r }))
    .sort((a, b) => (a.schedule.nextReviewAt ?? '').localeCompare(b.schedule.nextReviewAt ?? ''))
}

/** Conta questões vencidas por disciplina. */
export function dueReviewsCount(): number {
  return dueReviews().length
}

// ============ Revisão do Dia ============

export interface DailyReviewComposition {
  /** questões vencidas da repetição espaçada (prioridade máxima) */
  dueReviewIds: string[]
  /** questões erradas ainda não dominadas (caderno de erros ativo) */
  wrongIds: string[]
  /** questões novas para expandir cobertura (balanceado por disciplina) */
  newIds: string[]
  /** total recomendado para a sessão de hoje */
  total: number
}

/**
 * Compõe a revisão do dia inteligentemente:
 * 1. Questões vencidas (repetição espaçada) — prioridade máxima
 * 2. Questões erradas não dominadas — reforço do caderno
 * 3. Questões novas — balanceadas por disciplina para expandir cobertura
 *
 * @param maxTotal máximo de questões na sessão (padrão 15)
 * @param newRatio proporção de questões novas (0–1, padrão 0.3)
 */
export function buildDailyReview(maxTotal = 15, newRatio = 0.3): DailyReviewComposition {
  const due = dueReviews().map((r) => r.questionId)
  const wrong = wrongQuestions().map((w) => w.questionId)
  const wrongOnly = wrong.filter((id) => !due.includes(id))

  // Prioridade: due primeiro, depois wrong, depois new
  // Reserva espaço para novas conforme newRatio (mas não força se houver muitas vencidas)
  const targetNew = Math.max(0, Math.round(maxTotal * newRatio))
  const maxForDueAndWrong = Math.max(0, maxTotal - targetNew)

  const dueCapped = due.slice(0, maxForDueAndWrong)
  const remainingForWrong = Math.max(0, maxForDueAndWrong - dueCapped.length)
  const wrongCapped = wrongOnly.slice(0, remainingForWrong)

  const remainingForNew = Math.max(0, maxTotal - dueCapped.length - wrongCapped.length)
  const newTarget = Math.min(targetNew, remainingForNew)
  const seenIds = new Set<string>([...dueCapped, ...wrongCapped])
  const newIds = pickNewQuestions(newTarget, seenIds)

  return {
    dueReviewIds: dueCapped,
    wrongIds: wrongCapped,
    newIds,
    total: dueCapped.length + wrongCapped.length + newIds.length,
  }
}

/** Seleciona questões novas (nunca respondidas) balanceando por disciplina. */
function pickNewQuestions(count: number, excludeIds: Set<string>): string[] {
  if (count <= 0) return []
  const s = progressStore.get()
  const answeredIds = new Set(s.answers.map((a) => a.questionId))
  const allExclude = new Set([...excludeIds, ...answeredIds])
  const newPool: Question[] = allQuestions.filter((q) => !allExclude.has(q.id))
  // balanceia por disciplina
  const math = newPool.filter((q) => q.subject === 'matematica')
  const port = newPool.filter((q) => q.subject === 'portugues')
  const half = Math.ceil(count / 2)
  const picked = [...math.slice(0, half), ...port.slice(0, count - half)]
  return picked.slice(0, count).map((q) => q.id)
}

// ============ Caderno de erros 2.0 ============

export interface ErrorBookEntry {
  questionId: string
  subject: Subject
  topic: string
  subtopic?: string
  difficulty: string
  errorCount: number
  lastErrorAt?: string
  totalAttempts: number
  correctAfterError: number
  status: ReviewSchedule['status']
  nextReviewAt?: string
  mastered: boolean
}

/** Entradas do caderno de erros agrupadas por questão (histórico completo, não remove dominadas). */
export function errorBookEntries(subject?: Subject): ErrorBookEntry[] {
  const s = progressStore.get()
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]))
  const map = new Map<string, ErrorBookEntry>()
  for (const a of s.answers) {
    if (a.annulled) continue
    if (subject && a.subject !== subject) continue
    const existing = map.get(a.questionId)
    const review = s.reviews[a.questionId]
    if (!existing) {
      const q = questionMap.get(a.questionId)
      map.set(a.questionId, {
        questionId: a.questionId,
        subject: a.subject,
        topic: a.topic,
        subtopic: q?.subtopic,
        difficulty: a.difficulty,
        errorCount: 0,
        lastErrorAt: undefined,
        totalAttempts: 0,
        correctAfterError: 0,
        status: review?.status ?? 'novo',
        nextReviewAt: review?.nextReviewAt,
        mastered: review?.mastered ?? false,
      })
    }
    const entry = map.get(a.questionId)!
    entry.totalAttempts += 1
    if (!a.correct) {
      entry.errorCount += 1
      entry.lastErrorAt = a.answeredAt
    } else if (entry.errorCount > 0) {
      entry.correctAfterError += 1
    }
  }
  return Array.from(map.values())
    .filter((e) => e.errorCount > 0)
    .sort((a, b) => (b.lastErrorAt ?? '').localeCompare(a.lastErrorAt ?? ''))
}

// ============ Domínio por assunto ============

export type MasteryStatus = 'nao-iniciado' | 'comecando' | 'em-progresso' | 'bom' | 'dominado' | 'precisa-revisar'

export interface TopicMastery {
  subject: Subject
  topic: string
  answered: number
  correct: number
  accuracy: number
  status: MasteryStatus
  lastStudiedAt?: string
  reviewLevel: number
  hintsUsed: number
}

/**
 * Calcula domínio por assunto.
 * Critérios:
 * - nao-iniciado: 0 tentativas
 * - comecando: 1-2 tentativas
 * - em-progresso: 3+ tentativas, acerto < 60%
 * - bom: 5+ tentativas, acerto 60-79%
 * - dominado: 8+ tentativas, acerto >= 80%, reviewLevel >= 3
 * - precisa-revisar: acerto < 50% com 3+ tentativas, ou revisão vencida
 */
export function topicMastery(subject: Subject, topic: string): TopicMastery {
  const s = progressStore.get()
  const list = s.answers.filter((a) => a.subject === subject && a.topic === topic && !a.annulled)
  const answered = list.length
  const correct = list.filter((a) => a.correct).length
  const accuracy = answered ? correct / answered : 0
  const lastStudiedAt = list.length ? list[list.length - 1].answeredAt : undefined
  const hintsUsed = list.reduce((sum, a) => sum + (a.hintsUsed ?? 0), 0)

  // reviewLevel médio das questões deste tópico
  const topicReviews = list
    .map((a) => s.reviews[a.questionId])
    .filter((r): r is ReviewSchedule => Boolean(r))
  const reviewLevel = topicReviews.length
    ? Math.round(topicReviews.reduce((sum, r) => sum + r.reviewLevel, 0) / topicReviews.length)
    : 0

  // verifica revisões vencidas neste tópico
  const hasDueReview = list.some((a) => {
    const r = s.reviews[a.questionId]
    return r && !r.mastered && r.nextReviewAt && r.nextReviewAt <= new Date().toISOString()
  })

  let status: MasteryStatus
  if (answered === 0) {
    status = 'nao-iniciado'
  } else if (hasDueReview || (answered >= 3 && accuracy < 0.5)) {
    status = 'precisa-revisar'
  } else if (answered <= 2) {
    status = 'comecando'
  } else if (answered >= 8 && accuracy >= 0.8 && reviewLevel >= 3) {
    status = 'dominado'
  } else if (answered >= 5 && accuracy >= 0.6) {
    status = 'bom'
  } else {
    status = 'em-progresso'
  }

  return { subject, topic, answered, correct, accuracy, status, lastStudiedAt, reviewLevel, hintsUsed }
}

/** Domínio de todos os tópicos de uma disciplina. */
export function allTopicMastery(subject: Subject): TopicMastery[] {
  const topics = new Set(s_answersBySubject(subject).map((a) => a.topic))
  return Array.from(topics).map((t) => topicMastery(subject, t))
}

function s_answersBySubject(subject: Subject) {
  return progressStore.get().answers.filter((a) => a.subject === subject && !a.annulled)
}

/** Domínio geral (média ponderada por tentativas de todos os tópicos). */
export function overallMastery(subject?: Subject): number {
  const subjects: Subject[] = subject ? [subject] : ['matematica', 'portugues']
  let totalAnswered = 0
  let weightedSum = 0
  for (const subj of subjects) {
    const masteries = allTopicMastery(subj)
    for (const m of masteries) {
      const weight = m.answered
      const masteryScore = m.accuracy * Math.min(1, m.answered / 8) * Math.min(1, (m.reviewLevel + 1) / 4)
      weightedSum += masteryScore * weight
      totalAnswered += weight
    }
  }
  return totalAnswered ? weightedSum / totalAnswered : 0
}

// ============ Meta diária ============

/** Respostas de hoje (conta para meta de questões). */
export function todayAnswerCount(): number {
  const today = todayISODate()
  return progressStore.get().answers.filter((a) => a.answeredAt.slice(0, 10) === today && !a.annulled).length
}

/** Tempo estudado hoje em segundos. */
export function todayStudySeconds(): number {
  const today = todayISODate()
  // estima: soma timeSpentSeconds das respostas de hoje + tempo de simulados de hoje
  const answers = progressStore.get().answers.filter((a) => a.answeredAt.slice(0, 10) === today)
  const fromAnswers = answers.reduce((sum, a) => sum + (a.timeSpentSeconds ?? 0), 0)
  const simulados = progressStore.get().simulados.filter((s) => s.startedAt.slice(0, 10) === today)
  const fromSimulados = simulados.reduce((sum, s) => sum + s.durationSeconds, 0)
  return fromAnswers + fromSimulados
}

/** Progresso da meta diária (0-1). */
export function dailyGoalProgress(): { current: number; target: number; type: DailyGoal['type']; met: boolean } {
  const goal = progressStore.get().dailyGoal
  if (!goal) return { current: 0, target: 0, type: 'questoes', met: true }
  const current = goal.type === 'questoes' ? todayAnswerCount() : Math.floor(todayStudySeconds() / 60)
  return { current, target: goal.value, type: goal.type, met: current >= goal.value }
}

// ============ Estudo desta semana ============

/** Tempo estudado nos últimos 7 dias em segundos. */
export function weekStudySeconds(): number {
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 86400000
  const s = progressStore.get()
  const fromAnswers = s.answers
    .filter((a) => new Date(a.answeredAt).getTime() >= sevenDaysAgo && a.timeSpentSeconds)
    .reduce((sum, a) => sum + (a.timeSpentSeconds ?? 0), 0)
  const fromSimulados = s.simulados
    .filter((sim) => new Date(sim.startedAt).getTime() >= sevenDaysAgo)
    .reduce((sum, sim) => sum + sim.durationSeconds, 0)
  return fromAnswers + fromSimulados
}
