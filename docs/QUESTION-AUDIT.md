# QUESTION-AUDIT — Auditoria do banco de questões

> Gerado automaticamente por `scripts/audit-questions.mts` (Fase 3).
> Data: 2026-08-29

## Totais

| Métrica | Valor |
|---|---|
| Total de questões | 413 |
| Matemática | 212 |
| Português | 201 |
| Mini-aulas | 55 |
| Tópicos cobertos | 55 |
| Integridade estrutural (ids/5 alt/resposta) | OK |

## Distribuição por tópico (questões / fácil / média / difícil)

| Disciplina | Tópico | Total | Fácil | Média | Difícil |
|---|---|---|---|---|---|
| matematica | Adição | 10 | 10 | 0 | 0 |
| matematica | Classes e ordens | 7 | 3 | 2 | 2 |
| matematica | Divisão | 10 | 0 | 10 | 0 |
| matematica | Expressões numéricas | 8 | 0 | 8 | 0 |
| matematica | Figuras geométricas | 6 | 3 | 3 | 0 |
| matematica | Frações | 7 | 3 | 3 | 1 |
| matematica | Frações equivalentes | 6 | 3 | 2 | 1 |
| matematica | Grandezas e medidas | 8 | 5 | 3 | 0 |
| matematica | Média aritmética | 8 | 0 | 8 | 0 |
| matematica | MMC e MDC | 6 | 2 | 3 | 1 |
| matematica | Multiplicação | 10 | 0 | 10 | 0 |
| matematica | Múltiplos e divisores | 8 | 3 | 3 | 2 |
| matematica | Números decimais | 7 | 3 | 3 | 1 |
| matematica | Operações com decimais | 8 | 0 | 8 | 0 |
| matematica | Operações com frações | 8 | 0 | 8 | 0 |
| matematica | Perímetro e área | 8 | 0 | 8 | 0 |
| matematica | Polígonos | 6 | 3 | 3 | 0 |
| matematica | Porcentagem | 6 | 3 | 2 | 1 |
| matematica | Probabilidade | 6 | 3 | 2 | 1 |
| matematica | Relação fração e decimal | 6 | 2 | 2 | 2 |
| matematica | Sistema de numeração indo-arábico | 7 | 3 | 4 | 0 |
| matematica | Sistema de numeração romano | 6 | 3 | 2 | 1 |
| matematica | Sistema monetário brasileiro | 6 | 2 | 2 | 2 |
| matematica | Sólidos geométricos | 6 | 3 | 3 | 0 |
| matematica | Subtração | 10 | 10 | 0 | 0 |
| matematica | Transformação de unidades | 8 | 0 | 8 | 0 |
| matematica | Tratamento da informação | 8 | 3 | 4 | 1 |
| matematica | Vistas tridimensionais | 6 | 2 | 2 | 2 |
| matematica | Volume de paralelepípedos | 6 | 2 | 2 | 2 |
| portugues | Classes de palavras | 11 | 3 | 7 | 1 |
| portugues | Enredo | 5 | 0 | 5 | 0 |
| portugues | Fato x opinião | 10 | 3 | 7 | 0 |
| portugues | Finalidade dos gêneros | 15 | 7 | 8 | 0 |
| portugues | Flexão e derivação | 8 | 3 | 4 | 1 |
| portugues | Foco narrativo | 4 | 0 | 3 | 1 |
| portugues | Inferência de expressões | 6 | 0 | 6 | 0 |
| portugues | Inferência de palavras | 4 | 0 | 3 | 1 |
| portugues | Informações explícitas | 16 | 16 | 0 | 0 |
| portugues | Informações implícitas | 9 | 0 | 8 | 1 |
| portugues | Ironia e humor | 5 | 0 | 4 | 1 |
| portugues | Linguagem figurada | 7 | 2 | 5 | 0 |
| portugues | Narrador | 4 | 1 | 3 | 0 |
| portugues | Ortografia | 7 | 3 | 4 | 0 |
| portugues | Personagens | 7 | 7 | 0 | 0 |
| portugues | Pronomes | 11 | 2 | 7 | 2 |
| portugues | Relações entre partes do texto | 6 | 0 | 6 | 0 |
| portugues | Repetições e substituições | 5 | 0 | 3 | 2 |
| portugues | Sílaba tônica e tonicidade | 8 | 3 | 5 | 0 |
| portugues | Sinais de pontuação | 9 | 4 | 5 | 0 |
| portugues | Sinonímia e antonímia | 7 | 2 | 4 | 1 |
| portugues | Tema | 7 | 2 | 5 | 0 |
| portugues | Tempo e espaço | 7 | 5 | 2 | 0 |
| portugues | Textos multimodais | 5 | 1 | 3 | 1 |
| portugues | Verbos: indicativo e subjuntivo | 12 | 2 | 8 | 2 |
| portugues | Vírgula | 6 | 3 | 3 | 0 |

## Problemas detectados pela auditoria automatizada

