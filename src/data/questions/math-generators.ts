import type { Difficulty, Question } from '../../types/exam'
import { indexToOption, q, shuffleOptions } from './builder'

/** PRNG simples para reprodutibilidade */
function makeRng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function int(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

interface GenSpec {
  count: number
  seed: number
  idPrefix: string
  topic: string
  difficulty: Difficulty
  tags: string[]
  make: (rng: () => number, k: number) => {
    statement: string
    correct: string
    distractors: string[]
    explanation: string
    subtopic?: string
  }
}

function build(spec: GenSpec): Question[] {
  const rng = makeRng(spec.seed)
  const out: Question[] = []
  for (let k = 0; k < spec.count; k++) {
    const item = spec.make(rng, k)
    const { options, correctIndex } = shuffleOptions(item.correct, item.distractors, spec.seed + k * 97)
    out.push(
      q({
        id: `${spec.idPrefix}-${String(k + 1).padStart(3, '0')}`,
        subject: 'matematica',
        topic: spec.topic,
        subtopic: item.subtopic,
        statement: item.statement,
        options,
        correct: indexToOption(correctIndex),
        explanation: item.explanation,
        difficulty: spec.difficulty,
        tags: spec.tags,
      }),
    )
  }
  return out
}

function num(n: number): string {
  return n.toLocaleString('pt-BR')
}

const distractorNear = (correct: number, deltas: number[]): string[] =>
  deltas.map((d) => num(correct + d))

export const generatedMath: Question[] = [
  ...build({
    count: 10,
    seed: 11,
    idPrefix: 'mat-adicao',
    topic: 'Adição',
    difficulty: 'facil',
    tags: ['adicao', 'numeros-naturais'],
    make: (rng) => {
      const a = int(rng, 120, 980)
      const b = int(rng, 120, 980)
      const r = a + b
      return {
        statement: `Em uma escola há ${num(a)} alunos no turno da manhã e ${num(b)} no turno da tarde. Quantos alunos há ao todo?`,
        correct: num(r),
        distractors: distractorNear(r, [-10, 11, -100, a - b]),
        explanation: `${num(a)} + ${num(b)} = ${num(r)} alunos.`,
      }
    },
  }),
  ...build({
    count: 10,
    seed: 23,
    idPrefix: 'mat-subtracao',
    topic: 'Subtração',
    difficulty: 'facil',
    tags: ['subtracao', 'numeros-naturais'],
    make: (rng) => {
      const a = int(rng, 400, 1200)
      const b = int(rng, 50, a - 20)
      const r = a - b
      return {
        statement: `Uma padaria produziu ${num(a)} pães e vendeu ${num(b)} até o meio-dia. Quantos pães restaram?`,
        correct: num(r),
        distractors: distractorNear(r, [10, -11, 100, a + b - 2 * r]),
        explanation: `${num(a)} − ${num(b)} = ${num(r)} pães.`,
      }
    },
  }),
  ...build({
    count: 10,
    seed: 37,
    idPrefix: 'mat-multiplicacao',
    topic: 'Multiplicação',
    difficulty: 'media',
    tags: ['multiplicacao', 'numeros-naturais'],
    make: (rng) => {
      const a = int(rng, 12, 48)
      const b = int(rng, 6, 25)
      const r = a * b
      return {
        statement: `Uma caixa contém ${num(a)} bombons. Quantos bombons há em ${num(b)} caixas iguais?`,
        correct: num(r),
        distractors: distractorNear(r, [a + 1, -b, 10, a - 1]),
        explanation: `${num(a)} × ${num(b)} = ${num(r)} bombons.`,
      }
    },
  }),
  ...build({
    count: 10,
    seed: 41,
    idPrefix: 'mat-divisao',
    topic: 'Divisão',
    difficulty: 'media',
    tags: ['divisao', 'numeros-naturais'],
    make: (rng) => {
      const b = int(rng, 4, 12)
      const qv = int(rng, 15, 80)
      const a = b * qv
      return {
        statement: `${num(a)} balas serão divididas igualmente entre ${num(b)} crianças. Quantas balas cada criança recebe?`,
        correct: num(qv),
        distractors: distractorNear(qv, [1, -1, b, -b]),
        explanation: `${num(a)} ÷ ${num(b)} = ${num(qv)} balas para cada criança.`,
      }
    },
  }),
  ...build({
    count: 8,
    seed: 53,
    idPrefix: 'mat-expr',
    topic: 'Expressões numéricas',
    difficulty: 'media',
    tags: ['expressoes-numericas', 'operacoes'],
    make: (rng) => {
      const a = int(rng, 2, 9)
      const b = int(rng, 2, 9)
      const c = int(rng, 2, 9)
      const r = a + b * c
      return {
        statement: `Qual é o resultado de ${a} + ${b} × ${c}?`,
        correct: num(r),
        distractors: distractorNear(r, [-(b * c - a), (a + b) * c - r, -1, 1]),
        explanation: `Primeiro a multiplicação: ${b} × ${c} = ${b * c}. Depois: ${a} + ${b * c} = ${r}.`,
      }
    },
  }),
  ...build({
    count: 8,
    seed: 67,
    idPrefix: 'mat-decop',
    topic: 'Operações com decimais',
    difficulty: 'media',
    tags: ['decimais', 'operacoes'],
    make: (rng) => {
      const a = int(rng, 12, 89) / 10
      const b = int(rng, 12, 89) / 10
      const op = pick(rng, ['+', '-'] as const)
      const r = op === '+' ? a + b : a - b
      const rs = r.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
      return {
        statement: `Calcule: ${a.toLocaleString('pt-BR')} ${op} ${b.toLocaleString('pt-BR')}.`,
        correct: rs,
        distractors: [
          (r + 0.1).toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
          (r - 0.1).toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
          (r * 10).toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
          (r + 1).toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
        ],
        explanation: `${a.toLocaleString('pt-BR')} ${op} ${b.toLocaleString('pt-BR')} = ${rs}.`,
      }
    },
  }),
  ...build({
    count: 8,
    seed: 79,
    idPrefix: 'mat-fracop',
    topic: 'Operações com frações',
    difficulty: 'media',
    tags: ['fracoes', 'operacoes'],
    make: (rng) => {
      const d = pick(rng, [2, 3, 4, 5, 6, 8])
      const n1 = int(rng, 1, d - 1)
      const n2 = int(rng, 1, d - 1)
      const sum = n1 + n2
      const correct = sum >= d ? `${Math.floor(sum / d)} ${sum % d}/${d}`.trim() : `${sum}/${d}`
      return {
        statement: `Some as frações ${n1}/${d} + ${n2}/${d}.`,
        correct: correct.replace(/\s+/, ' e '),
        distractors: [
          `${n1 + n2}/${d + d}`,
          `${n1 * n2}/${d}`,
          `${Math.abs(n1 - n2)}/${d}`,
          `${n1 + n2 + 1}/${d}`,
        ],
        explanation: `Denominadores iguais: somam-se os numeradores. ${n1}/${d} + ${n2}/${d} = ${sum}/${d}${sum >= d ? ` = ${Math.floor(sum / d)} ${sum % d}/${d}` : ''}.`,
      }
    },
  }),
  ...build({
    count: 8,
    seed: 83,
    idPrefix: 'mat-unidades',
    topic: 'Transformação de unidades',
    difficulty: 'media',
    tags: ['unidades', 'conversao'],
    make: (rng) => {
      const kind = pick(rng, ['m->cm', 'cm->m', 'km->m', 'g->kg', 'kg->g', 'l->ml'] as const)
      const map: Record<string, { v: number }> = {
        'm->cm': { v: int(rng, 2, 20) },
        'cm->m': { v: int(rng, 200, 900) },
        'km->m': { v: int(rng, 2, 15) },
        'g->kg': { v: int(rng, 2000, 9000) },
        'kg->g': { v: int(rng, 2, 12) },
        'l->ml': { v: int(rng, 2, 9) },
      }
      const m = map[kind]
      if (kind === 'm->cm') {
        const r = m.v * 100
        return { statement: `Quantos centímetros há em ${m.v} metros?`, correct: num(r), distractors: [num(m.v * 10), num(m.v * 1000), num(m.v), num(r + 10)], explanation: `1 m = 100 cm. ${m.v} × 100 = ${num(r)} cm.` }
      }
      if (kind === 'cm->m') {
        const r = m.v / 100
        return { statement: `Quantos metros há em ${num(m.v)} centímetros?`, correct: num(r), distractors: [num(m.v * 10), num(m.v / 10), num(m.v), num(r + 1)], explanation: `100 cm = 1 m. ${num(m.v)} ÷ 100 = ${num(r)} m.` }
      }
      if (kind === 'km->m') {
        const r = m.v * 1000
        return { statement: `Quantos metros há em ${m.v} quilômetros?`, correct: num(r), distractors: [num(m.v * 100), num(m.v * 10), num(m.v), num(r + 100)], explanation: `1 km = 1000 m. ${m.v} × 1000 = ${num(r)} m.` }
      }
      if (kind === 'g->kg') {
        const r = m.v / 1000
        return { statement: `Quantos quilogramas há em ${num(m.v)} gramas?`, correct: num(r), distractors: [num(m.v * 10), num(m.v / 100), num(m.v), num(r + 1)], explanation: `1000 g = 1 kg. ${num(m.v)} ÷ 1000 = ${num(r)} kg.` }
      }
      if (kind === 'kg->g') {
        const r = m.v * 1000
        return { statement: `Quantos gramas há em ${m.v} quilogramas?`, correct: num(r), distractors: [num(m.v * 100), num(m.v * 10), num(m.v), num(r + 100)], explanation: `1 kg = 1000 g. ${m.v} × 1000 = ${num(r)} g.` }
      }
      const r = m.v * 1000
      return { statement: `Quantos mililitros há em ${m.v} litros?`, correct: num(r), distractors: [num(m.v * 100), num(m.v * 10), num(m.v), num(r + 100)], explanation: `1 L = 1000 mL. ${m.v} × 1000 = ${num(r)} mL.` }
    },
  }),
  ...build({
    count: 8,
    seed: 97,
    idPrefix: 'mat-media',
    topic: 'Média aritmética',
    difficulty: 'media',
    tags: ['media', 'estatistica'],
    make: (rng) => {
      const n = int(rng, 4, 6)
      const vals: number[] = []
      for (let i = 0; i < n; i++) vals.push(int(rng, 4, 10))
      const sum = vals.reduce((a, b) => a + b, 0)
      const r = sum / n
      const rs = Number.isInteger(r) ? num(r) : r.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
      return {
        statement: `As notas de um aluno foram: ${vals.join(', ')}. Qual é a média aritmética?`,
        correct: rs,
        distractors: [num(sum), num(Math.round(r) + 3), num(Math.max(...vals) * 2), num(Math.min(...vals))],
        explanation: `Soma = ${sum}; média = ${sum} ÷ ${n} = ${rs}.`,
      }
    },
  }),
  ...build({
    count: 8,
    seed: 101,
    idPrefix: 'mat-perim',
    topic: 'Perímetro e área',
    difficulty: 'media',
    tags: ['perimetro', 'geometria'],
    make: (rng) => {
      const kind = pick(rng, ['perim', 'area'] as const)
      if (kind === 'perim') {
        const l = int(rng, 5, 30)
        const r = l * 4
        return { statement: `Qual é o perímetro de um quadrado de lado ${l} cm?`, correct: num(r), distractors: [num(l * l), num(l * 2), num(l), num(r + 4)], explanation: `Perímetro do quadrado = 4 × lado = 4 × ${l} = ${r} cm.` }
      }
      const b = int(rng, 4, 20)
      const h = int(rng, 3, 15)
      const r = b * h
      return { statement: `Qual é a área de um retângulo de base ${b} cm e altura ${h} cm?`, correct: num(r), distractors: [num(2 * (b + h)), num(b + h), num(b * h * 2), num(r + b)], explanation: `Área do retângulo = base × altura = ${b} × ${h} = ${r} cm².` }
    },
  }),
]
