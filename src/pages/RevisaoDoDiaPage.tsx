import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildDailyReview, dueReviewsCount, wrongQuestions } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import { pickByIds, shuffle } from '../lib/exam-generator'
import { PracticeSession } from './TreinoPages'

export function RevisaoDoDiaPage() {
  const progress = useProgress()
  const [started, setStarted] = useState(false)
  const [seed] = useState(() => Date.now())

  const composition = useMemo(() => buildDailyReview(15, 0.3), [progress.answers, progress.reviews])
  const allIds = [...composition.dueReviewIds, ...composition.wrongIds, ...composition.newIds]
  const questions = useMemo(() => shuffle(pickByIds(allIds), seed), [allIds, seed])

  const dueCount = composition.dueReviewIds.length
  const wrongCount = composition.wrongIds.length
  const newCount = composition.newIds.length
  const total = composition.total

  if (started && questions.length > 0) {
    return (
      <PracticeSession
        questions={questions}
        subject={questions[0].subject}
        feedbackMode="imediato"
        sessionKey={`revisao-dia-${seed}`}
        context="revisao-erros"
        backTo="/revisao/hoje"
        title="Revisão do Dia"
      />
    )
  }

  return (
    <div className="page">
      <h1>Revisão do Dia</h1>
      <p className="lead">
        Sessão inteligente que combina questões vencidas da repetição espaçada,
        questões do caderno de erros e questões novas para expandir cobertura.
      </p>

      {total === 0 ? (
        <div className="empty-state">
          <p>
            Não há questões para revisar agora. Todas as revisões estão em dia e o
            caderno de erros está vazio. Que tal um treino novo?
          </p>
          <Link to="/treino" className="link-btn">Ir ao treino</Link>
        </div>
      ) : (
        <>
          <div className="summary-stats">
            <div><strong>{dueCount}</strong><span>vencidas</span></div>
            <div><strong>{wrongCount}</strong><span>do caderno</span></div>
            <div><strong>{newCount}</strong><span>novas</span></div>
            <div><strong>{total}</strong><span>total</span></div>
          </div>

          <section className="review-composition" aria-label="Composição da revisão">
            <h2>Como sua sessão será composta</h2>
            <ul className="composition-list">
              {dueCount > 0 && (
                <li>
                  <span className="comp-icon" aria-hidden="true">⏰</span>
                  <div>
                    <strong>{dueCount} questões vencidas</strong>
                    <p className="muted">Revisões agendadas pela repetição espaçada que estão prontas para hoje.</p>
                  </div>
                </li>
              )}
              {wrongCount > 0 && (
                <li>
                  <span className="comp-icon" aria-hidden="true">📝</span>
                  <div>
                    <strong>{wrongCount} questões do caderno de erros</strong>
                    <p className="muted">Questões que você errou e ainda não dominou.</p>
                  </div>
                </li>
              )}
              {newCount > 0 && (
                <li>
                  <span className="comp-icon" aria-hidden="true">✨</span>
                  <div>
                    <strong>{newCount} questões novas</strong>
                    <p className="muted">Balanceadas entre Matemática e Português para expandir sua cobertura.</p>
                  </div>
                </li>
              )}
            </ul>
          </section>

          <div className="actions">
            <button className="big-btn" onClick={() => setStarted(true)}>
              Iniciar revisão do dia ({total} questões)
            </button>
          </div>

          <p className="hint">
            Dica: a revisão do dia é atualizada a cada acesso. Faça diariamente para
            manter o ritmo de aprendizado.
          </p>
        </>
      )}

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}