| Severidade | Quantidade |
|---|---|
| Alta | 0 |
| Média | 56 |
| Baixa | 0 |
| **Total** | **56** |

### Por campo

| Campo | Ocorrências |
|---|---|
| hints[1] | 28 |
| hints[0] | 24 |
| statement | 3 |
| explanation.short | 1 |

### Lista detalhada de problemas de severidade ALTA

_Nenhum_

### Lista detalhada de problemas de severidade MÉDIA

- `mat-classes-002` **hints[0]**: Hint entrega a resposta: "Conceito: Os números são agrupados em classes (unidades simples, milhar, milhão) e cada classe tem três ordens (unidade, dezena, c..." (alt=B="dezena")
- `mat-frac-002` **hints[0]**: Hint entrega a resposta: "Conceito: Uma fração representa partes de um inteiro. O numerador indica as partes consideradas e o denominador indica em quantas ..." (alt=B="numerador")
- `mat-dec-002` **hints[1]**: Hint entrega a resposta: "Complete a ideia: Após a vírgula: décimos (3) e centésimos ___." (alt=D="centésimo")
- `mat-feq-005` **hints[1]**: Hint entrega a resposta: "Complete a ideia: 2×3=6 e 5×3=15 → 6/15, equivalente a ___." (alt=B="6/15")
- `mat-pct-001` **statement**: Enunciado muito curto: "50% de 80 é:"
- `mat-pct-002` **statement**: Enunciado muito curto: "10% de 200 é:"
- `mat-pct-006` **statement**: Enunciado muito curto: "100% de 50 é:"
- `mat-fig-002` **hints[0]**: Hint entrega a resposta: "Conceito: Figuras geométricas planas têm lados e vértices. Polígonos são figuras de lados retos: triângulo (3 lados), quadrilátero..." (alt=B="vértices")
- `mat-fig-002` **explanation.short**: Explicação de matemática sem números/op: "Os encontros dos lados são os vértices."
- `mat-fig-003` **hints[0]**: Hint entrega a resposta: "Conceito: Figuras geométricas planas têm lados e vértices. Polígonos são figuras de lados retos: triângulo (3 lados), quadrilátero..." (alt=C="reto")
- `port-t1-001` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Helena esqueceu a mochila no banco da praça...."" (alt=B="no banco da praça")
- `port-t1-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "uma senhora de vestido azul..."" (alt=B="uma senhora de vestido azul")
- `port-t2-001` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "No sábado, Pedro andou de bicicleta......"" (alt=B="sábado")
- `port-t4-001` **hints[0]**: Hint entrega a resposta: "Lembre: Ironia é dizer o contrário do que se pensa. Humor provoca o riso por meio de situações inesperadas, trocadilhos ou exage..." (alt=B="ironia")
- `port-t5-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Júlia..."" (alt=B="Júlia")
- `port-t8-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "antes das 19h..."" (alt=D="antes das 19h")
- `port-t10-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "mais de 500 pessoas..."" (alt=C="mais de 500")
- `port-ling-001` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Contente..."" (alt=B="contente")
- `port-ling-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Escuro..."" (alt=C="escuro")
- `port-ling-003` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Veloz..."" (alt=B="veloz")
- `port-ling-004` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Terminar..."" (alt=C="terminar")
- `port-ling-009` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "cachorro..."" (alt=B="cachorro")
- `port-ling-010` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "exceção..."" (alt=B="exceção")
- `port-ling-013` **hints[0]**: Hint entrega a resposta: "Lembre: As classes de palavras agrupam termos por função: substantivo, adjetivo, pronome, verbo, artigo, conjunção, preposição, ..." (alt=B="substantivo")
- `port-ling-014` **hints[0]**: Hint entrega a resposta: "Lembre: As classes de palavras agrupam termos por função: substantivo, adjetivo, pronome, verbo, artigo, conjunção, preposição, ..." (alt=B="adjetivo")
- `port-ling-015` **hints[0]**: Hint entrega a resposta: "Lembre: As classes de palavras agrupam termos por função: substantivo, adjetivo, pronome, verbo, artigo, conjunção, preposição, ..." (alt=C="verbo")
- `port-ling-021` **hints[0]**: Hint entrega a resposta: "Lembre: Verbos expressam ação, estado ou fenômeno. O indicativo expressa fatos certos; o subjuntivo expressa hipóteses, desejos ..." (alt=C="indicativo")
- `port-ling-022` **hints[0]**: Hint entrega a resposta: "Lembre: Verbos expressam ação, estado ou fenômeno. O indicativo expressa fatos certos; o subjuntivo expressa hipóteses, desejos ..." (alt=B="subjuntivo")
- `port-ling-026` **hints[0]**: Hint entrega a resposta: "Lembre: Pronomes substituem ou acompanham nomes. Tipos: pessoais (eu, tu), possessivos (meu, teu), demonstrativos (este, esse), ..." (alt=C="possessivo")
- `port-ling-027` **hints[0]**: Hint entrega a resposta: "Lembre: Pronomes substituem ou acompanham nomes. Tipos: pessoais (eu, tu), possessivos (meu, teu), demonstrativos (este, esse), ..." (alt=B="demonstrativo")
- `port-ling-036` **hints[0]**: Hint entrega a resposta: "Lembre: Ironia é dizer o contrário do que se pensa. Humor provoca o riso por meio de situações inesperadas, trocadilhos ou exage..." (alt=B="ironia")
- `port-ling-041` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "João..."" (alt=B="João")
- `port-ling-049` **hints[0]**: Hint entrega a resposta: "Lembre: O foco narrativo é a perspectiva de quem conta a história: 1ª pessoa (narrador-personagem) ou 3ª pessoa (narrador-observ..." (alt=B="3ª pessoa")
- `port-ling-051` **hints[0]**: Hint entrega a resposta: "Lembre: O enredo é a sequência de acontecimentos da narrativa. Costuma ter: situação inicial, conflito, desenvolvimento, clímax ..." (alt=B="a sequência de acontecimentos")
- `port-t11-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "9999-0000..."" (alt=B="9999-0000")
- `port-t11-007` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "encontrou um cachorrinho perdido na rua..."" (alt=B="na rua")
- `port-t12-004` **hints[0]**: Hint entrega a resposta: "Lembre: Linguagem figurada usa palavras em sentido não literal: metáforas, comparações, personificações. Enriquece o texto e exi..." (alt=B="figurada")
- `port-t13-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "a prova será na sexta-feira..."" (alt=E="sexta-feira")
- `port-t13-003` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "capítulos 3 e 4..."" (alt=C="3 e 4")
- `port-t15-005` **hints[0]**: Hint entrega a resposta: "Lembre: O foco narrativo é a perspectiva de quem conta a história: 1ª pessoa (narrador-personagem) ou 3ª pessoa (narrador-observ..." (alt=C="3ª pessoa")
- `port-t17-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "caíra num lago..."" (alt=B="num lago")
- `port-t18-001` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Theo..."" (alt=B="Theo")
- `port-t18-002` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Devolvo amanhã..."" (alt=B="amanhã")
- `port-t18-003` **hints[0]**: Hint entrega a resposta: "Lembre: Pronomes substituem ou acompanham nomes. Tipos: pessoais (eu, tu), possessivos (meu, teu), demonstrativos (este, esse), ..." (alt=B="possessivo")
- `port-ling-061` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Belo..."" (alt=B="belo")
- `port-ling-062` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Caro..."" (alt=A="caro")
- `port-ling-063` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Esperto..."" (alt=B="esperto")
- `port-ling-067` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "viagem..."" (alt=A="viagem")
- `port-ling-069` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "casa..."" (alt=A="casa")
- `port-ling-070` **hints[0]**: Hint entrega a resposta: "Lembre: As classes de palavras agrupam termos por função: substantivo, adjetivo, pronome, verbo, artigo, conjunção, preposição, ..." (alt=B="substantivo")
- `port-ling-072` **hints[0]**: Hint entrega a resposta: "Lembre: As classes de palavras agrupam termos por função: substantivo, adjetivo, pronome, verbo, artigo, conjunção, preposição, ..." (alt=A="preposição")
- `port-ling-078` **hints[0]**: Hint entrega a resposta: "Lembre: Verbos expressam ação, estado ou fenômeno. O indicativo expressa fatos certos; o subjuntivo expressa hipóteses, desejos ..." (alt=C="indicativo")
- `port-ling-082` **hints[0]**: Hint entrega a resposta: "Lembre: Pronomes substituem ou acompanham nomes. Tipos: pessoais (eu, tu), possessivos (meu, teu), demonstrativos (este, esse), ..." (alt=B="possessivo")
- `port-ling-091` **hints[0]**: Hint entrega a resposta: "Lembre: Ironia é dizer o contrário do que se pensa. Humor provoca o riso por meio de situações inesperadas, trocadilhos ou exage..." (alt=B="ironia")
- `port-ling-096` **hints[1]**: Hint entrega a resposta: "No texto, procure a parte que fala sobre "Maria..."" (alt=C="Maria")
- `port-ling-103` **hints[0]**: Hint entrega a resposta: "Lembre: O foco narrativo é a perspectiva de quem conta a história: 1ª pessoa (narrador-personagem) ou 3ª pessoa (narrador-observ..." (alt=C="3ª pessoa")

### Lista detalhada de problemas de severidade BAIXA

_Nenum_

## Coerência aula → questão

_OK — todos os tópicos têm aula e >= 3 questões._

## Correções aplicadas nesta fase

> Preenchido conforme as correções são feitas.

- Questões corrigidas: 0
- Gabaritos corrigidos: 0
- Explicações corrigidas: 0
- Alternativas corrigidas: 0
- Dicas corrigidas: 0
