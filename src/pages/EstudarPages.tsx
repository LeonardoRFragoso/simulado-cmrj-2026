import { Link, useParams } from 'react-router-dom'
import { mathTopics, portugueseTopics, topicsBySubject, type TopicNode } from '../data/edital-2026'
import { hasLesson } from '../data/lessons'
import { pickBySubjectTopic } from '../lib/exam-generator'
import { topicMastery } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { Subject } from '../types/exam'

export function EstudarIndexPage() {
  return (
    <div className="page">
      <h1>Estudar</h1>
      <p className="lead">
        Escolha uma disciplina para ver as mini-aulas e treinar questões por assunto.
      </p>
      <div className="modes-grid">
        <Link to="/estudar/matematica" className="mode-card">
          <h2>Matemática</h2>
          <p>{mathTopics.length} tópicos com mini-aulas e questões.</p>
        </Link>
        <Link to="/estudar/portugues" className="mode-card">
          <h2>Português</h2>
          <p>{portugueseTopics.length} tópicos com mini-aulas e questões.</p>
        </Link>
      </div>
      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}

export function EstudarSubjectPage() {
  const { subject } = useParams<{ subject: Subject }>()
  const progress = useProgress()
  const validSubject = subject === 'matematica' || subject === 'portugues'

  if (!validSubject) {
    return (
      <div className="page">
        <p>Disciplina inválida.</p>
        <Link to="/estudar" className="link-btn">Voltar</Link>
      </div>
    )
  }

  const topics = topicsBySubject(subject)
  const subjectLabel = subject === 'matematica' ? 'Matemática' : 'Português'

  // Group by area
  const areas = new Map<string, TopicNode[]>()
  for (const t of topics) {
    if (!areas.has(t.area)) areas.set(t.area, [])
    areas.get(t.area)!.push(t)
  }

  return (
    <div className="page">
      <Link to="/estudar" className="back-link">← Estudar</Link>
      <h1>Estudar — {subjectLabel}</h1>
      <p className="lead">
        Mini-aulas de 2 a 5 minutos com conceito, exemplos, erros comuns e dicas. Depois pratique as questões.
      </p>

      {Array.from(areas.entries()).map(([area, topicList]) => (
        <section key={area} className="study-area">
          <h2>{area}</h2>
          <ul className="study-topic-list">
            {topicList.map((t) => {
              const lessonExists = hasLesson(subject, t.topic)
              const questionCount = pickBySubjectTopic(subject, t.topic).length
              const mastery = topicMastery(subject, t.topic)
              return (
                <li key={t.topic} className="study-topic-item">
                  <Link
                    to={`/estudar/${subject}/${encodeURIComponent(t.topic)}`}
                    className="study-topic-link"
                  >
                    <span className="study-topic-label">{t.label}</span>
                    <span className="study-topic-meta">
                      {lessonExists && <span className="chip lesson">Aula</span>}
                      <span className="chip">{questionCount} questões</span>
                      {mastery && mastery.answered > 0 && (
                        <span className={`chip mastery-${mastery.status}`}>
                          {Math.round(mastery.accuracy * 100)}%
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <Link to="/estudar" className="back-link">← Voltar</Link>
    </div>
  )
}
