export type Subject = 'matematica' | 'portugues'
export type QuestionSourceType = 'original' | 'official-past-exam'
export type Difficulty = 'facil' | 'media' | 'dificil'
export type OptionId = 'A' | 'B' | 'C' | 'D' | 'E'

export interface QuestionOption {
  id: OptionId
  text: string
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
  explanation: string
  difficulty: Difficulty
  tags: string[]
  /** origem: rótulo legível */
  sourceLabel: string
  /** ano da questão, quando aplicável (provas anteriores) */
  year?: number
  sourceType: QuestionSourceType
  sourceUrl?: string
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
