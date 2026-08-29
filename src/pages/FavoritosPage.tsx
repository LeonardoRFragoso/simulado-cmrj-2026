import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toggleFavorite } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import { pickByIds, shuffle } from '../lib/exam-generator'
import { PracticeSession } from './TreinoPages'
import type { Subject } from '../types/exam'

export function FavoritosPage() {
  const progress = useProgress()
  const [filter, setFilter] = useState<'todas' | Subject>('todas')
  const [trainIds, setTrainIds] = useState<string[] | null>(null)

  const favoriteQuestions = useMemo(() => {
    const qs = pickByIds(progress.favorites)
    if (filter === 'todas') return qs
    return qs.filter((q) => q.subject === filter)
  }, [progress.favorites, filter])

  if (trainIds && trainIds.length > 0) {
    const questions = shuffle(pickByIds(trainIds), Date.now())
    return (
      <PracticeSession
        questions={questions}
        subject={questions[0].subject}
        feedbackMode="imediato"
        sessionKey={`favoritos-${Date.now()}`}
        context="treino-rapido"
        backTo="/favoritos"
        title="Treino de Favoritos"
      />
    )
  }

  return (
    <div className="page">
      <h1>Favoritos</h1>
      <p className="lead">
        Questões que você marcou com ★ para revisar depois. Use para guardar
        questões difíceis ou importantes.
      </p>

      {progress.favorites.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não tem questões favoritas. Toque em ☆ durante um treino para favoritar.</p>
          <Link to="/treino" className="link-btn">Ir ao treino</Link>
        </div>
      ) : (
        <>
          <div className="summary-stats">
            <div><strong>{progress.favorites.length}</strong><span>favoritas</span></div>
            <div><strong>{favoriteQuestions.filter((q) => q.subject === 'matematica').length}</strong><span>Matemática</span></div>
            <div><strong>{favoriteQuestions.filter((q) => q.subject === 'portugues').length}</strong><span>Português</span></div>
          </div>

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

          {favoriteQuestions.length > 0 && (
            <div className="actions">
              <button
                className="big-btn"
                onClick={() => setTrainIds(favoriteQuestions.map((q) => q.id))}
              >
                Treinar {favoriteQuestions.length} questões favoritas
              </button>
            </div>
          )}

          <ul className="favorites-list">
            {favoriteQuestions.map((q) => (
              <li key={q.id} className="favorite-item">
                <div className="fav-item-main">
                  <span className="chip subject">{q.subject === 'matematica' ? 'Matemática' : 'Português'}</span>
                  <span className="chip topic">{q.topic}</span>
                  <span className="chip diff">{q.difficulty === 'facil' ? 'Fácil' : q.difficulty === 'media' ? 'Média' : 'Difícil'}</span>
                </div>
                <p className="fav-statement">{q.statement}</p>
                <div className="fav-actions">
                  <Link
                    className="link-btn small"
                    to={`/treino/assunto/${q.subject}/${encodeURIComponent(q.topic)}`}
                  >
                    Treinar tópico
                  </Link>
                  <Link
                    className="link-btn small"
                    to={`/estudar/${q.subject}/${encodeURIComponent(q.topic)}`}
                  >
                    Ver aula
                  </Link>
                  <button
                    className="link-btn small danger"
                    onClick={() => toggleFavorite(q.id)}
                    aria-label="Remover dos favoritos"
                  >
                    ★ Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}
