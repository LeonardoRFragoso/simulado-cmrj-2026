import { describe, it, expect } from 'vitest'
import {
  getMotivationalMessage,
  assertNoForbiddenWords,
  type MotivationalContext,
} from './motivational-message'

const ALL_MESSAGES: string[] = []
const PERCENTAGES = [0, 39, 40, 49, 50, 69, 70, 84, 85, 94, 95, 99, 100]

function ctx(percentage: number, overrides: Partial<MotivationalContext> = {}): MotivationalContext {
  return {
    examType: 'treino',
    percentage,
    ...overrides,
  }
}

describe('motivational-message — faixas', () => {
  it('0% → recomecar', () => {
    const r = getMotivationalMessage(ctx(0), 1)
    expect(r.level).toBe('recomecar')
  })

  it('39% → recomecar', () => {
    const r = getMotivationalMessage(ctx(39), 1)
    expect(r.level).toBe('recomecar')
  })

  it('40% → quase', () => {
    const r = getMotivationalMessage(ctx(40), 1)
    expect(r.level).toBe('quase')
  })

  it('49% → quase', () => {
    const r = getMotivationalMessage(ctx(49), 1)
    expect(r.level).toBe('quase')
  })

  it('50% → bom', () => {
    const r = getMotivationalMessage(ctx(50), 1)
    expect(r.level).toBe('bom')
  })

  it('69% → bom', () => {
    const r = getMotivationalMessage(ctx(69), 1)
    expect(r.level).toBe('bom')
  })

  it('70% → muito-bom', () => {
    const r = getMotivationalMessage(ctx(70), 1)
    expect(r.level).toBe('muito-bom')
  })

  it('84% → muito-bom', () => {
    const r = getMotivationalMessage(ctx(84), 1)
    expect(r.level).toBe('muito-bom')
  })

  it('85% → excelente', () => {
    const r = getMotivationalMessage(ctx(85), 1)
    expect(r.level).toBe('excelente')
  })

  it('94% → excelente', () => {
    const r = getMotivationalMessage(ctx(94), 1)
    expect(r.level).toBe('excelente')
  })

  it('95% → excelente', () => {
    const r = getMotivationalMessage(ctx(95), 1)
    expect(r.level).toBe('excelente')
  })

  it('99% → excelente', () => {
    const r = getMotivationalMessage(ctx(99), 1)
    expect(r.level).toBe('excelente')
  })

  it('100% → gabaritou', () => {
    const r = getMotivationalMessage(ctx(100), 1)
    expect(r.level).toBe('gabaritou')
  })
})

describe('motivational-message — nickname', () => {
  it('com nickname: inclui o nome na mensagem', () => {
    const r = getMotivationalMessage(ctx(50, { nickname: 'Gui' }), 42)
    // Pelo menos o título deve conter "Gui"
    expect(r.title).toContain('Gui')
  })

  it('sem nickname: não quebra e não deixa marcador {nome}', () => {
    const r = getMotivationalMessage(ctx(50), 42)
    expect(r.title).not.toContain('{nome}')
    expect(r.message).not.toContain('{nome}')
  })

  it('nickname vazio: trata como sem nome', () => {
    const r = getMotivationalMessage(ctx(50, { nickname: '   ' }), 42)
    expect(r.title).not.toContain('{nome}')
    expect(r.message).not.toContain('{nome}')
  })
})

describe('motivational-message — evolução', () => {
  it('melhora >= 5 pontos: menciona evolução', () => {
    const r = getMotivationalMessage(ctx(81, { previousPercentage: 68, nickname: 'Gui' }), 1)
    expect(r.improvementMessage).toContain('evolução')
    expect(r.improvementMessage).toContain('68%')
    expect(r.improvementMessage).toContain('81%')
  })

  it('melhora pequena: mensagem de consistência', () => {
    const r = getMotivationalMessage(ctx(70, { previousPercentage: 68 }), 1)
    expect(r.improvementMessage).toContain('consistente')
  })

  it('resultado inferior: não diz "piorou"', () => {
    const r = getMotivationalMessage(ctx(50, { previousPercentage: 70 }), 1)
    expect(r.improvementMessage).toBeTruthy()
    expect(r.improvementMessage!.toLowerCase()).not.toContain('pior')
    expect(r.improvementMessage!.toLowerCase()).not.toContain('fracasso')
  })

  it('sem resultado anterior: sem mensagem de evolução', () => {
    const r = getMotivationalMessage(ctx(50), 1)
    expect(r.improvementMessage).toBeUndefined()
  })
})

