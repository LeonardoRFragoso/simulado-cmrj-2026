# Simulado CMRJ 2026/2027

Aplicação mobile-first (PWA) para preparação ao Processo Seletivo de Admissão 2026/2027 do Colégio Militar do Rio de Janeiro (CMRJ), ingresso no 6º ano do Ensino Fundamental em 2027.

> **Aviso:** esta aplicação é independente e não possui vínculo oficial com o Colégio Militar do Rio de Janeiro, o Exército Brasileiro, a DEPA ou o DECEx. As mensagens seguem o edital: indicamos se você atingiu o mínimo previsto, sem prometer aprovação.

## Funcionalidades

- **Treino Rápido** — 5, 10 ou 20 questões com feedback imediato ou no final.
- **Treino por Assunto** — escolha disciplina e assunto para focar o estudo.
- **Simulado Oficial** — 20+20 questões, redação e cronômetro de 270 min (persistente, com autoentrega e alertas).
- **Mini-simulados** — provas curtas (5+5, 20 Mat, 20 Port) sem cronômetro.
- **Produção Textual** — propostas narrativas, planejamento opcional, contador de linhas/palavras, checklist expandido e autoavaliação por competência (APTO/NÃO APTO).
- **Provas Anteriores** — prova 2025/2026 com gabarito oficial, questões anuladas e modo estudo.
- **Explicações estruturadas** — todas as 413 questões com explicação curta, conceito, passo a passo (Matemática), dicas progressivas e justificativa por alternativa (Português).
- **Dicas progressivas** — peça dicas antes de responder, sem entregar a alternativa.
- **Caderno de Erros 2.0** — histórico completo com agrupamento por disciplina/tópico/subassunto/dificuldade, estados (novo/revisar/em aprendizado/dominado) e repetição espaçada.
- **Repetição espaçada** — intervalos de 1, 3, 7, 14 e 30 dias. Migração de schema v1→v2 preserva dados.
- **Revisão do Dia** — sessão inteligente combinando revisões vencidas, erros recentes, assuntos fracos e questões novas.
- **Domínio por Assunto** — métrica de domínio com status (Não iniciado, Começando, Em progresso, Bom, Dominado, Precisa revisar).
- **Mini-aulas** — 55 aulas de 2-5 minutos cobrindo 100% dos tópicos do edital.
- **Estudar por assunto** — acesse mini-aulas e pratique por tópico.
- **Ciclo erro→aprendizado** — ao errar, estude a mini-aula agora ou favorite para revisar depois.
- **Questões relacionadas** — pratique mais 3 questões do mesmo tipo após um erro.
- **Favoritos** — marque questões com ★ e treine somente com elas.
- **Plano de Estudos** — cronograma automático baseado na data da prova e desempenho.
- **Meta Diária** — defina questões ou minutos por dia e acompanhe seu progresso.
- **Glossário** — termos pedagógicos com busca local instantânea.
- **Dashboard pedagógico** — domínio geral e por disciplina, revisões vencidas, tópicos dominados, meta diária, gráfico de evolução, backup JSON e configurações.
- **PWA offline** — funciona sem internet após o primeiro carregamento.
- **Acessibilidade** — navegação por teclado, contraste AA, tema claro/escuro/sistema, `prefers-reduced-motion`.
- **Privacidade** — sem cadastro, sem coleta de dados pessoais, sem trackers externos.

## Regras de prova (edital 2026/2027)

- Exame Intelectual: 18/10/2026.
- 20 questões objetivas de Matemática + 20 de Língua Portuguesa.
- Produção Textual narrativa (15 a 30 linhas), caráter eliminatório.
- Duração total: 270 minutos (4h30).
- Nota máxima de cada objetiva: 10,000; mínimo para aprovação: 5,000.
- Produção Textual: APTO exige pelo menos 50% dos descritores atendidos.

## Banco de questões

413 questões autorais (212 de Matemática + 201 de Português) com cobertura total
do conteúdo programático do edital. As questões operacionais de Matemática são
geradas deterministicamente (seed) para variar números sem duplicar alternativas.
A integridade e a cobertura são validadas por testes automatizados.

## Fontes

- [Edital nº 1, de 31/07/2026 — PS 2026/2027 aos Colégios Militares](https://www.in.gov.br/web/dou/-/edital-n-1-de-31-de-julho-de-2026-722685770)
- [Colégio Militar do Rio de Janeiro](https://cmrj.eb.mil.br)
- [Prova oficial 2025/2026 (caderno)](https://cmr.eb.mil.br/images/PDF/Concurso%202025/Prova%20Processo%20Seletivo%20CMR%2025-26.pdf)
- [Gabarito definitivo 2025/2026](https://cmr.eb.mil.br/images/PDF/Concurso%202025/GABARITO%20DEFINITIVO%202025-2026%20assinado.pdf)

Detalhes em [`docs/SOURCES.md`](docs/SOURCES.md).

## Rodar localmente

```bash
npm install
npm run dev
```

## Quality gates

```bash
npm run typecheck  # TypeScript sem erros
npm run test       # 107 testes unitários
npm run test:e2e   # 22 testes end-to-end (Playwright, Chromium + mobile)
npm run build      # build + PWA (service worker + manifest)
```

## Deploy

A configuração `vercel.json` permite deploy como SPA no Vercel.

```bash
vercel --prod
```

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitetura e padrões
- [`docs/EDITAL-MAPPING.md`](docs/EDITAL-MAPPING.md) — mapeamento do edital
- [`docs/PEDAGOGICAL-SYSTEM.md`](docs/PEDAGOGICAL-SYSTEM.md) — sistema pedagógico (explicações, repetição espaçada, domínio, revisão, plano)
- [`docs/SOURCES.md`](docs/SOURCES.md) — fontes oficiais
