import { useEffect, useRef } from 'react'
import type { Question } from '../types/exam'

interface Props {
  question: Question
  index?: number
  total?: number
  selected?: string
  showResult?: boolean
  isFavorite?: boolean
  disabled?: boolean
  onSelect: (option: string) => void
  onToggleFavorite?: () => void
}

export function QuestionCard({
  question,
  index,
  total,
  selected,
  showResult = false,
  isFavorite = false,
  disabled = false,
  onSelect,
  onToggleFavorite,
}: Props) {
  const groupRef = useRef<HTMLDivElement>(null)

  // foco no início do card ao trocar de questão (acessibilidade/navegação por teclado)
  useEffect(() => {
    groupRef.current?.focus()
  }, [question.id])

  const correctId = showResult ? question.correctOption : null

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

      {showResult && (
        <div className="explanation" role="note">
          <p><strong>Explicação:</strong> {question.explanation}</p>
          <p className="source-note">{question.sourceLabel}{question.sourceUrl ? ` · fonte` : ''}</p>
        </div>
      )}
    </section>
  )
}

function difficultyLabel(d: Question['difficulty']): string {
  return d === 'facil' ? 'Fácil' : d === 'media' ? 'Média' : 'Difícil'
}
