# PROMPT PARA DEVIN — SIMULADO CMRJ 2026/2027

Você está assumindo o repositório `simulado-cmrj-2026`. O objetivo é transformar a base atual em uma aplicação de estudo completa, responsiva, segura e publicável no Vercel para uma criança se preparar pelo celular para o Processo Seletivo 2026/2027 do Colégio Militar do Rio de Janeiro (CMRJ), ingresso no 6º ano em 2027.

## 0. Regra fundamental

Não invente regras do edital. Antes de alterar qualquer regra de prova, valide em fonte oficial atual. O edital-base é o Edital nº 1, de 31 de julho de 2026 — Processo Seletivo de Admissão 2026/2027 aos Colégios Militares. A página institucional do CMRJ é https://cmrj.eb.mil.br.

A aplicação é independente e NÃO pode parecer um produto oficial do Exército/CMRJ. Exibir aviso de independência no rodapé e na página Sobre.

## 1. Regras oficiais que a aplicação deve reproduzir no modo “Simulado Oficial”

Para ingresso no 6º ano do EF no CMRJ:
- data prevista do Exame Intelectual: 18/10/2026;
- prova única com duração máxima de 270 minutos (4h30);
- 20 questões objetivas de Matemática, nota máxima 10,000;
- 20 questões objetivas de Língua Portuguesa, nota máxima 10,000;
- Produção Textual narrativa com 15 a 30 linhas;
- mínimo 5,000 em Matemática;
- mínimo 5,000 em Língua Portuguesa;
- Produção Textual eliminatória; APTO exige pelo menos 50% dos descritores/competências;
- classificação objetiva calculada de forma compatível com o edital; manter as notas por disciplina e a média das objetivas;
- CMRJ oferece 30 vagas de 6º ano nesta edição.

Não simular 1º ano do Ensino Médio neste projeto, salvo futura solicitação explícita.

## 2. Conteúdo programático — usar como taxonomia obrigatória

### Matemática
Cobrir integralmente:
- sistema de numeração indo-arábico;
- classes e ordens dos números naturais;
- adição, subtração, multiplicação e divisão de naturais;
- expressões numéricas;
- múltiplos/divisores, MMC e MDC;
- frações, equivalência, comparação, ordenação e operações;
- números decimais e relação fração ↔ decimal;
- porcentagem;
- sistema de numeração romano;
- figuras geométricas, polígonos, perímetro e área;
- sólidos geométricos, planificação, vistas tridimensionais e volume de paralelepípedos;
- medidas de comprimento, superfície, volume, capacidade, massa e tempo;
- múltiplos/submúltiplos e transformação de unidades;
- sistema monetário brasileiro;
- tabelas, gráficos, média aritmética e probabilidade.

### Língua Portuguesa
Cobrir integralmente:
- informações explícitas;
- inferência de palavras, expressões e informações implícitas;
- elementos da narrativa;
- interpretação de texto multimodal;
- finalidade de gêneros textuais;
- continuidade textual por repetição/substituição;
- fato x opinião;
- tema;
- ironia/humor;
- efeitos da vírgula e de outros sinais de pontuação;
- sinonímia/antonímia;
- linguagem figurada;
- classes de palavras no texto;
- flexão e derivação;
- sílaba tônica/tonicidade;
- verbos nos modos indicativo e subjuntivo;
- pronomes pessoais, demonstrativos e possessivos;
- ortografia oficial vigente.

### Produção Textual
O treino precisa utilizar os cinco eixos do edital:
1. modalidade escrita;
2. tipo de texto narrativo;
3. tema;
4. coerência;
5. coesão.

Incluir alertas para irregularidades eliminatórias: fuga ao tema/tipologia, texto ilegível/incompreensível, poema quando a proposta exigir prosa, identificação do candidato, menos de 15 ou mais de 30 linhas etc. No ambiente digital não fingir que “caneta azul/preta” pode ser validada; apenas explicar que essa é uma regra da prova presencial.

## 3. Banco de questões

