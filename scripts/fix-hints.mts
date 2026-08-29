import { readFileSync, writeFileSync } from 'node:fs'

const FILES = [
  'src/data/questions/math-conceptual.ts',
  'src/data/questions/portuguese-conceptual.ts',
  'src/data/questions/portuguese-conceptual-2.ts',
]

const PT_GENERIC = [
  'Releia o texto com atenção para localizar a informação.',
  'Observe as palavras-chave relacionadas ao que se pergunta.',
  'Considere o contexto para interpretar corretamente.',
]

const MATH_GENERIC = [
  'Leia o problema com atenção e identifique o que se pede.',
  'Pense na operação matemática necessária para resolver.',
  'Verifique se o resultado faz sentido no contexto do problema.',
]

/** Escapa uma string para regex literal. */
function reEscape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Gera hints para Matemática a partir do short e concept. */
function makeMathHints(short: string, concept: string): string[] {
  // Tenta retirar o número/fração final do short para criar uma dica preenchedora
  let fillIn: string | null = null
  const lastToken = short.trim().split(/\s+/).pop()
  const lastPunct = lastToken ? /[.,;:!?]$/.test(lastToken) : false
  const token = lastToken ? lastToken.replace(/[.,;:!?]$/, '') : ''
  if (token && (/^\d/.test(token) || /^\d+\/\d+/.test(token) || /[\d.,\-]+/.test(token))) {
    const pieces = short.trim().split(/\s+/)
    pieces[pieces.length - 1] = (lastPunct ? '___.' : '___')
    fillIn = pieces.join(' ')
  }
  const h1 = concept.length < 120 ? `Conceito: ${concept}` : `Conceito: ${concept.slice(0, 120)}...`
  const h2 = fillIn ? `Complete a ideia: ${fillIn}` : 'Relacione o enunciado com o conceito deste tópico.'
  const h3 = 'Confira se a resposta escolhida faz sentido com o cálculo feito.'
  return [h1, h2, h3]
}

/** Gera hints para Português a partir do short e concept. */
function makePortugueseHints(short: string, concept: string): string[] {
  let contextHint = 'Procure no texto a passagem relacionada ao que se pergunta.'
  const quoteMatch = short.match(/"([^"]+)"/)
  if (quoteMatch) {
    contextHint = `No texto, procure a parte que fala sobre "${quoteMatch[1].slice(0, 60)}..."`
  }
  const h1 = concept.length < 120 ? `Lembre: ${concept}` : `Lembre: ${concept.slice(0, 120)}...`
  const h2 = contextHint
  const h3 = 'Descarte as alternativas que não têm apoio no texto lido.'
  return [h1, h2, h3]
}

/** Detecta qual padrão genérico está presente no bloco de hints. */
function containsGeneric(hintsStr: string, generics: string[]): boolean {
  return generics.some((g) => hintsStr.includes(g))
}

/** Reescreve o arquivo, substituindo os blocos de hints genéricos. */
function processFile(file: string) {
  let src = readFileSync(file, 'utf8')
  let changed = 0
  let unchanged = 0

  // Match explanationData: { short: '...', concept: '...', hints: [...] }
  const re = /explanationData:\s*\{\s*short:\s*'([^']*)',\s*concept:\s*'([^']*)',\s*hints:\s*\[([^\]]*)\]/g

  src = src.replace(re, (match, short, concept, hintsBody) => {
    const isMath = file.includes('math-conceptual')
    const generics = isMath ? MATH_GENERIC : PT_GENERIC
    const hasGeneric = containsGeneric(hintsBody, generics)
    if (!hasGeneric) {
      unchanged++
      return match
    }
    const newHints = isMath ? makeMathHints(short, concept) : makePortugueseHints(short, concept)
    const newHintsStr = newHints.map((h) => `        '${h}',`).join('\n')
    changed++
    return `explanationData: { short: '${short}', concept: '${concept}',\n      hints: [\n${newHintsStr}\n      ]`
  })

  writeFileSync(file, src)
  console.log(`${file}: ${changed} substituídas, ${unchanged} mantidas`)
}

for (const f of FILES) {
  processFile(f)
}
