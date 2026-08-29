import { describe, it, expect } from 'vitest'
import {
  approxLineCount,
  countWords,
  evaluateEssayApto,
  hasNarrativeStructure,
  looksOffTopic,
  validateEssay,
} from './essay'
import { essayDescriptors, examRules } from '../data/edital-2026'

describe('essay — contagem e validação', () => {
  it('conta palavras ignorando espaços extras', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
    expect(countWords('um dois   três')).toBe(3)
  })
  it('conta linhas aproximadas (12 palavras/linha)', () => {
    expect(approxLineCount('')).toBe(0)
    // 12 palavras = 1 linha
    expect(approxLineCount('a '.repeat(12).trim())).toBe(1)
    // 25 palavras = 3 linhas (ceil(25/12))
    expect(approxLineCount('a '.repeat(25).trim())).toBe(3)
  })
  it('validateEssay detecta texto curto, longo e sem título', () => {
    const short = validateEssay('texto pequeno', false)
    expect(short.tooShort).toBe(true)
    expect(short.missingTitle).toBe(true)
    const ok = validateEssay('a '.repeat(12 * examRules.essayMinLines).trim(), true)
    expect(ok.withinRange).toBe(true)
    expect(ok.missingTitle).toBe(false)
  })
  it('looksOffTopic detecta ausência de palavras-chave do tema', () => {
    expect(looksOffTopic('texto sobre futebol e praia e muitas outras coisas legais do dia a dia sem qualquer relação com o tema proposto aqui', ['bosque', 'floresta'])).toBe(true)
    expect(looksOffTopic('uma aventura no bosque', ['bosque', 'floresta'])).toBe(false)
    // texto muito curto não sinaliza fuga
    expect(looksOffTopic('oi', ['bosque'])).toBe(false)
  })
  it('hasNarrativeStructure detecta marcadores temporais', () => {
    expect(hasNarrativeStructure('Um dia eu fui passear...')).toBe(true)
    expect(hasNarrativeStructure('A equação do segundo grau...')).toBe(false)
  })
  it('evaluateEssayApto exige >=50% dos descritores com nota >=6', () => {
    const allGood = Object.fromEntries(essayDescriptors.map((_, i) => [`c${i}`, 8]))
    expect(evaluateEssayApto(allGood, essayDescriptors).apto).toBe(true)
    const allBad = Object.fromEntries(essayDescriptors.map((_, i) => [`c${i}`, 3]))
    expect(evaluateEssayApto(allBad, essayDescriptors).apto).toBe(false)
    const half = Object.fromEntries(essayDescriptors.map((_, i) => [`c${i}`, i < 3 ? 8 : 3]))
    // 3 de 5 = 60% -> apto
    expect(evaluateEssayApto(half, essayDescriptors).apto).toBe(true)
  })
})
