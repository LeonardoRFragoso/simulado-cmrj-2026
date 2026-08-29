#!/usr/bin/env node
/**
 * Script de migração: adiciona explanationData a cada q() call
 * que ainda não possui, preservando o explanation legado.
 *
 * Uso: node scripts/migrate-explanations.mjs <arquivo.ts>
 */
import { readFileSync, writeFileSync } from 'fs'

const file = process.argv[2]
const subjectHint = process.argv[3] // 'matematica' | 'portugues' (fallback)
if (!file) {
  console.error('Uso: node scripts/migrate-explanations.mjs <arquivo.ts> [subject]')
  process.exit(1)
}

const src = readFileSync(file, 'utf8')

if (src.includes('explanationData')) {
  console.log(`${file}: já possui explanationData, pulando.`)
  process.exit(0)
}

// Mapeamento de tópicos para conceitos (Matemática)
const mathConcepts = {
  'Sistema de numeração indo-arábico': 'No sistema de numeração indo-arábico (decimal), o valor de cada algarismo depende da sua posição: unidade, dezena, centena, unidade de milhar, etc.',
  'Classes e ordens': 'Os números são agrupados em classes (unidades simples, milhar, milhão) e cada classe tem três ordens (unidade, dezena, centena).',
  'Adição': 'A adição junta duas ou mais quantidades para formar um total. Os termos são chamados parcelas e o resultado é a soma.',
  'Subtração': 'A subtração é a diferença entre dois números. Os termos são minuendo, subtraendo e o resultado é o resto ou diferença.',
  'Multiplicação': 'A multiplicação é uma forma abreviada de somar parcelas iguais. Os termos são fatores e o resultado é o produto.',
  'Divisão': 'A divisão reparte uma quantidade em partes iguais. Os termos são dividendo, divisor, quociente e resto.',
  'Expressões numéricas': 'Nas expressões numéricas, segue-se a ordem: parênteses, potências, multiplicações/divisões (da esquerda para a direita), adições/subtrações.',
  'Números decimais': 'Números decimais usam vírgula para separar a parte inteira da parte decimal. Cada casa à direita da vírgula vale 1/10 da anterior.',
  'Operações com decimais': 'Nas operações com decimais, alinhe as vírgulas para somar/subtrair. Para multiplicar, multiplique como inteiros e conte as casas decimais.',
  'Frações': 'Uma fração representa partes de um inteiro. O numerador indica as partes consideradas e o denominador indica em quantas partes o inteiro foi dividido.',
  'Frações equivalentes': 'Frações equivalentes representam a mesma quantidade. Obtém-se multiplicando ou dividindo numerador e denominador pelo mesmo número.',
  'Operações com frações': 'Para somar/subtrair frações com mesmo denominador, somam-se os numeradores. Para multiplicar, multiplicam-se numeradores e denominadores.',
  'Relação fração e decimal': 'Toda fração pode ser escrita como decimal dividindo o numerador pelo denominador. Toda decimal finita pode ser escrita como fração decimal.',
  'MMC e MDC': 'MMC (mínimo múltiplo comum) é o menor número divisível por dois ou mais números. MDC (máximo divisor comum) é o maior número que divide dois ou mais números.',
  'Múltiplos e divisores': 'Múltiplos são resultados da multiplicação por inteiros. Divisores são números que dividem outro sem deixar resto.',
  'Porcentagem': 'Porcentagem é uma fração de denominador 100. Para calcular x% de um valor, multiplique o valor por x/100.',
  'Sistema monetário brasileiro': 'O sistema monetário brasileiro usa o Real (R$). As cédulas e moedas facilitam o troco e os cálculos do dia a dia.',
  'Sistema de numeração romano': 'O sistema romano usa letras: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Letras à direita somam; à esquerda subtraem.',
  'Grandezas e medidas': 'Grandezas são propriedades que podem ser medidas (comprimento, massa, tempo, capacidade). Cada grandeza tem unidades padrão.',
  'Transformação de unidades': 'Para transformar unidades, use a escala: cada passo multiplica ou divide por 10 (para medidas decimais) ou por 1000 (entre m e km, g e kg, L e mL).',
  'Perímetro e área': 'Perímetro é a soma dos lados de uma figura. Área é a medida da superfície. Retângulo: P=2(b+h), A=b×h. Quadrado: P=4l, A=l².',
  'Figuras geométricas': 'Figuras geométricas planas têm lados e vértices. Polígonos são figuras de lados retos: triângulo (3 lados), quadrilátero (4), pentágono (5), etc.',
  'Polígonos': 'Polígonos são figuras planas fechadas formadas por segmentos de reta. Classificam-se pelo número de lados: triângulo, quadrilátero, pentágono, hexágono, etc.',
  'Sólidos geométricos': 'Sólidos geométricos têm três dimensões: comprimento, largura e altura. Prismas têm faces paralelas iguais; pirâmides têm base e vértice no topo.',
  'Vistas tridimensionais': 'Vistas mostram um objeto de diferentes ângulos: frontal, superior e lateral. Ajuda a visualizar objetos 3D em 2D.',
  'Volume de paralelepípedos': 'Volume é o espaço ocupado por um sólido. Para um paralelepípedo (caixa), V = comprimento × largura × altura.',
  'Tratamento da informação': 'Gráficos e tabelas organizam dados para facilitar a leitura. Cada tipo de gráfico (barras, colunas, setores) destaca diferentes informações.',
  'Média aritmética': 'A média aritmética é a soma dos valores dividida pela quantidade de valores. Representa o valor central de um conjunto.',
  'Probabilidade': 'Probabilidade é a chance de um evento acontecer. Calcula-se: casos favoráveis / casos possíveis. Varia de 0 (impossível) a 1 (certo).',
}

