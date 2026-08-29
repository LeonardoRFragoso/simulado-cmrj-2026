import type { OptionId, Subject } from './exam'

export interface AnswerRecord {
  questionId: string
  selected: OptionId | null
  correct: boolean
  subject: Subject
  topic: string
  difficulty: string
  /** timestamp ISO */
  answeredAt: string
  /** contexto em que a resposta foi dada */
  context: 'treino-rapido' | 'treino-assunto' | 'simulado' | 'prova-anterior' | 'revisao-erros' | 'revisao-hoje' | 'mini-simulado' | 'favoritos'
  /** id do simulado/prova, quando aplicável */
  sessionId?: string
  /** questão anulada não conta como erro */
  annulled?: boolean
  /** tempo em segundos para responder esta questão */
  timeSpentSeconds?: number
  /** quantas dicas foram usadas nesta tentativa */
  hintsUsed?: number
}

export interface SimuladoResult {
  id: string
  startedAt: string
  finishedAt: string
  durationSeconds: number
  mathCorrect: number
  mathTotal: number
  mathScore: number
  portugueseCorrect: number
  portugueseTotal: number
  portugueseScore: number
  averageObjective: number
  essayStatus: 'nao_preenchida' | 'preenchida' | 'apto' | 'nao_apto'
  essayLineCount: number
  essayWordCount: number
  answers: AnswerRecord[]
  /** tipo do simulado: oficial, mini, matematica, portugues */
  type?: 'oficial' | 'mini' | 'matematica' | 'portugues'
}

export interface EssayDraft {
  id: string
  proposalId: string
  title: string
  text: string
  updatedAt: string
  /** checklist de revisão (itens marcados como conferidos) */
  reviewChecklist: Record<string, boolean>
  /** autoavaliação por competência (0-10 cada) */
  selfAssessment: Record<string, number>
  /** planejamento da redação (personagens, cenário, etc.) */
  planning?: EssayPlanning
}

export interface EssayPlanning {
  mainCharacter?: string
  otherCharacters?: string
  setting?: string
  time?: string
  problem?: string
  development?: string
  ending?: string
}

export interface SubjectStats {
  answered: number
  correct: number
  accuracy: number
  byTopic: Record<string, { answered: number; correct: number }>
}

/**
 * Entrada legada de mastery (schema v1). Mantida para migração.
 * No schema v2, substituída por ReviewSchedule.
 */
export interface MasteryEntry {
  questionId: string
  consecutiveErrors: number
  consecutiveCorrect: number
  mastered: boolean
  lastSeenAt: string
}

/**
 * Agenda de repetição espaçada (schema v2).
 * Intervalos: erro → hoje/próxima sessão; +1, +3, +7, +14, +30 dias.
 */
export interface ReviewSchedule {
  questionId: string
  lastReviewedAt?: string
  nextReviewAt?: string
  intervalDays: number
  reviewLevel: number
  totalErrors: number
  totalCorrect: number
  consecutiveCorrect: number
  mastered: boolean
  /** estado no caderno de erros */
  status: 'novo' | 'revisar' | 'em-aprendizado' | 'dominado'
}

/** Meta diária configurável pelo usuário. */
export interface DailyGoal {
  type: 'questoes' | 'minutos'
  value: number
}

/** Configuração do plano de estudos. */
export interface StudyPlanConfig {
  minutesPerDay: 15 | 30 | 45 | 60
  /** dia da semana em que o plano começou (0=domingo..6=sábado) */
  startedAt: string
}

export interface ProgressState {
  schemaVersion: number
  nickname: string
  answers: AnswerRecord[]
  simulados: SimuladoResult[]
  essays: EssayDraft[]
  favorites: string[]
  /** legacy mastery (schema v1) — mantido para auditoria histórica */
  mastery: Record<string, MasteryEntry>
  /** agenda de repetição espaçada (schema v2) */
  reviews: Record<string, ReviewSchedule>
  /** datas com pelo menos 1 resposta (ISO yyyy-mm-dd) */
  studyDays: string[]
  settings: {
    theme: 'claro' | 'escuro' | 'sistema'
    feedbackMode: 'imediato' | 'final'
    reducedMotion: boolean
  }
  /** tempo total estudado em segundos */
  totalStudySeconds: number
  /** meta diária */
  dailyGoal?: DailyGoal
  /** plano de estudos */
  studyPlan?: StudyPlanConfig
  /** histórico de questões favoritas removidas (auditoria) */
  _meta?: Record<string, unknown>
}

export const PROGRESS_SCHEMA_VERSION = 2
