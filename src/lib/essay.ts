import { examRules } from '../data/edital-2026'

/** Conta palavras ignorando espaços extras. */
export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Contagem aproximada de linhas manuscritas: uma "linha" de redação à mão
 * abriga em média ~12 palavras. Usamos essa estimativa pedagógica para o
 * contador aproximado exigido pelo edital (15 a 30 linhas).
 */
export const WORDS_PER_LINE = 12

export function approxLineCount(text: string): number {
  const words = countWords(text)
  if (words === 0) return 0
  // conta também quebras explícitas de linha do editor
  const hardLines = text.split(/\n+/).filter((l) => l.trim().length > 0).length
  const byWords = Math.ceil(words / WORDS_PER_LINE)
  return Math.max(hardLines, byWords)
}

export interface EssayValidation {
  tooShort: boolean
  tooLong: boolean
  extremelyShort: boolean
  missingTitle: boolean
  withinRange: boolean
  lineCount: number
  wordCount: number
  minLines: number
  maxLines: number
}

export function validateEssay(text: string, hasTitle: boolean): EssayValidation {
  const lineCount = approxLineCount(text)
  const wordCount = countWords(text)
  const min = examRules.essayMinLines
  const max = examRules.essayMaxLines
  return {
    lineCount,
    wordCount,
    minLines: min,
    maxLines: max,
    tooShort: lineCount < min,
    tooLong: lineCount > max,
    extremelyShort: wordCount < 20,
    missingTitle: hasTitle === false,
    withinRange: lineCount >= min && lineCount <= max,
  }
}

/** Heurística simples para possível fuga ao tema: verifica palavras-chave. */
export function looksOffTopic(text: string, themeKeywords: string[]): boolean {
  const lower = text.toLowerCase()
  if (countWords(text) < 20) return false
  const hits = themeKeywords.filter((k) => lower.includes(k.toLowerCase())).length
  // se nenhuma palavra-chave do tema aparece, sinaliza possível fuga
  return hits === 0
}

/** Heurística para estrutura narrativa: presença de marcadores temporais. */
export function hasNarrativeStructure(text: string): boolean {
  const lower = text.toLowerCase()
  const markers = ['um dia', 'certo dia', 'era uma vez', 'então', 'de repente', 'quando', 'finalmente', 'no fim', 'após', 'depois', 'antes', 'logo', 'assim']
  return markers.some((m) => lower.includes(m))
}

/**
 * Avalia APTO/NÃO APTO conforme edital: APTO exige pelo menos 50% dos
 * descritores atendidos (autoavaliação do aluno por competência).
 */
export function evaluateEssayApto(selfAssessment: Record<string, number>, descriptors: string[]): { apto: boolean; attended: number; total: number; percentage: number } {
  const total = descriptors.length
  const attended = descriptors.filter((_, i) => {
    // cada descritor mapeia para uma competência autoavaliada (0-10)
    // considera atendido se nota >= 6
    const key = Object.keys(selfAssessment)[i]
    return key ? (selfAssessment[key] ?? 0) >= 6 : false
  }).length
  const percentage = total ? Math.round((attended / total) * 100) : 0
  return { apto: percentage >= examRules.essayMinimumDescriptorPercentage, attended, total, percentage }
}
