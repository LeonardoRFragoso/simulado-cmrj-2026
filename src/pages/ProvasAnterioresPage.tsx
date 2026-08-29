import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { pastExams, pastExamYears, getPastExamByYear } from '../data/past-exams/past-exams'
import { recordAnswer } from '../stores/progress'
import type { OptionId } from '../types/exam'

export function ProvasAnterioresPage() {
  const [year, setYear] = useState<number | null>(pastExamYears[0] ?? null)
  const exam = year ? getPastExamByYear(year) : undefined

  return (
    <div className="page">
      <h1>Provas anteriores CMRJ</h1>
      <p className="lead">
        Provas históricas com fonte oficial rastreável. O Exame Intelectual 2026/2027 ainda ocorrerá em 18/10/2026;
        o caderno e o gabarito oficiais serão divulgados posteriormente pela banca. Esta seção não inventa provas.
      </p>

      <div className="year-tabs" role="tablist" aria-label="Anos disponíveis">
        {pastExamYears.map((y) => (
          <button
            key={y}
            role="tab"
            aria-selected={year === y}
            className={`year-tab ${year === y ? 'active' : ''}`}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
        {pastExamYears.length === 0 && <p>Nenhuma prova anterior disponível com fonte confiável no momento.</p>}
      </div>

      {exam && <ExamView exam={exam} />}

      <details className="info-card">
        <summary>Política de ingestão de provas anteriores</summary>
        <p>
          Somente cadastramos uma prova histórica quando há origem rastreável. Priorizamos fonte oficial
          CMRJ/DEPA/DECEx/Exército. Os enunciados completos não são transcritos em massa: o usuário é
          direcionado ao caderno oficial publicado pelo Colégio Militar. Questões anuladas aparecem
          historicamente, mas não prejudicam o score.
        </p>
      </details>
    </div>
  )
}

function ExamView({ exam }: { exam: (typeof pastExams)[number] }) {
  const [studyMode, setStudyMode] = useState(false)
  const [answers, setAnswers] = useState<Record<number, OptionId>>({})

  const mathQs = useMemo(() => exam.questions.filter((q) => q.subject === 'matematica'), [exam])
  const portQs = useMemo(() => exam.questions.filter((q) => q.subject === 'portugues'), [exam])

  const correctCount = exam.questions.filter((q) => {
    if (q.status === 'annulled') return false
    return answers[q.originalNumber] === q.officialAnswer
  }).length
  const validAnswered = exam.questions.filter((q) => q.status !== 'annulled' && answers[q.originalNumber]).length

  const submit = () => {
    for (const q of exam.questions) {
      const sel = answers[q.originalNumber]
      if (!sel) continue
      const correct = sel === q.officialAnswer
      recordAnswer({
        questionId: `past-${exam.year}-${q.originalNumber}`,
        selected: sel,
        correct,
        subject: q.subject,
        topic: q.topic,
        difficulty: 'media',
        context: 'prova-anterior',
        sessionId: `past-${exam.year}`,
        annulled: q.status === 'annulled',
      })
    }
  }

  return (
    <section className="exam-view">
      <div className="exam-meta">
        <h2>Prova {exam.year} — {exam.school}</h2>
        <p><strong>Série:</strong> {exam.grade}</p>
        <p><strong>Data da prova:</strong> {formatDate(exam.examDate)}</p>
        <p><strong>Questões:</strong> {exam.questions.length} objetivas (20 Matemática + 20 Português)</p>
        {exam.annulledQuestions.length > 0 && (
          <p className="warn-msg"><strong>Questões anuladas:</strong> {exam.annulledQuestions.join(', ')} (não prejudicam o score)</p>
        )}
        <p>
          <strong>Caderno oficial:</strong>{' '}
          <a href={exam.sourceUrl} target="_blank" rel="noreferrer noopener">abrir PDF oficial</a>
        </p>
        <p className="warning">
          Os enunciados completos estão no caderno oficial acima. Aqui você registra seu gabarito para
          conferência automática com o gabarito oficial.
        </p>
      </div>

      <div className="mode-toggle">
        <label>
          <input
            type="checkbox"
            checked={studyMode}
            onChange={(e) => setStudyMode(e.target.checked)}
          />
          Modo estudo (mostrar gabarito oficial enquanto responde)
        </label>
      </div>

      <AnswerSheet
        title="Matemática (questões 1 a 20)"
        questions={mathQs}
        answers={answers}
        studyMode={studyMode}
        onChange={(n, opt) => setAnswers((a) => ({ ...a, [n]: opt }))}
      />
      <AnswerSheet
        title="Português (questões 21 a 40)"
        questions={portQs}
        answers={answers}
        studyMode={studyMode}
        onChange={(n, opt) => setAnswers((a) => ({ ...a, [n]: opt }))}
      />

      <div className="exam-result">
        <p>Respondidas: {validAnswered}/{exam.questions.filter((q) => q.status !== 'annulled').length}</p>
        {validAnswered > 0 && <p>Acertos até agora: {correctCount}</p>}
        <button className="primary" onClick={submit} disabled={validAnswered === 0}>
          Registrar respostas no meu progresso
        </button>
      </div>

      <details className="info-card">
        <summary>Notas e fontes</summary>
        <p>{exam.notes}</p>
      </details>

      <Link to="/provas-anteriores" className="back-link">← Voltar</Link>
    </section>
  )
}

function AnswerSheet({
  title,
  questions,
  answers,
  studyMode,
  onChange,
}: {
  title: string
  questions: (typeof pastExams)[number]['questions']
  answers: Record<number, OptionId>
  studyMode: boolean
  onChange: (n: number, opt: OptionId) => void
}) {
  return (
    <div className="answer-sheet">
      <h3>{title}</h3>
      <ul className="sheet-list">
        {questions.map((q) => {
          const sel = answers[q.originalNumber]
          const isCorrect = sel === q.officialAnswer
          const annulled = q.status === 'annulled'
          return (
            <li key={q.originalNumber} className={`sheet-row ${annulled ? 'annulled' : ''}`}>
              <span className="sheet-num">{q.originalNumber}{annulled && ' (anulada)'}</span>
              <div className="sheet-opts" role="radiogroup" aria-label={`Resposta da questão ${q.originalNumber}`}>
                {(['A', 'B', 'C', 'D', 'E'] as OptionId[]).map((opt) => {
                  const selected = sel === opt
                  const showCorrect = studyMode && opt === q.officialAnswer && !annulled
                  let cls = ''
                  if (selected) cls = 'selected'
                  if (studyMode && selected && !annulled) cls = isCorrect ? 'correct' : 'wrong'
                  if (showCorrect && !selected) cls = 'correct-hint'
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`sheet-opt ${cls}`}
                      disabled={annulled}
                      onClick={() => onChange(q.originalNumber, opt)}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {studyMode && !annulled && sel && (
                <span className="sheet-feedback">{isCorrect ? '✓' : `✗ gabarito: ${q.officialAnswer}`}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
