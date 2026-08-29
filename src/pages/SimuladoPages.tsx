import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import { examRules } from '../data/edital-2026'
import { generateOfficialSimulado, type SimuladoPaper } from '../lib/exam-generator'
import { objectiveScore, isObjectiveApproved, overallObjectiveScore } from '../lib/scoring'
import { formatHMS, usePersistentTimer } from '../hooks/usePersistentTimer'
import { recordAnswer, saveSimulado, addStudyTime } from '../stores/progress'
import type { OptionId } from '../types/exam'
import type { SimuladoResult } from '../types/progress'

const STORAGE_KEY = 'cmrj-simulado-atual'
const ALERTS = [60 * 60, 30 * 60, 15 * 60, 5 * 60]

interface SimuladoState {
  paper: SimuladoPaper
  answers: Record<string, OptionId>
  marked: string[]
  startedAt: string
  /** tempo acumulado por questão (segundos) */
  questionTimes?: Record<string, number>
}

function loadSimulado(): SimuladoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SimuladoState
  } catch {
    return null
  }
}

function persistSimulado(s: SimuladoState | null) {
  try {
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function SimuladoSetupPage() {
  const navigate = useNavigate()
  const existing = loadSimulado()

  const start = () => {
    const paper = generateOfficialSimulado()
    const state: SimuladoState = {
      paper,
      answers: {},
      marked: [],
      startedAt: new Date().toISOString(),
    }
    persistSimulado(state)
    navigate('/simulado/prova')
  }

  return (
    <div className="page">
      <h1>Simulado Oficial</h1>
      <section className="info-card">
        <h2>Formato do Exame Intelectual 2026/2027</h2>
        <ul>
          <li>{examRules.mathQuestions} questões de Matemática (nota máxima 10,000)</li>
          <li>{examRules.portugueseQuestions} questões de Português (nota máxima 10,000)</li>
          <li>Produção Textual narrativa ({examRules.essayMinLines} a {examRules.essayMaxLines} linhas)</li>
          <li>Duração: {examRules.totalMinutes} minutos ({Math.floor(examRules.totalMinutes / 60)}h{String(examRules.totalMinutes % 60).padStart(2, '0')})</li>
          <li>Nota mínima em cada objetiva: {examRules.minimumScorePerObjective.toFixed(3).replace('.', ',')}</li>
          <li>Produção Textual: caráter eliminatório</li>
        </ul>
        <p className="warning">
          O cronômetro é persistente: se você recarregar a página, o tempo continua corrido.
          Ao zerar, a prova é entregue automaticamente.
        </p>
      </section>

      {existing && (
        <div className="resume-card">
          <p>Você tem um simulado em andamento.</p>
          <Link to="/simulado/prova" className="link-btn primary">Continuar simulado</Link>
          <button className="link-btn danger" onClick={() => { persistSimulado(null); localStorage.removeItem('cmrj-simulado-timer'); }}>Descartar e recomeçar</button>
        </div>
      )}

      <button className="big-btn" onClick={start} disabled={Boolean(existing)}>
        {existing ? 'Simulado em andamento' : 'Iniciar simulado oficial'}
      </button>
      <p className="hint">As mensagens seguem o edital: indicamos se você atingiu o mínimo previsto, sem prometer aprovação.</p>
    </div>
  )
}

export function SimuladoRunPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<SimuladoState | null>(() => loadSimulado())
  const [idx, setIdx] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)
  const questionStartRef = useRef<number>(Date.now())

  const timer = usePersistentTimer({
    storageKey: 'cmrj-simulado-timer',
    totalSeconds: examRules.totalMinutes * 60,
    alertThresholds: ALERTS,
    onAlert: (remaining) => setAlertMsg(`Restam ${formatHMS(remaining)}.`),
    onExpire: () => finish(true),
  })

  // inicia o timer ao entrar na prova (se ainda não correndo)
  useEffect(() => {
    if (state && !timer.state.running && !timer.state.expired) {
      timer.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const paper = state?.paper
  const questions = paper?.questions ?? []

  const persist = useCallback((next: SimuladoState) => {
    setState(next)
    persistSimulado(next)
  }, [])

  // Accumulate time per question when navigating away
  const accumulateQuestionTime = useCallback(() => {
    if (!state) return
    const qid = questions[idx]?.id
    if (!qid) return
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000)
    if (elapsed < 1) return
    const prevTimes = state.questionTimes ?? {}
    persist({ ...state, questionTimes: { ...prevTimes, [qid]: (prevTimes[qid] ?? 0) + elapsed } })
  }, [state, idx, questions, persist])

  // Reset timer when question changes
  useEffect(() => {
    questionStartRef.current = Date.now()
  }, [idx])

  const goToQuestion = useCallback((nextIdx: number) => {
    accumulateQuestionTime()
    setIdx(nextIdx)
  }, [accumulateQuestionTime])

  const handleSelect = useCallback(
    (option: string) => {
      if (!state) return
      persist({ ...state, answers: { ...state.answers, [questions[idx].id]: option as OptionId } })
    },
    [state, idx, questions, persist],
  )

  const toggleMark = useCallback(() => {
    if (!state) return
    const id = questions[idx].id
    const marked = state.marked.includes(id)
      ? state.marked.filter((m) => m !== id)
      : [...state.marked, id]
    persist({ ...state, marked })
  }, [state, idx, questions, persist])

  const finish = useCallback(
    (auto: boolean) => {
      if (!state) return
      setConfirmFinish(false)
      timer.stop()
      accumulateQuestionTime()
      // registra respostas (sem duplicar: o resultado é consolidado aqui)
      const answers = state.answers
      const questionTimes = state.questionTimes ?? {}
      let mathCorrect = 0
      let portCorrect = 0
      for (const q of state.paper.questions) {
        const sel = answers[q.id]
        const correct = sel === q.correctOption
        if (q.subject === 'matematica' && correct) mathCorrect += 1
        if (q.subject === 'portugues' && correct) portCorrect += 1
        if (sel) {
          recordAnswer({
            questionId: q.id,
            selected: sel,
            correct,
            subject: q.subject,
            topic: q.topic,
            difficulty: q.difficulty,
            context: 'simulado',
            sessionId: state.paper.id,
            timeSpentSeconds: questionTimes[q.id],
          })
        }
      }
      const mathScore = objectiveScore(mathCorrect, examRules.mathQuestions)
      const portScore = objectiveScore(portCorrect, examRules.portugueseQuestions)
      const avg = overallObjectiveScore({ matematica: mathScore, portugues: portScore })
      const startedMs = new Date(state.startedAt).getTime()
      const durationSeconds = Math.round((Date.now() - startedMs) / 1000)
      addStudyTime(durationSeconds)
      const result: SimuladoResult = {
        id: state.paper.id,
        startedAt: state.startedAt,
        finishedAt: new Date().toISOString(),
        durationSeconds,
        mathCorrect,
        mathTotal: examRules.mathQuestions,
        mathScore,
        portugueseCorrect: portCorrect,
        portugueseTotal: examRules.portugueseQuestions,
        portugueseScore: portScore,
        averageObjective: avg,
        essayStatus: 'nao_preenchida',
        essayLineCount: 0,
        essayWordCount: 0,
        answers: [],
      }
      saveSimulado(result)
      persistSimulado(null)
      timer.clear()
      navigate('/simulado/resultado', { state: { result, paper: state.paper, answers, auto } })
    },
    [state, timer, navigate],
  )

  if (!state || !questions.length) {
    return (
      <div className="page">
        <h1>Simulado</h1>
        <p>Não há simulado em andamento.</p>
        <Link to="/simulado" className="link-btn">Iniciar novo simulado</Link>
      </div>
    )
  }

  const q = questions[idx]
  const answeredCount = Object.keys(state.answers).length
  const lowTime = timer.state.remainingSeconds <= 5 * 60

  return (
    <div className="page simulado">
      <header className="sim-header" role="banner">
        <div className="sim-header-left">
          <span className="sim-progress">{answeredCount}/{questions.length} respondidas</span>
          <span className="sim-marked">{state.marked.length} marcadas</span>
        </div>
        <div className={`timer ${lowTime ? 'low' : ''}`} role="timer" aria-live="polite" aria-label={`Tempo restante ${formatHMS(timer.state.remainingSeconds)}`}>
          {formatHMS(timer.state.remainingSeconds)}
        </div>
        <button className="grid-btn" onClick={() => setShowGrid((v) => !v)} aria-expanded={showGrid}>Grade</button>
      </header>

      {alertMsg && (
        <div className="alert-toast" role="alert" onClick={() => setAlertMsg(null)}>
          {alertMsg}
        </div>
      )}

      {showGrid && (
        <div className="grade-grid" role="dialog" aria-label="Grade de questões">
          <div className="grade-head">
            <h2>Grade de questões</h2>
            <button onClick={() => setShowGrid(false)} aria-label="Fechar grade">✕</button>
          </div>
          <div className="grade-cells">
            {questions.map((qq, i) => {
              const ans = state.answers[qq.id]
              const marked = state.marked.includes(qq.id)
              return (
                <button
                  key={qq.id}
                  className={`cell ${ans ? 'answered' : ''} ${marked ? 'marked' : ''}`}
                  onClick={() => { goToQuestion(i); setShowGrid(false) }}
                  aria-label={`Questão ${i + 1}${ans ? ', respondida' : ', não respondida'}${marked ? ', marcada para revisão' : ''}`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
          <div className="legend">
            <span><span className="cell answered" /> respondida</span>
            <span><span className="cell marked" /> marcada</span>
            <span><span className="cell" /> não respondida</span>
          </div>
        </div>
      )}

      <QuestionCard
        question={q}
        index={idx}
        total={questions.length}
        selected={state.answers[q.id]}
        onSelect={handleSelect}
      />

      <div className="mark-row">
        <button className="mark-btn" onClick={toggleMark} aria-pressed={state.marked.includes(q.id)}>
          {state.marked.includes(q.id) ? '★ Marcada para revisão' : '☆ Marcar para revisão'}
        </button>
      </div>

      <nav className="question-nav" aria-label="Navegação entre questões">
        <button type="button" disabled={idx === 0} onClick={() => goToQuestion(idx - 1)}>Anterior</button>
        <span>{idx + 1} de {questions.length}</span>
        {idx < questions.length - 1 ? (
          <button type="button" className="primary" onClick={() => goToQuestion(idx + 1)}>Próxima</button>
        ) : (
          <button type="button" className="primary" onClick={() => setConfirmFinish(true)}>Finalizar prova</button>
        )}
      </nav>

      {confirmFinish && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal">
            <h2 id="confirm-title">Finalizar prova?</h2>
            <p>
              Você respondeu {answeredCount} de {questions.length} questões.
              {answeredCount < questions.length && ' Questões não respondidas serão consideradas erradas.'}
            </p>
            <div className="modal-actions">
              <button onClick={() => setConfirmFinish(false)}>Continuar prova</button>
              <button className="primary" onClick={() => finish(false)}>Entregar prova</button>
            </div>
          </div>
        </div>
      )}

      <div className="sim-footer-actions">
        <button className="link-btn" onClick={() => setConfirmFinish(true)}>Finalizar prova</button>
      </div>
    </div>
  )
}

interface ResultState {
  result: SimuladoResult
  paper: SimuladoPaper
  answers: Record<string, OptionId>
  auto?: boolean
}

export function SimuladoResultPage() {
  const location = useLocation()
  const state = location.state as ResultState | null
  if (!state) {
    return <div className="page"><h1>Resultado</h1><p>Sem resultado disponível.</p><Link to="/simulado" className="link-btn">Novo simulado</Link></div>
  }
  const { result, paper, answers, auto } = state
  const mathOk = isObjectiveApproved(result.mathScore)
  const portOk = isObjectiveApproved(result.portugueseScore)

  // desempenho por assunto
  const byTopic = useMemo(() => {
    const map = new Map<string, { subject: string; total: number; correct: number }>()
    for (const q of paper.questions) {
      const r = map.get(q.topic) ?? { subject: q.subject, total: 0, correct: 0 }
      r.total += 1
      if (answers[q.id] === q.correctOption) r.correct += 1
      map.set(q.topic, r)
    }
    return Array.from(map.entries()).map(([topic, r]) => ({ topic, ...r }))
  }, [paper, answers])

  const wrong = paper.questions.filter((q) => answers[q.id] !== q.correctOption)

  return (
    <div className="page">
      <h1>Resultado do Simulado Oficial</h1>
      {auto && <p className="info-note">⏱ O tempo acabou e a prova foi entregue automaticamente.</p>}

      <section className="result-block">
        <h2>Matemática</h2>
        <div className="result-stats">
          <div><strong>{result.mathCorrect}</strong><span>acertos</span></div>
          <div><strong>{result.mathTotal - result.mathCorrect}</strong><span>erros</span></div>
          <div><strong>{result.mathScore.toFixed(3).replace('.', ',')}</strong><span>nota</span></div>
        </div>
        <p className={mathOk ? 'ok-msg' : 'warn-msg'}>
          {mathOk
            ? 'Você atingiu o mínimo previsto no edital nesta disciplina.'
            : 'Você ainda não atingiu o mínimo previsto no edital nesta disciplina.'}
        </p>
      </section>

      <section className="result-block">
        <h2>Português</h2>
        <div className="result-stats">
          <div><strong>{result.portugueseCorrect}</strong><span>acertos</span></div>
          <div><strong>{result.portugueseTotal - result.portugueseCorrect}</strong><span>erros</span></div>
          <div><strong>{result.portugueseScore.toFixed(3).replace('.', ',')}</strong><span>nota</span></div>
        </div>
        <p className={portOk ? 'ok-msg' : 'warn-msg'}>
          {portOk
            ? 'Você atingiu o mínimo previsto no edital nesta disciplina.'
            : 'Você ainda não atingiu o mínimo previsto no edital nesta disciplina.'}
        </p>
      </section>

      <section className="result-block">
        <h2>Média objetiva</h2>
        <p className="big-score">{result.averageObjective.toFixed(3).replace('.', ',')}</p>
      </section>

      <section className="result-block">
        <h2>Produção Textual</h2>
        <p className="warn-msg">
          A redação não foi preenchida neste simulado. Lembre-se: ela tem caráter eliminatório.
          Acesse o módulo de Redação para treinar.
        </p>
        <Link to="/redacao" className="link-btn">Treinar redação</Link>
      </section>

      <section className="result-block">
        <h2>Desempenho por assunto</h2>
        <ul className="topic-performance">
          {byTopic.map((r) => (
            <li key={r.topic}>
              <span>{r.topic} <small>({r.subject === 'matematica' ? 'Mat' : 'Port'})</small></span>
              <span>{r.correct}/{r.total}</span>
            </li>
          ))}
        </ul>
      </section>

      {wrong.length > 0 && (
        <section className="result-block">
          <h2>Questões erradas e explicações</h2>
          <div className="review-list">
            {wrong.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} total={wrong.length} selected={answers[q.id]} showResult disabled onSelect={() => {}} />
            ))}
          </div>
        </section>
      )}

      <div className="actions">
        <Link to="/simulado" className="link-btn primary">Novo simulado</Link>
        <Link to="/dashboard" className="link-btn">Ver dashboard</Link>
      </div>
    </div>
  )
}