describe('motivational-message — disciplina (simulado oficial)', () => {
  it('Matemática >= 50 e Português < 50: foca em Português', () => {
    const r = getMotivationalMessage(
      ctx(65, {
        examType: 'simulado-oficial',
        mathPercentage: 85,
        portuguesePercentage: 45,
        nickname: 'Gui',
      }),
      1,
    )
    expect(r.improvementMessage).toContain('Português')
    expect(r.improvementMessage).toContain('Matemática')
  })

  it('Português >= 50 e Matemática < 50: foca em Matemática', () => {
    const r = getMotivationalMessage(
      ctx(65, {
        examType: 'simulado-oficial',
        mathPercentage: 45,
        portuguesePercentage: 85,
        nickname: 'Gui',
      }),
      1,
    )
    expect(r.improvementMessage).toContain('Matemática')
    expect(r.improvementMessage).toContain('Português')
  })

  it('ambas aprovadas: não adiciona nota de disciplina', () => {
    const r = getMotivationalMessage(
      ctx(80, {
        examType: 'simulado-oficial',
        mathPercentage: 80,
        portuguesePercentage: 80,
      }),
      1,
    )
    // improvementMessage pode existir por outros motivos, mas não deve ter "principal foco deve ser"
    expect(r.improvementMessage ?? '').not.toContain('principal foco deve ser')
  })

  it('não é simulado oficial: não avalia disciplina', () => {
    const r = getMotivationalMessage(
      ctx(65, {
        examType: 'treino',
        mathPercentage: 85,
        portuguesePercentage: 45,
      }),
      1,
    )
    expect(r.improvementMessage ?? '').not.toContain('Português')
  })
})

describe('motivational-message — assunto fraco', () => {
  it('com weakestTopic: inclui na mensagem', () => {
    const r = getMotivationalMessage(ctx(50, { weakestTopic: 'Frações' }), 1)
    expect(r.message).toContain('Frações')
    expect(r.message).toContain('principal ponto para revisar')
  })

  it('sem weakestTopic: não menciona ponto para revisar', () => {
    const r = getMotivationalMessage(ctx(50), 1)
    expect(r.message).not.toContain('principal ponto para revisar')
  })
})

describe('motivational-message — próximos passos (CTA)', () => {
  it('desempenho baixo: oferece revisar erros e tentar novamente', () => {
    const r = getMotivationalMessage(ctx(30), 1)
    const labels = r.nextSteps.map((s) => s.label)
    expect(labels).toContain('Revisar meus erros')
    expect(labels).toContain('Tentar novamente')
  })

  it('desempenho médio: oferece Revisão do Dia', () => {
    const r = getMotivationalMessage(ctx(60), 1)
    const labels = r.nextSteps.map((s) => s.label)
    expect(labels).toContain('Revisão do Dia')
  })

  it('desempenho alto: oferece fazer outro simulado', () => {
    const r = getMotivationalMessage(ctx(90, { examType: 'simulado-oficial' }), 1)
    const labels = r.nextSteps.map((s) => s.label)
    expect(labels).toContain('Fazer outro simulado')
  })
})

describe('motivational-message — 100% mensagem especial', () => {
  it('100% tem mensagem com "100%"', () => {
    const r = getMotivationalMessage(ctx(100), 1)
    expect(r.level).toBe('gabaritou')
    expect(r.message).toContain('100%')
  })
})

describe('motivational-message — variação', () => {
  it('diferentes seeds produzem diferentes mensagens na mesma faixa', () => {
    const messages = new Set<string>()
    for (let seed = 1; seed <= 50; seed++) {
      messages.add(getMotivationalMessage(ctx(50), seed).message)
    }
    // Pelo menos 3 variações diferentes em 50 seeds
    expect(messages.size).toBeGreaterThanOrEqual(3)
  })

  it('pelo menos 5 mensagens por faixa', () => {
    // O motor tem 5+ templates por faixa; validamos indiretamente
    // gerando muitas mensagens e verificando variação
    for (const pct of PERCENTAGES) {
      const msgs = new Set<string>()
      for (let seed = 1; seed <= 100; seed++) {
        msgs.add(getMotivationalMessage(ctx(pct), seed).message)
      }
      expect(msgs.size, `faixa ${pct}%`).toBeGreaterThanOrEqual(5)
    }
  })
})

describe('motivational-message — palavras proibidas', () => {
  it('nenhuma mensagem usa palavras proibidas', () => {
    // Coleta todas as mensagens geradas em todas as faixas e seeds
    const allMessages: string[] = []
    for (const pct of PERCENTAGES) {
      for (let seed = 1; seed <= 100; seed++) {
        const r = getMotivationalMessage(ctx(pct, { nickname: 'Gui' }), seed)
        allMessages.push(r.title, r.message)
        if (r.improvementMessage) allMessages.push(r.improvementMessage)
      }
    }
    const violations = assertNoForbiddenWords(allMessages)
    expect(violations, `Mensagens proibidas: ${violations.join('; ')}`).toHaveLength(0)
  })

  it('nenhuma mensagem declara aprovação oficial', () => {
    for (const pct of PERCENTAGES) {
      for (let seed = 1; seed <= 50; seed++) {
        const r = getMotivationalMessage(ctx(pct, { nickname: 'Gui' }), seed)
        const fullText = `${r.title} ${r.message} ${r.improvementMessage ?? ''}`.toLowerCase()
        expect(fullText).not.toContain('vaga garantida')
        expect(fullText).not.toContain('seria aprovado')
        expect(fullText).not.toContain('você passou')
        expect(fullText).not.toContain('você foi aprovado')
        expect(fullText).not.toContain('aprovação')
      }
    }
  })
})

describe('motivational-message — sem dados de tópico', () => {
  it('sem weakestTopic e sem previousPercentage: mensagem limpa', () => {
    const r = getMotivationalMessage(ctx(55), 1)
    expect(r.message).not.toContain('principal ponto')
    expect(r.improvementMessage).toBeUndefined()
  })
})
