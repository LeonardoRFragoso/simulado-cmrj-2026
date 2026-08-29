import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dailyGoalProgress, setDailyGoal, todayAnswerCount, todayStudySeconds } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { DailyGoal } from '../types/progress'

export function MetaDiariaPage() {
  const progress = useProgress()
  const currentGoal = progress.dailyGoal
  const [type, setType] = useState<DailyGoal['type']>(currentGoal?.type ?? 'questoes')
  const [value, setValue] = useState<number>(currentGoal?.value ?? 10)

  const goalProgress = dailyGoalProgress()
  const todayCount = todayAnswerCount()
  const todayMinutes = Math.floor(todayStudySeconds() / 60)
  const pct = goalProgress.target > 0 ? Math.min(100, Math.round((goalProgress.current / goalProgress.target) * 100)) : 0

  const save = () => {
    setDailyGoal({ type, value })
  }

  return (
    <div className="page">
      <h1>Meta Diária</h1>
      <p className="lead">
        Defina uma meta diária para manter a consistência. Pequenas metas
        alcançáveis todos os dias são mais eficazes que grandes esforços esporádicos.
      </p>

      {/* Progresso de hoje */}
      <section className="goal-today">
        <h2>Hoje</h2>
        {currentGoal ? (
          <>
            <div className="goal-display">
              <div className="goal-current">
                <strong>{goalProgress.current}</strong>
                <span>{goalProgress.type === 'questoes' ? 'questões' : 'minutos'}</span>
              </div>
              <div className="goal-target">
                <span className="muted">de</span>
                <strong>{goalProgress.target}</strong>
              </div>
            </div>
            <div className="progress-track large" aria-hidden="true">
              <div style={{ width: `${pct}%` }} />
            </div>
            <p className={`goal-status ${goalProgress.met ? 'met' : ''}`}>
              {goalProgress.met
                ? '✓ Meta de hoje alcançada! Parabéns!'
                : `Faltam ${goalProgress.target - goalProgress.current} ${goalProgress.type === 'questoes' ? 'questões' : 'minutos'} para a meta.`}
            </p>
          </>
        ) : (
          <p className="muted">Você ainda não definiu uma meta. Configure abaixo.</p>
        )}

        <div className="summary-stats">
          <div><strong>{todayCount}</strong><span>questões hoje</span></div>
          <div><strong>{todayMinutes}</strong><span>minutos hoje</span></div>
        </div>
      </section>

      {/* Configuração */}
      <section className="goal-config">
        <h2>Configurar meta</h2>
        <div className="filter-row" role="tablist" aria-label="Tipo de meta">
          <button
            role="tab"
            aria-selected={type === 'questoes'}
            className={`filter-tab ${type === 'questoes' ? 'active' : ''}`}
            onClick={() => setType('questoes')}
          >
            Questões por dia
          </button>
          <button
            role="tab"
            aria-selected={type === 'minutos'}
            className={`filter-tab ${type === 'minutos' ? 'active' : ''}`}
            onClick={() => setType('minutos')}
          >
            Minutos por dia
          </button>
        </div>

        <div className="goal-value-grid">
          {(type === 'questoes' ? [5, 10, 15, 20, 30] : [10, 20, 30, 45, 60]).map((v) => (
            <button
              key={v}
              className={`qty-card ${value === v ? 'active' : ''}`}
              onClick={() => setValue(v)}
              aria-pressed={value === v}
            >
              {v} {type === 'questoes' ? 'questões' : 'min'}
            </button>
          ))}
        </div>

        <div className="actions">
          <button className="big-btn" onClick={save}>
            Salvar meta: {value} {type === 'questoes' ? 'questões' : 'minutos'} por dia
          </button>
        </div>
      </section>

      <div className="info-card">
        <p className="muted">
          Dica: comece com uma meta pequena e aumente gradualmente. Consistência
          é mais importante que intensidade.
        </p>
      </div>

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}
