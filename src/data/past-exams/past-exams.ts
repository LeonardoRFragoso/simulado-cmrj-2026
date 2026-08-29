import type { OptionId, PastExam, PastExamQuestion } from '../../types/exam'

/**
 * Provas anteriores com fonte oficial rastreável.
 *
 * DECISÃO DOCUMENTADA (LGPD/direito autoral + honestidade):
 * - O Exame Intelectual 2026/2027 ainda ocorrerá em 18/10/2026. O edital prevê
 *   divulgação do caderno e gabarito posteriormente. NÃO há "Prova CMRJ 2026" antes
 *   da publicação oficial — portanto ela não é inventada aqui.
 * - A prova de 2025/2026 é um exame UNIFICADO, aplicado a todos os Colégios Militares
 *   (incluindo o CMRJ) no mesmo dia, com o mesmo caderno e gabarito.
 * - O gabarito oficial (factual) e a lista de questões anuladas são armazenados.
 *   O enunciado completo das questões NÃO é transcrito em massa: o usuário é
 *   direcionado ao caderno oficial publicado pelo CM para ler as questões.
 *   Isso respeita a fonte oficial e evita reprodução indevida do caderno.
 */

const GAB_2025: Record<number, OptionId> = {
  1: 'E', 2: 'C', 3: 'B', 4: 'D', 5: 'B',
  6: 'A', // anulada — valor placeholder, status annulled
  7: 'D', 8: 'C', 9: 'B', 10: 'B', 11: 'A', 12: 'C', 13: 'D', 14: 'E', 15: 'A',
  16: 'E', 17: 'E', 18: 'D', 19: 'A', 20: 'D',
  21: 'C', 22: 'B', 23: 'E', 24: 'A', 25: 'D', 26: 'C', 27: 'B', 28: 'C', 29: 'A',
  30: 'D', 31: 'D', 32: 'C', 33: 'E', 34: 'D', 35: 'E', 36: 'B', 37: 'A', 38: 'A',
  39: 'B', 40: 'E',
}

function build2025Questions(): PastExamQuestion[] {
  const out: PastExamQuestion[] = []
  for (let n = 1; n <= 40; n++) {
    const subject = n <= 20 ? 'matematica' : 'portugues'
    const status = n === 6 ? 'annulled' : 'active'
    out.push({
      year: 2025,
      originalNumber: n,
      subject,
      source: 'Prova oficial unificada 2025/2026 (CMRJ/CMR/CMs) — caderno publicado pelo Colégio Militar',
      officialAnswer: GAB_2025[n],
      topic: status === 'annulled' ? 'Questão anulada' : 'Consulte o caderno oficial',
      status,
      statement:
        'Enunciado disponível no caderno de questões oficial publicado pelo Colégio Militar. ' +
        'Consulte a fonte abaixo para ler a questão na íntegra.',
      options: [
        { id: 'A', text: 'A' },
        { id: 'B', text: 'B' },
        { id: 'C', text: 'C' },
        { id: 'D', text: 'D' },
        { id: 'E', text: 'E' },
      ],
      explanation:
        status === 'annulled'
          ? 'Questão anulada pela banca (Art. 54 do Manual do Candidato). Não prejudica o score.'
          : 'Gabarito oficial registrado. Para a explicação completa, consulte o caderno e o gabarito oficial.',
      sourceUrl: 'https://cmr.eb.mil.br/images/PDF/Concurso%202025/Prova%20Processo%20Seletivo%20CMR%2025-26.pdf',
    })
  }
  return out
}

export const pastExams: PastExam[] = [
  {
    year: 2025,
    school: 'Colégios Militares (exame unificado, incluindo CMRJ)',
    grade: '6º ano do Ensino Fundamental',
    examDate: '2025-10-19',
    sourceUrl: 'https://cmr.eb.mil.br/images/PDF/Concurso%202025/Prova%20Processo%20Seletivo%20CMR%2025-26.pdf',
    officialSource: true,
    questions: build2025Questions(),
    answerKey: GAB_2025,
    annulledQuestions: [6],
    notes:
      'Exame Intelectual unificado 2025/2026, aplicado em 19/10/2025 a todos os Colégios Militares ' +
      '(incluindo o CMRJ), com 40 questões objetivas (20 Matemática + 20 Português) e Produção Textual. ' +
      'Gabarito definitivo oficial: questão 06 ANULADA; questão 14 teve gabarito alterado para E após recurso. ' +
      'Os enunciados completos não são transcritos aqui — consulte o caderno oficial na fonte. ' +
      'Gabarito definitivo: https://cmr.eb.mil.br/images/PDF/Concurso%202025/GABARITO%20DEFINITIVO%202025-2026%20assinado.pdf',
  },
]

export function getPastExamByYear(year: number): PastExam | undefined {
  return pastExams.find((e) => e.year === year)
}

export const pastExamYears: number[] = pastExams.map((e) => e.year).sort((a, b) => b - a)
