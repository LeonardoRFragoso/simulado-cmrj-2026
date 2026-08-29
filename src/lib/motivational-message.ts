/**
 * Motor de mensagens motivacionais ao final de provas e simulados.
 *
 * Princípios:
 * - Tom jovem, positivo, natural, próximo — sem infantilizar ou pressionar.
 * - Nunca promete aprovação oficial nem usa palavras proibidas.
 * - Variação pseudoaleatória entre pelo menos 5 frases por faixa.
 * - Respeita prefers-reduced-motion (tratado na UI, não aqui).
 */

export type ExamType = 'treino' | 'mini-simulado' | 'matematica' | 'portugues' | 'simulado-oficial'

export type MotivationalLevel =
  | 'recomecar'
  | 'quase'
  | 'bom'
  | 'muito-bom'
  | 'excelente'
  | 'gabaritou'

export interface MotivationalContext {
  nickname?: string
  percentage: number
  mathPercentage?: number
  portuguesePercentage?: number
  previousPercentage?: number
  weakestTopic?: string
  examType: ExamType
}

export interface MotivationalResult {
  level: MotivationalLevel
  title: string
  message: string
  improvementMessage?: string
  nextSteps: { label: string; to: string }[]
}

/** Palavras proibidas em qualquer mensagem. */
const FORBIDDEN_WORDS = [
  'fracasso',
  'péssimo',
  'pessimo',
  'burro',
  'reprovado',
  'reprovada',
  'aprovado',
  'aprovada',
  'passou',
  'passou!',
  'vaga garantida',
  'aprovação',
]

/** Frases que indicam aprovação oficial — proibidas. */
const FORBIDDEN_PHRASES = [
  'vaga está garantida',
  'vaga garantida',
  'seria aprovado',
  'seria aprovada',
  'Você passou',
  'Você foi aprovado',
  'Você foi aprovada',
]

function containsForbidden(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    FORBIDDEN_WORDS.some((w) => lower.includes(w.toLowerCase())) ||
    FORBIDDEN_PHRASES.some((p) => text.includes(p))
  )
}

/** Validação pública (usada em testes). */
export function assertNoForbiddenWords(messages: string[]): string[] {
  return messages.filter(containsForbidden)
}

