import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { pickRandom, shuffle } from '../lib/exam-generator'
import { PracticeSession } from './TreinoPages'
import type { Question, Subject } from '../types/exam'

type MiniType = '5+5' | '20mat' | '20port'

interface MiniConfig {
  type: MiniType
  label: string
  description: string
  questions: () => Question[]
}

const CONFIGS: Record<MiniType, MiniConfig> = {
  '5+5': {
    type: '5+5',
    label: 'Mini 5+5',
    description: '5 questões de Matemática + 5 de Português (10 no total)',
    questions: () => [...pickRandom('matematica', 5), ...pickRandom('portugues', 5)],
  },
  '20mat': {
    type: '20mat',
    label: 'Mini 20 Matemática',
    description: '20 questões de Matemática',
    questions: () => pickRandom('matematica', 20),
  },
  '20port': {
    type: '20port',
    label: 'Mini 20 Português',
    description: '20 questões de Português',
    questions: () => pickRandom('portugues', 20),
  },
}

export function MiniSimuladoSetupPage() {
  return (
    <div className="page">
      <h1>Mini-simulados</h1>
      <p className="lead">
        Simulados curtos para prática rápida. Diferente do Simulado Oficial,
        estes não têm tempo cronometrado e mostram o resultado ao final.
      </p>

      <div className="modes-grid">
        {(Object.values(CONFIGS) as MiniConfig[]).map((cfg) => (
          <Link
            key={cfg.type}
            to={`/mini-simulado/${cfg.type}`}
            className="mode-card"
          >
            <h2>{cfg.label}</h2>
            <p>{cfg.description}</p>
          </Link>
        ))}
      </div>

      <div className="info-card" style={{ marginTop: '14px' }}>
        <p className="muted">
          Os mini-simulados usam o mesmo banco de questões do treino, mas no
          formato "prova": você responde tudo e vê o resultado no final.
          Não afetam o Simulado Oficial.
        </p>
      </div>

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}

export function MiniSimuladoRunPage() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const [seed] = useState(() => Date.now())

  const config = (Object.values(CONFIGS) as MiniConfig[]).find((c) => c.type === type)

  const questions = useMemo(() => {
    if (!config) return []
    return shuffle(config.questions(), seed)
  }, [config, seed])

  if (!config) {
    return (
      <div className="page">
        <p>Tipo de mini-simulado inválido.</p>
        <Link to="/mini-simulado" className="link-btn">Voltar</Link>
      </div>
    )
  }

  if (questions.length === 0) {
    return <div className="page"><p>Não há questões disponíveis.</p></div>
  }

  return (
    <PracticeSession
      questions={questions}
      subject={questions[0].subject}
      feedbackMode="final"
      sessionKey={`mini-simulado-${type}-${seed}`}
      context="treino-rapido"
      backTo="/mini-simulado"
      title={config.label}
      examType="mini-simulado"
    />
  )
}