const portConcepts = {
  'Informações explícitas': 'Informações explícitas são aquelas que aparecem diretamente no texto, sem necessidade de interpretação. Basta localizar a informação na leitura.',
  'Informações implícitas': 'Informações implícitas são aquelas que não aparecem diretamente no texto, mas podem ser deduzidas pela leitura atenta e pelo contexto.',
  'Inferência de palavras': 'Inferir o sentido de uma palavra significa deduzir seu significado pelo contexto, mesmo sem conhecê-la previamente.',
  'Inferência de expressões': 'Inferir o sentido de uma expressão significa compreender seu significado no contexto, indo além do sentido literal das palavras.',
  'Tema': 'O tema é o assunto central do texto. Para identificá-lo, pergunte-se: "Sobre o que o texto fala principalmente?"',
  'Relações entre partes do texto': 'As partes de um texto se relacionam por conectivos, referências e progressão temática. Identificar essas relações ajuda a compreender o conjunto.',
  'Repetições e substituições': 'Para evitar repetição, o texto usa pronomes, sinônimos e outras palavras que retomam termos anteriores (coesão por referência).',
  'Sinonímia e antonímia': 'Sinônimos são palavras de sentido equivalente. Antônimos têm sentidos opostos. Ambos ajudam na coesão e na clareza do texto.',
  'Personagens': 'Personagens são os seres que participam da narrativa. O personagem principal é o protagonista; quem se opõe é o antagonista.',
  'Narrador': 'O narrador é quem conta a história. Pode ser personagem (participa) ou observador (apenas observa). A posição do narrador define o foco narrativo.',
  'Foco narrativo': 'O foco narrativo é a perspectiva de quem conta a história: 1ª pessoa (narrador-personagem) ou 3ª pessoa (narrador-observador/onisciente).',
  'Enredo': 'O enredo é a sequência de acontecimentos da narrativa. Costuma ter: situação inicial, conflito, desenvolvimento, clímax e desfecho.',
  'Tempo e espaço': 'Tempo é quando a história acontece (cronológico ou psicológico). Espaço é onde os acontecimentos se passam (cenário).',
  'Linguagem figurada': 'Linguagem figurada usa palavras em sentido não literal: metáforas, comparações, personificações. Enriquece o texto e exige interpretação.',
  'Ironia e humor': 'Ironia é dizer o contrário do que se pensa. Humor provoca o riso por meio de situações inesperadas, trocadilhos ou exageros.',
  'Fato x opinião': 'Fato é algo verificável e objetivo. Opinião é um ponto de vista subjetivo. Distinguir os dois é fundamental para a leitura crítica.',
  'Finalidade dos gêneros': 'Cada gênero textual tem uma finalidade: informar (notícia), convencer (publicidade), emocionar (poema), narrar (conto), instruir (receita).',
  'Textos multimodais': 'Textos multimodais combinam linguagem verbal e não verbal (imagens, gráficos, charges). A leitura deve considerar todos os elementos.',
  'Classes de palavras': 'As classes de palavras agrupam termos por função: substantivo, adjetivo, pronome, verbo, artigo, conjunção, preposição, etc.',
  'Flexão e derivação': 'Flexão altera a forma da palavra (gênero, número, tempo). Derivação cria palavra nova (prefixação, sufixação, composição).',
  'Sílaba tônica e tonicidade': 'Toda palavra tem uma sílaba mais forte (sílaba tônica). Classificação: oxítona (última), paroxítona (penúltima), proparoxítona (antepenúltima).',
  'Verbos: indicativo e subjuntivo': 'Verbos expressam ação, estado ou fenômeno. O indicativo expressa fatos certos; o subjuntivo expressa hipóteses, desejos ou dúvidas.',
  'Pronomes': 'Pronomes substituem ou acompanham nomes. Tipos: pessoais (eu, tu), possessivos (meu, teu), demonstrativos (este, esse), interrogativos (quem, qual).',
  'Ortografia': 'Ortografia é a forma correta de escrever as palavras. Envolve o uso correto de letras, acentos e sinais gráficos conforme a norma-padrão.',
  'Sinais de pontuação': 'A pontuação organiza o texto e indica entonação: vírgula (pausa), ponto (fim de frase), ponto de interrogação (pergunta), ponto de exclamação (emoção).',
  'Vírgula': 'A vírgula marca pausas e separa elementos. NÃO se usa vírgula entre sujeito e verbo, nem entre verbo e objeto. Usa-se para isolar apostos, enumerações e vocativos.',
}