/** PRNG simples e determinístico (LCG) para permitir variação reproduzível. */
function makeRng(seed: number): () => number {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

/** Substitui {nome} pelo nickname ou remove o marcador. */
function personalize(template: string, nickname?: string): string {
  const name = nickname?.trim()
  if (name) {
    return template.replace(/\{nome\}/g, name)
  }
  // Sem nickname: remove ", {nome}!" e " {nome}" de forma natural
  return template
    .replace(/,\s*\{nome\}!/g, '!')
    .replace(/\s*\{nome\}!/g, '!')
    .replace(/,\s*\{nome\},/g, ',')
    .replace(/\s*\{nome\},/g, ',')
    .replace(/,\s*\{nome\}/g, '')
    .replace(/\s*\{nome\}/g, '')
    .replace(/\{nome\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim()
}

interface Band {
  level: MotivationalLevel
  min: number
  max: number
  titles: string[]
  messages: string[]
}

const BANDS: Band[] = [
  {
    level: 'recomecar',
    min: 0,
    max: 39,
    titles: [
      'Calma, {nome}!',
      'Tudo bem, {nome}!',
      'Bora tentar de novo, {nome}!',
      'Não desanima, {nome}!',
      'Faz parte do treino, {nome}!',
    ],
    messages: [
      'A gente sabe que você pode fazer bem melhor que isso. Dá uma olhada no que errou, treina mais um pouco e tenta de novo. Tenho certeza que você ainda vai tirar onda nessa prova!',
      'Essa não foi das melhores, mas faz parte do treino. Cada erro daqui é uma chance a menos de errar no dia da prova. Bora revisar?',
      'Errar agora é bom: mostra exatamente onde falta treinar. Dá uma revisada nos erros e tenta de novo que você chega lá!',
      'Não é o resultado que você queria, mas é ótimo para saber onde focar. Revisa os erros com calma e bora para a próxima!',
      'O começo é sempre assim. O importante é não parar. Olha o que errou, treina mais um pouco e logo as coisas começam a encaixar!',
    ],
  },
  {
    level: 'quase',
    min: 40,
    max: 49,
    titles: [
      'Tá quase, {nome}!',
      'Por pouco, {nome}!',
      'Quase lá, {nome}!',
      'Foi chegando, {nome}!',
      'Falta pouco, {nome}!',
    ],
    messages: [
      'Foi por pouco! Você já está chegando lá. Revisa os assuntos em que mais errou e tenta novamente.',
      'Tá quase! Mais um pouco de treino e essa nota sobe.',
      'Você está no caminho. Falta pouquinho para passar de fase. Revisa o que errou e bora de novo!',
      'Quase deu! Esse resultado mostra que você tem base. Agora é lapidar os detalhes e tentar mais uma vez.',
      'Tá colando! Com mais um pouco de treino focado nos pontos fracos, essa nota sobe rápido.',
    ],
  },
  {
    level: 'bom',
    min: 50,
    max: 69,
    titles: [
      'Boa, {nome}!',
      'Bom trabalho, {nome}!',
      'Mandou bem, {nome}!',
      'Resultado sólido, {nome}!',
      'Tá no caminho, {nome}!',
    ],
    messages: [
      'Você já mostrou que tem uma base legal. Agora vamos transformar os erros em pontos.',
      'Você já está acertando bastante coisa. Agora é revisar os detalhes que ainda estão escapando.',
      'Resultado bacana! O próximo passo é pegar os erros e transformálos em acertos na próxima tentativa.',
      'Boa! Você tem uma base sólida. Continua treinando que os pontos sobem rápido.',
      'Mandou bem! O treino está dando resultado. Agora é focar nos pontos que ainda escapam.',
    ],
  },
  {
    level: 'muito-bom',
    min: 70,
    max: 84,
    titles: [
      'Muito bom, {nome}!',
      'Mandou bem, {nome}!',
      'Resultado forte, {nome}!',
      'Tá indo bem, {nome}!',
      'Excelente ritmo, {nome}!',
    ],
    messages: [
      'Seu resultado já está forte. Continua treinando para corrigir os poucos pontos que ainda estão escapando.',
      'Você está mostrando que o estudo está funcionando. Vamos buscar ainda mais?',
      'Resultado muito bom! Faltam só alguns ajustes para chegar num nível ainda mais alto.',
      'Tá indo muito bem! Com mais um pouco de treino nos pontos fracos, você chega num nível excelente.',
      'Seu desempenho está forte. Continua assim e revisa os últimos detalhes.',
    ],
  },
  {
    level: 'excelente',
    min: 85,
    max: 99,
    titles: [
      'Excelente, {nome}!',
      'Que resultado, {nome}!',
      'Tá voando, {nome}!',
      'Quase perfeito, {nome}!',
      'Domínio muito bom, {nome}!',
    ],
    messages: [
      'Você está mostrando um domínio muito bom da prova. Continua nesse ritmo.',
      'Está muito forte. Agora usa o Caderno de Erros para acertar os últimos detalhes.',
      'Resultado excelente. Agora o desafio é manter esse nível até o dia da prova.',
      'Resultado muito forte. Continua assim e revisa os poucos erros para fechar tudo.',
      'Que desempenho! Você está com um domínio muito bom. Mantém o treino para não perder o ritmo.',
    ],
  },
  {
    level: 'gabaritou',
    min: 100,
    max: 100,
    titles: [
      'Gabaritou, {nome}!',
      '100%, {nome}!',
      'Perfeito, {nome}!',
      'Mandou tudo, {nome}!',
      'Resultado máximo, {nome}!',
    ],
    messages: [
      '100%! Resultado excelente. Agora mantém o ritmo, porque consistência é o que vai fazer diferença no dia da prova.',
      'Gabaritou! Mostrou domínio total da prova. O desafio agora é manter essa consistência até o dia da prova.',
      '100%! Você acertou tudo. Continua treinando para manter esse nível no dia oficial.',
      'Mandou tudo! Resultado perfeito. Mantém o ritmo e continua revisando para não perder o embalo.',
      'Resultado máximo! Você está muito bem preparado. O seg agora é manter a consistência até a prova.',
    ],
  },
]

function findBand(percentage: number): Band {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)))
  const band = BANDS.find((b) => clamped >= b.min && clamped <= b.max)
  if (!band) return BANDS[0]
  return band
}

function pickFrom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** Mensagem de evolução comparando com resultado anterior. */
function buildImprovementMessage(
  current: number,
  previous: number | undefined,
  nickname?: string,
): string | undefined {
  if (previous === undefined || previous === null) return undefined
  const delta = Math.round(current - previous)
  const name = nickname?.trim()
  if (delta >= 5) {
    return name
      ? `Olha essa evolução, ${name}: você passou de ${previous}% para ${current}%! Seu estudo está dando resultado.`
      : `Olha essa evolução: você passou de ${previous}% para ${current}%! Seu estudo está dando resultado.`
  }
  if (delta >= -2) {
    return 'Você manteve um resultado consistente. Continua trabalhando nos pontos fracos.'
  }
  return name
    ? `Hoje o resultado ficou abaixo do último simulado, ${name}, mas isso faz parte. Vamos olhar onde os pontos escaparam e usar isso na próxima tentativa.`
    : 'Hoje o resultado ficou abaixo do último simulado, mas isso faz parte. Vamos olhar onde os pontos escaparam e usar isso na próxima tentativa.'
}

