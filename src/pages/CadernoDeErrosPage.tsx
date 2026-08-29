import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { errorBookEntries, type ErrorBookEntry } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import { pickByIds, shuffle } from '../lib/exam-generator'
import { PracticeSession } from './TreinoPages'
import type { Question, Subject } from '../types/exam'

type StatusFilter = 'todos' | 'novos' | 'em-progresso' | 'dominados' | 'vencidos' | 'revisar'
type GroupMode = 'topico' | 'disciplina' | 'cronologico'

export function CadernoDeErrosPage() {
  const progress = useProgress()
  const [subjectFilter, setSubjectFilter] = useState<'todas' | Subject>('todas')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [groupMode, setGroupMode] = useState<GroupMode>('topico')
  const [trainIds, setTrainIds] = useState<string[] | null>(null)

  const entries = useMemo(
    () => errorBookEntries(subjectFilter === 'todas' ? undefined : subjectFilter),
    [progress.answers, subjectFilter],
  )

  const filtered = useMemo(() => {
    const now = new Date().toISOString()
    return entries.filter((e) => {
      if (statusFilter === 'todos') return true
      if (statusFilter === 'novos') return e.status === 'novo' && !e.mastered
      if (statusFilter === 'em-progresso') return e.status === 'em-aprendizado' && !e.mastered
      if (statusFilter === 'revisar') return e.status === 'revisar' && !e.mastered
      if (statusFilter === 'dominados') return e.mastered
      if (statusFilter === 'vencidos') return !e.mastered && e.nextReviewAt != null && e.nextReviewAt <= now
      return true
    })
  }, [entries, statusFilter])

  const grouped = useMemo(() => {
    const groups = new Map<string, ErrorBookEntry[]>()
    for (const e of filtered) {
      let key: string
      if (groupMode === 'topico') key = `${e.subject}|${e.topic}`
      else if (groupMode === 'disciplina') key = e.subject
      else key = (e.lastErrorAt ?? '').slice(0, 10)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(e)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered, groupMode])

  const stats = useMemo(() => {
    const total = entries.length
    const mastered = entries.filter((e) => e.mastered).length
    const vencidos = entries.filter((e) => !e.mastered && e.nextReviewAt != null && e.nextReviewAt <= new Date().toISOString()).length
    const novos = entries.filter((e) => e.status === 'novo' && !e.mastered).length
    return { total, mastered, vencidos, novos, ativos: total - mastered }
  }, [entries])

  if (trainIds) {
    const questions = pickByIds(trainIds)
    if (questions.length === 0) {
      setTrainIds(null)
      return null
    }
    return (
      <PracticeSession
        questions={shuffle(questions, Date.now())}
        subject={questions[0].subject}
        feedbackMode="imediato"
        sessionKey={`caderno-${Date.now()}`}
        context="revisao-erros"
        backTo="/caderno-de-erros"
        title="Treino do Caderno de Erros"
      />
    )
  }

  return (
    <div className="page">
      <h1>Caderno de Erros</h1>
      <p className="lead">
        Acompanhe cada questão que você errou, seu histórico de tentativas e o status de cada uma
        no sistema de repetição espaçada.
      </p>

      <div className="summary-stats">
        <div><strong>{stats.ativos}</strong><span>ativas</span></div>
        <div><strong>{stats.novos}</strong><span>novas</span></div>
        <div><strong>{stats.vencidos}</strong><span>vencidas</span></div>
        <div><strong>{stats.mastered}</strong><span>dominadas</span></div>
      </div>

      {/* Filtros */}
      <div className="filter-row" role="tablist" aria-label="Filtrar por disciplina">
        {(['todas', 'matematica', 'portugues'] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={subjectFilter === f}
            className={`filter-tab ${subjectFilter === f ? 'active' : ''}`}
            onClick={() => setSubjectFilter(f)}
          >
            {f === 'todas' ? 'Todas' : f === 'matematica' ? 'Matemática' : 'Português'}
          </button>
        ))}
      </div>

      <div className="filter-row" role="tablist" aria-label="Filtrar por status">
        {([
          ['todos', 'Todos'],
          ['novos', 'Novos'],
          ['em-progresso', 'Em progresso'],
          ['revisar', 'A revisar'],
          ['vencidos', 'Vencidos'],
          ['dominados', 'Dominados'],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            role="tab"
            aria-selected={statusFilter === val}
            className={`filter-tab ${statusFilter === val ? 'active' : ''}`}
            onClick={() => setStatusFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="filter-row" role="tablist" aria-label="Agrupar por">
        {([
          ['topico', 'Por tópico'],
          ['disciplina', 'Por disciplina'],
          ['cronologico', 'Cronológico'],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            role="tab"
            aria-selected={groupMode === val}
            className={`filter-tab ${groupMode === val ? 'active' : ''}`}
            onClick={() => setGroupMode(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ação: treinar todas as filtradas */}
      {filtered.length > 0 && (
        <div className="actions">
          <button
            className="big-btn"
            onClick={() => setTrainIds(filtered.filter((e) => !e.mastered).map((e) => e.questionId))}
          >
            Treinar {filtered.filter((e) => !e.mastered).length} questões ativas
          </button>
        </div>
      )}

      {/* Lista agrupada */}
      {grouped.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma questão encontrada com esses filtros.</p>
          <Link to="/treino" className="link-btn">Ir ao treino</Link>
        </div>
      ) : (
        <div className="error-book-groups">
          {grouped.map(([key, items]) => (
            <ErrorGroup
              key={key}
              groupKey={key}
              items={items}
              groupMode={groupMode}
              onTrain={(ids) => setTrainIds(ids)}
            />
          ))}
        </div>
      )}

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}

function ErrorGroup({
  groupKey,
  items,
  groupMode,
  onTrain,
}: {
  groupKey: string
  items: ErrorBookEntry[]
  groupMode: GroupMode
  onTrain: (ids: string[]) => void
}) {
  const [expanded, setExpanded] = useState(groupMode !== 'cronologico')
  const activeIds = items.filter((e) => !e.mastered).map((e) => e.questionId)

  let label = groupKey
  if (groupMode === 'topico') {
    const [subj, topic] = groupKey.split('|')
    label = `${subj === 'matematica' ? 'Matemática' : 'Português'} — ${topic}`
  } else if (groupMode === 'disciplina') {
    label = groupKey === 'matematica' ? 'Matemática' : 'Português'
  } else if (groupMode === 'cronologico') {
    label = groupKey || 'Sem data'
  }

  const masteredCount = items.filter((e) => e.mastered).length

  return (
    <section className="error-group">
      <button
        className="error-group-head"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="group-label">{label}</span>
        <span className="group-meta">
          <span>{items.length} questões</span>
          {masteredCount > 0 && <span className="muted">{masteredCount} dominadas</span>}
          {activeIds.length > 0 && <span className="badge-count">{activeIds.length} ativas</span>}
        </span>
        <span className="chevron" aria-hidden="true">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <ul className="error-items">
          {items.map((e) => (
            <li key={e.questionId} className={`error-item ${e.mastered ? 'mastered' : ''}`}>
              <div className="error-item-main">
                <span className="error-qid">{e.questionId}</span>
                <span className="error-topic">{e.topic}</span>
                <span className={`status-chip status-${e.status}`}>{statusLabel(e.status)}</span>
                {e.mastered && <span className="status-chip mastered">✓ dominada</span>}
              </div>
              <div className="error-item-stats">
                <span>{e.errorCount} erro{e.errorCount !== 1 ? 's' : ''}</span>
                <span>{e.totalAttempts} tentativa{e.totalAttempts !== 1 ? 's' : ''}</span>
                {e.correctAfterError > 0 && <span className="ok">{e.correctAfterError} acerto(s) após erro</span>}
                {e.nextReviewAt && !e.mastered && (
                  <span className="muted">próx. revisão: {formatDate(e.nextReviewAt)}</span>
                )}
              </div>
            </li>
          ))}
          {activeIds.length > 0 && (
            <li className="error-group-actions">
              <button className="link-btn" onClick={() => onTrain(activeIds)}>
                Treinar {activeIds.length} questões deste grupo
              </button>
            </li>
          )}
        </ul>
      )}
    </section>
  )
}

function statusLabel(status: ErrorBookEntry['status']): string {
  const map: Record<string, string> = {
    novo: 'novo',
    'em-aprendizado': 'aprendendo',
    revisar: 'a revisar',
    dominado: 'dominado',
  }
  return map[status] ?? status
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
