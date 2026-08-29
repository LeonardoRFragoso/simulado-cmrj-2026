export type Subject = 'matematica' | 'portugues'
export type QuestionSourceType = 'original' | 'official-past-exam'
export type Difficulty = 'facil' | 'media' | 'dificil'
export type OptionId = 'A' | 'B' | 'C' | 'D' | 'E'

export interface QuestionOption {
  id: OptionId
  text: string
}

/**
 * Explicação pedagógica estruturada.
 * - short: sempre presente (resumo conciso do porquê da resposta)
 * - concept: conceito/definição envolvido
 * - steps: passo a passo (preferencial em Matemática com cálculo)
 * - tip: dica útil / atalho / estratégia
 * - commonMistake: erro comum que leva aos distratores
 * - optionExplanations: justificativa por alternativa (especial em Português)
 * - hints: dicas progressivas ANTES da resposta (não entregam a alternativa)
 */
export interface QuestionExplanation {
  short: string
  concept?: string
  steps?: string[]
  tip?: string
  commonMistake?: string
  optionExplanations?: Partial<Record<OptionId, string>>
  hints?: string[]
}

export interface Question {
  id: string
  subject: Subject
  /** assunto principal (alinhado ao edital) */
  topic: string
  /** subassunto quando aplicável */
  subtopic?: string
  statement: string
  /** suporte de texto para questões de interpretação, quando aplicável */
  supportText?: string
  options: QuestionOption[]
  correctOption: OptionId
  /** explicação legada (string). Mantida para retrocompatibilidade. */
  explanation: string
  /** explicação estruturada pedagógica. Quando ausente, derivada de `explanation`. */
  explanationData?: QuestionExplanation
  difficulty: Difficulty
  tags: string[]
  /** origem: rótulo legível */
  sourceLabel: string
  /** ano da questão, quando aplicável (provas anteriores) */
  year?: number
  sourceType: QuestionSourceType
  sourceUrl?: string
}

/** Obtém a explicação estruturada, derivando de `explanation` (legado) se necessário. */
export function getExplanation(q: Question): QuestionExplanation {
  if (q.explanationData) return q.explanationData
  return { short: q.explanation }
}

export interface ExamRules {
  edition: string
  admissionYear: number
  examDate: string
  totalMinutes: number
  mathQuestions: number
  portugueseQuestions: number
  minimumScorePerObjective: number
  essayMinLines: number
  essayMaxLines: number
  essayMinimumDescriptorPercentage: number
}

export type QuestionStatus = 'active' | 'annulled'

export interface PastExamQuestion {
  year: number
  originalNumber: number
  subject: Subject
  source: string
  officialAnswer: OptionId
  topic: string
  status: QuestionStatus
  statement: string
  options: QuestionOption[]
  explanation?: string
  sourceUrl?: string
}

export interface PastExam {
  year: number
  school: string
  grade: string
  examDate: string
  sourceUrl: string
  officialSource: boolean
  questions: PastExamQuestion[]
  answerKey: Record<number, OptionId>
  annulledQuestions: number[]
  notes: string
}