/** CTAs por faixa de desempenho. */
function buildNextSteps(
  level: MotivationalLevel,
  examType: ExamType,
  weakestTopic?: string,
): { label: string; to: string }[] {
  const isSimuladoOficial = examType === 'simulado-oficial'
  const baseSteps: { label: string; to: string }[] = []

  if (level === 'recomecar' || level === 'quase') {
    baseSteps.push({ label: 'Revisar meus erros', to: '/caderno-de-erros' })
    if (weakestTopic) {
      baseSteps.push({ label: 'Estudar assuntos fracos', to: '/estudar' })
    }
    baseSteps.push({ label: 'Tentar novamente', to: isSimuladoOficial ? '/simulado' : '/treino/rapido' })
  } else if (level === 'bom') {
    baseSteps.push({ label: 'Revisão do Dia', to: '/revisao/hoje' })
    if (weakestTopic) {
      baseSteps.push({ label: 'Praticar assunto mais fraco', to: '/treino/assunto' })
    }
  } else {
    baseSteps.push({ label: 'Revisar últimos erros', to: '/caderno-de-erros' })
    baseSteps.push({ label: isSimuladoOficial ? 'Fazer outro simulado' : 'Fazer novo treino', to: isSimuladoOficial ? '/simulado' : '/treino/rapido' })
  }

  return baseSteps
}

/**
 * Gera a mensagem motivacional para o contexto dado.
 * @param seed Semente para seleção pseudoaleatória (default: Date.now()).
 */
export function getMotivationalMessage(
  ctx: MotivationalContext,
  seed: number = Date.now(),
): MotivationalResult {
  const band = findBand(ctx.percentage)
  const rng = makeRng(seed)

  const title = personalize(pickFrom(band.titles, rng), ctx.nickname)
  const message = personalize(pickFrom(band.messages, rng), ctx.nickname)

  // Mensagem de disciplina (apenas simulado oficial com dados de ambas)
  let disciplineNote: string | undefined
  if (
    ctx.examType === 'simulado-oficial' &&
    ctx.mathPercentage !== undefined &&
    ctx.portuguesePercentage !== undefined
  ) {
    const mathPct = ctx.mathPercentage
    const portPct = ctx.portuguesePercentage
    const mathApproved = mathPct >= 50
    const portApproved = portPct >= 50
    const name = ctx.nickname?.trim()

    if (mathApproved && !portApproved) {
      disciplineNote = name
        ? `Seu resultado geral foi bom, ${name}! Matemática está muito forte. Agora o principal foco deve ser Português, onde ainda dá para buscar alguns pontos importantes.`
        : 'Seu resultado geral foi bom! Matemática está muito forte. Agora o principal foco deve ser Português, onde ainda dá para buscar alguns pontos importantes.'
    } else if (portApproved && !mathApproved) {
      disciplineNote = name
        ? `Seu resultado geral foi bom, ${name}! Português está muito forte. Agora o principal foco deve ser Matemática, onde ainda dá para buscar alguns pontos importantes.`
        : 'Seu resultado geral foi bom! Português está muito forte. Agora o principal foco deve ser Matemática, onde ainda dá para buscar alguns pontos importantes.'
    }
  }

  const improvementMessage = buildImprovementMessage(ctx.percentage, ctx.previousPercentage, ctx.nickname)

  // Combina mensagem de disciplina com evolução se ambas existirem
  const fullImprovement = [disciplineNote, improvementMessage].filter(Boolean).join(' ') || undefined

  // Assunto mais fraco
  let weakestNote: string | undefined
  if (ctx.weakestTopic) {
    weakestNote = `Seu principal ponto para revisar agora é ${ctx.weakestTopic}.`
  }

  const nextSteps = buildNextSteps(band.level, ctx.examType, ctx.weakestTopic)

  // Anexa nota do assunto fraco à mensagem principal se existir
  const fullMessage = weakestNote ? `${message} ${weakestNote}` : message

  return {
    level: band.level,
    title,
    message: fullMessage,
    improvementMessage: fullImprovement,
    nextSteps,
  }
}

/** Utilitário: calcula o tópico mais fraco a partir de uma lista de questões e respostas. */
export function computeWeakestTopic(
  questions: { id: string; topic: string }[],
  answers: Record<string, string>,
  correctOption: (q: { id: string; correctOption: string }) => string,
  minAnswered = 2,
): string | undefined {
  const map = new Map<string, { total: number; correct: number }>()
  for (const q of questions) {
    const sel = answers[q.id]
    if (!sel) continue
    const r = map.get(q.topic) ?? { total: 0, correct: 0 }
    r.total += 1
    if (sel === correctOption(q as never)) r.correct += 1
    map.set(q.topic, r)
  }
  const candidates = Array.from(map.entries())
    .filter(([, r]) => r.total >= minAnswered)
    .map(([topic, r]) => ({ topic, acc: r.correct / r.total }))
    .sort((a, b) => a.acc - b.acc)
  return candidates[0]?.topic
}

/** Utilitário: encontra o resultado anterior comparável para evolução. */
export function findPreviousPercentage(
  simulados: { type?: string; averageObjective: number; mathCorrect: number; mathTotal: number; portugueseCorrect: number; portugueseTotal: number }[],
  currentType?: string,
): number | undefined {
  const comparable = simulados
    .filter((s) => !currentType || s.type === currentType || (!s.type && !currentType))
    .slice(-2, -1) // penúltimo (o último é o atual)
  if (comparable.length === 0) return undefined
  const prev = comparable[0]
  const total = prev.mathTotal + prev.portugueseTotal
  if (total === 0) return undefined
  return Math.round(((prev.mathCorrect + prev.portugueseCorrect) / total) * 100)
}
