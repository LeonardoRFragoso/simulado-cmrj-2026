import { writeFileSync } from 'node:fs'
import { allQuestions, coverageReport, validateQuestions } from '../src/data/questions/index'
import { allLessons, getLesson, hasLesson } from '../src/data/lessons/index'
import { getExplanation } from '../src/types/exam'
import { mathTopics, portugueseTopics } from '../src/data/edital-2026'

interface Issue {
  id: string
  field: string
  severity: 'alta' | 'media' | 'baixa'
  detail: string
}

const issues: Issue[] = []

// Padrões de explicação genérica (não ensinam)
const GENERIC_PATTERNS: RegExp[] = [
  /^observe os dados e resolva com aten[çc][ãa]o\.?$/i,
  /^use o conceito estudado\.?$/i,
  /^leia o enunciado com aten[çc][ãa]o\.?$/i,
  /^analise as alternativas\.?$/i,
  /^a resposta correta [eé] [a-z] porque [a-z] est[áa] correta\.?$/i,
  /^resposta correta: [a-e]\.?$/i,
]

function isGenericShort(text: string): boolean {
  const t = text.trim()
  if (t.length < 15) return true
  for (const p of GENERIC_PATTERNS) if (p.test(t)) return true
  return false
}

/** Converte string numérica pt-BR (vírgula decimal, ponto milhar) para float. */
function parsePtBr(s: string): number | null {
  const cleaned = s.replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.')
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null
  return parseFloat(cleaned)
}

/** Compara duas alternativas: iguais só se texto idêntico OU mesmo valor numérico pt-BR. */
function optionsEquivalent(a: string, b: string): boolean {
  if (a.toLowerCase() === b.toLowerCase()) return true
  const na = parsePtBr(a)
  const nb = parsePtBr(b)
  if (na !== null && nb !== null) return na === nb
  return false
}

for (const q of allQuestions) {
  const ed = getExplanation(q)

  // 1. explicação principal genérica
  if (isGenericShort(ed.short)) {
    issues.push({ id: q.id, field: 'explanation.short', severity: 'alta', detail: `Genérica/curta demais: "${ed.short}"` })
  }

  // 2. explicação legada genérica (quando explanationData ausente e caiu no legado)
  if (!q.explanationData && isGenericShort(q.explanation)) {
    issues.push({ id: q.id, field: 'explanation', severity: 'alta', detail: `Sem explanationData e legado genérico: "${q.explanation}"` })
  }

  // 3. hints que entregam a alternativa literalmente
  if (ed.hints) {
    const correctText = q.options.find((o) => o.id === q.correctOption)?.text ?? ''
    for (let i = 0; i < ed.hints.length; i++) {
      const h = ed.hints[i]
      if (correctText && h.toLowerCase().includes(correctText.toLowerCase()) && correctText.length > 3) {
        issues.push({ id: q.id, field: `hints[${i}]`, severity: 'media', detail: `Hint entrega a resposta: "${h}" (alt=${q.correctOption}="${correctText}")` })
      }
    }
  }

  // 4. distratores colidindo com a correta (após normalização)
  const texts = q.options.map((o) => o.text.trim())
  const correctText = q.options.find((o) => o.id === q.correctOption)?.text.trim() ?? ''
  const seen = new Set<string>()
  for (const t of texts) {
    if (seen.has(t)) issues.push({ id: q.id, field: 'options', severity: 'alta', detail: `Alternativa duplicada: "${t}"` })
    seen.add(t)
  }

  // 5. distrator semanticamente equivalente à correta (mesmo valor numérico ou texto)
  for (const o of q.options) {
    if (o.id === q.correctOption) continue
    if (optionsEquivalent(o.text, correctText)) {
      issues.push({ id: q.id, field: 'options', severity: 'alta', detail: `Distrator igual à correta: "${o.text}"` })
    }
  }

  // 6. enunciado muito curto
  if (q.statement.trim().length < 15) {
    issues.push({ id: q.id, field: 'statement', severity: 'media', detail: `Enunciado muito curto: "${q.statement}"` })
  }

  // 7. explicação short não referencia a questão (heuristic: se short não contém nenhum número/tópico)
  // (apenas para matemática gerada — evita falso positivo em português)
  if (q.subject === 'matematica') {
    const hasNumber = /\d/.test(ed.short)
    const hasOp = /[+\-×÷=]/.test(ed.short)
    if (!hasNumber && !hasOp && ed.short.length < 40) {
      issues.push({ id: q.id, field: 'explanation.short', severity: 'media', detail: `Explicação de matemática sem números/op: "${ed.short}"` })
    }
  }

  // 8. optionExplanations cobrem todas as alternativas (recomendado em português)
  if (q.subject === 'portugues') {
    if (ed.optionExplanations) {
      const covered = Object.keys(ed.optionExplanations)
      if (covered.length < 5) {
        issues.push({ id: q.id, field: 'optionExplanations', severity: 'baixa', detail: `Cobre apenas ${covered.length}/5 alternativas` })
      }
    }
  }
}

