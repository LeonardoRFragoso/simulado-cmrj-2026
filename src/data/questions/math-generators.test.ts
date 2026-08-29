import { describe, it, expect } from 'vitest'
import { mathGenSpecs, build, makeRng, ensureDistinctDistractors, type GenSpec } from './math-generators'
import { generatedMath } from './math-generators'
import { allQuestions } from './index'

/** Converte string numérica pt-BR para float (vírgula decimal, ponto milhar). */
function parsePtBr(s: string): number | null {
  const cleaned = s.replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.')
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null
  return parseFloat(cleaned)
}

/**
 * Executa um spec com um seed diferente e retorna os itens gerados (sem embaralhar),
 * para validar propriedades matemáticas em muitos seeds.
 */
function runSpecWithSeed(spec: GenSpec, seed: number, count: number) {
  const rng = makeRng(seed)
  const items = []
  for (let k = 0; k < count; k++) {
    const item = spec.make(rng, k)
    items.push(item)
  }
  return items
}

describe('geradores de Matemática — property-based (múltiplos seeds)', () => {
  it('cada spec produz 5 opções distintas com exactly 1 correta em 200 seeds', () => {
    const SEEDS = 200
    const failures: string[] = []
    for (const spec of mathGenSpecs) {
      for (let s = 0; s < SEEDS; s++) {
        const seed = spec.seed + s * 1000 + 1
        const items = runSpecWithSeed(spec, seed, 5)
        for (let k = 0; k < items.length; k++) {
          const item = items[k]
          const distractors = ensureDistinctDistractors(item.correct, item.distractors)
          const all = [item.correct, ...distractors]
          // 5 opções
          if (all.length !== 5) {
            failures.push(`${spec.idPrefix} seed=${seed} k=${k}: ${all.length} opções`)
            continue
          }
          // todas distintas (comparando numericamente quando possível, senão texto)
          const seen = new Set<string>()
          let dup = false
          for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) {
              const a = all[i], b = all[j]
              const na = parsePtBr(a), nb = parsePtBr(b)
              const eq = na !== null && nb !== null ? na === nb : a === b
              if (eq) {
                failures.push(`${spec.idPrefix} seed=${seed} k=${k}: opções iguais "${a}"=="${b}"`)
                dup = true
                break
              }
            }
            if (dup) break
          }
          if (dup) continue
          // correct não pode ser igual a nenhum distractor (já coberto acima)
          void seen
        }
      }
    }
    expect(failures, failures.slice(0, 20).join('\n')).toEqual([])
  })

  it('questões geradas finais têm opções distintas e gabarito válido', () => {
    const gen = generatedMath
    expect(gen.length).toBe(88)
    for (const qst of gen) {
      const texts = qst.options.map((o) => o.text)
      // sem duplicatas (numéricas ou textuais)
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i], b = texts[j]
          const na = parsePtBr(a), nb = parsePtBr(b)
          const eq = na !== null && nb !== null ? na === nb : a === b
          expect(eq, `${qst.id}: opções iguais "${a}"=="${b}"`).toBe(false)
        }
      }
      // gabarito presente
      const correct = qst.options.find((o) => o.id === qst.correctOption)
      expect(correct, `${qst.id}: gabarito ausente`).toBeDefined()
    }
  })
})

describe('geradores — coerência da explicação com os valores gerados', () => {
  it('a explicação short contém o resultado correto (heurística numérica)', () => {
    const gen = allQuestions.filter((q) => q.subject === 'matematica' && q.id.startsWith('mat-') && !q.id.includes('sni') && !q.id.includes('classes') && !q.id.includes('md-') && !q.id.includes('mmc') && !q.id.includes('fig') && !q.id.includes('poli') && !q.id.includes('soli') && !q.id.includes('vistas') && !q.id.includes('vol') && !q.id.includes('grand') && !q.id.includes('mon') && !q.id.includes('prob') && !q.id.includes('trat') && !q.id.includes('rom') && !q.id.includes('pct') && !q.id.includes('rfd') && !q.id.includes('frac'))
    // Foco nos geradores com cálculo numérico direto
    const calcIds = new Set(generatedMath.map((g) => g.id))
    const calc = allQuestions.filter((q) => calcIds.has(q.id))
    for (const q of calc) {
      const ed = q.explanationData
      if (!ed) continue
      const correctOpt = q.options.find((o) => o.id === q.correctOption)
      if (!correctOpt) continue
      const correctNum = parsePtBr(correctOpt.text)
      if (correctNum === null) continue // resposta não numérica, pula
      // A explicação short deve mencionar o valor correto (numérico)
      const shortNum = parsePtBr(ed.short.replace(/[^0-9,\-\s.]/g, ' ').trim().split(/\s+/).pop() ?? '')
      // Heurística flexível: o número correto aparece em algum lugar da explicação
      const correctStr = String(correctNum).replace('.', ',')
      const hasNum = ed.short.includes(correctStr) || ed.short.includes(correctOpt.text) || ed.short.includes(String(correctNum))
      expect(hasNum, `${q.id}: explicação não menciona o resultado ${correctOpt.text} (${correctStr}). short="${ed.short}"`).toBe(true)
    }
  })
})
