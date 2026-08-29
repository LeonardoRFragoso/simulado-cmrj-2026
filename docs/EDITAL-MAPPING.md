# Mapeamento do edital — implementação

| Regra do edital | Implementação | Status |
|---|---|---|
| 20 questões de Matemática | `src/data/edital-2026.ts` + `src/lib/exam-generator.ts` | ✅ Gerador determinístico com cobertura por tópico |
| 20 questões de Português | `src/data/edital-2026.ts` + `src/lib/exam-generator.ts` | ✅ Gerador determinístico com cobertura por tópico |
| 270 minutos | `src/data/edital-2026.ts` + `src/hooks/usePersistentTimer.ts` | ✅ Cronômetro persistente com autoentrega e alertas |
| Nota mínima 5,000 em cada objetiva | `src/lib/scoring.ts` | ✅ `isObjectiveApproved` + testes |
| Produção Textual 15–30 linhas | `src/lib/essay.ts` + `src/pages/RedacaoPage.tsx` | ✅ Contador de linhas/palavras + validação |
| APTO com pelo menos 50% dos descritores | `src/lib/essay.ts` (`evaluateEssayApto`) | ✅ Autoavaliação por competência |
| Conteúdo de Matemática (29 tópicos) | `src/data/questions/math-*.ts` | ✅ 212 questões, cobertura total validada por teste |
| Conteúdo de Português (25 tópicos) | `src/data/questions/portuguese-*.ts` | ✅ 201 questões, cobertura total validada por teste |
| Competências da redação | `src/data/edital-2026.ts` (`essayCompetencies`, `essayDescriptors`) | ✅ Rubrica guiada no editor |
| Provas anteriores com fonte rastreável | `src/data/past-exams/past-exams.ts` | ✅ Prova 2025/2026 com gabarito oficial |
| Questões anuladas não prejudicam o score | `src/stores/progress.ts` + `src/pages/ProvasAnterioresPage.tsx` | ✅ `annulled` flag tratado |
| Progresso local persistente | `src/stores/progress.ts` | ✅ localStorage versionado + export/import |
| Caráter eliminatório da redação | `src/pages/SimuladoResultPage.tsx` | ✅ Aviso destacado no resultado |

## Cobertura do banco de questões

Validada por `src/data/questions/index.test.ts`:
- 212 questões de Matemática (>= 200)
- 201 questões de Português (>= 200)
- 413 questões no total (>= 400)
- Todos os tópicos do edital cobertos
- Cada tópico de Matemática com >= 3 questões
- Cada tópico de Português com >= 2 questões
- IDs únicos, 5 alternativas, resposta correta válida, sem alternativas duplicadas
