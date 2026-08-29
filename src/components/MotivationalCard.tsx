import { Link } from 'react-router-dom'
import type { MotivationalResult } from '../lib/motivational-message'

interface MotivationalCardProps {
  result: MotivationalResult
  /** Porcentagem geral para destaque visual. */
  percentage: number
  /** Breakdown por disciplina (apenas simulado oficial). */
  disciplines?: { label: string; percentage: number }[]
  /** Tópico prioritário para mostrar como "próximo foco". */
  weakestTopic?: string
}

const LEVEL_CLASS: Record<MotivationalResult['level'], string> = {
  recomecar: 'motiv-recomecar',
  quase: 'motiv-quase',
  bom: 'motiv-bom',
  'muito-bom': 'motiv-muito-bom',
  excelente: 'motiv-excelente',
  gabaritou: 'motiv-gabaritou',
}

export function MotivationalCard({ result, percentage, disciplines, weakestTopic }: MotivationalCardProps) {
  const isCelebration = percentage >= 85
  const isPerfect = percentage === 100

  return (
    <section
      className={`motivational-card ${LEVEL_CLASS[result.level]} ${isCelebration ? 'celebrate' : ''} ${isPerfect ? 'perfect' : ''}`}
      aria-live="polite"
    >
      <div className="motiv-score" aria-label={`Aproveitamento: ${percentage}%`}>
        <span className="motiv-score-num">{percentage}<small>%</small></span>
      </div>

      <h2 className="motiv-title">{result.title}</h2>
      <p className="motiv-message">{result.message}</p>

      {result.improvementMessage && (
        <p className="motiv-improvement">{result.improvementMessage}</p>
      )}

      {disciplines && disciplines.length > 0 && (
        <div className="motiv-disciplines" aria-label="Desempenho por disciplina">
          {disciplines.map((d) => (
            <div key={d.label} className="motiv-discipline">
              <span className="motiv-disc-label">{d.label}</span>
              <span className="motiv-disc-pct">{d.percentage}%</span>
            </div>
          ))}
        </div>
      )}

      {weakestTopic && (
        <p className="motiv-focus">
          <strong>Seu próximo foco:</strong> {weakestTopic}
        </p>
      )}

      {result.nextSteps.length > 0 && (
        <div className="motiv-actions">
          {result.nextSteps.map((step, i) => (
            <Link
              key={step.to + i}
              to={step.to}
              className={`link-btn ${i === 0 ? 'primary' : ''}`}
            >
              {step.label}
            </Link>
          ))}
        </div>
      )}

      {isPerfect && <div className="motiv-confetti" aria-hidden="true" />}
    </section>
  )
}
