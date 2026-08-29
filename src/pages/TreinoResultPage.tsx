import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { QuestionCard } from '../components/QuestionCard'
import { MotivationalCard } from '../components/MotivationalCard'
import { computeWeakestTopic, getMotivationalMessage } from '../lib/motivational-message'
import { useProgress } from '../hooks/useProgress'
import type { Question } from '../types/exam'

interface ResultState {
  questions: Question[]
  answers: Record<string, string>
  sessionKey: string
  examType?: 'treino' | 'mini-simulado' | 'matematica' | 'portugues'
}

export function TreinoResultPage() {
  const location = useLocation()
  const state = location.state as ResultState | null
  const progress = useProgress()

  const motivational = useMemo(() => {
    if (!state || !state.questions?.length) return null
    const { questions, answers, examType = 'treino' } = state
    const correct = questions.filter((q) => answers[q.id] === q.correctOption).length
    const total = questions.length
    const percentage = Math.round((correct / total) * 100)

    // Tópico mais fraco (apenas se houver dados suficientes)
    const weakestTopic = computeWeakestTopic(
      questions,
      answers,
      (q) => q.correctOption,
      2,
    )

    return getMotivationalMessage(
      {
        nickname: progress.nickname || undefined,
        percentage,
        weakestTopic,
        examType,
      },
      state.sessionKey ? hashString(state.sessionKey) : Date.now(),
    )
  }, [state, progress.nickname])

  if (!state || !state.questions?.length) {
    return (
      <div className="page">
        <h1>Resultado</h1>
        <p>Não foi possível carregar o resultado da sessão.</p>
        <Link to="/treino" className="link-btn">Voltar ao treino</Link>
      </div>
    )
  }
  const { questions, answers } = state
  const correct = questions.filter((q) => answers[q.id] === q.correctOption).length
  const total = questions.length
  const acc = Math.round((correct / total) * 100)

  return (
    <div className="page">
      <h1>Resultado do treino</h1>

      {motivational && (
        <MotivationalCard
          result={motivational}
          percentage={acc}
        />
      )}

      <div className="result-summary">
        <div><strong>{correct}</strong><span>acertos</span></div>
        <div><strong>{total - correct}</strong><span>erros</span></div>
        <div><strong>{acc}%</strong><span>aproveitamento</span></div>
      </div>

      <h2>Revisão das questões</h2>
      <div className="review-list">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            total={total}
            selected={answers[q.id]}
            showResult
            disabled
            onSelect={() => {}}
          />
        ))}
      </div>

      <div className="actions">
        <Link to="/treino" className="link-btn">Novo treino</Link>
        <Link to="/revisao" className="link-btn">Revisar erros</Link>
      </div>
    </div>
  )
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}
