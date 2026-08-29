# Arquitetura

## Visão geral

Aplicação mobile-first (PWA) em React + TypeScript + Vite, sem backend. Todo o
progresso do usuário é persistido localmente (localStorage) com schema versionado
e export/import de backup JSON. O app funciona offline após o primeiro carregamento.

```
src/
├── App.tsx                  # Router + ThemeApplier + ScrollToContent
├── main.tsx                 # Entry point
├── styles.css               # CSS mobile-first com tema claro/escuro
├── components/
│   ├── Layout.tsx           # Shell: topbar + content + bottom-nav + disclaimer
│   └── QuestionCard.tsx     # Card de questão acessível (radiogroup, favorito, explicação, dicas, erro→aprendizado)
├── pages/
│   ├── HomePage.tsx
│   ├── TreinoPages.tsx      # Setup + Config + Run (rápido e por assunto) + PracticeSession
│   ├── TreinoResultPage.tsx
│   ├── SimuladoPages.tsx    # Setup + Run (timer persistente, grade) + Result
│   ├── MiniSimuladoPages.tsx # Mini-simulados (5+5, 20 Mat, 20 Port)
│   ├── RedacaoPage.tsx      # Propostas + planejamento + editor + checklist expandido + autoavaliação
│   ├── ProvasAnterioresPage.tsx
│   ├── RevisaoPage.tsx      # Reutiliza PracticeSession
│   ├── CadernoDeErrosPage.tsx # Caderno de Erros 2.0 com agrupamento e estados
│   ├── RevisaoDoDiaPage.tsx # Revisão inteligente do dia
│   ├── DominioPage.tsx      # Domínio por assunto com métrica e status
│   ├── EstudarPages.tsx     # Listagem de disciplinas e tópicos para estudo
│   ├── EstudarTopicoPage.tsx # Mini-aula + prática por tópico
│   ├── FavoritosPage.tsx    # Questões favoritas com filtros e treino
│   ├── PlanoDeEstudosPage.tsx # Cronograma automático
│   ├── MetaDiariaPage.tsx   # Configuração de meta diária
│   ├── GlossarioPage.tsx    # Glossário com busca
│   └── DashboardPage.tsx    # Stats + domínio + meta + gráfico + backup + settings
├── hooks/
│   ├── useProgress.ts       # useSyncExternalStore sobre progressStore
│   ├── usePersistentTimer.ts# Cronômetro que sobrevive a reload
│   └── useOnlineStatus.ts
├── stores/
│   └── progress.ts          # Store local (localStorage), schema v2, repetição espaçada, domínio
├── lib/
│   ├── exam-generator.ts    # Geração determinística de simulados (seed, shuffle, pickByTopic, getRelatedQuestions)
│   ├── scoring.ts           # Nota objetiva (0-10), média, aprovação
│   └── essay.ts             # Contagem de linhas/palavras, validação, APTO/NÃO APTO
├── data/
│   ├── edital-2026.ts       # Regras, tópicos, competências, descritores, referências
│   ├── questions/
│   │   ├── builder.ts       # Helper para construir questões determinísticas
│   │   ├── math-generators.ts
│   │   ├── math-conceptual.ts
│   │   ├── math-index.ts
│   │   ├── portuguese-conceptual.ts
│   │   ├── portuguese-conceptual-2.ts
│   │   ├── portuguese-index.ts
│   │   └── index.ts         # allQuestions, questionsBySubject, coverageReport, validateQuestions
│   ├── lessons/
│   │   └── index.ts         # 55 mini-aulas (uma por tópico do edital)
│   └── past-exams/
│       └── past-exams.ts    # Prova 2025/2026 com gabarito oficial e questões anuladas
├── types/
│   ├── exam.ts              # Question, QuestionExplanation, ExamRules, PastExam, OptionId, Subject
│   └── progress.ts          # ProgressState, AnswerRecord, ReviewSchedule, DailyGoal, StudyPlanConfig, EssayPlanning
└── test/
    └── setup.ts             # Setup do Vitest (jsdom)
```

