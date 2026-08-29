import type { Difficulty, OptionId, Question, QuestionExplanation, Subject } from '../../types/exam'

const OPTION_IDS: OptionId[] = ['A', 'B', 'C', 'D', 'E']

export interface QuestionInput {
  id: string
  subject: Subject
  topic: string
  subtopic?: string
  statement: string
  supportText?: string
  /** textos das alternativas A..E */
  options: [string, string, string, string, string]
  correct: OptionId
  /** explicação legada (string). Usada como fallback se explanationData ausente. */
  explanation: string
  /** explicação estruturada pedagógica (preferencial) */
  explanationData?: QuestionExplanation
  difficulty: Difficulty
  tags: string[]
  year?: number
  sourceUrl?: string
  sourceLabel?: string
  sourceType?: Question['sourceType']
}

export function q(input: QuestionInput): Question {
  return {
    id: input.id,
    subject: input.subject,
    topic: input.topic,
    subtopic: input.subtopic,
    statement: input.statement,
    supportText: input.supportText,
    options: input.options.map((text, i) => ({ id: OPTION_IDS[i], text })) as Question['options'],
    correctOption: input.correct,
    explanation: input.explanation,
    explanationData: input.explanationData,
    difficulty: input.difficulty,
    tags: input.tags,
    sourceLabel: input.sourceLabel ?? 'Questão autoral de treinamento',
    year: input.year,
    sourceType: input.sourceType ?? 'original',
    sourceUrl: input.sourceUrl,
  }
}

/**
 * Embaralha deterministicamente a posição da resposta correta.
 * Retorna as 5 alternativas (texto) e o índice da correta (0..4).
 * Usa um seed simples para reprodutibilidade.
 */
export function shuffleOptions(
  correct: string,
  distractors: string[],
  seed: number,
): { options: [string, string, string, string, string]; correctIndex: number } {
  const all = [correct, ...distractors]
  // Fisher–Yates com PRNG linear congruential
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  for (let i = all.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const correctIndex = all.indexOf(correct)
  return { options: all as [string, string, string, string, string], correctIndex }
}

export function indexToOption(i: number): OptionId {
  return OPTION_IDS[i]
}
