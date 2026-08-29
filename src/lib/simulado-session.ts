/**
 * Normaliza a posição persistida do simulado para um índice válido.
 * Estados antigos sem índice e valores corrompidos voltam para a primeira questão.
 */
export function normalizeQuestionIndex(value: unknown, totalQuestions: number): number {
  if (!Number.isFinite(totalQuestions) || totalQuestions <= 0) return 0

  const maxIndex = Math.max(0, Math.trunc(totalQuestions) - 1)
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0

  const index = Math.trunc(value)
  return Math.min(Math.max(index, 0), maxIndex)
}

/**
 * Acumula o tempo gasto na questão atual sem mutar o objeto anterior.
 * Tempos menores que 1 segundo são ignorados para evitar ruído de navegação.
 */
export function accumulateQuestionTime(
  current: Record<string, number> | undefined,
  questionId: string | undefined,
  elapsedSeconds: number,
): Record<string, number> | undefined {
  if (!questionId || !Number.isFinite(elapsedSeconds) || elapsedSeconds < 1) return current

  const elapsed = Math.max(1, Math.round(elapsedSeconds))
  return {
    ...(current ?? {}),
    [questionId]: Math.max(0, current?.[questionId] ?? 0) + elapsed,
  }
}
