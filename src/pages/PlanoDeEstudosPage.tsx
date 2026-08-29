import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { generateStudyPlan, type StudyPlan } from '../lib/study-plan'
import { progressStore, updateSettings } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'

type MinutesPerDay = 15 | 30 | 45 | 60

export function PlanoDeEstudosPage() {
  const progress = useProgress()
  const existingPlan = progress.studyPlan
  const [minutesPerDay, setMinutesPerDay] = useState<MinutesPerDay>(existingPlan?.minutesPerDay ?? 30)

  const plan = useMemo(() => {
    const startedAt = existingPlan?.startedAt ?? new Date().toISOString()
    return generateStudyPlan(minutesPerDay, startedAt)
  }, [minutesPerDay, existingPlan, progress.answers])

  const startPlan = () => {
    progressStore.set((s) => ({
      ...s,
      studyPlan: { minutesPerDay, startedAt: new Date().toISOString() },
    }))
  }

  // Agrupa por dia
  const daysGrouped = useMemo(() => {
    const groups = new Map<number, typeof plan.days>()
    for (const d of plan.days) {
      if (!groups.has(d.dayNumber)) groups.set(d.dayNumber, [])
      groups.get(d.dayNumber)!.push(d)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b)
  }, [plan])

  const completedCount = plan.days.filter((d) => d.status === 'concluido').length
  const progressPct = plan.days.length > 0 ? Math.round((completedCount / plan.days.length) * 100) : 0

  return (
    <div className="page">
      <h1>Plano de Estudos</h1>
      <p className="lead">
        Distribui todos os {plan.totalTopics} tópicos do edital ao longo de dias,
        priorizando os assuntos que você ainda precisa dominar.
      </p>

      {/* Configuração */}
      <section className="plan-config">
        <h2>Tempo por dia</h2>
        <div className="filter-row" role="tablist" aria-label="Minutos por dia">
          {([15, 30, 45, 60] as MinutesPerDay[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={minutesPerDay === m}
              className={`filter-tab ${minutesPerDay === m ? 'active' : ''}`}
              onClick={() => setMinutesPerDay(m)}
            >
              {m} min
            </button>
          ))}
        </div>
        {!existingPlan && (
          <div className="actions">
            <button className="big-btn" onClick={startPlan}>
              Iniciar plano ({plan.totalDays} dias)
            </button>
          </div>
        )}
      </section>

      {/* Progresso */}
      {plan.days.length > 0 && (
        <section className="plan-progress">
          <div className="summary-stats">
            <div><strong>{plan.totalDays}</strong><span>dias</span></div>
            <div><strong>{completedCount}</strong><span>concluídos</span></div>
            <div><strong>{progressPct}%</strong><span>progresso</span></div>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div style={{ width: `${progressPct}%` }} />
          </div>
        </section>
      )}

      {/* Calendário */}
      <section className="plan-calendar">
        <h2>Cronograma</h2>
        {daysGrouped.map(([dayNum, items]) => (
          <PlanDay key={dayNum} dayNumber={dayNum} items={items} />
        ))}
      </section>

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}

function PlanDay({ dayNumber, items }: { dayNumber: number; items: StudyPlan['days'] }) {
  const [expanded, setExpanded] = useState(dayNumber === 1)
  const date = items[0]?.date
  const formattedDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }) : ''
  const allDone = items.every((i) => i.status === 'concluido')

  return (
    <section className={`plan-day ${allDone ? 'done' : ''}`}>
      <button
        className="plan-day-head"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="day-num">Dia {dayNumber}</span>
        <span className="day-date">{formattedDate}</span>
        <span className="day-meta">
          {items.length} tópicos · {items[0]?.estimatedMinutes ?? 0} min
          {allDone && <span className="done-badge">✓</span>}
        </span>
        <span className="chevron" aria-hidden="true">{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <ul className="plan-topics">
          {items.map((item) => (
            <li key={`${item.subject}-${item.topic}`} className={`plan-topic ${item.status}`}>
              <div className="plan-topic-main">
                <span className="chip subject">{item.subject === 'matematica' ? 'Mat' : 'Port'}</span>
                <span className="plan-topic-label">{item.topicLabel}</span>
              </div>
              <div className="plan-topic-actions">
                <Link
                  className="link-btn small"
                  to={`/estudar/${item.subject}/${encodeURIComponent(item.topic)}`}
                >
                  Estudar
                </Link>
                <Link
                  className="link-btn small"
                  to={`/treino/assunto/${item.subject}/${encodeURIComponent(item.topic)}`}
                >
                  Treinar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
