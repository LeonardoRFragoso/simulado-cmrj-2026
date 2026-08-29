import { readFileSync, writeFileSync } from 'node:fs'

const MATH_FILE = 'src/data/questions/math-conceptual.ts'

const GENERIC_STEPS = [
  'Identifique os dados do problema e o que se pede.',
  'Aplique a operação ou regra necessária para encontrar o resultado.',
  'Verifique se o resultado encontrado está entre as alternativas.',
]

const GENERIC_HINTS = [
  'Leia o problema com atenção e identifique o que se pede.',
  'Pense na operação matemática necessária para resolver.',
  'Verifique se o resultado faz sentido no contexto do problema.',
]

/** Divide short em passos quando os steps atuais são genéricos. */
function stepsFromShort(short: string): string[] {
  const parts = short.includes(';')
    ? short.split(';').map((s) => s.trim()).filter(Boolean)
    : short.split(/(?<=[.!?])\s+(?=[A-ZÁÂÃÉÊÍÓÔÕÚ])/).map((s) => s.trim()).filter(Boolean)
  return parts.length >= 2
    ? parts
    : [short, 'Confira o resultado com as alternativas apresentadas.']
}

/** Gera hints para Matemática a partir do short e concept. */
function makeMathHints(short: string, concept: string): string[] {
  let fillIn: string | null = null
  const lastToken = short.trim().split(/\s+/).pop()
  if (lastToken) {
    const token = lastToken.replace(/[.,;:!?]$/, '')
    if (/^\d/.test(token) || /^\d+\/\d+/.test(token)) {
      const pieces = short.trim().split(/\s+/)
      pieces[pieces.length - 1] = '___' + (lastToken.slice(-1).match(/[.,;:!?]/) ? lastToken.slice(-1) : '')
      fillIn = pieces.join(' ')
    }
  }
  const h1 = concept.length < 120 ? `Conceito: ${concept}` : `Conceito: ${concept.slice(0, 120)}...`
  const h2 = fillIn ? `Complete a ideia: ${fillIn}` : 'Relacione o enunciado com o conceito deste tópico.'
  const h3 = 'Confira se a resposta escolhida faz sentido com o cálculo feito.'
  return [h1, h2, h3]
}

function containsGeneric(arr: string, generics: string[]): boolean {
  return generics.some((g) => arr.includes(g))
}

let src = readFileSync(MATH_FILE, 'utf8')
let changedSteps = 0
let changedHints = 0

// Match explanationData: { short: '...', concept: '...', steps: [...], hints: [...] }
const re = /explanationData:\s*\{\s*short:\s*'([^']*)',\s*concept:\s*'([^']*)',\s*steps:\s*\[([^\]]*)\],\s*hints:\s*\[([^\]]*)\]/g

src = src.replace(re, (match, short, concept, stepsBody, hintsBody) => {
  const needsSteps = containsGeneric(stepsBody, GENERIC_STEPS)
  const needsHints = containsGeneric(hintsBody, GENERIC_HINTS)
  if (!needsSteps && !needsHints) return match

  const newSteps = needsSteps ? stepsFromShort(short) : null
  const newHints = needsHints ? makeMathHints(short, concept) : null

  let stepsStr = stepsBody
  let hintsStr = hintsBody

  if (newSteps) {
    stepsStr = newSteps.map((s) => `        '${s}',`).join('\n')
    changedSteps++
  }
  if (newHints) {
    hintsStr = newHints.map((h) => `        '${h}',`).join('\n')
    changedHints++
  }

  return `explanationData: { short: '${short}', concept: '${concept}', steps: [\n${stepsStr}\n      ], hints: [\n${hintsStr}\n      ]`
})

writeFileSync(MATH_FILE, src)
console.log(`${MATH_FILE}: steps substituídas=${changedSteps}, hints substituídas=${changedHints}`)
