import { Link, useLocation } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import type { Question } from '../types/exam'

interface ResultState {
  questions: Question[]
  answers: Record<string, string>
  sessionKey: string
}

export function TreinoResultPage() {
  const location = useLocation()
  const state = location.state as ResultState | null
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
