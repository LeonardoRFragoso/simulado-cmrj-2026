import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { subjectStats, topicMastery, allTopicMastery } from '../stores/progress'
import { allQuestions } from '../data/questions'
import type { Subject } from '../types/exam'
import type { AnswerRecord } from '../types/progress'

export function AnalyticsPage() {
  const progress = useProgress()

  const analytics = useMemo(() => computeAnalytics(progress.answers), [progress.answers])

  return (
    <div className="page">
      <h1>Analytics Pedagógicos</h1>
      <p className="lead">
        Métricas detalhadas sobre seu desempenho: tempo por questão, uso de dicas,
        dificuldade e padrões de erro.
      </p>

      {/* Tempo por questão */}
      <section className="analytics-card">
        <h2>Tempo por questão</h2>
        <div className="summary-stats">
          <div><strong>{analytics.avgTimePerQuestion}s</strong><span>média</span></div>
          <div><strong>{analytics.medianTime}s</strong><span>mediana</span></div>
          <div><strong>{analytics.fastest}s</strong><span>mais rápido</span></div>
          <div><strong>{analytics.slowest}s</strong><span>mais lento</span></div>
        </div>
        <p className="hint">
          {analytics.timedAnswers > 0
            ? `Baseado em ${analytics.timedAnswers} questões com tempo registrado.`
            : 'Responda questões no treino para registrar o tempo (em breve).'}
        </p>
      </section>

      {/* Tempo por disciplina */}
      <section className="analytics-card">
        <h2>Tempo por disciplina</h2>
        <div className="analytics-rows">
          <AnalyticsRow label="Matemática" value={`${analytics.matAvgTime}s`} sub={`${analytics.matTimed} questões`} pct={analytics.matAvgTime / Math.max(1, analytics.portAvgTime, analytics.matAvgTime)} />
          <AnalyticsRow label="Português" value={`${analytics.portAvgTime}s`} sub={`${analytics.portTimed} questões`} pct={analytics.portAvgTime / Math.max(1, analytics.portAvgTime, analytics.matAvgTime)} />
        </div>
      </section>

      {/* Uso de dicas */}
      <section className="analytics-card">
        <h2>Uso de dicas progressivas</h2>
        <div className="summary-stats">
          <div><strong>{analytics.totalHintsUsed}</strong><span>dicas usadas</span></div>
          <div><strong>{analytics.questionsWithHints}</strong><span>questões com dica</span></div>
          <div><strong>{analytics.avgHintsPerQuestion}</strong><span>média/questão</span></div>
        </div>
        <p className="hint">
          {analytics.totalHintsUsed === 0
            ? 'Use dicas durante o treino para receber ajuda progressiva.'
            : analytics.avgHintsPerQuestion < 1
              ? 'Você usa poucas dicas — bom sinal de autonomia!'
              : 'Considere revisar os tópicos onde usa mais dicas.'}
        </p>
      </section>

      {/* Precisão por dificuldade */}
      <section className="analytics-card">
        <h2>Precisão por dificuldade</h2>
        <div className="analytics-rows">
          <AnalyticsRow label="Fácil" value={`${analytics.easyAcc}%`} sub={`${analytics.easyCorrect}/${analytics.easyTotal}`} pct={analytics.easyAcc / 100} color="good" />
          <AnalyticsRow label="Média" value={`${analytics.mediumAcc}%`} sub={`${analytics.mediumCorrect}/${analytics.mediumTotal}`} pct={analytics.mediumAcc / 100} color="warn" />
          <AnalyticsRow label="Difícil" value={`${analytics.hardAcc}%`} sub={`${analytics.hardCorrect}/${analytics.hardTotal}`} pct={analytics.hardAcc / 100} color="danger" />
        </div>
      </section>

      {/* Tempo vs correção */}
      <section className="analytics-card">
        <h2>Tempo: acertos vs erros</h2>
        <div className="analytics-rows">
          <AnalyticsRow label="Tempo médio (acertos)" value={`${analytics.avgTimeCorrect}s`} sub={`${analytics.correctCount} questões`} pct={analytics.avgTimeCorrect / Math.max(1, analytics.avgTimeWrong)} color="good" />
          <AnalyticsRow label="Tempo médio (erros)" value={`${analytics.avgTimeWrong}s`} sub={`${analytics.wrongCount} questões`} pct={analytics.avgTimeWrong / Math.max(1, analytics.avgTimeCorrect)} color="danger" />
        </div>
        {analytics.wrongCount > 0 && analytics.avgTimeWrong > analytics.avgTimeCorrect && (
          <p className="hint">Você gasta mais tempo nas questões que erra — pode indicar dúvida. Revise esses tópicos.</p>
        )}
      </section>

      {/* Tópicos mais demorados */}
      {analytics.slowestTopics.length > 0 && (
        <section className="analytics-card">
          <h2>Tópicos mais demorados</h2>
          <ul className="analytics-list">
            {analytics.slowestTopics.map((t) => (
              <li key={`${t.subject}-${t.topic}`}>
                <span className="chip subject small">{t.subject === 'matematica' ? 'Mat' : 'Port'}</span>
                <span className="analytics-topic-name">{t.topic}</span>
                <span className="analytics-topic-time">{t.avgTime}s médios · {t.count} questões</span>
                <Link className="link-btn small" to={`/estudar/${t.subject}/${encodeURIComponent(t.topic)}`}>Estudar</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tópicos com mais dicas */}
      {analytics.mostHintedTopics.length > 0 && (
        <section className="analytics-card">
          <h2>Tópicos com mais uso de dicas</h2>
          <ul className="analytics-list">
            {analytics.mostHintedTopics.map((t) => (
              <li key={`${t.subject}-${t.topic}`}>
                <span className="chip subject small">{t.subject === 'matematica' ? 'Mat' : 'Port'}</span>
                <span className="analytics-topic-name">{t.topic}</span>
                <span className="analytics-topic-time">{t.totalHints} dicas · {t.count} questões</span>
                <Link className="link-btn small" to={`/estudar/${t.subject}/${encodeURIComponent(t.topic)}`}>Estudar</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}

function AnalyticsRow({ label, value, sub, pct, color }: { label: string; value: string; sub: string; pct: number; color?: string }) {
  return (
    <div className="analytics-row">
      <span className="analytics-row-label">{label}</span>
      <div className="analytics-row-bar">
        <div className={`progress-track ${color ?? ''}`} aria-hidden="true">
          <div style={{ width: `${Math.min(100, pct * 100)}%` }} />
        </div>
      </div>
      <span className="analytics-row-value">{value}</span>
      <span className="analytics-row-sub muted">{sub}</span>
    </div>
  )
}

interface Analytics {
  avgTimePerQuestion: number
  medianTime: number
  fastest: number
  slowest: number
  timedAnswers: number
  matAvgTime: number
  portAvgTime: number
  matTimed: number
  portTimed: number
  totalHintsUsed: number
  questionsWithHints: number
  avgHintsPerQuestion: number
  easyAcc: number
  mediumAcc: number
  hardAcc: number
  easyTotal: number
  mediumTotal: number
  hardTotal: number
  easyCorrect: number
  mediumCorrect: number
  hardCorrect: number
  avgTimeCorrect: number
  avgTimeWrong: number
  correctCount: number
  wrongCount: number
  slowestTopics: { subject: Subject; topic: string; avgTime: number; count: number }[]
  mostHintedTopics: { subject: Subject; topic: string; totalHints: number; count: number }[]
}

function computeAnalytics(answers: AnswerRecord[]): Analytics {
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]))
  const timed = answers.filter((a) => a.timeSpentSeconds != null && a.timeSpentSeconds > 0)
  const times = timed.map((a) => a.timeSpentSeconds!).sort((a, b) => a - b)

  const avg = times.length > 0 ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : 0
  const median = times.length > 0 ? times[Math.floor(times.length / 2)] : 0
  const fastest = times.length > 0 ? times[0] : 0
  const slowest = times.length > 0 ? times[times.length - 1] : 0

  const matTimed = timed.filter((a) => questionMap.get(a.questionId)?.subject === 'matematica')
  const portTimed = timed.filter((a) => questionMap.get(a.questionId)?.subject === 'portugues')
  const matAvg = matTimed.length > 0 ? Math.round(matTimed.reduce((s, a) => s + (a.timeSpentSeconds ?? 0), 0) / matTimed.length) : 0
  const portAvg = portTimed.length > 0 ? Math.round(portTimed.reduce((s, a) => s + (a.timeSpentSeconds ?? 0), 0) / portTimed.length) : 0

  const hinted = answers.filter((a) => (a.hintsUsed ?? 0) > 0)
  const totalHints = answers.reduce((s, a) => s + (a.hintsUsed ?? 0), 0)
  const avgHints = answers.length > 0 ? (totalHints / answers.length).toFixed(1) : '0'

  // Precisão por dificuldade
  const valid = answers.filter((a) => !a.annulled)
  const easy = valid.filter((a) => questionMap.get(a.questionId)?.difficulty === 'facil')
  const medium = valid.filter((a) => questionMap.get(a.questionId)?.difficulty === 'media')
  const hard = valid.filter((a) => questionMap.get(a.questionId)?.difficulty === 'dificil')
  const acc = (arr: AnswerRecord[]) => arr.length > 0 ? Math.round((arr.filter((a) => a.correct).length / arr.length) * 100) : 0

  // Tempo: acertos vs erros
  const correctTimed = timed.filter((a) => a.correct)
  const wrongTimed = timed.filter((a) => !a.correct && !a.annulled)
  const avgCorrect = correctTimed.length > 0 ? Math.round(correctTimed.reduce((s, a) => s + (a.timeSpentSeconds ?? 0), 0) / correctTimed.length) : 0
  const avgWrong = wrongTimed.length > 0 ? Math.round(wrongTimed.reduce((s, a) => s + (a.timeSpentSeconds ?? 0), 0) / wrongTimed.length) : 0

  // Tópicos mais demorados
  const topicTimes = new Map<string, { subject: Subject; topic: string; totalTime: number; count: number }>()
  for (const a of timed) {
    const q = questionMap.get(a.questionId)
    if (!q) continue
    const key = `${q.subject}|${q.topic}`
    const existing = topicTimes.get(key) ?? { subject: q.subject, topic: q.topic, totalTime: 0, count: 0 }
    existing.totalTime += a.timeSpentSeconds ?? 0
    existing.count += 1
    topicTimes.set(key, existing)
  }
  const slowestTopics = Array.from(topicTimes.values())
    .filter((t) => t.count >= 2)
    .map((t) => ({ subject: t.subject, topic: t.topic, avgTime: Math.round(t.totalTime / t.count), count: t.count }))
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 5)

  // Tópicos com mais dicas
  const topicHints = new Map<string, { subject: Subject; topic: string; totalHints: number; count: number }>()
  for (const a of hinted) {
    const q = questionMap.get(a.questionId)
    if (!q) continue
    const key = `${q.subject}|${q.topic}`
    const existing = topicHints.get(key) ?? { subject: q.subject, topic: q.topic, totalHints: 0, count: 0 }
    existing.totalHints += a.hintsUsed ?? 0
    existing.count += 1
    topicHints.set(key, existing)
  }
  const mostHintedTopics = Array.from(topicHints.values())
    .filter((t) => t.count >= 1)
    .map((t) => ({ subject: t.subject, topic: t.topic, totalHints: t.totalHints, count: t.count }))
    .sort((a, b) => b.totalHints - a.totalHints)
    .slice(0, 5)

  return {
    avgTimePerQuestion: avg,
    medianTime: median,
    fastest,
    slowest,
    timedAnswers: times.length,
    matAvgTime: matAvg,
    portAvgTime: portAvg,
    matTimed: matTimed.length,
    portTimed: portTimed.length,
    totalHintsUsed: totalHints,
    questionsWithHints: hinted.length,
    avgHintsPerQuestion: Number(avgHints),
    easyAcc: acc(easy),
    mediumAcc: acc(medium),
    hardAcc: acc(hard),
    easyTotal: easy.length,
    mediumTotal: medium.length,
    hardTotal: hard.length,
    easyCorrect: easy.filter((a) => a.correct).length,
    mediumCorrect: medium.filter((a) => a.correct).length,
    hardCorrect: hard.filter((a) => a.correct).length,
    avgTimeCorrect: avgCorrect,
    avgTimeWrong: avgWrong,
    correctCount: correctTimed.length,
    wrongCount: wrongTimed.length,
    slowestTopics,
    mostHintedTopics,
  }
}
