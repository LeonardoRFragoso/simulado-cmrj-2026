# Simulado CMRJ 2026/2027

Aplicação mobile-first (PWA) para preparação ao Processo Seletivo de Admissão 2026/2027 do Colégio Militar do Rio de Janeiro (CMRJ), ingresso no 6º ano do Ensino Fundamental em 2027.

> **Aviso:** esta aplicação é independente e não possui vínculo oficial com o Colégio Militar do Rio de Janeiro, o Exército Brasileiro, a DEPA ou o DECEx. As mensagens seguem o edital: indicamos se você atingiu o mínimo previsto, sem prometer aprovação.

## Funcionalidades

- **Treino Rápido** — 5, 10 ou 20 questões com feedback imediato ou no final.
- **Treino por Assunto** — escolha disciplina e assunto para focar o estudo.
- **Simulado Oficial** — 20+20 questões, redação e cronômetro de 270 min (persistente, com autoentrega e alertas).
- **Produção Textual** — propostas narrativas, contador de linhas/palavras, checklist de revisão e autoavaliação por competência (APTO/NÃO APTO).
- **Provas Anteriores** — prova 2025/2026 com gabarito oficial, questões anuladas e modo estudo.
- **Revisão de Erros** — banco automático das questões erradas, com mastery após 2 acertos consecutivos.
- **Dashboard** — estatísticas, sequência de dias, gráfico de evolução, backup JSON e configurações.
- **PWA offline** — funciona sem internet após o primeiro carregamento.
- **Acessibilidade** — navegação por teclado, contraste AA, tema claro/escuro/sistema, `prefers-reduced-motion`.

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
npx tsc --noEmit   # typecheck
npx vitest run     # 34 testes
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
- [`docs/SOURCES.md`](docs/SOURCES.md) — fontes oficiais
