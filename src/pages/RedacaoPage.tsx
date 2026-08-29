import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { essayCompetencies, essayDescriptors, examRules } from '../data/edital-2026'
import { approxLineCount, countWords, evaluateEssayApto, hasNarrativeStructure, looksOffTopic, validateEssay } from '../lib/essay'
import { upsertEssay } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { EssayDraft } from '../types/progress'

interface Proposal {
  id: string
  title: string
  theme: string
  keywords: string[]
  statement: string
}

const proposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'O dia em que tudo mudou',
    theme: 'Uma mudança inesperada na rotina',
    keywords: ['mudou', 'dia', 'rotina', 'inesperado', 'diferente'],
    statement:
      'Escreva uma narrativa em que o personagem principal enfrenta uma mudança inesperada em sua rotina. ' +
      'Conte como foi esse dia, o que aconteceu e como o personagem reagiu. Dê um título à sua história.',
  },
  {
    id: 'prop-002',
    title: 'A aventura no bosque',
    theme: 'Uma aventura ao ar livre',
    keywords: ['bosque', 'aventura', 'amigos', 'floresta', 'descoberta', 'caminho'],
    statement:
      'Imagine que você e um amigo encontraram um bosque desconhecido perto de casa. Escreva uma narrativa ' +
      'contando a aventura que viveram ali, com início, meio e fim. Dê um título à história.',
  },
  {
    id: 'prop-003',
    title: 'O mistério do objeto encontrado',
    theme: 'Um objeto misterioso',
    keywords: ['objeto', 'encontrou', 'mistério', 'descobriu', 'antigo', 'estranho'],
    statement:
      'Escreva uma narrativa sobre uma pessoa que encontra um objeto misterioso na rua. ' +
      'Conte quem encontrou, qual era o objeto e o que aconteceu em seguida. Dê um título à história.',
  },
  {
    id: 'prop-004',
    title: 'A carta que chegou tarde',
    theme: 'Uma mensagem importante',
    keywords: ['carta', 'mensagem', 'amigo', 'carteiro', 'recebeu', 'notícia'],
    statement:
      'Escreva uma narrativa em que um personagem recebe uma carta muito tempo depois de ter sido enviada. ' +
      'Conte quem era o remetente, o que a carta dizia e o que o personagem fez ao lê-la. Dê um título à história.',
  },
  {
    id: 'prop-005',
    title: 'O torneio da escola',
    theme: 'Uma competição escolar',
    keywords: ['torneio', 'escola', 'competição', 'time', 'jogo', 'vitória', 'amigos'],
    statement:
      'Escreva uma narrativa sobre uma competição na escola. Conte quem participou, como foi o torneio ' +
      'e como terminou. Dê um título à história.',
  },
]

export function RedacaoPage() {
  const progress = useProgress()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const proposal = proposals.find((p) => p.id === selectedId) ?? null

  if (!proposal) {
    return (
      <div className="page">
        <h1>Produção Textual</h1>
        <p className="lead">
          A redação do processo seletivo é um texto narrativo de {examRules.essayMinLines} a {examRules.essayMaxLines} linhas,
          com caráter eliminatório. Escolha uma proposta para treinar.
        </p>
        <ul className="proposal-list">
          {proposals.map((p) => {
            const draft = progress.essays.find((e) => e.proposalId === p.id)
            return (
              <li key={p.id}>
                <button className="proposal-card" onClick={() => setSelectedId(p.id)}>
                  <h2>{p.title}</h2>
                  <p>{p.statement}</p>
                  {draft && <span className="draft-tag">Rascunho salvo</span>}
                </button>
              </li>
            )
          })}
        </ul>
        <details className="info-card">
          <summary>Irregularidades eliminatórias previstas no edital</summary>
          <ul>
            <li>Fuga ao tema proposto.</li>
            <li>Texto que não atenda ao tipo narrativo solicitado.</li>
            <li>Texto com menos de {examRules.essayMinLines} linhas.</li>
            <li>Não atender a pelo menos {examRules.essayMinimumDescriptorPercentage}% dos descritores de avaliação.</li>
          </ul>
          <p className="warning">
            A autoavaliação aqui é um auxílio de estudo e NÃO equivale à correção da banca oficial.
          </p>
        </details>
      </div>
    )
  }

  return <RedacaoEditor proposal={proposal} />
}