Criar arquitetura de banco de questões versionado em JSON/TS ou SQLite/Supabase, mas a aplicação deve continuar funcionando mesmo sem login.

Meta mínima para primeira publicação:
- pelo menos 200 questões autorais de Matemática;
- pelo menos 200 questões autorais de Português;
- distribuição equilibrada por todos os tópicos do edital;
- dificuldades fácil/média/difícil;
- cada questão com resposta correta e explicação pedagógica curta;
- textos adequados à faixa etária do 5º ano/ingresso no 6º ano.

### Questões de provas anteriores
Prioridade alta, mas com rastreabilidade obrigatória.
- Procurar primeiro fontes oficiais do CMRJ, DEPA, DECEx, Exército Brasileiro ou páginas institucionais com caderno/gabarito.
- Incluir provas de 2025 e anos anteriores disponíveis oficialmente.
- Cada item histórico deve armazenar: ano, colégio, disciplina, número da questão, URL de origem, gabarito oficial e status (válida/anulada quando aplicável).
- Se uma questão tiver sido anulada, marcar explicitamente e NÃO contabilizá-la normalmente no modo treino.
- Não copiar bancos comerciais, cursos pagos, apostilas ou resoluções de terceiros.
- Não usar uma fonte não oficial como se fosse oficial.
- Se o PDF oficial não estiver acessível, registrar a lacuna em `docs/SOURCES.md` em vez de fabricar o conteúdo.

## 4. Modos de estudo

Implementar:

### A. Treino rápido
- usuário escolhe Matemática ou Português;
- escolhe 5, 10 ou 20 questões;
- feedback imediato opcional;
- explicação após resposta;
- opção “refazer somente erradas”.

### B. Treino por assunto
- seleção por tópico do edital;
- indicador de domínio por assunto;
- recomendações baseadas nos erros recentes.

### C. Simulado oficial
- 20 Matemática + 20 Português + etapa de Produção Textual;
- cronômetro de 270 minutos;
- navegação livre por número da questão;
- marcar questão para revisão;
- salvar respostas localmente a cada alteração;
- alerta de tempo em 60, 30, 15 e 5 minutos;
- autoentrega ao final do cronômetro;
- tela final com NM, NLP, média objetiva, acertos, erros, não respondidas e situação simulada por disciplina;
- não declarar “aprovado no CMRJ”; usar “atingiu/não atingiu o mínimo previsto no edital neste simulado”.

### D. Provas anteriores
- escolher ano;
- reproduzir estrutura da prova histórica quando houver fonte confiável;
- mostrar gabarito somente após finalizar ou quando o usuário sair do modo prova;
- exibir fonte de cada prova.

### E. Redação
- propostas narrativas autorais;
- editor que simula entre 15 e 30 linhas visuais;
- contador de linhas aproximado e contador de palavras;
- checklist por competência;
- autoavaliação guiada;
- histórico local de redações;
- não prometer correção oficial automática.

## 5. Experiência infantil e mobile-first

O candidato usará principalmente um celular. Prioridades:
- botões com área de toque mínima confortável (~44px);
- tipografia grande e alto contraste;
- não usar linguagem excessivamente infantilizada;
- interface limpa, poucas decisões por tela;
- barra inferior de navegação em telas pequenas;
- indicador claro de progresso;
- dark mode opcional;
- suporte a orientação portrait e landscape;
- evitar modais pequenos e dropdowns difíceis de tocar;
- acessibilidade por teclado e leitor de tela;
- `prefers-reduced-motion`;
- WCAG AA como mínimo.

## 6. Progresso e gamificação leve

Sem criar pressão inadequada. Implementar:
- sequência de dias de estudo;
- número de questões respondidas;
- percentual de acerto por disciplina e assunto;
- “assuntos para revisar”;
- metas semanais configuráveis;
- conquistas discretas por consistência, não por comparação social;
- não implementar ranking público entre crianças.

## 7. Persistência e privacidade