// Cobertura aula → questão
const lessonIssues: string[] = []
const editalTopics: { subject: 'matematica' | 'portugues'; topic: string }[] = [
  ...mathTopics.map((t) => ({ subject: 'matematica' as const, topic: t.topic })),
  ...portugueseTopics.map((t) => ({ subject: 'portugues' as const, topic: t.topic })),
]
for (const t of editalTopics) {
  if (!hasLesson(t.subject, t.topic)) {
    lessonIssues.push(`Sem aula: ${t.subject}/${t.topic}`)
  }
  const qs = allQuestions.filter((q) => q.subject === t.subject && q.topic === t.topic)
  if (qs.length < 3) {
    lessonIssues.push(`Poucas questões (${qs.length}): ${t.subject}/${t.topic}`)
  }
}
// Aulas sem questão
for (const l of allLessons()) {
  const qs = allQuestions.filter((q) => q.subject === l.subject && q.topic === l.topic)
  if (qs.length === 0) lessonIssues.push(`Aula sem questões: ${l.subject}/${l.topic}`)
}

// ---- Relatório markdown ----
const math = allQuestions.filter((q) => q.subject === 'matematica')
const port = allQuestions.filter((q) => q.subject === 'portugues')
const v = validateQuestions()

const byTopic = coverageReport()
  .map((r) => `| ${r.subject} | ${r.topic} | ${r.total} | ${r.facil} | ${r.media} | ${r.dificil} |`)
  .join('\n')

const highCount = issues.filter((i) => i.severity === 'alta').length
const medCount = issues.filter((i) => i.severity === 'media').length
const lowCount = issues.filter((i) => i.severity === 'baixa').length

const issuesByField = new Map<string, number>()
for (const i of issues) issuesByField.set(i.field, (issuesByField.get(i.field) ?? 0) + 1)
const fieldRows = Array.from(issuesByField.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([f, c]) => `| ${f} | ${c} |`)
  .join('\n')

const md = `# QUESTION-AUDIT — Auditoria do banco de questões

> Gerado automaticamente por \`scripts/audit-questions.mts\` (Fase 3).
> Data: ${new Date().toISOString().slice(0, 10)}

## Totais

| Métrica | Valor |
|---|---|
| Total de questões | ${allQuestions.length} |
| Matemática | ${math.length} |
| Português | ${port.length} |
| Mini-aulas | ${allLessons().length} |
| Tópicos cobertos | ${byTopic.split('\n').length} |
| Integridade estrutural (ids/5 alt/resposta) | ${v.ok ? 'OK' : 'FALHA'} |

## Distribuição por tópico (questões / fácil / média / difícil)

| Disciplina | Tópico | Total | Fácil | Média | Difícil |
|---|---|---|---|---|---|
${byTopic}

## Problemas detectados pela auditoria automatizada

| Severidade | Quantidade |
|---|---|
| Alta | ${highCount} |
| Média | ${medCount} |
| Baixa | ${lowCount} |
| **Total** | **${issues.length}** |

### Por campo

| Campo | Ocorrências |
|---|---|
${fieldRows || '| — | 0 |'}

### Lista detalhada de problemas de severidade ALTA

${issues
  .filter((i) => i.severity === 'alta')
  .map((i) => `- \`${i.id}\` **${i.field}**: ${i.detail}`)
  .join('\n') || '_Nenhum_'}

### Lista detalhada de problemas de severidade MÉDIA

${issues
  .filter((i) => i.severity === 'media')
  .map((i) => `- \`${i.id}\` **${i.field}**: ${i.detail}`)
  .join('\n') || '_Nenhum_'}

### Lista detalhada de problemas de severidade BAIXA

${issues
  .filter((i) => i.severity === 'baixa')
  .slice(0, 50)
  .map((i) => `- \`${i.id}\` **${i.field}**: ${i.detail}`)
  .join('\n') || '_Nenum_'}

## Coerência aula → questão

${lessonIssues.length === 0 ? '_OK — todos os tópicos têm aula e >= 3 questões._' : lessonIssues.map((s) => `- ${s}`).join('\n')}

## Correções aplicadas nesta fase

> Preenchido conforme as correções são feitas.

- Questões corrigidas: 0
- Gabaritos corrigidos: 0
- Explicações corrigidas: 0
- Alternativas corrigidas: 0
- Dicas corrigidas: 0
`

writeFileSync('docs/QUESTION-AUDIT.md', md)
console.log(`Audit concluído: ${issues.length} issues (alta=${highCount}, media=${medCount}, baixa=${lowCount})`)
console.log(`Lesson issues: ${lessonIssues.length}`)
console.log(`Relatório: docs/QUESTION-AUDIT.md`)
