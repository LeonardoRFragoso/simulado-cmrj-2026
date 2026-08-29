import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import { pickByIds, shuffle } from '../lib/exam-generator'
import { recordAnswer, toggleFavorite, wrongQuestions, progressStore } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { Question, Subject } from '../types/exam'
import { PracticeSession } from './TreinoPages'

export function RevisaoPage() {
  const progress = useProgress()
  const [filter, setFilter] = useState<'todas' | Subject>('todas')
  const wrong = useMemo(
    () => wrongQuestions(filter === 'todas' ? undefined : filter),
    [progress.answers, filter],
  )
  const wrongIds = wrong.map((w) => w.questionId)
  const questions = pickByIds(wrongIds)

  const masteredCount = Object.values(progress.mastery).filter((m) => m.mastered).length

  return (
    <div className="page">
      <h1>Revisão de Erros</h1>
      <p className="lead">
        Banco automático das questões que você errou. Uma questão é considerada dominada após
        2 acertos consecutivos posteriores.
      </p>

      <div className="filter-row" role="tablist" aria-label="Filtrar por disciplina">
        {(['todas', 'matematica', 'portugues'] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'todas' ? 'Todas' : f === 'matematica' ? 'Matemática' : 'Português'}
          </button>
        ))}
      </div>

      <div className="summary-stats">
        <div><strong>{questions.length}</strong><span>para revisar</span></div>
        <div><strong>{masteredCount}</strong><span>dominadas</span></div>
      </div>

      {questions.length === 0 ? (
        <div className="empty-state">
          <p>Não há questões erradas para revisar no momento. Continue treinando!</p>
          <Link to="/treino" className="link-btn">Ir ao treino</Link>
        </div>
      ) : (
        <>
          <p className="hint">Total a revisar: {questions.length}</p>
          <RevisaoSession questions={questions} />
        </>
      )}
    </div>
  )
}

function RevisaoSession({ questions }: { questions: Question[] }) {
  const [started, setStarted] = useState(false)
  const [seed] = useState(() => Date.now())
  const sessionQuestions = useMemo(() => (started ? shuffle(questions, seed) : []), [started, questions, seed])
  const progress = useProgress()

  if (!started) {
    return (
      <div className="actions">
        <button className="big-btn" onClick={() => setStarted(true)}>
          Iniciar revisão ({questions.length} questões)
        </button>
      </div>
    )
  }
  return (
    <PracticeSession
      questions={sessionQuestions}
      subject={sessionQuestions[0]?.subject ?? 'matematica'}
      feedbackMode="imediato"
      sessionKey={`revisao-${seed}`}
      context="revisao-erros"
      backTo="/revisao"
      title="Revisão de Erros"
    />
  )
}

// Componente auxiliar para marcar dominada manualmente (acesso rápido)
export function MarkMasteredButton({ questionId }: { questionId: string }) {
  const onMark = () => {
    progressStore.set((s) => {
      const prev = s.mastery[questionId] ?? {
        questionId,
        consecutiveErrors: 0,
        consecutiveCorrect: 0,
        mastered: false,
        lastSeenAt: new Date().toISOString(),
      }
      return {
        ...s,
        mastery: { ...s.mastery, [questionId]: { ...prev, mastered: true, consecutiveCorrect: 2 } },
      }
    })
  }
  return <button className="link-btn" onClick={onMark}>Marcar como dominada</button>
}
