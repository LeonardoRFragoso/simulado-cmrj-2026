import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import { topicsBySubject } from '../data/edital-2026'
import { pickBySubjectTopic, pickRandom, shuffle } from '../lib/exam-generator'
import { recordAnswer, subjectStats, toggleFavorite } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { Question, Subject } from '../types/exam'

type FeedbackMode = 'imediato' | 'final'

export function TreinoRapidoSetupPage() {
  return (
    <div className="page">
      <h1>Treino Rápido</h1>
      <p className="lead">Escolha a disciplina e a quantidade de questões.</p>
      <div className="setup-grid">
        <SetupCard title="Matemática" to="/treino/rapido/matematica" />
        <SetupCard title="Português" to="/treino/rapido/portugues" />
      </div>
    </div>
  )
}

export function TreinoRapidoConfigPage() {
  const { subject } = useParams<{ subject: Subject }>()
  const navigate = useNavigate()
  if (subject !== 'matematica' && subject !== 'portugues') {
    return <div className="page"><p>Disciplina inválida.</p></div>
  }
  return (
    <div className="page">
      <h1>Treino Rápido — {subject === 'matematica' ? 'Matemática' : 'Português'}</h1>
      <p className="lead">Quantas questões?</p>
      <div className="qty-grid">
        {[5, 10, 20].map((n) => (
          <button key={n} className="qty-card" onClick={() => navigate(`/treino/rapido/${subject}/${n}`)}>
            {n} questões
          </button>
        ))}
      </div>
      <Link to="/treino/rapido" className="back-link">← Voltar</Link>
    </div>
  )
}

export function TreinoRapidoRunPage() {
  const { subject, qty } = useParams<{ subject: Subject; qty: string }>()
  const count = Number(qty)
  const validSubject = subject === 'matematica' || subject === 'portugues'
  const questions = useMemo<Question[]>(
    () => (validSubject ? pickRandom(subject, count) : []),
    [validSubject, subject, count],
  )
  const progress = useProgress()
  const [feedbackMode] = useState<FeedbackMode>(progress.settings.feedbackMode ?? 'imediato')
  const sessionKey = `treino-rapido-${subject}-${qty}-${Date.now()}`

  if (!validSubject || !Number.isFinite(count) || count <= 0) {
    return <div className="page"><p>Configuração de treino inválida.</p><Link to="/treino/rapido">Voltar</Link></div>
  }
  if (!questions.length) {
    return <div className="page"><p>Não há questões disponíveis.</p></div>
  }
  return (
    <PracticeSession
      questions={questions}
      subject={subject}
      feedbackMode={feedbackMode}
      sessionKey={sessionKey}
      context="treino-rapido"
      backTo="/treino/rapido"
      title={`Treino Rápido — ${subject === 'matematica' ? 'Matemática' : 'Português'}`}
    />
  )
}

export function TreinoAssuntoSetupPage() {
  return (
    <div className="page">
      <h1>Treino por Assunto</h1>
      <p className="lead">Escolha a disciplina.</p>
      <div className="setup-grid">
        <SetupCard title="Matemática" to="/treino/assunto/matematica" />
        <SetupCard title="Português" to="/treino/assunto/portugues" />
      </div>
    </div>
  )
}

