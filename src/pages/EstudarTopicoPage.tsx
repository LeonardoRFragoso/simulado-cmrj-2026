import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getLesson, type LessonBlock } from '../data/lessons'
import { topicsBySubject } from '../data/edital-2026'
import { pickBySubjectTopic, shuffle, getRelatedQuestions } from '../lib/exam-generator'
import { topicMastery } from '../stores/progress'
import { useProgress } from '../hooks/useProgress'
import type { Subject } from '../types/exam'

export function EstudarTopicoPage() {
  const { subject, topic } = useParams<{ subject: Subject; topic: string }>()
  const decodedTopic = decodeURIComponent(topic ?? '')
  const progress = useProgress()
  const navigate = useNavigate()

  const validSubject = subject === 'matematica' || subject === 'portugues'
  const lesson = useMemo(
    () => (validSubject ? getLesson(subject, decodedTopic) : undefined),
    [validSubject, subject, decodedTopic],
  )
  const mastery = useMemo(
    () => (validSubject ? topicMastery(subject, decodedTopic) : null),
    [validSubject, subject, decodedTopic, progress.answers],
  )
  const relatedQuestions = useMemo(
    () => (validSubject ? pickBySubjectTopic(subject, decodedTopic) : []),
    [validSubject, subject, decodedTopic],
  )

  if (!validSubject) {
    return <div className="page"><p>Disciplina inválida.</p><Link to="/">Voltar</Link></div>
  }

  if (!lesson) {
    return (
      <div className="page">
        <h1>Aula não disponível</h1>
        <p>Ainda não há mini-aula para este tópico: <strong>{decodedTopic}</strong>.</p>
        <div className="actions">
          <Link to={`/treino/assunto/${subject}/${encodeURIComponent(decodedTopic)}`} className="link-btn primary">
            Treinar questões deste tópico
          </Link>
          <Link to="/dominio" className="link-btn">Ver domínio por assunto</Link>
        </div>
      </div>
    )
  }

  const trainQuestions = shuffle(relatedQuestions, Date.now()).slice(0, 5)

  return (
    <div className="page study-page">
      <Link to="/dominio" className="back-link">← Domínio por assunto</Link>

      <h1>{lesson.title}</h1>
      <p className="lead">{lesson.summary}</p>

      {/* Status de domínio */}
      {mastery && mastery.answered > 0 && (
        <div className="mastery-status-box">
          <span className={`status-chip mastery-${masteryStatusColor(mastery.status)}`}>
            {masteryStatusLabel(mastery.status)}
          </span>
          <span className="muted">{mastery.answered} questões · {Math.round(mastery.accuracy * 100)}% acerto</span>
        </div>
      )}

      {/* Conteúdo da aula */}
      <article className="lesson-content">
        {lesson.blocks.map((block, i) => (
          <LessonBlockView key={i} block={block} />
        ))}
      </article>

      {/* Exemplos */}
      {lesson.examples && lesson.examples.length > 0 && (
        <section className="lesson-section">
          <h2>Exemplos</h2>
          <ul className="lesson-examples">
            {lesson.examples.map((ex, i) => <li key={i}>{ex}</li>)}
          </ul>
        </section>
      )}

      {/* Dicas */}
      {lesson.tips && lesson.tips.length > 0 && (
        <section className="lesson-section tips-section">
          <h2>Dicas e Macetes</h2>
          <ul className="lesson-tips">
            {lesson.tips.map((tip, i) => <li key={i}>💡 {tip}</li>)}
          </ul>
        </section>
      )}

      {/* Erros comuns */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <section className="lesson-section mistakes-section">
          <h2>Erros Comuns</h2>
          <ul className="lesson-mistakes">
            {lesson.commonMistakes.map((m, i) => <li key={i}>⚠️ {m}</li>)}
          </ul>
        </section>
      )}

      {/* Glossário */}
      {lesson.glossaryTerms && lesson.glossaryTerms.length > 0 && (
        <section className="lesson-section">
          <h2>Termos-chave</h2>
          <div className="glossary-terms">
            {lesson.glossaryTerms.map((t) => (
              <Link key={t} className="term-chip" to={`/glossario?q=${encodeURIComponent(t)}`}>
                {t}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ações */}
      <section className="lesson-actions">
        <h2>Pratique agora</h2>
        <p className="muted">{relatedQuestions.length} questões disponíveis neste tópico.</p>
        <div className="actions">
          <Link
            className="big-btn"
            to={`/treino/assunto/${subject}/${encodeURIComponent(decodedTopic)}`}
          >
            Treinar todas as {relatedQuestions.length} questões
          </Link>
          {trainQuestions.length > 0 && (
            <button
              className="link-btn"
              onClick={() => navigate(`/treino/assunto/${subject}/${encodeURIComponent(decodedTopic)}`)}
            >
              Treinar 5 questões
            </button>
          )}
        </div>
      </section>

      {/* Questões relacionadas */}
      {relatedQuestions.length > 1 && (
        <section className="lesson-section related-questions-section">
          <h2>Questões relacionadas</h2>
          <ul className="related-list">
            {getRelatedQuestions(relatedQuestions[0].id, 5).map((rq) => (
              <li key={rq.id} className="related-item">
                <span className="related-meta">
                  <span className="chip diff">{rq.difficulty === 'facil' ? 'Fácil' : rq.difficulty === 'media' ? 'Média' : 'Difícil'}</span>
                  {rq.subtopic && <span className="chip subtopic">{rq.subtopic}</span>}
                </span>
                <span className="related-statement">{rq.statement}</span>
                <Link
                  className="link-btn small"
                  to={`/treino/assunto/${subject}/${encodeURIComponent(rq.topic)}`}
                >
                  Treinar
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Navegação entre tópicos */}
      <TopicNavigation subject={subject} currentTopic={decodedTopic} />
    </div>
  )
}

function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p>{block.text}</p>
    case 'heading':
      return <h3>{block.text}</h3>
    case 'list':
      return (
        <ul>
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )
    case 'formula':
      return (
        <div className="formula-box" role="math">
          <code>{block.text}</code>
          {block.description && <span className="formula-desc">{block.description}</span>}
        </div>
      )
    case 'example':
      return (
        <div className="example-box">
          <p className="example-text"><strong>Exemplo:</strong> {block.text}</p>
          <p className="example-solution">→ {block.solution}</p>
        </div>
      )
  }
}

function TopicNavigation({ subject, currentTopic }: { subject: Subject; currentTopic: string }) {
  const topics = topicsBySubject(subject)
  const currentIdx = topics.findIndex((t) => t.topic === currentTopic)
  const prev = currentIdx > 0 ? topics[currentIdx - 1] : null
  const next = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null

  return (
    <nav className="topic-nav" aria-label="Navegação entre tópicos">
      {prev ? (
        <Link className="topic-nav-link" to={`/estudar/${subject}/${encodeURIComponent(prev.topic)}`}>
          ← {prev.label}
        </Link>
      ) : <span />}
      <span className="muted">{currentIdx + 1} / {topics.length}</span>
      {next ? (
        <Link className="topic-nav-link" to={`/estudar/${subject}/${encodeURIComponent(next.topic)}`}>
          {next.label} →
        </Link>
      ) : <span />}
    </nav>
  )
}

function masteryStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'nao-iniciado': 'Não iniciado',
    comecando: 'Começando',
    'em-progresso': 'Em progresso',
    bom: 'Bom',
    dominado: 'Dominado',
    'precisa-revisar': 'Precisa revisar',
  }
  return map[status] ?? status
}

function masteryStatusColor(status: string): string {
  const map: Record<string, string> = {
    'nao-iniciado': 'muted',
    comecando: 'info',
    'em-progresso': 'warn',
    bom: 'good',
    dominado: 'great',
    'precisa-revisar': 'danger',
  }
  return map[status] ?? 'muted'
}
