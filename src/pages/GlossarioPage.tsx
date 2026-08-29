import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchGlossary } from '../data/glossary'
import type { Subject } from '../types/exam'

export function GlossarioPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [subject, setSubject] = useState<'todas' | Subject>('todas')

  const results = useMemo(() => {
    return searchGlossary(query, subject === 'todas' ? undefined : subject)
  }, [query, subject])

  return (
    <div className="page">
      <h1>Glossário</h1>
      <p className="lead">
        Definições dos termos usados nas aulas e questões. Use a busca para
        encontrar rapidamente.
      </p>

      <div className="search-box">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar termo..."
          aria-label="Buscar no glossário"
          autoFocus={!!initialQuery}
        />
      </div>

      <div className="filter-row" role="tablist" aria-label="Filtrar por disciplina">
        {(['todas', 'matematica', 'portugues'] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={subject === f}
            className={`filter-tab ${subject === f ? 'active' : ''}`}
            onClick={() => setSubject(f)}
          >
            {f === 'todas' ? 'Todas' : f === 'matematica' ? 'Matemática' : 'Português'}
          </button>
        ))}
      </div>

      <p className="hint">{results.length} {results.length === 1 ? 'termo' : 'termos'}</p>

      {results.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum termo encontrado para "{query}".</p>
        </div>
      ) : (
        <dl className="glossary-list">
          {results.map((entry) => (
            <div key={`${entry.term}-${entry.subject}`} className="glossary-entry">
              <dt className="glossary-term">
                {entry.term}
                <span className={`chip subject small ${entry.subject}`}>
                  {entry.subject === 'matematica' ? 'Mat' : entry.subject === 'portugues' ? 'Port' : 'Geral'}
                </span>
              </dt>
              <dd className="glossary-def">{entry.definition}</dd>
              {entry.relatedTopic && (
                <dd className="glossary-related">
                  <Link
                    to={`/estudar/${entry.subject}/${encodeURIComponent(entry.relatedTopic)}`}
                    className="link-btn small"
                  >
                    Ver aula: {entry.relatedTopic}
                  </Link>
                </dd>
              )}
            </div>
          ))}
        </dl>
      )}

      <Link to="/" className="back-link">← Voltar</Link>
    </div>
  )
}
