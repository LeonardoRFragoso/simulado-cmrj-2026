import { describe, it, expect } from 'vitest'
import { searchGlossary, allGlossaryEntries } from './glossary'

describe('glossário', () => {
  it('tem entradas suficientes (>= 50)', () => {
    expect(allGlossaryEntries().length).toBeGreaterThanOrEqual(50)
  })

  it('busca por termo retorna resultados relevantes', () => {
    const results = searchGlossary('fração')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((r) => r.term.toLowerCase().includes('fração'))).toBe(true)
  })

  it('busca case-insensitive', () => {
    const lower = searchGlossary('metáfora')
    const upper = searchGlossary('METÁFORA')
    expect(lower.length).toBe(upper.length)
  })

  it('filtra por disciplina', () => {
    const math = searchGlossary('', 'matematica')
    const port = searchGlossary('', 'portugues')
    for (const e of math) expect(e.subject).toBe('matematica')
    for (const e of port) expect(e.subject).toBe('portugues')
  })

  it('termos que começam com a query aparecem primeiro', () => {
    const results = searchGlossary('pro')
    if (results.length >= 2) {
      const firstStarts = results[0].term.toLowerCase().startsWith('pro')
      expect(firstStarts).toBe(true)
    }
  })

  it('todas as entradas têm termo e definição', () => {
    for (const e of allGlossaryEntries()) {
      expect(e.term).toBeTruthy()
      expect(e.definition).toBeTruthy()
      expect(e.definition.length).toBeGreaterThan(10)
    }
  })

  it('busca vazia retorna todas ordenadas alfabeticamente', () => {
    const results = searchGlossary('')
    expect(results.length).toBe(allGlossaryEntries().length)
    for (let i = 1; i < results.length; i++) {
      // localeCompare returns <= 0 if sorted correctly
      expect(results[i].term.localeCompare(results[i - 1].term)).toBeGreaterThanOrEqual(0)
    }
  })
})