Primeira versão deve funcionar sem cadastro e salvar progresso em `localStorage`/IndexedDB.

Opcionalmente, depois que a versão local estiver estável, preparar uma camada de sincronização com Supabase, SEM tornar o backend obrigatório para abrir a aplicação.

Se houver conta:
- coletar o mínimo possível;
- não solicitar nome completo da criança, CPF, endereço, escola ou telefone;
- preferir apelido e conta do responsável;
- documentar LGPD e tratamento de dados de menores;
- não adicionar analytics invasivo ou publicidade.

## 8. PWA e funcionamento instável de rede

Transformar em PWA instalável:
- manifest;
- ícones próprios e genéricos, sem brasões oficiais;
- service worker;
- cache do shell e do banco básico de questões;
- continuar permitindo treino offline após a primeira visita;
- indicador online/offline.

## 9. Arquitetura

Pode manter Vite + React + TypeScript ou migrar para uma alternativa apenas se houver justificativa objetiva. Não migrar por preferência pessoal.

Organização sugerida:
- `src/features/exam`
- `src/features/practice`
- `src/features/essay`
- `src/features/progress`
- `src/data/questions`
- `src/data/past-exams`
- `src/domain`
- `src/lib`
- `src/components`
- `src/pages`
- `docs/SOURCES.md`
- `docs/EDITAL-MAPPING.md`
- `docs/ARCHITECTURE.md`

Usar tipos rigorosos. Não espalhar regras de prova em componentes; centralizar em domínio/configuração versionada.

## 10. Testes obrigatórios

Adicionar Vitest + Testing Library e, se viável, Playwright.

Cobrir no mínimo:
- cálculo de nota por disciplina;
- limite mínimo de 5,000;
- geração de simulado com exatamente 20+20;
- timer e autoentrega;
- persistência e recuperação de respostas;
- questões anuladas não afetando score histórico;
- filtro por assunto/ano;
- navegação mobile;
- fluxo completo de simulado;
- produção textual com limites configurados;
- acessibilidade básica dos controles.

Quality gates antes de concluir:
```bash
npm ci
npm run typecheck
npm run test
npm run build
```
Se adicionar Playwright, executar também os E2E relevantes.

## 11. Vercel

Ao final:
1. garantir build reproduzível;
2. conectar o repositório ao Vercel;
3. configurar Production Branch como `main`;
4. fazer deploy de produção;
5. validar no celular ou viewport equivalente (375x812 e 390x844);
6. testar reload de rotas internas;
7. validar Lighthouse mobile, priorizando Accessibility >= 95, Best Practices >= 95 e SEO >= 90;
8. retornar a URL final de produção.

Não adicionar GitHub Actions pagos/desnecessários. Preferir validação local e integração nativa do Vercel.

## 12. Documentação de fontes

Criar `docs/SOURCES.md` contendo, para cada fonte:
- título;
- instituição;
- URL;
- data de consulta;
- o que foi extraído;
- se é oficial ou secundária;
- observações sobre divergências.

Criar `docs/EDITAL-MAPPING.md` mostrando cada regra/conteúdo do edital e onde ela está implementada/testada no código.

## 13. Entrega esperada

A tarefa só estará concluída quando houver:
- aplicação funcional no celular;
- deploy público no Vercel;
- banco inicial de questões autorais completo;
- módulo para provas anteriores com fontes rastreáveis disponíveis;
- simulado oficial 20+20+redação;
- cronômetro de 270 min;
- correção objetiva e relatório de desempenho;
- treino por assunto;
- progresso persistente;
- PWA/offline;
- testes passando;
- documentação das fontes e do mapeamento do edital;
- README atualizado com URL de produção.

Ao terminar, envie um relatório com:
1. arquivos alterados/criados;
2. arquitetura final;
3. quantidade de questões por matéria/tópico/ano;
4. fontes oficiais usadas;
5. testes executados e resultados;
6. Lighthouse mobile;
7. URL do Vercel;
8. pendências reais, sem omitir limitações.
