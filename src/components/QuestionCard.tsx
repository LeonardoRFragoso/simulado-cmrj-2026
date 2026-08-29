import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question } from '../types/exam'
import { getExplanation } from '../types/exam'

interface Props {
  question: Question
  index?: number
  total?: number
  selected?: string
  showResult?: boolean
  isFavorite?: boolean
  disabled?: boolean
  /** Modo de estudo permite dicas progressivas e revisão de assunto. Simulados oficiais não. */
  studyMode?: boolean
  onSelect: (option: string) => void
  onToggleFavorite?: () => void
  /** Callback quando o usuário pede dica (para analytics) */
  onHintUsed?: (level: number) => void
}

export function QuestionCard({
  question,
  index,
  total,
  selected,
  showResult = false,
  isFavorite = false,
  disabled = false,
  studyMode = false,
  onSelect,
  onToggleFavorite,
  onHintUsed,
}: Props) {
  const groupRef = useRef<HTMLDivElement>(null)
  const [showSteps, setShowSteps] = useState(false)
  const [hintLevel, setHintLevel] = useState(0) // 0 = sem dica; 1..N = dicas reveladas

  // foco no início do card ao trocar de questão (acessibilidade/navegação por teclado)
  useEffect(() => {
    groupRef.current?.focus()
    setShowSteps(false)
    setHintLevel(0)
  }, [question.id])

  const correctId = showResult ? question.correctOption : null
  const explanation = getExplanation(question)
  const isWrong = showResult && selected != null && selected !== question.correctOption
  const hints = explanation.hints ?? []

  const revealHint = () => {
    const next = Math.min(hintLevel + 1, hints.length)
    setHintLevel(next)
    onHintUsed?.(next)
  }

  return (
    <section className="question-card" aria-labelledby={`q-${question.id}`}>
      <div className="question-head">
        <div className="question-meta">
          <span className="chip subject">{question.subject === 'matematica' ? 'Matemática' : 'Português'}</span>
          <span className="chip topic">{question.topic}</span>
          {question.subtopic && <span className="chip subtopic">{question.subtopic}</span>}
          <span className="chip diff">{difficultyLabel(question.difficulty)}</span>
        </div>
        {onToggleFavorite && (
          <button
            type="button"
            className={`fav-btn ${isFavorite ? 'on' : ''}`}
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
      </div>

      {typeof index === 'number' && typeof total === 'number' && (
        <p className="counter" aria-hidden="true">Questão {index + 1} de {total}</p>
      )}

      {question.supportText && (
        <div className="support-text" aria-label="Texto de apoio">
          <pre>{question.supportText}</pre>
        </div>
      )}

      <h2 id={`q-${question.id}`} className="statement">{question.statement}</h2>

      <div
        ref={groupRef}
        className="options"
        role="radiogroup"
        aria-label="Alternativas"
        tabIndex={0}
      >
        {question.options.map((option) => {
          const isSelected = selected === option.id
          const isCorrect = correctId === option.id
          let state = ''
          if (showResult) {
            if (isCorrect) state = 'correct'
            else if (isSelected) state = 'wrong'
          } else if (isSelected) {
            state = 'selected'
          }
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled && !isSelected}
              className={`option ${state}`}
              onClick={() => onSelect(option.id)}
            >
              <strong className="opt-letter" aria-hidden="true">{option.id}</strong>
              <span className="opt-text">{option.text}</span>
              {showResult && isCorrect && <span className="badge ok" aria-label="Resposta correta">✓</span>}
              {showResult && isSelected && !isCorrect && <span className="badge no" aria-label="Sua resposta está incorreta">✗</span>}
            </button>
          )
        })}
      </div>

      {/* Dicas progressivas (apenas em modo de estudo, antes de responder) */}
      {studyMode && !showResult && hints.length > 0 && (
        <div className="hints-area" aria-label="Dicas progressivas">
          {hintLevel > 0 && (
            <ul className="hints-list">
              {hints.slice(0, hintLevel).map((h, i) => (
                <li key={i} className="hint-item">
                  <span className="hint-num" aria-hidden="true">Dica {i + 1}</span>
                  <span className="hint-text">{h}</span>
                </li>
              ))}
            </ul>
          )}
          {hintLevel < hints.length && (
            <button type="button" className="hint-btn" onClick={revealHint}>
              💡 {hintLevel === 0 ? 'Pedir dica' : 'Pedir outra dica'}
              <span className="hint-count" aria-hidden="true"> ({hintLevel}/{hints.length})</span>
            </button>
          )}
        </div>
      )}

      {/* Explicação estruturada após resposta */}
      {showResult && (
        <div className="explanation" role="note">
          {isWrong && (
            <p className="correct-answer">
              <strong>Resposta correta: {question.correctOption}</strong>
              {' — '}
              {question.options.find((o) => o.id === question.correctOption)?.text}
            </p>
          )}

          <p className="explanation-short">
            <strong>{isWrong ? 'Por quê?' : 'Explicação'}:</strong> {explanation.short}
          </p>

          {explanation.concept && (
            <p className="explanation-concept">
              <span className="exp-label">Conceito:</span> {explanation.concept}
            </p>
          )}

          {explanation.tip && (
            <p className="explanation-tip">
              <span className="exp-label">Dica:</span> {explanation.tip}
            </p>
          )}

          {explanation.commonMistake && (
            <p className="explanation-mistake">
              <span className="exp-label">Erro comum:</span> {explanation.commonMistake}
            </p>
          )}

          {explanation.optionExplanations && (
            <ul className="option-explanations" aria-label="Justificativa por alternativa">
              {question.options.map((opt) => {
                const text = explanation.optionExplanations![opt.id]
                if (!text) return null
                return (
                  <li key={opt.id} className={opt.id === question.correctOption ? 'opt-correct' : ''}>
                    <strong>{opt.id}.</strong> {text}
                  </li>
                )
              })}
            </ul>
          )}

          {showSteps && explanation.steps && (
            <ol className="explanation-steps" aria-label="Passo a passo">
              {explanation.steps.map((s, i) => (
                <li key={i} className="step-item">{s}</li>
              ))}
            </ol>
          )}

          {/* Ações pedagógicas */}
          {studyMode && (
            <div className="explanation-actions">
              {explanation.steps && !showSteps && (
                <button type="button" className="action-btn" onClick={() => setShowSteps(true)}>
                  Ver passo a passo
                </button>
              )}
              {explanation.steps && showSteps && (
                <button type="button" className="action-btn" onClick={() => setShowSteps(false)}>
                  Ocultar passo a passo
                </button>
              )}
              <Link
                className="action-btn"
                to={`/estudar/${question.subject}/${encodeURIComponent(question.topic)}`}
              >
                Revisar assunto
              </Link>
            </div>
          )}

          <p className="source-note">{question.sourceLabel}{question.sourceUrl ? ` · fonte` : ''}</p>
        </div>
      )}
    </section>
  )
}

function difficultyLabel(d: Question['difficulty']): string {
  return d === 'facil' ? 'Fácil' : d === 'media' ? 'Média' : 'Difícil'
}
