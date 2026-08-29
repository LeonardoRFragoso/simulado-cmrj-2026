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
  context: 'treino-rapido' | 'treino-assunto' | 'simulado' | 'prova-anterior' | 'revisao-erros'
  /** id do simulado/prova, quando aplicável */
  sessionId?: string
  /** questão anulada não conta como erro */
  annulled?: boolean
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
}

export interface SubjectStats {
  answered: number
  correct: number
  accuracy: number
  byTopic: Record<string, { answered: number; correct: number }>
}

export interface MasteryEntry {
  questionId: string
  /** erros consecutivos desde o último acerto */
  consecutiveErrors: number
  /** acertos consecutivos desde o último erro (para considerar dominada) */
  consecutiveCorrect: number
  mastered: boolean
  lastSeenAt: string
}

export interface ProgressState {
  schemaVersion: number
  nickname: string
  answers: AnswerRecord[]
  simulados: SimuladoResult[]
  essays: EssayDraft[]
  favorites: string[]
  mastery: Record<string, MasteryEntry>
  /** datas com pelo menos 1 resposta (ISO yyyy-mm-dd) */
  studyDays: string[]
  settings: {
    theme: 'claro' | 'escuro' | 'sistema'
    feedbackMode: 'imediato' | 'final'
    reducedMotion: boolean
  }
  /** tempo total estudado em segundos */
  totalStudySeconds: number
}

export const PROGRESS_SCHEMA_VERSION = 1
