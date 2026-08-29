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
│   └── QuestionCard.tsx     # Card de questão acessível (radiogroup, favorito, explicação)
├── pages/
│   ├── HomePage.tsx
│   ├── TreinoPages.tsx      # Setup + Config + Run (rápido e por assunto) + PracticeSession
│   ├── TreinoResultPage.tsx
│   ├── SimuladoPages.tsx    # Setup + Run (timer persistente, grade) + Result
│   ├── RedacaoPage.tsx      # Propostas + editor + checklist + autoavaliação
│   ├── ProvasAnterioresPage.tsx
│   ├── RevisaoPage.tsx      # Reutiliza PracticeSession
│   └── DashboardPage.tsx    # Stats + gráfico + backup + settings
├── hooks/
│   ├── useProgress.ts       # useSyncExternalStore sobre progressStore
│   ├── usePersistentTimer.ts# Cronômetro que sobrevive a reload
│   └── useOnlineStatus.ts
├── stores/
│   └── progress.ts          # Store local (localStorage), ações de domínio, seletores
├── lib/
│   ├── exam-generator.ts    # Geração determinística de simulados (seed, shuffle, pickByTopic)
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
│   └── past-exams/
│       └── past-exams.ts    # Prova 2025/2026 com gabarito oficial e questões anuladas
├── types/
│   ├── exam.ts              # Question, ExamRules, PastExam, OptionId, Subject
│   └── progress.ts          # ProgressState, AnswerRecord, SimuladoResult, MasteryEntry
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
- `src/lib/scoring.test.ts` — notas objetivas (5 testes)
- `src/lib/essay.test.ts` — contagem, validação, APTO (6 testes)
- `src/lib/exam-generator.test.ts` — geração determinística (4 testes)
- `src/stores/progress.test.ts` — persistência, mastery, streak, backup (11 testes)

Total: 34 testes, todos passando.

## Quality gates

```bash
npx tsc --noEmit   # typecheck
npx vitest run     # testes
npm run build      # build + PWA
```
