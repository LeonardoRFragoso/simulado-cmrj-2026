export interface GlossaryEntry {
  term: string
  definition: string
  subject: 'matematica' | 'portugues' | 'geral'
  relatedTopic?: string
}

const entries: GlossaryEntry[] = [
  // Matemática
  { term: 'Algarismo', definition: 'Cada um dos símbolos usados para representar números. No sistema decimal: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.', subject: 'matematica' },
  { term: 'Valor posicional', definition: 'O valor de um algarismo depende da sua posição no número. Ex: em 348, o 4 vale 40 (dezena).', subject: 'matematica', relatedTopic: 'Sistema de numeração indo-arábico' },
  { term: 'Ordem', definition: 'Cada posição de um algarismo no número: unidade, dezena, centena, etc.', subject: 'matematica' },
  { term: 'Classe', definition: 'Grupo de três ordens em um número. Ex: classe das unidades simples, dos milhares, dos milhões.', subject: 'matematica' },
  { term: 'Parcela', definition: 'Cada um dos números que são somados em uma adição.', subject: 'matematica', relatedTopic: 'Adição' },
  { term: 'Soma', definition: 'O resultado de uma adição.', subject: 'matematica', relatedTopic: 'Adição' },
  { term: 'Minuendo', definition: 'O número do qual se subtrai outro em uma subtração.', subject: 'matematica', relatedTopic: 'Subtração' },
  { term: 'Subtraendo', definition: 'O número que é subtraído do minuendo.', subject: 'matematica', relatedTopic: 'Subtração' },
  { term: 'Resto', definition: 'O resultado de uma subtração, ou o que sobra em uma divisão não exata.', subject: 'matematica' },
  { term: 'Fator', definition: 'Cada um dos números que são multiplicados.', subject: 'matematica', relatedTopic: 'Multiplicação' },
  { term: 'Produto', definition: 'O resultado de uma multiplicação.', subject: 'matematica', relatedTopic: 'Multiplicação' },
  { term: 'Dividendo', definition: 'O número que está sendo dividido em uma divisão.', subject: 'matematica', relatedTopic: 'Divisão' },
  { term: 'Divisor', definition: 'O número pelo qual se divide o dividendo.', subject: 'matematica', relatedTopic: 'Divisão' },
  { term: 'Quociente', definition: 'O resultado inteiro de uma divisão.', subject: 'matematica', relatedTopic: 'Divisão' },
  { term: 'Fração', definition: 'Parte de um inteiro, expressa como numerador/denominador.', subject: 'matematica', relatedTopic: 'Frações' },
  { term: 'Numerador', definition: 'A parte de cima da fração: quantas partes consideramos.', subject: 'matematica', relatedTopic: 'Frações' },
  { term: 'Denominador', definition: 'A parte de baixo da fração: em quantas partes o inteiro foi dividido.', subject: 'matematica', relatedTopic: 'Frações' },
  { term: 'Fração equivalente', definition: 'Frações que representam a mesma quantidade. Ex: 1/2 = 2/4.', subject: 'matematica', relatedTopic: 'Frações equivalentes' },
  { term: 'MMC', definition: 'Mínimo Múltiplo Comum: o menor número que é múltiplo de dois ou mais números.', subject: 'matematica', relatedTopic: 'MMC e MDC' },
  { term: 'MDC', definition: 'Máximo Divisor Comum: o maior número que divide dois ou mais números sem resto.', subject: 'matematica', relatedTopic: 'MMC e MDC' },
  { term: 'Múltiplo', definition: 'Resultado da multiplicação de um número por um inteiro.', subject: 'matematica', relatedTopic: 'Múltiplos e divisores' },
  { term: 'Divisor', definition: 'Número que divide outro sem deixar resto.', subject: 'matematica', relatedTopic: 'Múltiplos e divisores' },
  { term: 'Número primo', definition: 'Número maior que 1 que só é divisível por 1 e por ele mesmo. Ex: 2, 3, 5, 7, 11.', subject: 'matematica' },
  { term: 'Porcentagem', definition: 'Fração de denominador 100. Ex: 25% = 25/100 = 0,25.', subject: 'matematica', relatedTopic: 'Porcentagem' },
  { term: 'Decimal', definition: 'Número com parte inteira e parte decimal separadas por vírgula.', subject: 'matematica', relatedTopic: 'Números decimais' },
  { term: 'Décimo', definition: 'Cada parte quando se divide um inteiro em 10 partes. 1 décimo = 0,1.', subject: 'matematica' },
  { term: 'Centésimo', definition: 'Cada parte quando se divide um inteiro em 100 partes. 1 centésimo = 0,01.', subject: 'matematica' },
  { term: 'Perímetro', definition: 'A soma dos lados de uma figura geométrica (medida do contorno).', subject: 'matematica', relatedTopic: 'Perímetro e área' },
  { term: 'Área', definition: 'A medida da superfície interna de uma figura.', subject: 'matematica', relatedTopic: 'Perímetro e área' },
  { term: 'Polígono', definition: 'Figura plana fechada formada por segmentos de reta.', subject: 'matematica', relatedTopic: 'Polígonos' },
  { term: 'Vértice', definition: 'Ponto onde dois lados de uma figura se encontram.', subject: 'matematica' },
  { term: 'Ângulo', definition: 'Abertura formada por dois lados que se encontram em um vértice.', subject: 'matematica' },
  { term: 'Diagonal', definition: 'Segmento que liga dois vértices não consecutivos de um polígono.', subject: 'matematica' },
  { term: 'Triângulo', definition: 'Polígono de três lados. Tipos: equilátero, isósceles, escaleno.', subject: 'matematica', relatedTopic: 'Polígonos' },
  { term: 'Quadrilátero', definition: 'Polígono de quatro lados. Ex: quadrado, retângulo, trapézio.', subject: 'matematica' },
  { term: 'Volume', definition: 'O espaço ocupado por um sólido tridimensional.', subject: 'matematica', relatedTopic: 'Volume de paralelepípedos' },
  { term: 'Prisma', definition: 'Sólido com bases paralelas e iguais e faces laterais retangulares.', subject: 'matematica', relatedTopic: 'Sólidos geométricos' },
  { term: 'Pirâmide', definition: 'Sólido com base poligonal e vértice no topo.', subject: 'matematica', relatedTopic: 'Sólidos geométricos' },
  { term: 'Face', definition: 'Cada superfície plana de um sólido geométrico.', subject: 'matematica' },
  { term: 'Aresta', definition: 'Linha onde duas faces de um sólido se encontram.', subject: 'matematica' },
  { term: 'Grandeza', definition: 'Tudo aquilo que pode ser medido. Ex: comprimento, massa, tempo.', subject: 'matematica', relatedTopic: 'Grandezas e medidas' },
  { term: 'Conversão', definition: 'Transformação de uma unidade de medida em outra equivalente.', subject: 'matematica', relatedTopic: 'Transformação de unidades' },
  { term: 'Média aritmética', definition: 'Soma dos valores dividida pela quantidade de valores.', subject: 'matematica', relatedTopic: 'Média aritmética' },
  { term: 'Probabilidade', definition: 'A chance de um evento acontecer. Calcula-se: casos favoráveis / casos possíveis.', subject: 'matematica', relatedTopic: 'Probabilidade' },
  { term: 'Evento', definition: 'Cada resultado possível em um experimento aleatório.', subject: 'matematica' },
  { term: 'Espaço amostral', definition: 'O conjunto de todos os resultados possíveis de um experimento.', subject: 'matematica' },
  { term: 'Gráfico', definition: 'Representação visual de dados para facilitar a leitura.', subject: 'matematica', relatedTopic: 'Tratamento da informação' },
  { term: 'Tabela', definition: 'Organização de dados em linhas e colunas.', subject: 'matematica', relatedTopic: 'Tratamento da informação' },

  // Português
  { term: 'Informação explícita', definition: 'Informação que aparece diretamente no texto.', subject: 'portugues', relatedTopic: 'Informações explícitas' },
  { term: 'Informação implícita', definition: 'Informação que não está dita diretamente, mas pode ser deduzida.', subject: 'portugues', relatedTopic: 'Informações implícitas' },
  { term: 'Inferência', definition: 'Dedução de informação a partir do contexto, sem estar explícito.', subject: 'portugues' },
  { term: 'Contexto', definition: 'O conjunto de palavras e ideias ao redor de um termo, que ajuda a interpretá-lo.', subject: 'portugues' },
  { term: 'Tema', definition: 'O assunto central do texto.', subject: 'portugues', relatedTopic: 'Tema' },
  { term: 'Narrador', definition: 'A voz que conta a história. Pode ser personagem ou observador.', subject: 'portugues', relatedTopic: 'Narrador' },
  { term: 'Foco narrativo', definition: 'A perspectiva de quem conta a história: 1ª ou 3ª pessoa.', subject: 'portugues', relatedTopic: 'Foco narrativo' },
  { term: 'Personagem', definition: 'Ser que participa da narrativa.', subject: 'portugues', relatedTopic: 'Personagens' },
  { term: 'Protagonista', definition: 'O personagem principal da narrativa.', subject: 'portugues' },
  { term: 'Antagonista', definition: 'O personagem que se opõe ao protagonista.', subject: 'portugues' },
  { term: 'Enredo', definition: 'A sequência de acontecimentos da narrativa.', subject: 'portugues', relatedTopic: 'Enredo' },
  { term: 'Clímax', definition: 'O ponto de maior tensão no enredo.', subject: 'portugues' },
  { term: 'Desfecho', definition: 'A resolução da história.', subject: 'portugues' },
  { term: 'Tempo cronológico', definition: 'Tempo que segue a ordem dos fatos.', subject: 'portugues', relatedTopic: 'Tempo e espaço' },
  { term: 'Espaço', definition: 'O cenário onde a história acontece.', subject: 'portugues', relatedTopic: 'Tempo e espaço' },
  { term: 'Cenário', definition: 'O lugar onde os acontecimentos da narrativa se passam.', subject: 'portugues' },
  { term: 'Gênero textual', definition: 'Tipo de texto com características próprias. Ex: notícia, poema, receita.', subject: 'portugues', relatedTopic: 'Finalidade dos gêneros' },
  { term: 'Finalidade', definition: 'O objetivo de um texto: informar, convencer, emocionar, etc.', subject: 'portugues' },
  { term: 'Multimodal', definition: 'Texto que combina linguagem verbal e não verbal (imagens, gráficos).', subject: 'portugues', relatedTopic: 'Textos multimodais' },
  { term: 'Linguagem verbal', definition: 'Uso de palavras (escritas ou faladas) para comunicar.', subject: 'portugues' },
  { term: 'Linguagem não verbal', definition: 'Uso de imagens, símbolos, sons (sem palavras) para comunicar.', subject: 'portugues' },
  { term: 'Coesão', definition: 'A ligação entre as partes do texto, garantindo continuidade.', subject: 'portugues' },
  { term: 'Conectivo', definition: 'Palavra que liga orações ou termos. Ex: e, mas, porque, portanto.', subject: 'portugues', relatedTopic: 'Relações entre partes do texto' },
  { term: 'Referência', definition: 'Retomada de um termo anterior por pronome ou sinônimo.', subject: 'portugues', relatedTopic: 'Repetições e substituições' },
  { term: 'Pronome', definition: 'Palavra que substitui ou acompanha um nome.', subject: 'portugues', relatedTopic: 'Pronomes' },
  { term: 'Fato', definition: 'Algo que pode ser comprovado, objetivo.', subject: 'portugues', relatedTopic: 'Fato x opinião' },
  { term: 'Opinião', definition: 'Ponto de vista subjetivo, pessoal.', subject: 'portugues', relatedTopic: 'Fato x opinião' },
  { term: 'Ironia', definition: 'Dizer o contrário do que se pensa, geralmente com tom crítico.', subject: 'portugues', relatedTopic: 'Ironia e humor' },
  { term: 'Humor', definition: 'Recurso que provoca o riso por situações inesperadas ou trocadilhos.', subject: 'portugues', relatedTopic: 'Ironia e humor' },
  { term: 'Metáfora', definition: 'Comparação implícita entre duas coisas. Ex: "A vida é uma estrada."', subject: 'portugues', relatedTopic: 'Linguagem figurada' },
  { term: 'Comparação', definition: 'Comparação explícita usando "como". Ex: "Fortes como um leão."', subject: 'portugues', relatedTopic: 'Linguagem figurada' },
  { term: 'Personificação', definition: 'Atribuir características humanas a coisas ou animais.', subject: 'portugues', relatedTopic: 'Linguagem figurada' },
  { term: 'Hipérbole', definition: 'Exagero intencional. Ex: "Chorei um mar de lágrimas."', subject: 'portugues', relatedTopic: 'Linguagem figurada' },
  { term: 'Sentido figurado', definition: 'Sentido não literal das palavras, criando imagens.', subject: 'portugues' },
  { term: 'Substantivo', definition: 'Palavra que nomeia seres, lugares, ideias. Ex: casa, amor.', subject: 'portugues', relatedTopic: 'Classes de palavras' },
  { term: 'Adjetivo', definition: 'Palavra que caracteriza um substantivo. Ex: bonito, grande.', subject: 'portugues', relatedTopic: 'Classes de palavras' },
  { term: 'Verbo', definition: 'Palavra que expressa ação, estado ou fenômeno. Ex: correr, ser.', subject: 'portugues', relatedTopic: 'Verbos: indicativo e subjuntivo' },
  { term: 'Indicativo', definition: 'Modo verbal que expressa fatos certos.', subject: 'portugues', relatedTopic: 'Verbos: indicativo e subjuntivo' },
  { term: 'Subjuntivo', definition: 'Modo verbal que expressa hipóteses, desejos, dúvidas.', subject: 'portugues', relatedTopic: 'Verbos: indicativo e subjuntivo' },
  { term: 'Conjunção', definition: 'Palavra que liga orações. Ex: e, mas, porque.', subject: 'portugues', relatedTopic: 'Classes de palavras' },
  { term: 'Sinônimo', definition: 'Palavra de sentido equivalente. Ex: bonito/lindo.', subject: 'portugues', relatedTopic: 'Sinonímia e antonímia' },
  { term: 'Antônimo', definition: 'Palavra de sentido oposto. Ex: quente/frio.', subject: 'portugues', relatedTopic: 'Sinonímia e antonímia' },
  { term: 'Flexão', definition: 'Alteração da forma de uma palavra (gênero, número, tempo).', subject: 'portugues', relatedTopic: 'Flexão e derivação' },
  { term: 'Derivação', definition: 'Formação de palavra nova por prefixação, sufixação ou composição.', subject: 'portugues', relatedTopic: 'Flexão e derivação' },
  { term: 'Prefixo', definition: 'Afixo colocado antes do radical. Ex: in-feliz.', subject: 'portugues' },
  { term: 'Sufixo', definition: 'Afixo colocado depois do radical. Ex: feliz-mente.', subject: 'portugues' },
  { term: 'Sílaba tônica', definition: 'A sílaba mais forte de uma palavra.', subject: 'portugues', relatedTopic: 'Sílaba tônica e tonicidade' },
  { term: 'Oxítona', definition: 'Palavra cuja sílaba tônica é a última. Ex: ca-CAU.', subject: 'portugues', relatedTopic: 'Sílaba tônica e tonicidade' },
  { term: 'Paroxítona', definition: 'Palavra cuja sílaba tônica é a penúltima. Ex: CA-sa.', subject: 'portugues', relatedTopic: 'Sílaba tônica e tonicidade' },
  { term: 'Proparoxítona', definition: 'Palavra cuja sílaba tônica é a antepenúltima. Ex: MÚ-si-ca.', subject: 'portugues', relatedTopic: 'Sílaba tônica e tonicidade' },
  { term: 'Ortografia', definition: 'A forma correta de escrever as palavras conforme a norma-padrão.', subject: 'portugues', relatedTopic: 'Ortografia' },
  { term: 'Norma-padrão', definition: 'O conjunto de regras de escrita e fala consideradas corretas.', subject: 'portugues' },
  { term: 'Vírgula', definition: 'Sinal de pontuação que marca pausas e separa elementos.', subject: 'portugues', relatedTopic: 'Vírgula' },
  { term: 'Aposto', definition: 'Termo que explica ou especifica um nome anterior.', subject: 'portugues' },
  { term: 'Vocativo', definition: 'Termo usado para chamar ou invocar alguém.', subject: 'portugues' },
  { term: 'Pontuação', definition: 'Conjunto de sinais que organizam o texto e indicam entonação.', subject: 'portugues', relatedTopic: 'Sinais de pontuação' },
  { term: 'Reticências', definition: 'Sinal (...) que indica pausa, dúvida ou omissão.', subject: 'portugues', relatedTopic: 'Sinais de pontuação' },
  { term: 'Travessão', definition: 'Sinal (—) que marca fala de personagem ou diálogo.', subject: 'portugues', relatedTopic: 'Sinais de pontuação' },
  { term: 'Pronome pessoal', definition: 'Pronome que substitui nomes de pessoas. Ex: eu, tu, ele.', subject: 'portugues', relatedTopic: 'Pronomes' },
  { term: 'Pronome demonstrativo', definition: 'Pronome que indica posição. Ex: este, esse, aquele.', subject: 'portugues', relatedTopic: 'Pronomes' },
]

/** Busca termos do glossário por texto (case-insensitive). */
export function searchGlossary(query: string, subject?: 'matematica' | 'portugues'): GlossaryEntry[] {
  const q = query.trim().toLowerCase()
  let result = entries
  if (subject) result = result.filter((e) => e.subject === subject)
  if (q) {
    result = result.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q),
    )
    // ordena: termos que começam com a query primeiro
    result.sort((a, b) => {
      const aStarts = a.term.toLowerCase().startsWith(q) ? 0 : 1
      const bStarts = b.term.toLowerCase().startsWith(q) ? 0 : 1
      return aStarts - bStarts || a.term.localeCompare(b.term)
    })
  } else {
    result = [...result].sort((a, b) => a.term.localeCompare(b.term))
  }
  return result
}

export function allGlossaryEntries(): GlossaryEntry[] {
  return [...entries].sort((a, b) => a.term.localeCompare(b.term))
}
