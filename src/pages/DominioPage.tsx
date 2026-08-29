import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { topicsBySubject } from '../data/edital-2026'
import { topicMastery, type MasteryStatus, type TopicMastery } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { Subject } from '../types/exam'

const STATUS_LABEL: Record<MasteryStatus, string> = {
  'nao-iniciado': 'Não iniciado',
  comecando: 'Começando',
  'em-progresso': 'Em progresso',
  bom: 'Bom',
  dominado: 'Dominado',
  'precisa-revisar': 'Precisa revisar',
}

const STATUS_COLOR: Record<MasteryStatus, string> = {
  'nao-iniciado': 'muted',
  comecando: 'info',
  'em-progresso': 'warn',
  bom: 'good',
  dominado: 'great',
  'precisa-revisar': 'danger',
}

export function DominioPage() {
  const progress = useProgress()
  const [subject, setSubject] = useState<Subject>('matematica')

  const topics = useMemo(() => {
    const editalTopics = topicsBySubject(subject)
    return editalTopics.map((t) => {
      const mastery = topicMastery(subject, t.topic)
      return { ...t, mastery }
    })
  }, [subject, progress.answers])

  const summary = useMemo(() => {
    const counts: Record<MasteryStatus, number> = {
      'nao-iniciado': 0,
      comecando: 0,
      'em-progresso': 0,
      bom: 0,
      dominado: 0,
      'precisa-revisar': 0,
    }
    for (const t of topics) counts[t.mastery.status]++
    const total = topics.length
    const dominados = counts.dominado
    const emProgresso = counts.bom + counts['em-progresso']
    return { counts, total, dominados, emProgresso }
  }, [topics])

  return (
    <div className="page">
      <h1>Domínio por Assunto</h1>
      <p className="lead">
        Acompanhe seu nível de domínio em cada tópico do edital. Treine mais os
        assuntos que precisam de revisão.
      </p>

      <div className="filter-row" role="tablist" aria-label="Disciplina">
        {(['matematica', 'portugues'] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={subject === s}
            className={`filter-tab ${subject === s ? 'active' : ''}`}
            onClick={() => setSubject(s)}
          >
            {s === 'matematica' ? 'Matemática' : 'Português'}
          </button>
        ))}
      </div>

      <div className="summary-stats">
        <div><strong>{summary.total}</strong><span>tópicos</span></div>
        <div><strong>{summary.dominados}</strong><span>dominados</span></div>
        <div><strong>{summary.emProgresso}</strong><span>em progresso</span></div>
        <div><strong>{summary.counts['precisa-revisar']}</strong><span>precisam revisar</span></div>
      </div>

      {/* Legenda de status */}
      <div className="mastery-legend" aria-label="Legenda de status">
        {(Object.keys(STATUS_LABEL) as MasteryStatus[]).map((st) => (
          <span key={st} className={`legend-chip ${STATUS_COLOR[st]}`}>
            {STATUS_LABEL[st]}
          </span>
        ))}
      </div>

      <ul className="mastery-list">
        {topics.map((t) => (
          <MasteryRow key={t.topic} topic={t.topic} label={t.label} mastery={t.mastery} subject={subject} />
        ))}
      </ul>

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}

function MasteryRow({
  topic,
  label,
  mastery,
  subject,
}: {
  topic: string
  label: string
  mastery: TopicMastery
  subject: Subject
}) {
  const pct = mastery.answered > 0 ? Math.round(mastery.accuracy * 100) : null
  return (
    <li className={`mastery-row status-${mastery.status}`}>
      <div className="mastery-main">
        <span className="mastery-label">{label}</span>
        <span className={`status-chip mastery-${STATUS_COLOR[mastery.status]}`}>
          {STATUS_LABEL[mastery.status]}
        </span>
      </div>
      <div className="mastery-stats">
        <span>{mastery.answered} questões</span>
        {pct !== null && <span>{pct}% acerto</span>}
        {mastery.reviewLevel > 0 && <span>nível {mastery.reviewLevel}</span>}
      </div>
      <div className="mastery-actions">
        <Link
          className="link-btn small"
          to={`/treino/assunto/${subject}/${encodeURIComponent(topic)}`}
        >
          Treinar
        </Link>
        <Link
          className="link-btn small"
          to={`/estudar/${subject}/${encodeURIComponent(topic)}`}
        >
          Estudar
        </Link>
      </div>
    </li>
  )
}
