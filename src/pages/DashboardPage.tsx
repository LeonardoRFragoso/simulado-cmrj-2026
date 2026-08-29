import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import {
  bestStreak,
  currentStreak,
  generalAccuracy,
  progressStore,
  subjectStats,
  topicsToReview,
  dailyGoalProgress,
  dueReviewsCount,
  errorBookEntries,
  allTopicMastery,
} from '../stores/progress'
import { setNickname, updateSettings } from '../stores/progress'

export function DashboardPage() {
  const progress = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)

  const mat = subjectStats('matematica')
  const port = subjectStats('portugues')
  const acc = generalAccuracy()
  const streak = currentStreak()
  const best = bestStreak()
  const review = topicsToReview(5)
  const goalProgress = dailyGoalProgress()
  const dueCount = dueReviewsCount()
  const errorEntries = errorBookEntries()
  const activeErrors = errorEntries.filter((e) => !e.mastered).length
  const masteredErrors = errorEntries.filter((e) => e.mastered).length
  const matMastery = allTopicMastery('matematica')
  const portMastery = allTopicMastery('portugues')
  const dominatedTopics = [...matMastery, ...portMastery].filter((m) => m.status === 'dominado').length
  const totalTopicsStudied = [...matMastery, ...portMastery].filter((m) => m.answered > 0).length

  const totalAnswered = progress.answers.filter((a) => !a.annulled).length
  const totalCorrect = progress.answers.filter((a) => !a.annulled && a.correct).length
  const studyHours = Math.floor(progress.totalStudySeconds / 3600)
  const studyMin = Math.floor((progress.totalStudySeconds % 3600) / 60)

  const handleExport = () => {
    const json = progressStore.exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-cmrj-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const res = progressStore.importJSON(String(reader.result))
      setImportMsg(res.ok ? 'Backup importado com sucesso.' : `Erro: ${res.error}`)
    }
    reader.readAsText(file)
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <section className="nickname-card">
        <label htmlFor="nick">Apelido (opcional, fica só no seu aparelho)</label>
        <input
          id="nick"
          className="text-input"
          value={progress.nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Como você quer ser chamado?"
          maxLength={40}
        />
      </section>

      <section className="stats-grid" aria-label="Estatísticas gerais">
        <StatCard value={totalAnswered} label="respondidas" />
        <StatCard value={totalCorrect} label="acertos" />
        <StatCard value={acc > 0 ? (acc * 100).toFixed(0) + '%' : '—'} label="taxa geral" />
        <StatCard value={progress.simulados.length} label="simulados" />
        <StatCard value={progress.essays.length} label="redações" />
        <StatCard value={progress.studyDays.length} label="dias estudados" />
        <StatCard value={streak} label="sequência atual" />
        <StatCard value={best} label="melhor sequência" />
        <StatCard value={studyHours > 0 ? `${studyHours}h${String(studyMin).padStart(2, '0')}` : `${studyMin}min`} label="tempo estudado" />
      </section>

      <section className="subject-stats">
        <h2>Por disciplina</h2>
        <div className="subject-row">
          <h3>Matemática</h3>
          <p>{mat.correct}/{mat.answered} · {mat.answered ? (mat.accuracy * 100).toFixed(0) + '%' : '—'}</p>
        </div>
        <div className="subject-row">
          <h3>Português</h3>
          <p>{port.correct}/{port.answered} · {port.answered ? (port.accuracy * 100).toFixed(0) + '%' : '—'}</p>
        </div>
      </section>

      {/* Meta diária */}
      {goalProgress.target > 0 && (
        <section className="goal-dashboard-card">
          <h2>Meta de hoje</h2>
          <div className="goal-dashboard-bar">
            <div className="progress-track" aria-hidden="true">
              <div style={{ width: `${Math.min(100, (goalProgress.current / goalProgress.target) * 100)}%` }} />
            </div>
            <span className={goalProgress.met ? 'met' : ''}>
              {goalProgress.current}/{goalProgress.target} {goalProgress.type === 'questoes' ? 'questões' : 'minutos'}
              {goalProgress.met && ' ✓'}
            </span>
          </div>
          {!goalProgress.met && (
            <Link to="/treino" className="link-btn small">Continuar agora →</Link>
          )}
        </section>
      )}

      {/* Resumo pedagógico */}
      <section className="pedagogy-summary">
        <h2>Resumo pedagógico</h2>
        <div className="summary-stats">
          <div><strong>{dueCount}</strong><span>revisões vencidas</span></div>
          <div><strong>{activeErrors}</strong><span>no caderno de erros</span></div>
          <div><strong>{masteredErrors}</strong><span>erros dominados</span></div>
          <div><strong>{dominatedTopics}</strong><span>tópicos dominados</span></div>
        </div>
        <div className="actions">
          {dueCount > 0 && <Link to="/revisao/hoje" className="link-btn">Revisão do dia ({dueCount})</Link>}
          {activeErrors > 0 && <Link to="/caderno-de-erros" className="link-btn">Caderno de erros ({activeErrors})</Link>}
          <Link to="/dominio" className="link-btn">Domínio por assunto</Link>
        </div>
      </section>

      <section className="review-suggest">
        <h2>Assuntos para revisar</h2>
        {review.length === 0 ? (
          <p>Continue respondendo questões para receber sugestões de revisão.</p>
        ) : (
          <ul className="review-list-mini">
            {review.map((r) => (
              <li key={`${r.subject}-${r.topic}`}>
                <span>{r.topic} <small>({r.subject === 'matematica' ? 'Mat' : 'Port'})</small></span>
                <span>{(r.accuracy * 100).toFixed(0)}% · {r.answered} resp.</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="evolution-chart" aria-label="Evolução dos últimos dias">
        <h2>Evolução (últimos 14 dias)</h2>
        <EvolutionChart answers={progress.answers} />
      </section>

      <section className="backup-card">
        <h2>Backup do progresso</h2>
        <p className="hint">Seu progresso fica salvo neste aparelho. Exporte um backup JSON para não perder ao trocar de celular.</p>
        <div className="actions">
          <button className="link-btn" onClick={handleExport}>Exportar backup</button>
          <button className="link-btn" onClick={() => fileRef.current?.click()}>Importar backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleImport} hidden />
          <button className="link-btn danger" onClick={() => { if (confirm('Apagar todo o progresso?')) progressStore.reset() }}>Apagar progresso</button>
        </div>
        {importMsg && <p className="info-note">{importMsg}</p>}
      </section>

      <section className="settings-card">
        <h2>Configurações</h2>
        <label>
          Tema
          <select
            className="text-input"
            value={progress.settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as 'claro' | 'escuro' | 'sistema' })}
          >
            <option value="sistema">Sistema</option>
            <option value="claro">Claro</option>
            <option value="escuro">Escuro</option>
          </select>
        </label>
        <label>
          Feedback no treino
          <select
            className="text-input"
            value={progress.settings.feedbackMode}
            onChange={(e) => updateSettings({ feedbackMode: e.target.value as 'imediato' | 'final' })}
          >
            <option value="imediato">Imediato</option>
            <option value="final">Somente no final</option>
          </select>
        </label>
      </section>

      <div className="actions">
        <Link to="/" className="link-btn">Início</Link>
        <Link to="/treino" className="link-btn primary">Estudar agora</Link>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function EvolutionChart({ answers }: { answers: { answeredAt: string; correct: boolean; annulled?: boolean }[] }) {
  // agrega acertos por dia nos últimos 14 dias
  const days: { date: string; correct: number; total: number }[] = []
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({ date: key, correct: 0, total: 0 })
  }
  const idx = new Map(days.map((d, i) => [d.date, i]))
  for (const a of answers) {
    if (a.annulled) continue
    const key = a.answeredAt.slice(0, 10)
    const i = idx.get(key)
    if (i === undefined) continue
    days[i].total += 1
    if (a.correct) days[i].correct += 1
  }
  const maxTotal = Math.max(1, ...days.map((d) => d.total))
  return (
    <div className="chart" role="img" aria-label="Gráfico de acertos por dia nos últimos 14 dias">
      {days.map((d) => (
        <div key={d.date} className="bar-col" title={`${d.date}: ${d.correct}/${d.total} acertos`}>
          <div className="bar" style={{ height: `${(d.total / maxTotal) * 100}%` }}>
            <div className="bar-correct" style={{ height: d.total ? `${(d.correct / d.total) * 100}%` : '0%' }} />
          </div>
          <span className="bar-label">{d.date.slice(8, 10)}</span>
        </div>
      ))}
    </div>
  )
}
