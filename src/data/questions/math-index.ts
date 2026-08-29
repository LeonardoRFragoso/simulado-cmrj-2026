import type { Question } from '../../types/exam'
import { conceptualMath } from './math-conceptual'
import { generatedMath } from './math-generators'

export const mathQuestions: Question[] = [...generatedMath, ...conceptualMath]

export function getMathQuestionById(id: string): Question | undefined {
  return mathQuestions.find((q) => q.id === id)
}
