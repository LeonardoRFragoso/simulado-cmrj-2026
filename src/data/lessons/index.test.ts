import { describe, it, expect } from 'vitest'
import { allLessons, getLesson, hasLesson } from './index'
import { topicsBySubject } from '../edital-2026'

describe('mini-aulas — cobertura de todos os tópicos', () => {
  it('todas as aulas têm título, resumo e pelo menos 1 bloco', () => {
    for (const lesson of allLessons()) {
      expect(lesson.title, `${lesson.topic}: sem título`).toBeTruthy()
      expect(lesson.summary, `${lesson.topic}: sem resumo`).toBeTruthy()
      expect(lesson.blocks.length, `${lesson.topic}: sem blocos`).toBeGreaterThan(0)
    }
  })

  it('cobre todos os tópicos de Matemática do edital', () => {
    const mathTopics = topicsBySubject('matematica')
    const missing = mathTopics.filter((t) => !hasLesson('matematica', t.topic))
    expect(missing, `Tópicos sem aula: ${missing.map((t) => t.topic).join(', ')}`).toHaveLength(0)
  })

  it('cobre todos os tópicos de Português do edital', () => {
    const portTopics = topicsBySubject('portugues')
    const missing = portTopics.filter((t) => !hasLesson('portugues', t.topic))
    expect(missing, `Tópicos sem aula: ${missing.map((t) => t.topic).join(', ')}`).toHaveLength(0)
  })

  it('getLesson retorna a aula correta', () => {
    const lesson = getLesson('matematica', 'Adição')
    expect(lesson).toBeDefined()
    expect(lesson!.subject).toBe('matematica')
    expect(lesson!.topic).toBe('Adição')
  })

  it('getLesson retorna undefined para tópico inexistente', () => {
    expect(getLesson('matematica', 'Tópico Inexistente')).toBeUndefined()
  })

  it('aulas de Matemática com cálculo têm exemplos (campo ou bloco)', () => {
    const calcTopics = ['Adição', 'Subtração', 'Multiplicação', 'Divisão', 'Porcentagem', 'Perímetro e área']
    for (const topic of calcTopics) {
      const lesson = getLesson('matematica', topic)
      expect(lesson, `${topic}: deve ter aula`).toBeDefined()
      const hasExamplesField = lesson!.examples && lesson!.examples.length > 0
      const hasExampleBlock = lesson!.blocks.some((b) => b.type === 'example')
      expect(hasExamplesField || hasExampleBlock, `${topic}: deve ter exemplos (campo ou bloco)`).toBe(true)
    }
  })
})
