import type { Question } from '../../types/exam'
import { portugueseQuestions } from './portuguese-conceptual'
import { portugueseQuestions2 } from './portuguese-conceptual-2'

export const portugueseAllQuestions: Question[] = [...portugueseQuestions, ...portugueseQuestions2]

export function getPortugueseQuestionById(id: string): Question | undefined {
  return portugueseAllQuestions.find((q) => q.id === id)
}