function RedacaoEditor({ proposal }: { proposal: Proposal }) {
  const progress = useProgress()
  const existing = progress.essays.find((e) => e.proposalId === proposal.id)
  const [title, setTitle] = useState(existing?.title ?? '')
  const [text, setText] = useState(existing?.text ?? '')
  const [checklist, setChecklist] = useState<Record<string, boolean>>(existing?.reviewChecklist ?? {})
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>(existing?.selfAssessment ?? {})
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [showPlanning, setShowPlanning] = useState(!existing?.planning && !text)
  const [planning, setPlanning] = useState(existing?.planning ?? {})

  const validation = useMemo(() => validateEssay(text, Boolean(title.trim())), [text, title])
  const offTopic = useMemo(() => looksOffTopic(text, proposal.keywords), [text, proposal.keywords])
  const hasNarrative = useMemo(() => hasNarrativeStructure(text), [text])
  const apto = useMemo(() => evaluateEssayApto(selfAssessment, essayDescriptors), [selfAssessment])

  const save = () => {
    const draft: EssayDraft = {
      id: existing?.id ?? `essay-${proposal.id}-${Date.now()}`,
      proposalId: proposal.id,
      title,
      text,
      updatedAt: new Date().toISOString(),
      reviewChecklist: checklist,
      selfAssessment,
      planning,
    }
    upsertEssay(draft)
    setSavedAt(new Date().toLocaleTimeString('pt-BR'))
  }

  const checklistItems = [
    'Respondi ao tema proposto',
    'Minha história tem começo, desenvolvimento e fim',
    'Há personagens na narrativa',
    'O lugar onde acontece está claro',
    'Os acontecimentos têm sequência lógica',
    'Usei pontuação adequada',
    'Evitei repetir palavras demais',
    'Revisei a ortografia',
    'Incluí um título',
    'O texto tem entre 15 e 30 linhas',
  ]

  const planningFields: { key: keyof typeof planning; label: string; placeholder: string }[] = [
    { key: 'mainCharacter', label: 'Personagem principal', placeholder: 'Quem é o protagonista?' },
    { key: 'otherCharacters', label: 'Outros personagens', placeholder: 'Quem mais aparece na história?' },
    { key: 'setting', label: 'Onde acontece?', placeholder: 'Qual é o cenário?' },
    { key: 'time', label: 'Quando acontece?', placeholder: 'Em que época ou momento?' },
    { key: 'problem', label: 'Qual é o problema?', placeholder: 'O que desencadeia a história?' },
    { key: 'development', label: 'O que acontece no desenvolvimento?', placeholder: 'Como a história se desenvolve?' },
    { key: 'ending', label: 'Como termina?', placeholder: 'Qual é o desfecho?' },
  ]

  return (
    <div className="page redacao">
      <div className="redacao-head">
        <Link to="/redacao" className="back-link">← Voltar às propostas</Link>
        <h1>{proposal.title}</h1>
      </div>

      <section className="proposal-box">
        <h2>Proposta</h2>
        <p>{proposal.statement}</p>
        <p className="theme"><strong>Tema:</strong> {proposal.theme}</p>
      </section>

      {/* Planejamento da redação (opcional, não conta como linhas) */}
      <section className="planning-box">
        <button
          className="planning-toggle"
          onClick={() => setShowPlanning((v) => !v)}
          aria-expanded={showPlanning}
        >
          {showPlanning ? '▼' : '▶'} Planejar minha redação (opcional)
        </button>
        {showPlanning && (
          <div className="planning-fields">
            <p className="hint">
              Preencha o roteiro antes de começar. Estes dados <strong>não contam</strong> como linhas da redação.
            </p>
            {planningFields.map((f) => (
              <div key={f.key} className="planning-field">
                <label htmlFor={`plan-${f.key}`}>{f.label}</label>
                <input
                  id={`plan-${f.key}`}
                  className="text-input"
                  value={planning[f.key] ?? ''}
                  onChange={(e) => setPlanning((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  maxLength={200}
                />
              </div>
            ))}
            <div className="actions">
              <button className="link-btn primary" onClick={() => setShowPlanning(false)}>
                Começar redação
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="editor-box">
        <label htmlFor="essay-title" className="field-label">Título</label>
        <input
          id="essay-title"
          className="text-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da sua narrativa"
          maxLength={80}
        />

        <label htmlFor="essay-text" className="field-label">Sua redação</label>
        <textarea
          id="essay-text"
          className="text-area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva aqui sua narrativa..."
          rows={12}
        />

        <div className="counters" aria-live="polite">
          <span>Linhas aproximadas: <strong>{validation.lineCount}</strong> (mín. {validation.minLines}, máx. {validation.maxLines})</span>
          <span>Palavras: <strong>{validation.wordCount}</strong></span>
        </div>

        <ul className="alerts" role="status">
          {validation.extremelyShort && <li className="alert warn">Texto extremamente curto.</li>}
          {validation.tooShort && <li className="alert warn">Menos de {validation.minLines} linhas: irregularidade eliminatória.</li>}
          {validation.tooLong && <li className="alert warn">Mais de {validation.maxLines} linhas: revise o tamanho.</li>}
          {validation.missingTitle && <li className="alert warn">A proposta solicita um título.</li>}
          {offTopic && <li className="alert warn">Possível fuga ao tema: nenhuma palavra-chave do tema aparece.</li>}
          {!hasNarrative && validation.wordCount >= 20 && <li className="alert warn">Estrutura narrativa não identificada (use marcadores de tempo como "um dia", "então", "finalmente").</li>}
          {validation.withinRange && !validation.missingTitle && <li className="alert ok">Dentro do limite de linhas e com título.</li>}
        </ul>

        <div className="actions">
          <button className="primary" onClick={save}>Salvar rascunho</button>
          {savedAt && <span className="saved-msg">Salvo às {savedAt}</span>}
        </div>
      </section>

      <section className="checklist-box">
        <h2>Checklist de revisão</h2>
        <ul className="checklist">
          {checklistItems.map((item) => (
            <li key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(checklist[item])}
                  onChange={(e) => setChecklist((c) => ({ ...c, [item]: e.target.checked }))}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="self-assess-box">
        <h2>Autoavaliação por competência</h2>
        <p className="hint">Atribua uma nota de 0 a 10 para cada competência. APTO exige pelo menos {examRules.essayMinimumDescriptorPercentage}% dos descritores atendidos (nota ≥ 6).</p>
        {essayCompetencies.map((comp) => (
          <div key={comp} className="assess-row">
            <label htmlFor={`assess-${comp}`}>{comp}</label>
            <input
              id={`assess-${comp}`}
              type="range"
              min={0}
              max={10}
              step={1}
              value={selfAssessment[comp] ?? 0}
              onChange={(e) => setSelfAssessment((s) => ({ ...s, [comp]: Number(e.target.value) }))}
            />
            <span className="assess-val">{selfAssessment[comp] ?? 0}</span>
          </div>
        ))}
        <div className={`apto-result ${apto.apto ? 'ok' : 'warn'}`}>
          {apto.apto
            ? `APTO — ${apto.attended} de ${apto.total} descritores atendidos (${apto.percentage}%).`
            : `Ainda NÃO APTO — ${apto.attended} de ${apto.total} descritores atendidos (${apto.percentage}%).`}
        </div>
        <p className="warning">A autoavaliação é um guia de estudos e não substitui a correção da banca oficial.</p>
      </section>
    </div>
  )
}