const mathHints = [
  'Leia o problema com atenção e identifique o que se pede.',
  'Pense na operação matemática necessária para resolver.',
  'Verifique se o resultado faz sentido no contexto do problema.',
]

const portHints = [
  'Releia o texto com atenção para localizar a informação.',
  'Observe as palavras-chave relacionadas ao que se pergunta.',
  'Considere o contexto para interpretar corretamente.',
]

const mathCalcTopics = new Set([
  'Adição', 'Subtração', 'Multiplicação', 'Divisão', 'Expressões numéricas',
  'Operações com decimais', 'Operações com frações', 'Transformação de unidades',
  'Média aritmética', 'Perímetro e área', 'Porcentagem', 'MMC e MDC',
  'Volume de paralelepípedos', 'Frações equivalentes', 'Relação fração e decimal',
])

function escapeSingleQuote(s) {
  return s.replace(/'/g, "\\'")
}

function generateExplanationData(explanation, topic, subject) {
  const short = explanation
  const isMath = subject === 'matematica'
  const conceptMap = isMath ? mathConcepts : portConcepts
  const concept = conceptMap[topic]
  const hints = isMath ? mathHints : portHints

  const parts = []
  parts.push(`short: '${escapeSingleQuote(short)}'`)
  if (concept) {
    parts.push(`concept: '${escapeSingleQuote(concept)}'`)
  }
  if (isMath && mathCalcTopics.has(topic)) {
    parts.push(`steps: [\n        'Identifique os dados do problema e o que se pede.',\n        'Aplique a operação ou regra necessária para encontrar o resultado.',\n        'Verifique se o resultado encontrado está entre as alternativas.',\n      ]`)
  }
  parts.push(`hints: [\n        '${hints.map(escapeSingleQuote).join("',\n        '")}',\n      ]`)

  return `{ ${parts.join(', ')} }`
}

/**
 * Estratégia: processa o arquivo com regex para encontrar cada q() call.
 * Cada q() tem o padrão: explanation: '...' }),
 * Substituímos por: explanation: '...',\n    explanationData: {...},\n  }),
 * Isso mantém explanationData DENTRO do q() call.
 */
const lines = src.split('\n')
const output = []

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  // Procura por linhas que terminam com explanation: '...' }),
  // O padrão é: <indent>explanation: '<texto>' }),
  const match = line.match(/^(\s*)explanation:\s*'((?:[^'\\]|\\.)*)'\s*\}\),?\s*$/)
  if (match) {
    const indent = match[1]
    const explanation = match[2]

    // Encontra o subject e topic nas linhas anteriores deste q() call
    let subject = null
    let topic = null
    for (let j = i - 1; j >= 0 && j >= i - 10; j--) {
      const prevLine = lines[j]
      if (!subject) {
        const sm = prevLine.match(/subject:\s*'(matematica|portugues)'/)
        if (sm) subject = sm[1]
      }
      if (!topic) {
        const tm = prevLine.match(/topic:\s*'([^']+)'/)
        if (tm) topic = tm[1]
      }
      if (subject && topic) break
    }

    const ed = generateExplanationData(explanation, topic ?? '', subject ?? subjectHint ?? 'matematica')

    // Reescreve a linha: explanation: '...',\n<indent>explanationData: {...},\n<indent>}),
    output.push(`${indent}explanation: '${explanation}',`)
    output.push(`${indent}explanationData: ${ed},`)
    output.push(`${indent}}),`)
  } else {
    output.push(line)
  }
}

const result = output.join('\n')
writeFileSync(file, result, 'utf8')
console.log(`${file}: migração concluída.`)
