import { Link } from 'react-router-dom'
import { examRules, officialReferences } from '../data/edital-2026'
import { allQuestions, questionsBySubject } from '../data/questions'
import { useProgress } from '../hooks/useProgress'
import { generalAccuracy } from '../stores/progress'

export function HomePage() {
  const progress = useProgress()
  const totalAnswered = progress.answers.filter((a) => !a.annulled).length
  const accuracy = generalAccuracy()
  const matCount = questionsBySubject('matematica').length
  const portCount = questionsBySubject('portugues').length

  return (
    <div className="page">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">CMRJ • 6º ano • ingresso 2027</p>
        <h1 id="hero-title">Simulado CMRJ 2026/2027</h1>
        <p className="hero-sub">
          Treino mobile-first alinhado ao edital vigente. Estude {allQuestions.length} questões autorais
          ({matCount} de Matemática e {portCount} de Português) com simulado oficial, redação e provas anteriores.
        </p>
      </section>

      <section className="rules-grid" aria-label="Regras principais da prova">
        <article><strong>{examRules.mathQuestions}</strong><span>Matemática</span></article>
        <article><strong>{examRules.portugueseQuestions}</strong><span>Português</span></article>
        <article><strong>{examRules.totalMinutes} min</strong><span>Tempo total</span></article>
        <article><strong>{examRules.essayMinLines}–{examRules.essayMaxLines}</strong><span>Linhas da redação</span></article>
      </section>

      <section className="modes-grid" aria-label="Modos de estudo">
        <Link to="/treino/rapido" className="mode-card">
          <h2>Treino Rápido</h2>
          <p>5, 10 ou 20 questões com feedback imediato ou no final.</p>
        </Link>
        <Link to="/treino/assunto" className="mode-card">
          <h2>Treino por Assunto</h2>
          <p>Escolha disciplina e assunto para focar o estudo.</p>
        </Link>
        <Link to="/simulado" className="mode-card">
          <h2>Simulado Oficial</h2>
          <p>20+20 questões, redação e cronômetro de {examRules.totalMinutes} minutos.</p>
        </Link>
        <Link to="/provas-anteriores" className="mode-card">
          <h2>Provas Anteriores</h2>
          <p>Provas históricas com fonte rastreável e questões anuladas.</p>
        </Link>
        <Link to="/revisao" className="mode-card">
          <h2>Revisão de Erros</h2>
          <p>Revista as questões que você errou até dominá-las.</p>
        </Link>
        <Link to="/caderno-de-erros" className="mode-card">
          <h2>Caderno de Erros</h2>
          <p>Histórico completo com agrupamento, status e repetição espaçada.</p>
        </Link>
        <Link to="/revisao/hoje" className="mode-card">
          <h2>Revisão do Dia</h2>
          <p>Sessão inteligente: vencidas + caderno + novas, tudo em um lugar.</p>
        </Link>
        <Link to="/dominio" className="mode-card">
          <h2>Domínio por Assunto</h2>
          <p>Veja seu nível em cada tópico do edital e onde focar.</p>
        </Link>
        <Link to="/favoritos" className="mode-card">
          <h2>Favoritos</h2>
          <p>Questões que você marcou com ★ para revisar depois.</p>
        </Link>
        <Link to="/mini-simulado" className="mode-card">
          <h2>Mini-simulados</h2>
          <p>Provas curtas (5+5, 20 Mat, 20 Port) sem tempo cronometrado.</p>
        </Link>
        <Link to="/redacao" className="mode-card">
          <h2>Produção Textual</h2>
          <p>Escreva, conte linhas e revise com o checklist do edital.</p>
        </Link>
      </section>

      <section className="summary-card" aria-label="Seu progresso">
        <h2>Seu progresso</h2>
        <div className="summary-stats">
          <div><strong>{totalAnswered}</strong><span>respondidas</span></div>
          <div><strong>{accuracy > 0 ? (accuracy * 100).toFixed(0) + '%' : '—'}</strong><span>acertos</span></div>
          <div><strong>{progress.studyDays.length}</strong><span>dias estudados</span></div>
        </div>
        <Link to="/dashboard" className="link-btn">Ver dashboard completo</Link>
      </section>

      <details className="syllabus">
        <summary>Fontes oficiais e regras do edital</summary>
        <ul className="refs">
          {officialReferences.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer noopener">{r.label}</a>
            </li>
          ))}
        </ul>
        <p className="refs-note">
          Exame Intelectual previsto para {formatDate(examRules.examDate)}. Nota mínima em cada objetiva: {examRules.minimumScorePerObjective.toFixed(3).replace('.', ',')}.
          Produção Textual: caráter eliminatório, APTO com pelo menos {examRules.essayMinimumDescriptorPercentage}% dos descritores.
        </p>
      </details>
    </div>
  )
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