export function TreinoAssuntoListPage() {
  const { subject } = useParams<{ subject: Subject }>()
  const navigate = useNavigate()
  const validSubject = subject === 'matematica' || subject === 'portugues'
  if (!validSubject) return <div className="page"><p>Disciplina inválida.</p></div>
  const topics = topicsBySubject(subject)
  const stats = subjectStats(subject)
  return (
    <div className="page">
      <h1>Treino por Assunto — {subject === 'matematica' ? 'Matemática' : 'Português'}</h1>
      <ul className="topic-list">
        {topics.map((t) => {
          const st = stats.byTopic[t.topic] ?? { answered: 0, correct: 0 }
          const acc = st.answered ? Math.round((st.correct / st.answered) * 100) : null
          const available = pickBySubjectTopic(subject, t.topic).length
          return (
            <li key={t.topic}>
              <button className="topic-row" onClick={() => navigate(`/treino/assunto/${subject}/${encodeURIComponent(t.topic)}`)}>
                <span className="topic-label">{t.label}</span>
                <span className="topic-meta">
                  <span>{available} questões</span>
                  {acc !== null && <span className="acc">{acc}% acerto</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <Link to="/treino/assunto" className="back-link">← Voltar</Link>
    </div>
  )
}

export function TreinoAssuntoRunPage() {
  const { subject, topic } = useParams<{ subject: Subject; topic: string }>()
  const decodedTopic = decodeURIComponent(topic ?? '')
  const validSubject = subject === 'matematica' || subject === 'portugues'
  const questions = useMemo(
    () => (validSubject ? shuffle(pickBySubjectTopic(subject, decodedTopic), 7) : []),
    [validSubject, subject, decodedTopic],
  )
  if (!validSubject) return <div className="page"><p>Disciplina inválida.</p></div>
  return (
    <PracticeSession
      questions={questions}
      subject={subject}
      feedbackMode="imediato"
      sessionKey={`treino-assunto-${subject}-${decodedTopic}-${Date.now()}`}
      context="treino-assunto"
      backTo={`/treino/assunto/${subject}`}
      title={`Assunto: ${decodedTopic}`}
    />
  )
}

// ============ Sessão de prática reutilizável ============

export interface PracticeSessionProps {
  questions: Question[]
  subject: Subject
  feedbackMode: FeedbackMode
  sessionKey: string
  context: 'treino-rapido' | 'treino-assunto' | 'revisao-erros'
  backTo: string
  title: string
}

export function PracticeSession({ questions, feedbackMode, sessionKey, context, backTo, title }: PracticeSessionProps) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const progress = useProgress()
  const navigate = useNavigate()
  const question = questions[idx]
  const showResult = feedbackMode === 'imediato' ? submitted[question.id] : false
  const allAnswered = questions.every((q) => answers[q.id])

  const handleSelect = useCallback(
    (option: string) => {
      if (submitted[question.id] && feedbackMode === 'imediato') return
      setAnswers((a) => ({ ...a, [question.id]: option }))
      if (feedbackMode === 'imediato') {
        const isCorrect = option === question.correctOption
        setSubmitted((s) => ({ ...s, [question.id]: true }))
        recordAnswer({
          questionId: question.id,
          selected: option as Question['correctOption'],
          correct: isCorrect,
          subject: question.subject,
          topic: question.topic,
          difficulty: question.difficulty,
          context,
          sessionId: sessionKey,
        })
      }
    },
    [question, submitted, feedbackMode, context, sessionKey],
  )

  const finish = () => {
    // registra todas as respostas ainda não registradas (modo final)
    for (const q of questions) {
      const sel = answers[q.id]
      if (!submitted[q.id] && sel) {
        const isCorrect = sel === q.correctOption
        setSubmitted((s) => ({ ...s, [q.id]: true }))
        recordAnswer({
          questionId: q.id,
          selected: sel as Question['correctOption'],
          correct: isCorrect,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          context,
          sessionId: sessionKey,
        })
      }
    }
    navigate('resultado', { state: { answers, questions, sessionKey } })
  }

  const correctCount = questions.filter((q) => submitted[q.id] && answers[q.id] === q.correctOption).length

  return (
    <div className="page practice">
      <div className="practice-head">
        <Link to={backTo} className="back-link">← Sair</Link>
        <h1>{title}</h1>
        <div className="progress-track" aria-hidden="true">
          <div style={{ width: `${(idx + 1) / questions.length * 100}%` }} />
        </div>
      </div>

      <QuestionCard
        question={question}
        index={idx}
        total={questions.length}
        selected={answers[question.id]}
        showResult={showResult}
        isFavorite={progress.favorites.includes(question.id)}
        onSelect={handleSelect}
        onToggleFavorite={() => toggleFavorite(question.id)}
      />

      <nav className="question-nav" aria-label="Navegação entre questões">
        <button type="button" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Anterior</button>
        <span>{idx + 1} de {questions.length}</span>
        {idx < questions.length - 1 ? (
          <button type="button" className="primary" onClick={() => setIdx((i) => i + 1)}>Próxima</button>
        ) : (
          <button type="button" className="primary" disabled={!allAnswered && feedbackMode === 'final'} onClick={finish}>
            Finalizar
          </button>
        )}
      </nav>

      {feedbackMode === 'imediato' && submitted[question.id] && (
        <div className="quick-result">
          {answers[question.id] === question.correctOption ? '✓ Acertou!' : `✗ Resposta correta: ${question.correctOption}`}
        </div>
      )}

      {feedbackMode === 'final' && (
        <p className="hint">Respostas registradas: {Object.keys(answers).length}/{questions.length} · Acertos até agora: {correctCount}</p>
      )}
    </div>
  )
}

function SetupCard({ title, to }: { title: string; to: string }) {
  return (
    <Link to={to} className="mode-card">
      <h2>{title}</h2>
      <p>Iniciar treino</p>
    </Link>
  )
}
