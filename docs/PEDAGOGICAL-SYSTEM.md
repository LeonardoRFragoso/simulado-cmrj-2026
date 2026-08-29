# Sistema Pedagógico — Simulado CMRJ 2026/2027

## Visão geral

A aplicação evoluiu de um simulado simples para uma plataforma pedagógica completa
de preparação ao Processo Seletivo CMRJ 2026/2027. Todas as funcionalidades
funcionam offline após o primeiro carregamento, sem backend, sem cadastro
obrigatório e sem coleta de dados pessoais.

## Modelo de explicações

Cada questão possui uma explicação estruturada (`QuestionExplanation`):

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| `short` | Resumo conciso do porquê da resposta | Sim, todas |
| `concept` | Conceito/definição envolvido | Português |
| `steps` | Passo a passo (preferencial em Matemática com cálculo) | Matemática com cálculo (≥ 2 passos) |
| `tip` | Dica útil / atalho / estratégia | Opcional |
| `commonMistake` | Erro comum que leva aos distratores | Opcional |
| `optionExplanations` | Justificativa por alternativa | Português quando pedagogicamente relevante |
| `hints` | Dicas progressivas ANTES da resposta (não entregam a alternativa) | ≥ 2 dicas |

Validação automática: `src/data/questions/explanations.test.ts` garante que
todas as 413 questões satisfazem os critérios acima.

## Repetição espaçada

Substitui o modelo anterior (2 acertos consecutivos) por um sistema de revisão
espaçada simples e transparente.

### Intervalos

| Evento | Próxima revisão |
|--------|-----------------|
| Erro | Hoje ou próxima sessão |
| 1º acerto após erro | +1 dia |
| 2º acerto | +3 dias |
| 3º acerto | +7 dias |
| 4º acerto | +14 dias |
| 5º+ acerto | +30 dias |

### Schema

```typescript
interface ReviewSchedule {
  questionId: string
  lastReviewedAt?: string
  nextReviewAt?: string
  intervalDays: number
  reviewLevel: number
  totalErrors: number
  totalCorrect: number
  consecutiveCorrect: number
  mastered: boolean
  status: 'novo' | 'revisar' | 'em-aprendizado' | 'dominado'
}
```

### Migração

`PROGRESS_SCHEMA_VERSION = 2`. A migração v1→v2 converte `MasteryEntry` em
`ReviewSchedule` preservando dados existentes. Backups antigos (schema v1)
continuam importáveis.

## Domínio por assunto

Métrica de domínio calculada localmente a partir de:

- Taxa de acerto
- Quantidade de tentativas
- Recência
- Dificuldade
- Revisões bem-sucedidas
- Uso de dicas

### Status

| Status | Critério |
|--------|----------|
| Não iniciado | 0 questões respondidas |
| Começando | 1-2 questões, < 50% acerto |
| Em progresso | 3+ questões, 50-70% acerto |
| Bom | 5+ questões, 70-85% acerto |
| Dominado | 5+ questões, ≥ 85% acerto, sem revisões vencidas |
| Precisa revisar | Qualquer questão com revisão vencida ou < 50% acerto |

**Não considerar "Dominado" com apenas uma questão respondida.**

## Revisão do dia

Sessão inteligente que combina:

1. Questões vencidas da repetição espaçada (prioridade 1)
2. Questões erradas recentemente (prioridade 2)
3. Tópicos com baixo domínio (prioridade 3)
4. Questões novas (prioridade 4)

Nunca repete excessivamente a mesma questão em sequência.

Rota: `/revisao/hoje`

## Plano de estudos

Cronograma automático baseado em:

- Data da prova (18/10/2026)
- Desempenho atual
- Assuntos não iniciados
- Assuntos fracos
- Revisões vencidas

Configurável: 15, 30, 45 ou 60 min/dia. Salvo localmente.

Rota: `/plano-de-estudos`

## Meta diária

Meta configurável de questões ou minutos por dia.

Sugestões: 10/20/30 questões ou 15/30/45 minutos.

Exibida no Dashboard. Não é competitiva.

Rota: `/meta-diaria`

## Mini-aulas

Cada tópico oficial do edital possui uma mini-aula de 2 a 5 minutos.

Estrutura: conceito, regra, exemplo resolvido, passo a passo, erro comum, dica.

Cobertura: 100% dos tópicos validada por teste (`src/data/lessons/index.test.ts`).

Rotas: `/estudar`, `/estudar/matematica`, `/estudar/portugues`, `/estudar/:subject/:topic`

## Ciclo erro → aprendizado

```
Pergunta → Resposta errada → Explicação curta → Passo a passo (opcional)
→ "Estudar agora" (mini-aula) ou "Revisar depois" (favorita)
→ 3 questões semelhantes → Questão original volta pela repetição espaçada
```

Não obriga abandonar o treino atual.

## Caderno de erros 2.0

Agrupamento por: disciplina, tópico, subassunto, dificuldade, cronológico.

Estados: novo, revisar, em aprendizado, dominado.

Não remove questões dominadas do histórico — apenas da lista "precisa revisar".

Rota: `/caderno-de-erros`

## Mini-simulados

| Tipo | Composição | Tempo |
|------|-----------|-------|
| Mini | 5 Mat + 5 Port | 30 min (sugerido) |
| Matemática | 20 Mat | — |
| Português | 20 Port | — |
| Oficial | 20 Mat + 20 Port + Redação | 270 min |

O Simulado Oficial é o único identificado como formato completo do edital.
Mini-simulados não têm cronômetro persistente.

Rota: `/mini-simulado`

## Glossário

Termos pedagógicos derivados das mini-aulas. Busca local instantânea.

Rota: `/glossario`

## Redação — planejamento

Antes de escrever, o aluno pode preencher um roteiro opcional:

- Personagem principal
- Outros personagens
- Onde acontece
- Quando acontece
- Qual é o problema
- O que acontece no desenvolvimento
- Como termina

Estes dados **não contam** como linhas da redação.

## Redação — revisão guiada

Checklist expandido de autoavaliação:

- [ ] Respondi ao tema
- [ ] Minha história tem começo, desenvolvimento e fim
- [ ] Há personagens
- [ ] O lugar está claro
- [ ] Os acontecimentos têm sequência
- [ ] Usei pontuação
- [ ] Evitei repetir palavras demais
- [ ] Revisei ortografia
- [ ] Incluí um título
- [ ] Tenho de 15 a 30 linhas

Nunca declara que a redação seria aprovada pela banca. Usa "Autoavaliação de estudo".

## Privacidade

O usuário pode ser menor de idade. NÃO coletamos:

- Nome completo
- CPF
- Telefone
- Email
- Endereço
- Data de nascimento completa
- Escola
- Localização

Apelido local é suficiente. Todos os dados ficam SOMENTE no dispositivo.
Nenhum tracker externo, Google Analytics ou publicidade.

## Analytics pedagógicos locais

Registrados sem enviar para servidor:

- Tempo por questão (`timeSpentSeconds`)
- Uso de dica (`hintsUsed`)
- Resultado
- Tentativas
- Revisões
- Assunto

## Regras de recomendação

A "Revisão do Dia" e o "O que estudar hoje" seguem prioridades:

1. Revisão vencida (repetição espaçada)
2. Erro recente
3. Assunto fraco (domínio < Bom)
4. Questão nova

Nunca repetem excessivamente a mesma questão em sequência.
