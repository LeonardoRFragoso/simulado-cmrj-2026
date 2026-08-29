import type { Difficulty, Question, QuestionExplanation } from '../../types/exam'
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
    explanationData?: QuestionExplanation
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
        explanationData: item.explanationData,
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
        explanationData: {
          short: `${num(a)} + ${num(b)} = ${num(r)} alunos.`,
          concept: 'Adição de números naturais: somar quantidades de grupos diferentes para obter o total.',
          steps: [
            `Identifique os valores: ${num(a)} alunos no turno da manhã e ${num(b)} no turno da tarde.`,
            `Some os dois valores: ${num(a)} + ${num(b)} = ${num(r)}.`,
            `O total é ${num(r)} alunos.`,
          ],
          tip: 'Em problemas que pedem o total, some as quantidades de cada grupo.',
          commonMistake: 'Alguns alunos subtraem em vez de somar quando a pergunta pede o total.',
          hints: [
            'A pergunta pede o total de alunos, então qual operação usar?',
            'Some os alunos da manhã com os da tarde.',
          ],
        },
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
        explanationData: {
          short: `${num(a)} − ${num(b)} = ${num(r)} pães.`,
          concept: 'Subtração de números naturais: encontrar a diferença entre o que foi produzido e o que foi vendido.',
          steps: [
            `Identifique os valores: ${num(a)} pães produzidos e ${num(b)} pães vendidos.`,
            `Subtraia o que foi vendido do que foi produzido: ${num(a)} − ${num(b)} = ${num(r)}.`,
            `Restaram ${num(r)} pães.`,
          ],
          tip: 'Quando a pergunta pede quanto restou, subtraia o que saiu do que havia.',
          commonMistake: 'Alguns alunos somam em vez de subtrair quando a pergunta pede o que restou.',
          hints: [
            'A pergunta pede quantos pães restaram, então qual operação usar?',
            'Subtraia os pães vendidos dos pães produzidos.',
          ],
        },
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
        explanationData: {
          short: `${num(a)} × ${num(b)} = ${num(r)} bombons.`,
          concept: 'Multiplicação de números naturais: somar repetidamente a mesma quantidade.',
          steps: [
            `Identifique os valores: ${num(a)} bombons por caixa e ${num(b)} caixas.`,
            `Multiplique: ${num(a)} × ${num(b)} = ${num(r)}.`,
            `Há ${num(r)} bombons no total.`,
          ],
          tip: 'Quando há grupos iguais, multiplique o número de grupos pela quantidade em cada grupo.',
          commonMistake: 'Alguns alunos somam em vez de multiplicar quando há grupos iguais.',
          hints: [
            'Há vários grupos iguais, qual operação é mais eficiente?',
            'Multiplique o número de bombons por caixa pelo número de caixas.',
          ],
        },
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
        explanationData: {
          short: `${num(a)} ÷ ${num(b)} = ${num(qv)} balas para cada criança.`,
          concept: 'Divisão exata de números naturais: repartir uma quantidade em partes iguais.',
          steps: [
            `Identifique os valores: ${num(a)} balas para ${num(b)} crianças.`,
            `Divida: ${num(a)} ÷ ${num(b)} = ${num(qv)}.`,
            `Cada criança recebe ${num(qv)} balas.`,
          ],
          tip: 'Para dividir igualmente, use a divisão; confere multiplicando o resultado pelo número de partes.',
          commonMistake: 'Alguns alunos confundem dividendo e divisor, invertendo a ordem da divisão.',
          hints: [
            'A divisão deve ser exata, então qual número dividir por qual?',
            `Divida o total de balas pelo número de crianças (${num(b)}).`,
          ],
        },
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
        explanationData: {
          short: `Primeiro a multiplicação: ${b} × ${c} = ${b * c}. Depois: ${a} + ${b * c} = ${r}.`,
          concept: 'Ordem das operações: multiplicação antes da adição.',
          steps: [
            `Resolva primeiro a multiplicação: ${b} × ${c} = ${b * c}.`,
            `Depois some: ${a} + ${b * c} = ${r}.`,
            `O resultado é ${r}.`,
          ],
          tip: 'Na ordem das operações, multiplicação e divisão vêm antes de adição e subtração.',
          commonMistake: 'Resolver da esquerda para a direita sem respeitar a precedência, somando antes de multiplicar.',
          hints: [
            'Lembre-se da ordem das operações: qual vem primeiro, adição ou multiplicação?',
            'Resolva a multiplicação antes de somar.',
          ],
        },
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
        explanationData: {
          short: `${a.toLocaleString('pt-BR')} ${op} ${b.toLocaleString('pt-BR')} = ${rs}.`,
          concept: 'Operações com números decimais: alinhar a vírgula ao calcular.',
          steps: [
            `Identifique os valores: ${a.toLocaleString('pt-BR')} e ${b.toLocaleString('pt-BR')}.`,
            `Realize a operação ${op} alinhando as casas decimais.`,
            `O resultado é ${rs}.`,
          ],
          tip: 'Ao somar ou subtrair decimais, alinhe as vírgulas para não trocar as casas.',
          commonMistake: 'Esquecer de alinhar a vírgula e somar colunas de ordens diferentes.',
          hints: [
            'Lembre-se de alinhar as vírgulas antes de calcular.',
            `A operação é ${op}; resolva com cuidado nas casas decimais.`,
          ],
        },
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
        explanationData: {
          short: `Denominadores iguais: somam-se os numeradores. ${n1}/${d} + ${n2}/${d} = ${sum}/${d}${sum >= d ? ` = ${Math.floor(sum / d)} ${sum % d}/${d}` : ''}.`,
          concept: 'Adição de frações com denominadores iguais: somam-se os numeradores e mantém-se o denominador.',
          steps: [
            `Como os denominadores são iguais (${d}), some os numeradores: ${n1} + ${n2} = ${sum}.`,
            `Mantenha o denominador: ${sum}/${d}.`,
            `${sum >= d ? `Simplifique: ${sum}/${d} = ${Math.floor(sum / d)} ${sum % d}/${d}.` : 'A fração já está na forma simplificada.'}`,
          ],
          tip: 'Com denominadores iguais, basta somar os numeradores e conservar o denominador.',
          commonMistake: 'Somar os denominadores junto com os numeradores, obtendo um denominador errado.',
          hints: [
            'As frações têm o mesmo denominador; o que isso facilita?',
            'Some apenas os numeradores e mantenha o denominador.',
          ],
        },
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
        return { statement: `Quantos centímetros há em ${m.v} metros?`, correct: num(r), distractors: [num(m.v * 10), num(m.v * 1000), num(m.v), num(r + 10)], explanation: `1 m = 100 cm. ${m.v} × 100 = ${num(r)} cm.`, explanationData: {
          short: `1 m = 100 cm. ${m.v} × 100 = ${num(r)} cm.`,
          concept: 'Conversão de unidades de comprimento: 1 metro equivale a 100 centímetros.',
          steps: [
            `Identifique a conversão: 1 m = 100 cm.`,
            `Multiplique: ${m.v} × 100 = ${num(r)}.`,
            `O resultado é ${num(r)} cm.`,
          ],
          tip: 'Para converter de metros para centímetros, multiplique por 100.',
          commonMistake: 'Multiplicar por 10 ou por 1000 em vez de 100.',
          hints: [
            'Quantos centímetros cabem em 1 metro?',
            'Multiplique o valor em metros por 100.',
          ],
        } }
      }
      if (kind === 'cm->m') {
        const r = m.v / 100
        return { statement: `Quantos metros há em ${num(m.v)} centímetros?`, correct: num(r), distractors: [num(m.v * 10), num(m.v / 10), num(m.v), num(r + 1)], explanation: `100 cm = 1 m. ${num(m.v)} ÷ 100 = ${num(r)} m.`, explanationData: {
          short: `100 cm = 1 m. ${num(m.v)} ÷ 100 = ${num(r)} m.`,
          concept: 'Conversão de unidades de comprimento: 100 centímetros equivalem a 1 metro.',
          steps: [
            `Identifique a conversão: 100 cm = 1 m.`,
            `Divida: ${num(m.v)} ÷ 100 = ${num(r)}.`,
            `O resultado é ${num(r)} m.`,
          ],
          tip: 'Para converter de centímetros para metros, divida por 100.',
          commonMistake: 'Dividir por 10 ou multiplicar em vez de dividir por 100.',
          hints: [
            'Quantos centímetros formam 1 metro?',
            'Divida o valor em centímetros por 100.',
          ],
        } }
      }
      if (kind === 'km->m') {
        const r = m.v * 1000
        return {
          statement: `Quantos metros há em ${m.v} quilômetros?`,
          correct: num(r),
          distractors: [num(m.v * 100), num(m.v * 10), num(m.v), num(r + 100)],
          explanation: `1 km = 1000 m. ${m.v} × 1000 = ${num(r)} m.`,
          explanationData: {
            short: `1 km = 1000 m. ${m.v} × 1000 = ${num(r)} m.`,
            concept: 'Conversão de unidades de comprimento: 1 quilômetro equivale a 1000 metros.',
            steps: [
              `Identifique a conversão: 1 km = 1000 m.`,
              `Multiplique: ${m.v} × 1000 = ${num(r)}.`,
              `O resultado é ${num(r)} m.`,
            ],
            tip: 'Para converter de quilômetros para metros, multiplique por 1000.',
            commonMistake: 'Multiplicar por 100 em vez de 1000.',
            hints: [
              'Quantos metros formam 1 quilômetro?',
              'Multiplique o valor em quilômetros por 1000.',
            ],
          },
        }
      }
      if (kind === 'g->kg') {
        const r = m.v / 1000
        return {
          statement: `Quantos quilogramas há em ${num(m.v)} gramas?`,
          correct: num(r),
          distractors: [num(m.v * 10), num(m.v / 100), num(m.v), num(r + 1)],
          explanation: `1000 g = 1 kg. ${num(m.v)} ÷ 1000 = ${num(r)} kg.`,
          explanationData: {
            short: `1000 g = 1 kg. ${num(m.v)} ÷ 1000 = ${num(r)} kg.`,
            concept: 'Conversão de unidades de massa: 1000 gramas equivalem a 1 quilograma.',
            steps: [
              `Identifique a conversão: 1000 g = 1 kg.`,
              `Divida: ${num(m.v)} ÷ 1000 = ${num(r)}.`,
              `O resultado é ${num(r)} kg.`,
            ],
            tip: 'Para converter de gramas para quilogramas, divida por 1000.',
            commonMistake: 'Dividir por 100 em vez de 1000.',
            hints: [
              'Quantos gramas formam 1 quilograma?',
              'Divida o valor em gramas por 1000.',
            ],
          },
        }
      }
      if (kind === 'kg->g') {
        const r = m.v * 1000
        return {
          statement: `Quantos gramas há em ${m.v} quilogramas?`,
          correct: num(r),
          distractors: [num(m.v * 100), num(m.v * 10), num(m.v), num(r + 100)],
          explanation: `1 kg = 1000 g. ${m.v} × 1000 = ${num(r)} g.`,
          explanationData: {
            short: `1 kg = 1000 g. ${m.v} × 1000 = ${num(r)} g.`,
            concept: 'Conversão de unidades de massa: 1 quilograma equivale a 1000 gramas.',
            steps: [
              `Identifique a conversão: 1 kg = 1000 g.`,
              `Multiplique: ${m.v} × 1000 = ${num(r)}.`,
              `O resultado é ${num(r)} g.`,
            ],
            tip: 'Para converter de quilogramas para gramas, multiplique por 1000.',
            commonMistake: 'Multiplicar por 100 em vez de 1000.',
            hints: [
              'Quantos gramas formam 1 quilograma?',
              'Multiplique o valor em quilogramas por 1000.',
            ],
          },
        }
      }
      const r = m.v * 1000
      return {
        statement: `Quantos mililitros há em ${m.v} litros?`,
        correct: num(r),
        distractors: [num(m.v * 100), num(m.v * 10), num(m.v), num(r + 100)],
        explanation: `1 L = 1000 mL. ${m.v} × 1000 = ${num(r)} mL.`,
        explanationData: {
          short: `1 L = 1000 mL. ${m.v} × 1000 = ${num(r)} mL.`,
          concept: 'Conversão de unidades de capacidade: 1 litro equivale a 1000 mililitros.',
          steps: [
            `Identifique a conversão: 1 L = 1000 mL.`,
            `Multiplique: ${m.v} × 1000 = ${num(r)}.`,
            `O resultado é ${num(r)} mL.`,
          ],
          tip: 'Para converter de litros para mililitros, multiplique por 1000.',
          commonMistake: 'Multiplicar por 100 em vez de 1000.',
          hints: [
            'Quantos mililitros formam 1 litro?',
            'Multiplique o valor em litros por 1000.',
          ],
        },
      }
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
        explanationData: {
          short: `Soma = ${sum}; média = ${sum} ÷ ${n} = ${rs}.`,
          concept: 'A média aritmética é a soma dos valores dividida pela quantidade de valores. Representa o valor central de um conjunto.',
          steps: [
            `Some todas as notas: ${vals.join(' + ')} = ${sum}.`,
            `Divida pela quantidade de notas (${n}): ${sum} ÷ ${n} = ${rs}.`,
            `O resultado é a média aritmética.`,
          ],
          hints: [
            'Lembre-se: média = soma dos valores ÷ quantidade de valores.',
            'Some as notas primeiro, depois divida pelo número de notas.',
            'Verifique se o resultado está entre o menor e o maior valor.',
          ],
        },
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
        return {
          statement: `Qual é o perímetro de um quadrado de lado ${l} cm?`,
          correct: num(r),
          distractors: [num(l * l), num(l * 2), num(l), num(r + 4)],
          explanation: `Perímetro do quadrado = 4 × lado = 4 × ${l} = ${r} cm.`,
          explanationData: {
            short: `Perímetro do quadrado = 4 × lado = 4 × ${l} = ${r} cm.`,
            concept: 'Perímetro é a soma dos lados de uma figura. Área é a medida da superfície. Retângulo: P=2(b+h), A=b×h. Quadrado: P=4l, A=l².',
            steps: [
              `Identifique o lado do quadrado: ${l} cm.`,
              `Multiplique o lado por 4 (4 lados iguais): 4 × ${l} = ${r} cm.`,
              `O perímetro é ${r} cm.`,
            ],
            hints: [
              'Perímetro é a soma de todos os lados da figura.',
              'Um quadrado tem 4 lados iguais, então some 4 vezes o lado.',
              'Confira a unidade: perímetro é em cm (linear), não cm².',
            ],
          },
        }
      }
      const b = int(rng, 4, 20)
      const h = int(rng, 3, 15)
      const r = b * h
      return {
        statement: `Qual é a área de um retângulo de base ${b} cm e altura ${h} cm?`,
        correct: num(r),
        distractors: [num(2 * (b + h)), num(b + h), num(b * h * 2), num(r + b)],
        explanation: `Área do retângulo = base × altura = ${b} × ${h} = ${r} cm².`,
        explanationData: {
          short: `Área do retângulo = base × altura = ${b} × ${h} = ${r} cm².`,
          concept: 'Perímetro é a soma dos lados de uma figura. Área é a medida da superfície. Retângulo: P=2(b+h), A=b×h. Quadrado: P=4l, A=l².',
          steps: [
            `Identifique a base (${b} cm) e a altura (${h} cm).`,
            `Multiplique base × altura: ${b} × ${h} = ${r}.`,
            `A área é ${r} cm².`,
          ],
          hints: [
            'Área mede a superfície da figura (em cm²).',
            'Para retângulo: área = base × altura.',
            'Não confunda com perímetro (que é a soma dos lados).',
          ],
        },
      }
    },
  }),
]
