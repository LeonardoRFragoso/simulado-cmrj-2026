# QA-REPORT — Fase 3 (Auditoria de Qualidade)

> Branch: `qa/pedagogical-hardening`
> HEAD inicial: `2abd7d6` (merge Fase 2)
> Data: 2026-08-29

## 1. Baseline (inicial)

| Gate          | Resultado |
|---------------|-----------|
| `npm ci`      | OK (452 pacotes, 0 vulnerabilidades) |
| `typecheck`   | OK (0 erros) |
| `test`        | 90 testes / 14 arquivos — todos passando |
| `build`       | OK — bundle `index-*.js` 689.68 kB (gzip 165.00 kB) |
| `test:e2e`    | N/A — Playwright ainda não configurado |

## 2. Baseline após a Fase 3

| Gate             | Resultado |
|------------------|-----------|
| `npm ci`         | OK |
| `npm run typecheck` | OK (0 erros) |
| `npm run test`   | 107 testes / 16 arquivos — todos passando |
| `npm run build`  | OK — bundle `index-*.js` 713 kB (gzip 167.89 kB), CSS 31.59 kB (gzip 6.38 kB) |
| `npm run test:e2e` | 22 testes (Playwright Chromium + mobile) — todos passando |

Avisos:
- Build emite warning de chunk > 500 kB; continua abaixo de 1 MB e não impacta a deploy.

## 3. Ativos auditados

- **Questões:** 413 (212 Matemática / 201 Português) — auditadas via `scripts/audit-questions.mts`
- **Mini-aulas:** 55 — cobertura 100% dos 54 tópicos do edital validada por teste
- **Geradores matemáticos:** 20 geradores testados com 200 sementes cada (property-based)
- **Fluxo de progresso:** caderno de erros, revisão do dia, meta diária, backup/import, migração v1→v2

## 4. Bugs encontrados e corrigidos

1. **Geradores matemáticos com alternativas duplicadas**
   - Arquivo: `src/data/questions/math-generators.ts`
   - Problema: `mat-fracop`, `mat-media` e `mat-perim` podiam gerar 2 alternativas iguais para certas sementes.
   - Correção: função `build` deduplica distratores por valor numérico e ajusta frações com nudge crescente.
   - Validação: `math-generators.test.ts` cobre 200 sementes por gerador, garantindo 5 opções distintas e 1 correta.

2. **Tempo de estudo não acumulado em `totalStudySeconds`**
   - Arquivo: `src/stores/progress.ts` — função `recordAnswer`
   - Problema: `timeSpentSeconds` não era somado a `totalStudySeconds`, afetando analytics e meta diária.
   - Correção: acúmulo correto de `timeSpentSeconds` com conversão e persistência.
   - Validação: `src/stores/progress-audit.test.ts` (14 testes) cobre o cenário.

3. **Dicas genéricas idênticas em todas as questões conceituais**
   - Arquivos: `math-conceptual.ts`, `portuguese-conceptual.ts`, `portuguese-conceptual-2.ts`
   - Problema: 295 questões com as mesmas 3 dicas de leitura genéricas.
   - Correção: script `scripts/fix-hints.mts` e `scripts/fix-hints-2.mts` gerou dicas específicas a partir do `short` e `concept` de cada questão, e passos de cálculo a partir do `short` para 30 questões de Matemática.
   - Observação: as dicas automáticas são melhores que o padrão idêntico, mas ainda podem ser aprimoradas manualmente por um revisor pedagógico.

## 5. Testes adicionados

- `src/data/questions/math-generators.test.ts` — property-based para geradores
- `src/stores/progress-audit.test.ts` — progresso, meta, backup, migração, revisão espaçada
- `e2e/*.spec.ts` (8 arquivos) — 22 specs Playwright cobrindo home, treino, erro, simulado, progresso, redação, mobile e PWA

## 6. Gates funcionais verificados

- **Simulado Oficial:** sem vazamento de gabarito/explicação durante a prova (verificado por E2E e `SimuladoNoLeak.test.tsx`)
- **PWA/Offline:** service worker e `manifest.webmanifest` funcionam (E2E)
- **Mobile:** viewport 375×812 sem rolagem horizontal, alvos de toque ≥ 44 px (E2E)
- **Redação:** persistência de título e texto após reload (E2E)
- **Backup/Import:** JSON inválido, parcial e v1 antigo testados em `progress-audit.test.ts`
- **Migração localStorage:** v1→v2 com fixtures reais
- **Dark mode / acessibilidade:** atributos `aria` e navegação por teclado cobertos nos componentes
- **Caderno de erros + repetição espaçada:** 14 testes em `progress-audit.test.ts`

## 7. Limitações restantes / débito técnico

1. **Chunk único do bundle** continua acima de 500 kB minified. O code splitting pode ser explorado em fase futura, mas o tamanho estável não bloqueia o uso.
2. **Dicas das questões conceituais** foram geradas automaticamente; um passo de revisão humana elevaria ainda mais a qualidade pedagógica.
3. **Lighthouse em produção** não foi executado porque depende do deploy na Vercel.
4. **Amostragem manual de conteúdo** das mini-aulas não foi feita; a integridade estrutural e cobertura estão testadas, mas a clareza textual não foi revisada frase a frase.

## 8. Recomendação

O projeto passa em todos os quality gates definidos para a Fase 3 (typecheck, 107 testes unitários, 22 E2E, build). Os itens de maior risco pedagógico e técnico foram mitigados. Recomendado merge para `main` e deploy na Vercel.

## 9. Status do merge/deploy

- PR #2 merged em `main` (squash, commit `3493154`).
- Branch `qa/pedagogical-hardening` removida após merge.
- Deploy Vercel: **bloqueado pelo limite gratuito (100 deploys/dia)**. Tentar novamente após a janela de 24h, ou conectar o repo à Vercel para deploy automático a partir do `main`.