## Padrões principais

### Store local versionada
`stores/progress.ts` é uma store minimalista com `subscribe`/`get`/`set` compatível
com `useSyncExternalStore`. O `schemaVersion` permite migrações futuras preservando
o progresso do usuário. Toda escrita persiste em `localStorage` e notifica os listeners.

### Cronômetro persistente
`usePersistentTimer` salva o `startedAt` no localStorage e recalcula o restante a
partir do relógio do sistema. Isso garante precisão mesmo se o app for fechado e
reaberto, e permite a autoentrega quando o tempo zera.

### Geração determinística de simulados
`exam-generator.ts` usa um PRNG linear congruente (seed) com Fisher–Yates para
embaralhar. A mesma seed produz o mesmo simulado. `pickByTopic` distribui questões
em round-robin pelos tópicos do edital para maximizar a cobertura.

### Questões autorais
As 413 questões (212 Mat + 201 Port) são autorais e determinísticas. As de
Matemática operacional são geradas a partir de seeds para variar números sem
duplicar alternativas. A cobertura total do edital é validada por teste.

### Provas anteriores — honestidade
O caderno 2025/2026 é um exame unificado aplicado a todos os CMs (incluindo CMRJ).
O gabarito oficial e as questões anuladas são registrados factualmente. Os enunciados
completos NÃO são transcritos — o usuário é direcionado ao PDF oficial. O Exame
2026/2027 ainda ocorrerá em 18/10/2026; nenhuma prova futura é inventada.

### Acessibilidade
- Navegação por teclado (radiogroup, focus management, skip links via `#conteudo`).
- `aria-live` para timer e alertas; `role="status"` para online/offline.
- Alvos touch >= 44px; contraste AA; `prefers-reduced-motion` respeitado.
- Tema claro/escuro/sistema com `data-theme` no `<html>`.

### PWA
`vite-plugin-pwa` gera o service worker (Workbox) e o manifest. O `navigateFallback`
serve o `index.html` para todas as rotas (SPA offline). Ícones 192/512/maskable.

## Testes

- `src/data/questions/index.test.ts` — integridade e cobertura do banco (8 testes)
- `src/data/questions/explanations.test.ts` — validação de explicações estruturadas (5 testes)
- `src/data/questions/math-generators.test.ts` — geração determinística e validação de distratores (2 suites)
- `src/data/lessons/index.test.ts` — cobertura de mini-aulas (6 testes)
- `src/data/glossary.test.ts` — glossário (3 testes)
- `src/lib/scoring.test.ts` — notas objetivas (5 testes)
- `src/lib/essay.test.ts` — contagem, validação, APTO (6 testes)
- `src/lib/exam-generator.test.ts` — geração determinística (4 testes)
- `src/lib/related-questions.test.ts` — questões relacionadas (5 testes)
- `src/stores/progress.test.ts` — persistência, mastery, streak, backup, migração (11 testes)
- `src/stores/progress-audit.test.ts` — caderno, meta, totalStudySeconds, backup/import (14 testes)
- `src/stores/daily-review.test.ts` — revisão do dia (5 testes)
- `src/components/QuestionCard.test.tsx` — UX pedagógica, dicas, explicação (10 testes)
- `src/components/QuestionCardErrorCycle.test.tsx` — ciclo erro→aprendizado (3 testes)
- `src/components/SimuladoNoLeak.test.tsx` — não vazamento de respostas no simulado (7 testes)
- `src/pages/EstudarPages.test.tsx` — mini-aulas e prática por tópico (8 testes)

Total: 107 testes, todos passando.

## Quality gates

```bash
npm run typecheck  # TypeScript sem erros
npm run test       # 107 testes unitários
npm run test:e2e   # 22 testes E2E com Playwright
npm run build      # build + PWA
```
