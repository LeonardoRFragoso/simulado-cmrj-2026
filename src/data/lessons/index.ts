import type { Subject } from '../../types/exam'

/**
 * Mini-aula para um tópico do edital.
 * Conteúdo conciso, voltado para estudo rápido antes de treinar.
 */
export interface Lesson {
  topic: string
  subject: Subject
  /** título da aula (pode diferir do topic) */
  title: string
  /** resumo de 1-2 frases */
  summary: string
  /** conteúdo em blocos para renderização */
  blocks: LessonBlock[]
  /** exemplos práticos */
  examples?: string[]
  /** dicas e macetes */
  tips?: string[]
  /** erros comuns a evitar */
  commonMistakes?: string[]
  /** termos do glossário relacionados */
  glossaryTerms?: string[]
}

export type LessonBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'formula'; text: string; description?: string }
  | { type: 'example'; text: string; solution: string }

/** Mapa topic → Lesson */
const lessonMap = new Map<string, Lesson>()

export function getLesson(subject: Subject, topic: string): Lesson | undefined {
  return lessonMap.get(lessonKey(subject, topic))
}

export function hasLesson(subject: Subject, topic: string): boolean {
  return lessonMap.has(lessonKey(subject, topic))
}

export function allLessons(): Lesson[] {
  return Array.from(lessonMap.values())
}

function lessonKey(subject: Subject, topic: string): string {
  return `${subject}|${topic}`
}

function register(lesson: Lesson): void {
  lessonMap.set(lessonKey(lesson.subject, lesson.topic), lesson)
}

// ============ MATEMÁTICA ============

register({
  topic: 'Sistema de numeração indo-arábico',
  subject: 'matematica',
  title: 'Sistema de Numeração Indo-Árabico',
  summary: 'Sistema decimal posicional: o valor de cada algarismo depende da sua posição no número.',
  blocks: [
    { type: 'paragraph', text: 'O sistema de numeração que usamos é o indo-arábico, também chamado de decimal. Ele usa 10 algarismos: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.' },
    { type: 'heading', text: 'Valor posicional' },
    { type: 'paragraph', text: 'O valor de cada algarismo depende da sua posição (ordem) no número. Da direita para a esquerda: unidade, dezena, centena, unidade de milhar, dezena de milhar, etc.' },
    { type: 'example', text: 'No número 3 487:', solution: '7 = unidade (7), 8 = dezena (80), 4 = centena (400), 3 = unidade de milhar (3 000)' },
  ],
  examples: [
    'No número 5 230, o algarismo 5 vale 5 000 (unidade de milhar).',
    'No número 12 045, o algarismo 2 vale 2 000; o algarismo 4 vale 40.',
  ],
  tips: [
    'Cada posição da direita para esquerda vale 10 vezes mais que a anterior.',
    'O zero à esquerda não muda o valor: 007 = 7.',
  ],
  commonMistakes: [
    'Confundir o algarismo com seu valor posicional (ex: achar que o 4 em 3 487 vale 4 e não 400).',
  ],
  glossaryTerms: ['Algarismo', 'Valor posicional', 'Ordem', 'Classe'],
})

register({
  topic: 'Classes e ordens',
  subject: 'matematica',
  title: 'Classes e Ordens',
  summary: 'Os números são agrupados em classes de três ordens cada, separadas por pontos ou espaços.',
  blocks: [
    { type: 'paragraph', text: 'Para facilitar a leitura de números grandes, agrupamos os algarismos em classes, cada uma com três ordens.' },
    { type: 'heading', text: 'Estrutura' },
    { type: 'list', items: [
      'Classe das unidades simples: unidade, dezena, centena',
      'Classe dos milhares: unidade de milhar, dezena de milhar, centena de milhar',
      'Classe dos milhões: unidade de milhão, dezena de milhão, centena de milhão',
    ] },
    { type: 'example', text: 'Número 1 234 567:', solution: '1 milhão, 234 mil, 567 unidades → lê-se "um milhão, duzentos e trinta e quatro mil, quinhentos e sessenta e sete".' },
  ],
  tips: [
    'Separe as classes com espaço ao escrever: 1 000 000 (não use ponto para não confundir com decimal).',
  ],
  glossaryTerms: ['Classe', 'Ordem'],
})

register({
  topic: 'Adição',
  subject: 'matematica',
  title: 'Adição de Números Naturais',
  summary: 'Juntar quantidades para obter o total. Termos: parcelas e soma.',
  blocks: [
    { type: 'paragraph', text: 'A adição é a operação de juntar duas ou mais quantidades. Os números que somamos são chamados parcelas, e o resultado é a soma.' },
    { type: 'formula', text: 'a + b = s', description: 'parcela + parcela = soma' },
    { type: 'heading', text: 'Propriedades' },
    { type: 'list', items: [
      'Comutativa: a + b = b + a (a ordem não altera a soma)',
      'Associativa: (a + b) + c = a + (b + c)',
      'Elemento neutro: a + 0 = a',
    ] },
    { type: 'example', text: 'Uma escola tem 347 alunos no turno da manhã e 289 no turno da tarde. Quantos alunos no total?', solution: '347 + 289 = 636 alunos.' },
  ],
  tips: [
    'Alinhe os números pela direita (unidades sob unidades) para não errar.',
    'Confira somando de trás para frente ou estimando primeiro.',
  ],
  commonMistakes: [
    'Esquecer o "vai um" na soma de dezenas ou centenas.',
  ],
  glossaryTerms: ['Parcela', 'Soma', 'Comutativa'],
})

register({
  topic: 'Subtração',
  subject: 'matematica',
  title: 'Subtração de Números Naturais',
  summary: 'Encontrar a diferença entre dois números. Termos: minuendo, subtraendo e resto.',
  blocks: [
    { type: 'paragraph', text: 'A subtração representa a diferença entre duas quantidades. O número do qual subtraímos é o minuendo, o que subtraímos é o subtraendo, e o resultado é o resto (ou diferença).' },
    { type: 'formula', text: 'a − b = r', description: 'minuendo − subtraendo = resto' },
    { type: 'example', text: 'Uma padaria produziu 240 pães e vendeu 175. Quantos restaram?', solution: '240 − 175 = 65 pães.' },
  ],
  tips: [
    'Alinhe os números pela direita, como na adição.',
    'No "empresta um", borrow 1 da ordem à esquerda (vale 10 na ordem atual).',
  ],
  commonMistakes: [
    'Esquecer de subtrair 1 da ordem à esquerda ao "emprestar".',
  ],
  glossaryTerms: ['Minuendo', 'Subtraendo', 'Resto', 'Diferença'],
})

register({
  topic: 'Multiplicação',
  subject: 'matematica',
  title: 'Multiplicação de Números Naturais',
  summary: 'Soma de parcelas iguais. Termos: fatores e produto.',
  blocks: [
    { type: 'paragraph', text: 'A multiplicação é uma forma abreviada de somar parcelas iguais. Os números que multiplicamos são os fatores, e o resultado é o produto.' },
    { type: 'formula', text: 'a × b = p', description: 'fator × fator = produto' },
    { type: 'heading', text: 'Propriedades' },
    { type: 'list', items: [
      'Comutativa: a × b = b × a',
      'Associativa: (a × b) × c = a × (b × c)',
      'Distributiva: a × (b + c) = a×b + a×c',
      'Elemento neutro: a × 1 = a',
      'Elemento absorvente: a × 0 = 0',
    ] },
    { type: 'example', text: 'Uma caixa tem 24 bombons. Quantos bombons há em 15 caixas?', solution: '24 × 15 = 360 bombons.' },
  ],
  tips: [
    'Decomponha um fator: 24 × 15 = 24 × (10 + 5) = 240 + 120 = 360.',
  ],
  commonMistakes: [
    'Erro no "vai um" ao multiplicar dezenas.',
  ],
  glossaryTerms: ['Fator', 'Produto', 'Distributiva'],
})

register({
  topic: 'Divisão',
  subject: 'matematica',
  title: 'Divisão de Números Naturais',
  summary: 'Repartir uma quantidade em partes iguais. Termos: dividendo, divisor, quociente e resto.',
  blocks: [
    { type: 'paragraph', text: 'A divisão reparte uma quantidade em partes iguais ou descobre quantas vezes uma quantidade cabe em outra.' },
    { type: 'formula', text: 'D = d × q + r', description: 'dividendo = divisor × quociente + resto (com r < d)' },
    { type: 'example', text: 'Repartir 47 balas igualmente entre 6 crianças.', solution: '47 ÷ 6 = 7 (quociente) com resto 5. Cada criança recebe 7 balas e sobram 5.' },
  ],
  tips: [
    'O resto é sempre menor que o divisor.',
    'Confira: dividendo = divisor × quociente + resto.',
  ],
  commonMistakes: [
    'Esquecer de verificar o resto (deve ser < divisor).',
  ],
  glossaryTerms: ['Dividendo', 'Divisor', 'Quociente', 'Resto'],
})

register({
  topic: 'Expressões numéricas',
  subject: 'matematica',
  title: 'Expressões Numéricas',
  summary: 'Cálculo de expressões respeitando a ordem das operações.',
  blocks: [
    { type: 'heading', text: 'Ordem das operações' },
    { type: 'list', items: [
      '1º: Parênteses, colchetes, chaves (do mais interno para o mais externo)',
      '2º: Potências e raízes',
      '3º: Multiplicações e divisões (da esquerda para a direita)',
      '4º: Adições e subtrações (da esquerda para a direita)',
    ] },
    { type: 'example', text: 'Calcule: 3 + 2 × (5 − 2)²', solution: '5 − 2 = 3 → 3² = 9 → 2 × 9 = 18 → 3 + 18 = 21.' },
  ],
  tips: [
    'Use a regra "PMDAS": Parênteses, Multiplicação/Divisão, Adição/Subtração.',
  ],
  commonMistakes: [
    'Calcular da esquerda para a direita ignorando a precedência (ex: 3 + 2 × 5 = 13, não 25).',
  ],
  glossaryTerms: ['Precedência', 'Parênteses'],
})

register({
  topic: 'Múltiplos e divisores',
  subject: 'matematica',
  title: 'Múltiplos e Divisores',
  summary: 'Múltiplos são resultados da multiplicação; divisores são números que dividem outro sem resto.',
  blocks: [
    { type: 'paragraph', text: 'Um número é múltiplo de outro quando resulta da multiplicação desse número por um inteiro. Um número é divisor de outro quando a divisão é exata (resto zero).' },
    { type: 'example', text: 'Múltiplos de 4:', solution: '0, 4, 8, 12, 16, 20, 24, ...' },
    { type: 'example', text: 'Divisores de 12:', solution: '1, 2, 3, 4, 6, 12' },
  ],
  tips: [
    'Todo número é múltiplo de si mesmo e divisor de si mesmo.',
    'O zero é múltiplo de todo número, mas não é divisor de nenhum.',
  ],
  glossaryTerms: ['Múltiplo', 'Divisor', 'Divisibilidade'],
})

register({
  topic: 'MMC e MDC',
  subject: 'matematica',
  title: 'MMC e MDC',
  summary: 'MMC: menor múltiplo comum. MDC: máximo divisor comum.',
  blocks: [
    { type: 'paragraph', text: 'O Mínimo Múltiplo Comum (MMC) é o menor número que é múltiplo de dois ou mais números ao mesmo tempo. O Máximo Divisor Comum (MDC) é o maior número que divide dois ou mais números sem deixar resto.' },
    { type: 'heading', text: 'Método da decomposição' },
    { type: 'paragraph', text: 'Para o MMC, decomponha em fatores primos e pegue cada fator com seu maior expoente. Para o MDC, pegue cada fator comum com seu menor expoente.' },
    { type: 'example', text: 'MMC de 12 e 18:', solution: '12 = 2²×3; 18 = 2×3² → MMC = 2²×3² = 36.' },
    { type: 'example', text: 'MDC de 12 e 18:', solution: '12 = 2²×3; 18 = 2×3² → MDC = 2×3 = 6.' },
  ],
  tips: [
    'MMC usa o MAIOR expoente de cada fator; MDC usa o MENOR expoente dos fatores comuns.',
    'MMC é útil para somar frações com denominadores diferentes.',
  ],
  glossaryTerms: ['MMC', 'MDC', 'Número primo'],
})

register({
  topic: 'Frações',
  subject: 'matematica',
  title: 'Frações',
  summary: 'Partes de um inteiro: numerador/denominador.',
  blocks: [
    { type: 'paragraph', text: 'Uma fração representa partes de um inteiro. O numerador (em cima) indica quantas partes consideramos; o denominador (embaixo) indica em quantas partes o inteiro foi dividido.' },
    { type: 'formula', text: 'a/b', description: 'numerador / denominador' },
    { type: 'heading', text: 'Tipos de fração' },
    { type: 'list', items: [
      'Própria: numerador < denominador (ex: 3/4)',
      'Imprópria: numerador ≥ denominador (ex: 5/3)',
      'Aparente: numerador é múltiplo do denominador (ex: 6/3 = 2)',
      'Unitária: numerador = 1 (ex: 1/5)',
    ] },
  ],
  tips: [
    'O denominador nunca pode ser zero.',
  ],
  glossaryTerms: ['Fração', 'Numerador', 'Denominador'],
})

register({
  topic: 'Números decimais',
  subject: 'matematica',
  title: 'Números Decimais',
  summary: 'Números com parte inteira e parte decimal separadas por vírgula.',
  blocks: [
    { type: 'paragraph', text: 'Números decimais usam vírgula para separar a parte inteira da parte decimal. Cada casa à direita da vírgula vale 1/10 da anterior.' },
    { type: 'list', items: [
      '1ª casa decimal: décimos (1/10)',
      '2ª casa: centésimos (1/100)',
      '3ª casa: milésimos (1/1000)',
    ] },
    { type: 'example', text: 'O número 3,45 lê-se:', solution: '"três inteiros e quarenta e cinco centésimos".' },
  ],
  tips: [
    'No Brasil, usamos vírgula para separar decimais (não ponto).',
  ],
  glossaryTerms: ['Decimal', 'Décimo', 'Centésimo'],
})

register({
  topic: 'Frações equivalentes',
  subject: 'matematica',
  title: 'Frações Equivalentes',
  summary: 'Frações que representam a mesma quantidade.',
  blocks: [
    { type: 'paragraph', text: 'Frações equivalentes representam a mesma parte de um inteiro. Obtém-se multiplicando ou dividindo numerador e denominador pelo mesmo número.' },
    { type: 'example', text: '1/2 = 2/4 = 3/6 = 4/8', solution: 'Todas representam metade do inteiro.' },
    { type: 'heading', text: 'Simplificação' },
    { type: 'paragraph', text: 'Para simplificar uma fração, divida numerador e denominador pelo MDC deles.' },
  ],
  tips: [
    'Para verificar equivalência, faça multiplicação cruzada: a/b = c/d se a×d = b×c.',
  ],
  glossaryTerms: ['Fração equivalente', 'Simplificação'],
})

register({
  topic: 'Relação fração e decimal',
  subject: 'matematica',
  title: 'Relação entre Fração e Decimal',
  summary: 'Toda fração pode ser escrita como decimal e vice-versa.',
  blocks: [
    { type: 'paragraph', text: 'Para transformar fração em decimal, divida o numerador pelo denominador. Para transformar decimal em fração, escreva como fração decimal (denominador 10, 100, 1000...) e simplifique.' },
    { type: 'example', text: 'Fração 3/4 em decimal:', solution: '3 ÷ 4 = 0,75.' },
    { type: 'example', text: 'Decimal 0,25 em fração:', solution: '0,25 = 25/100 = 1/4.' },
  ],
  tips: [
    'Frações com denominador 10, 100, 1000 são "frações decimais" e convertem direto.',
  ],
  glossaryTerms: ['Fração decimal'],
})

register({
  topic: 'Operações com frações',
  subject: 'matematica',
  title: 'Operações com Frações',
  summary: 'Soma, subtração, multiplicação e divisão de frações.',
  blocks: [
    { type: 'heading', text: 'Soma e subtração' },
    { type: 'paragraph', text: 'Para somar ou subtrair frações com o mesmo denominador, somam-se (ou subtraem-se) os numeradores e mantém o denominador. Com denominadores diferentes, calcule o MMC primeiro.' },
    { type: 'example', text: '1/4 + 2/4 = 3/4', solution: 'Mesmo denominador: some os numeradores.' },
    { type: 'example', text: '1/3 + 1/6', solution: 'MMC(3,6) = 6 → 2/6 + 1/6 = 3/6 = 1/2.' },
    { type: 'heading', text: 'Multiplicação' },
    { type: 'paragraph', text: 'Multiplique numeradores entre si e denominadores entre si.' },
    { type: 'formula', text: 'a/b × c/d = (a×c)/(b×d)' },
    { type: 'heading', text: 'Divisão' },
    { type: 'paragraph', text: 'Para dividir frações, multiplique a primeira pelo inverso da segunda.' },
    { type: 'formula', text: 'a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)' },
  ],
  tips: [
    'Na multiplicação, simplifique antes de multiplicar (corte fatores comuns).',
  ],
  glossaryTerms: ['MMC', 'Inverso multiplicativo'],
})

register({
  topic: 'Operações com decimais',
  subject: 'matematica',
  title: 'Operações com Decimais',
  summary: 'Soma, subtração, multiplicação e divisão com números decimais.',
  blocks: [
    { type: 'heading', text: 'Soma e subtração' },
    { type: 'paragraph', text: 'Alinhe as vírgulas e opere como números inteiros.' },
    { type: 'example', text: '3,45 + 2,1', solution: 'Alinhe: 3,45 + 2,10 = 5,55.' },
    { type: 'heading', text: 'Multiplicação' },
    { type: 'paragraph', text: 'Multiplique como inteiros e conte o total de casas decimais dos dois fatores.' },
    { type: 'example', text: '2,5 × 0,4', solution: '25 × 4 = 100; 1+1 = 2 casas decimais → 1,00 = 1.' },
    { type: 'heading', text: 'Divisão' },
    { type: 'paragraph', text: 'Igual o número de casas decimais multiplicando ambos por 10, 100, etc.' },
  ],
  tips: [
    'Na multiplicação, conte as casas decimais dos dois fatores.',
  ],
  glossaryTerms: ['Casa decimal'],
})

register({
  topic: 'Porcentagem',
  subject: 'matematica',
  title: 'Porcentagem',
  summary: 'Fração de denominador 100. x% = x/100.',
  blocks: [
    { type: 'paragraph', text: 'Porcentagem é uma fração com denominador 100. Para calcular x% de um valor, multiplique o valor por x/100.' },
    { type: 'formula', text: 'x% de V = V × (x/100)' },
    { type: 'example', text: 'Quanto é 25% de 80?', solution: '80 × 25/100 = 80 × 0,25 = 20.' },
    { type: 'example', text: 'Um produto de R$ 200 com 15% de desconto.', solution: 'Desconto = 200 × 0,15 = R$ 30. Preço final = 200 − 30 = R$ 170.' },
  ],
  tips: [
    '10% = 1/10; 25% = 1/4; 50% = 1/2; 75% = 3/4; 100% = o todo.',
  ],
  glossaryTerms: ['Porcentagem', 'Desconto', 'Juros'],
})

register({
  topic: 'Sistema de numeração romano',
  subject: 'matematica',
  title: 'Sistema de Numeração Romano',
  summary: 'Sistema que usa letras: I, V, X, L, C, D, M.',
  blocks: [
    { type: 'paragraph', text: 'O sistema romano usa sete letras para representar números:' },
    { type: 'list', items: [
      'I = 1, V = 5, X = 10, L = 50',
      'C = 100, D = 500, M = 1000',
    ] },
    { type: 'heading', text: 'Regras' },
    { type: 'list', items: [
      'Letras à direita somam: VI = 5 + 1 = 6',
      'Letras à esquerda subtraem: IV = 5 − 1 = 4',
      'I, X, C, M podem repetir até 3 vezes: III = 3, XXX = 30',
      'V, L, D não se repetem',
    ] },
    { type: 'example', text: 'Converter 49 para romano:', solution: '49 = 40 + 9 = XL + IX = XLIX.' },
  ],
  tips: [
    'Para subtrair, só se subtrai I, X ou C (e apenas de V, X; L, C; D, M respectivamente).',
  ],
  glossaryTerms: ['Algarismo romano'],
})

register({
  topic: 'Figuras geométricas',
  subject: 'matematica',
  title: 'Figuras Geométricas Planas',
  summary: 'Polígonos e figuras com lados e vértices.',
  blocks: [
    { type: 'paragraph', text: 'Figuras geométricas planas têm duas dimensões (comprimento e largura). Polígonos são figuras fechadas formadas por segmentos de reta.' },
    { type: 'heading', text: 'Classificação dos polígonos' },
    { type: 'list', items: [
      'Triângulo: 3 lados',
      'Quadrilátero: 4 lados (quadrado, retângulo, losango, trapézio)',
      'Pentágono: 5 lados',
      'Hexágono: 6 lados',
      'Heptágono: 7 lados',
      'Octógono: 8 lados',
    ] },
    { type: 'heading', text: 'Elementos' },
    { type: 'list', items: ['Lados', 'Vértices', 'Ângulos', 'Diagonais'] },
  ],
  glossaryTerms: ['Polígono', 'Vértice', 'Ângulo', 'Diagonal'],
})

register({
  topic: 'Polígonos',
  subject: 'matematica',
  title: 'Polígonos',
  summary: 'Figuras planas fechadas formadas por segmentos de reta.',
  blocks: [
    { type: 'paragraph', text: 'Polígonos são classificados pelo número de lados. Podem ser regulares (todos os lados e ângulos iguais) ou irregulares.' },
    { type: 'heading', text: 'Triângulos (por lados)' },
    { type: 'list', items: ['Equilátero: 3 lados iguais', 'Isósceles: 2 lados iguais', 'Escaleno: 3 lados diferentes'] },
    { type: 'heading', text: 'Triângulos (por ângulos)' },
    { type: 'list', items: ['Acutângulo: 3 ângulos agudos (< 90°)', 'Retângulo: 1 ângulo reto (90°)', 'Obtusângulo: 1 ângulo obtuso (> 90°)'] },
  ],
  tips: [
    'A soma dos ângulos internos de um triângulo é sempre 180°.',
  ],
  glossaryTerms: ['Triângulo', 'Quadrilátero', 'Ângulo'],
})

register({
  topic: 'Perímetro e área',
  subject: 'matematica',
  title: 'Perímetro e Área',
  summary: 'Perímetro: soma dos lados. Área: medida da superfície.',
  blocks: [
    { type: 'paragraph', text: 'Perímetro é a soma de todos os lados de uma figura (medida do contorno). Área é a medida da superfície interna da figura.' },
    { type: 'heading', text: 'Fórmulas principais' },
    { type: 'formula', text: 'Quadrado: P = 4l; A = l²' },
    { type: 'formula', text: 'Retângulo: P = 2(b + h); A = b × h' },
    { type: 'formula', text: 'Triângulo: P = a + b + c; A = (b × h) / 2' },
    { type: 'example', text: 'Área de um retângulo 6 cm × 4 cm:', solution: 'A = 6 × 4 = 24 cm². Perímetro = 2(6+4) = 20 cm.' },
  ],
  tips: [
    'Perímetro é linear (cm, m); área é quadrática (cm², m²).',
  ],
  commonMistakes: [
    'Confundir perímetro com área (unidades diferentes!).',
  ],
  glossaryTerms: ['Perímetro', 'Área'],
})

register({
  topic: 'Sólidos geométricos',
  subject: 'matematica',
  title: 'Sólidos Geométricos',
  summary: 'Figuras tridimensionais: prismas, pirâmides, cilindros, cones, esferas.',
  blocks: [
    { type: 'paragraph', text: 'Sólidos geométricos têm três dimensões: comprimento, largura e altura. Possuem faces (superfícies planas), arestas (linhas) e vértices (pontos).' },
    { type: 'heading', text: 'Principais sólidos' },
    { type: 'list', items: [
      'Prisma: bases paralelas e iguais, faces laterais retangulares',
      'Pirâmide: base poligonal e vértice no topo',
      'Cilindro: bases circulares',
      'Cone: base circular e vértice',
      'Esfera: superfície curva sem arestas',
    ] },
  ],
  tips: [
    'Planificação é a figura plana que, ao ser dobrada, forma o sólido.',
  ],
  glossaryTerms: ['Face', 'Aresta', 'Vértice', 'Prisma', 'Pirâmide'],
})

register({
  topic: 'Vistas tridimensionais',
  subject: 'matematica',
  title: 'Vistas Tridimensionais',
  summary: 'Projeções de um objeto 3D em planos 2D: frontal, superior e lateral.',
  blocks: [
    { type: 'paragraph', text: 'Vistas mostram um objeto tridimensional de diferentes ângulos. As três vistas principais são: frontal, superior e lateral.' },
    { type: 'list', items: [
      'Vista frontal: olhando de frente',
      'Vista superior: olhando de cima',
      'Vista lateral: olhando de lado',
    ] },
  ],
  tips: [
    'Imagine-se andando ao redor do objeto para ver cada vista.',
  ],
  glossaryTerms: ['Vista', 'Projeção'],
})

register({
  topic: 'Volume de paralelepípedos',
  subject: 'matematica',
  title: 'Volume de Paralelepípedos',
  summary: 'Volume = comprimento × largura × altura.',
  blocks: [
    { type: 'paragraph', text: 'Volume é o espaço ocupado por um sólido. Para um paralelepípedo (caixa retangular), calcula-se multiplicando as três dimensões.' },
    { type: 'formula', text: 'V = c × l × h', description: 'volume = comprimento × largura × altura' },
    { type: 'example', text: 'Volume de uma caixa 5 cm × 3 cm × 2 cm:', solution: 'V = 5 × 3 × 2 = 30 cm³.' },
  ],
  tips: [
    'Unidade de volume é cúbica (cm³, m³). 1 litro = 1 dm³ = 1000 cm³.',
  ],
  glossaryTerms: ['Volume', 'Paralelepípedo'],
})

register({
  topic: 'Grandezas e medidas',
  subject: 'matematica',
  title: 'Grandezas e Medidas',
  summary: 'Grandezas são propriedades mensuráveis: comprimento, massa, tempo, capacidade.',
  blocks: [
    { type: 'paragraph', text: 'Grandeza é tudo aquilo que pode ser medido. As grandezas mais comuns são: comprimento, massa, tempo, temperatura e capacidade.' },
    { type: 'heading', text: 'Unidades do Sistema Internacional' },
    { type: 'list', items: [
      'Comprimento: metro (m)',
      'Massa: quilograma (kg)',
      'Tempo: segundo (s)',
      'Capacidade: litro (L)',
      'Temperatura: grau Celsius (°C)',
    ] },
  ],
  glossaryTerms: ['Grandeza', 'Medida', 'Unidade'],
})

register({
  topic: 'Transformação de unidades',
  subject: 'matematica',
  title: 'Transformação de Unidades',
  summary: 'Converter entre unidades usando fatores de conversão.',
  blocks: [
    { type: 'heading', text: 'Comprimento' },
    { type: 'list', items: ['1 km = 1000 m', '1 m = 100 cm', '1 cm = 10 mm'] },
    { type: 'heading', text: 'Massa' },
    { type: 'list', items: ['1 kg = 1000 g', '1 t = 1000 kg'] },
    { type: 'heading', text: 'Capacidade' },
    { type: 'list', items: ['1 L = 1000 mL'] },
    { type: 'example', text: 'Converter 2,5 km em metros:', solution: '2,5 × 1000 = 2 500 m.' },
  ],
  tips: [
    'Para unidades decimais, cada passo multiplica/divide por 10.',
    'Entre m e km, g e kg, L e mL, multiplica/divide por 1000.',
  ],
  glossaryTerms: ['Conversão', 'Quilômetro', 'Metro'],
})

register({
  topic: 'Sistema monetário brasileiro',
  subject: 'matematica',
  title: 'Sistema Monetário Brasileiro',
  summary: 'O Real (R$) é a moeda oficial. Cédulas e moedas facilitam o troco.',
  blocks: [
    { type: 'paragraph', text: 'O sistema monetário brasileiro usa o Real (R$). As cédulas são: 2, 5, 10, 20, 50, 100 e 200 reais. As moedas são: 5, 10, 25, 50 centavos e 1 real.' },
    { type: 'example', text: 'Troco para R$ 50 pagando R$ 23,50:', solution: '50,00 − 23,50 = R$ 26,50 de troco.' },
  ],
  tips: [
    'Para calcular troco, subtraia o valor pago do valor entregue.',
  ],
  glossaryTerms: ['Real', 'Troco', 'Cédula', 'Moeda'],
})

register({
  topic: 'Tratamento da informação',
  subject: 'matematica',
  title: 'Tabelas e Gráficos',
  summary: 'Organização e leitura de dados em tabelas e gráficos.',
  blocks: [
    { type: 'paragraph', text: 'Tabelas e gráficos organizam dados para facilitar a leitura e a comparação.' },
    { type: 'heading', text: 'Tipos de gráficos' },
    { type: 'list', items: [
      'Gráfico de barras: compara quantidades',
      'Gráfico de colunas: barras verticais',
      'Gráfico de setores (pizza): mostra proporções',
      'Gráfico de linhas: mostra evolução no tempo',
    ] },
  ],
  tips: [
    'Leia sempre o título e os eixos antes de interpretar um gráfico.',
  ],
  glossaryTerms: ['Gráfico', 'Tabela', 'Eixo'],
})

register({
  topic: 'Média aritmética',
  subject: 'matematica',
  title: 'Média Aritmética',
  summary: 'Soma dos valores dividida pela quantidade de valores.',
  blocks: [
    { type: 'formula', text: 'média = (soma dos valores) / (quantidade de valores)' },
    { type: 'example', text: 'Notas: 7, 8, 6, 9. Média?', solution: '(7 + 8 + 6 + 9) / 4 = 30 / 4 = 7,5.' },
  ],
  tips: [
    'A média é um valor central; pode não ser nenhum dos valores do conjunto.',
  ],
  glossaryTerms: ['Média aritmética'],
})

register({
  topic: 'Probabilidade',
  subject: 'matematica',
  title: 'Probabilidade',
  summary: 'Chance de um evento acontecer: casos favoráveis / casos possíveis.',
  blocks: [
    { type: 'formula', text: 'P(evento) = casos favoráveis / casos possíveis' },
    { type: 'paragraph', text: 'A probabilidade varia de 0 (impossível) a 1 (certo). Pode ser expressa como fração, decimal ou porcentagem.' },
    { type: 'example', text: 'Probabilidade de tirar 6 em um dado:', solution: '1 caso favorável / 6 possíveis = 1/6 ≈ 0,167 ≈ 16,7%.' },
  ],
  tips: [
    'P = 0 → impossível; P = 1 → certo; P = 0,5 → 50% de chance.',
  ],
  glossaryTerms: ['Probabilidade', 'Evento', 'Espaço amostral'],
})

// ============ PORTUGUÊS ============

register({
  topic: 'Informações explícitas',
  subject: 'portugues',
  title: 'Informações Explícitas',
  summary: 'Informações que aparecem diretamente no texto.',
  blocks: [
    { type: 'paragraph', text: 'Informações explícitas são aquelas que aparecem literalmente no texto. Para encontrá-las, basta localizar a informação durante a leitura.' },
    { type: 'example', text: '"João foi à escola de bicicleta."', solution: 'A informação explícita é que João foi à escola de bicicleta.' },
  ],
  tips: [
    'Sublinhe ou grife a parte do texto que responde à pergunta.',
  ],
  glossaryTerms: ['Informação explícita'],
})

register({
  topic: 'Inferência de palavras',
  subject: 'portugues',
  title: 'Inferência do Significado de Palavras',
  summary: 'Deduzir o sentido de uma palavra pelo contexto.',
  blocks: [
    { type: 'paragraph', text: 'Inferir o sentido de uma palavra significa deduzir seu significado pelo contexto, mesmo sem conhecê-la previamente. Observe as palavras ao redor e o tema do texto.' },
    { type: 'example', text: '"O menino era taciturno: falava pouco e sempre sério."', solution: 'Pelo contexto, "taciturno" significa sério, calado, pouco comunicativo.' },
  ],
  tips: [
    'Procure sinônimos ou explicações no próprio texto.',
  ],
  glossaryTerms: ['Inferência', 'Contexto'],
})

register({
  topic: 'Inferência de expressões',
  subject: 'portugues',
  title: 'Inferência de Expressões',
  summary: 'Deduzir o sentido de uma expressão no contexto.',
  blocks: [
    { type: 'paragraph', text: 'Inferir o sentido de uma expressão significa compreender seu significado no contexto, indo além do sentido literal das palavras.' },
    { type: 'example', text: '"Ela tem um coração de pedra."', solution: 'A expressão "coração de pedra" significa pessoa insensível, sem emoção.' },
  ],
  glossaryTerms: ['Sentido figurado', 'Expressão'],
})

register({
  topic: 'Informações implícitas',
  subject: 'portugues',
  title: 'Informações Implícitas',
  summary: 'Informações deduzidas pela leitura atenta, não ditas diretamente.',
  blocks: [
    { type: 'paragraph', text: 'Informações implícitas não aparecem literalmente no texto, mas podem ser deduzidas pela leitura atenta e pelo contexto.' },
    { type: 'example', text: '"Maria olhou o relógio, pegou a bolsa e saiu correndo."', solution: 'Implícito: Maria estava atrasada (não está dito, mas deduz-se pela ação).' },
  ],
  tips: [
    'Pergunte-se: "O que o texto sugere sem dizer diretamente?"',
  ],
  glossaryTerms: ['Informação implícita', 'Dedução'],
})

register({
  topic: 'Narrador',
  subject: 'portugues',
  title: 'Narrador',
  summary: 'Quem conta a história. Pode ser personagem ou observador.',
  blocks: [
    { type: 'paragraph', text: 'O narrador é a voz que conta a história. Pode ser personagem (participa da narrativa, 1ª pessoa) ou observador (apenas observa, 3ª pessoa).' },
    { type: 'list', items: [
      'Narrador-personagem: participa da história, usa "eu"',
      'Narrador-observador: conta a história de fora, usa "ele/ela"',
      'Narrador-onisciente: sabe tudo sobre os personagens',
    ] },
  ],
  glossaryTerms: ['Narrador', 'Foco narrativo'],
})

register({
  topic: 'Foco narrativo',
  subject: 'portugues',
  title: 'Foco Narrativo',
  summary: 'A perspectiva de quem conta a história.',
  blocks: [
    { type: 'list', items: [
      '1ª pessoa: narrador-personagem (eu)',
      '3ª pessoa: narrador-observador ou onisciente (ele/ela)',
    ] },
  ],
  tips: [
    'Se o texto usa "eu", é 1ª pessoa. Se usa "ele/ela", é 3ª pessoa.',
  ],
  glossaryTerms: ['Foco narrativo', 'Pessoa verbal'],
})

register({
  topic: 'Personagens',
  subject: 'portugues',
  title: 'Personagens',
  summary: 'Seres que participam da narrativa.',
  blocks: [
    { type: 'paragraph', text: 'Personagens são os seres (pessoas, animais, objetos) que participam da narrativa.' },
    { type: 'list', items: [
      'Protagonista: personagem principal',
      'Antagonista: opõe-se ao protagonista',
      'Personagem secundário: participa, mas não é central',
      'Personagem plano: sem evolução',
      'Personagem redondo: complexo, evolui',
    ] },
  ],
  glossaryTerms: ['Personagem', 'Protagonista', 'Antagonista'],
})

register({
  topic: 'Enredo',
  subject: 'portugues',
  title: 'Enredo',
  summary: 'Sequência de acontecimentos da narrativa.',
  blocks: [
    { type: 'paragraph', text: 'O enredo é a sequência de acontecimentos da narrativa. Costuma ter cinco partes:' },
    { type: 'list', items: [
      'Situação inicial: apresentação',
      'Conflito: problema que move a história',
      'Desenvolvimento: ações para resolver o conflito',
      'Clímax: ponto de maior tensão',
      'Desfecho: resolução da história',
    ] },
  ],
  glossaryTerms: ['Enredo', 'Clímax', 'Desfecho'],
})

register({
  topic: 'Tempo e espaço',
  subject: 'portugues',
  title: 'Tempo e Espaço',
  summary: 'Tempo: quando a história acontece. Espaço: onde acontece.',
  blocks: [
    { type: 'heading', text: 'Tempo' },
    { type: 'list', items: [
      'Cronológico: segue a ordem dos fatos',
      'Psicológico: tempo interno, subjetivo',
      'Flashback: volta ao passado',
    ] },
    { type: 'heading', text: 'Espaço' },
    { type: 'paragraph', text: 'Espaço é o cenário onde a história acontece. Pode ser físico (lugar) ou social (ambiente cultural).' },
  ],
  glossaryTerms: ['Tempo cronológico', 'Espaço', 'Cenário'],
})

register({
  topic: 'Textos multimodais',
  subject: 'portugues',
  title: 'Textos Multimodais',
  summary: 'Combinam linguagem verbal e não verbal.',
  blocks: [
    { type: 'paragraph', text: 'Textos multimodais combinam palavras (linguagem verbal) com imagens, gráficos, charges, símbolos (linguagem não verbal). A leitura deve considerar todos os elementos.' },
    { type: 'list', items: ['Charges', 'Histórias em quadrinhos', 'Infográficos', 'Anúncios publicitários'] },
  ],
  tips: [
    'Observe como imagem e texto se complementam ou criam contraste.',
  ],
  glossaryTerms: ['Multimodal', 'Linguagem verbal', 'Linguagem não verbal'],
})

register({
  topic: 'Finalidade dos gêneros',
  subject: 'portugues',
  title: 'Finalidade dos Gêneros Textuais',
  summary: 'Cada gênero tem uma finalidade: informar, convencer, emocionar.',
  blocks: [
    { type: 'list', items: [
      'Notícia: informar',
      'Publicidade: convencer/vender',
      'Poema: emocionar/expressar',
      'Conto: narrar',
      'Receita: instruir',
      'Carta: comunicar',
    ] },
  ],
  tips: [
    'A finalidade guia as escolhas de linguagem do texto.',
  ],
  glossaryTerms: ['Gênero textual', 'Finalidade'],
})

register({
  topic: 'Relações entre partes do texto',
  subject: 'portugues',
  title: 'Relações entre Partes do Texto',
  summary: 'Conectivos e referências ligam as partes do texto.',
  blocks: [
    { type: 'paragraph', text: 'As partes de um texto se relacionam por conectivos, pronomes e progressão temática. Identificar essas relações ajuda a compreender o conjunto.' },
    { type: 'heading', text: 'Conectivos principais' },
    { type: 'list', items: [
      'Adição: e, além disso, também',
      'Oposição: mas, porém, contudo',
      'Causa: porque, pois, já que',
      'Conclusão: portanto, logo, então',
    ] },
  ],
  glossaryTerms: ['Conectivo', 'Coesão', 'Referência'],
})

register({
  topic: 'Repetições e substituições',
  subject: 'portugues',
  title: 'Repetições e Substituições',
  summary: 'Coesão por referência: pronomes e sinônimos evitam repetição.',
  blocks: [
    { type: 'paragraph', text: 'Para evitar repetição, o texto usa pronomes, sinônimos e outras palavras que retomam termos anteriores. Isso se chama coesão por referência.' },
    { type: 'example', text: '"João comprou um livro. Ele o leu em um dia."', solution: '"Ele" retoma João; "o" retoma o livro.' },
  ],
  tips: [
    'Pronomes pessoais, demonstrativos e possessivos são os principais recursos de substituição.',
  ],
  glossaryTerms: ['Coesão', 'Referência', 'Pronome'],
})

register({
  topic: 'Fato x opinião',
  subject: 'portugues',
  title: 'Fato x Opinião',
  summary: 'Fato: verificável e objetivo. Opinião: subjetivo, ponto de vista.',
  blocks: [
    { type: 'list', items: [
      'Fato: pode ser comprovado (ex: "Choveu 50 mm ontem.")',
      'Opinião: ponto de vista (ex: "A chuva foi terrível.")',
    ] },
  ],
  tips: [
    'Palavras como "acho", "penso", "na minha opinião" indicam opinião.',
  ],
  glossaryTerms: ['Fato', 'Opinião'],
})

register({
  topic: 'Tema',
  subject: 'portugues',
  title: 'Tema',
  summary: 'O assunto central do texto.',
  blocks: [
    { type: 'paragraph', text: 'O tema é o assunto central do texto. Para identificá-lo, pergunte-se: "Sobre o que o texto fala principalmente?"' },
    { type: 'example', text: 'Um texto sobre reciclagem e meio ambiente.', solution: 'Tema: sustentabilidade / preservação ambiental.' },
  ],
  tips: [
    'O tema é geral; o tópico é específico.',
  ],
  glossaryTerms: ['Tema', 'Assunto'],
})

register({
  topic: 'Ironia e humor',
  subject: 'portugues',
  title: 'Ironia e Humor',
  summary: 'Ironia: dizer o contrário do que se pensa. Humor: provocar o riso.',
  blocks: [
    { type: 'paragraph', text: 'Ironia é dizer o contrário do que se pensa, geralmente com tom crítico. Humor provoca o riso por meio de situações inesperadas, trocadilhos ou exageros.' },
    { type: 'example', text: '"Que tempo maravilhoso!", disse sob chuva forte.', solution: 'Ironia: o tempo não está maravilhoso.' },
  ],
  glossaryTerms: ['Ironia', 'Humor', 'Sarcasmo'],
})

register({
  topic: 'Vírgula',
  subject: 'portugues',
  title: 'Efeitos de Sentido da Vírgula',
  summary: 'A vírgula marca pausas e separa elementos, criando efeitos de sentido.',
  blocks: [
    { type: 'paragraph', text: 'A vírgula marca pausas e separa elementos do texto, podendo alterar o sentido.' },
    { type: 'heading', text: 'Usos principais' },
    { type: 'list', items: [
      'Separar itens de enumeração',
      'Isolar aposto e vocativo',
      'Marcar deslocamento de termos',
      'Separar orações coordenadas',
    ] },
    { type: 'heading', text: 'Não se usa vírgula' },
    { type: 'list', items: ['Entre sujeito e verbo', 'Entre verbo e objeto'] },
  ],
  tips: [
    'A vírgula pode mudar o sentido: "João, não vá" vs "João não vá".',
  ],
  glossaryTerms: ['Vírgula', 'Aposto', 'Vocativo'],
})

register({
  topic: 'Sinonímia e antonímia',
  subject: 'portugues',
  title: 'Sinonímia e Antonímia',
  summary: 'Sinônimos: sentidos equivalentes. Antônimos: sentidos opostos.',
  blocks: [
    { type: 'paragraph', text: 'Sinônimos são palavras de sentido equivalente (ex: bonito/lindo). Antônimos têm sentidos opostos (ex: quente/frio).' },
    { type: 'example', text: 'Sinônimos de "feliz":', solution: 'contente, alegre, satisfeito.' },
    { type: 'example', text: 'Antônimos de "alto":', solution: 'baixo.' },
  ],
  tips: [
    'Sinônimos evitam repetição; antônimos criam contraste.',
  ],
  glossaryTerms: ['Sinônimo', 'Antônimo'],
})

register({
  topic: 'Sinais de pontuação',
  subject: 'portugues',
  title: 'Outros Sinais de Pontuação',
  summary: 'Dois pontos, ponto e vírgula, travessão, reticências, aspas, parênteses.',
  blocks: [
    { type: 'list', items: [
      'Dois pontos (:): introduz enumeração ou fala',
      'Ponto e vírgula (;): separa itens ou orações longas',
      'Travessão (—): marca fala de personagem',
      'Reticências (...): indica pausa, dúvida ou omissão',
      'Aspas (""): destaca citações ou palavras estrangeiras',
      'Parênteses (): isola informações complementares',
    ] },
  ],
  glossaryTerms: ['Pontuação', 'Reticências', 'Travessão'],
})

register({
  topic: 'Linguagem figurada',
  subject: 'portugues',
  title: 'Linguagem Figurada',
  summary: 'Sentido não literal: metáforas, comparações, personificações.',
  blocks: [
    { type: 'paragraph', text: 'Linguagem figurada usa palavras em sentido não literal, criando imagens e efeitos.' },
    { type: 'list', items: [
      'Metáfora: comparação implícita (ex: "A vida é uma estrada.")',
      'Comparação: usa "como" (ex: "Fortes como um leão.")',
      'Personificação: dá características humanas a coisas (ex: "O vento sussurrou.")',
      'Hipérbole: exagero (ex: "Chorei um mar de lágrimas.")',
    ] },
  ],
  glossaryTerms: ['Metáfora', 'Comparação', 'Personificação', 'Hipérbole'],
})

register({
  topic: 'Classes de palavras',
  subject: 'portugues',
  title: 'Classes de Palavras',
  summary: 'Agrupamento por função: substantivo, adjetivo, verbo, etc.',
  blocks: [
    { type: 'list', items: [
      'Substantivo: nomeia (ex: casa, amor)',
      'Adjetivo: caracteriza (ex: bonito, grande)',
      'Verbo: ação ou estado (ex: correr, ser)',
      'Pronome: substitui nome (ex: ele, meu)',
      'Artigo: define (ex: o, a, um)',
      'Conjunção: liga orações (ex: e, mas)',
      'Preposição: liga termos (ex: de, em)',
      'Numeral: quantidade (ex: dois, primeiro)',
      'Interjeição: emoção (ex: ah!, oh!)',
    ] },
  ],
  glossaryTerms: ['Substantivo', 'Adjetivo', 'Verbo', 'Pronome', 'Conjunção'],
})

register({
  topic: 'Flexão e derivação',
  subject: 'portugues',
  title: 'Flexão e Derivação',
  summary: 'Flexão: altera a forma. Derivação: cria palavra nova.',
  blocks: [
    { type: 'heading', text: 'Flexão' },
    { type: 'list', items: [
      'Gênero: menino / menina',
      'Número: casa / casas',
      'Grau: grande / grandíssimo',
      'Tempo verbal: corro / corri',
    ] },
    { type: 'heading', text: 'Derivação' },
    { type: 'list', items: [
      'Prefixação: infeliz (in + feliz)',
      'Sufixação: felizmente (feliz + mente)',
      'Composição: guarda-chuva (guarda + chuva)',
    ] },
  ],
  glossaryTerms: ['Flexão', 'Derivação', 'Prefixo', 'Sufixo'],
})

register({
  topic: 'Sílaba tônica e tonicidade',
  subject: 'portugues',
  title: 'Sílaba Tônica e Tonicidade',
  summary: 'A sílaba mais forte da palavra. Classificação: oxítona, paroxítona, proparoxítona.',
  blocks: [
    { type: 'paragraph', text: 'Toda palavra tem uma sílaba mais forte, chamada sílaba tônica.' },
    { type: 'list', items: [
      'Oxítona: última sílaba (ex: ca-CAU, SA-bor)',
      'Paroxítona: penúltima sílaba (ex: CA-sa, me-SA)',
      'Proparoxítona: antepenúltima sílaba (ex: SÁ-ra-do, MÚ-si-ca)',
    ] },
  ],
  tips: [
    'A maioria das palavras em português é paroxítona.',
  ],
  glossaryTerms: ['Sílaba tônica', 'Oxítona', 'Paroxítona', 'Proparoxítona'],
})

register({
  topic: 'Verbos: indicativo e subjuntivo',
  subject: 'portugues',
  title: 'Verbos: Indicativo e Subjuntivo',
  summary: 'Indicativo: fatos certos. Subjuntivo: hipóteses, desejos, dúvidas.',
  blocks: [
    { type: 'heading', text: 'Indicativo' },
    { type: 'paragraph', text: 'Expressa fatos, certezas, realidade.' },
    { type: 'example', text: 'Eu estudo todos os dias.', solution: 'Fato certo → indicativo.' },
    { type: 'heading', text: 'Subjuntivo' },
    { type: 'paragraph', text: 'Expressa hipóteses, desejos, dúvidas, possibilidades.' },
    { type: 'example', text: 'Se eu estudasse mais, passaria.', solution: 'Hipótese → subjuntivo.' },
  ],
  tips: [
    'Palavras como "se", "quem sabe", "tomara" costumam introduzir o subjuntivo.',
  ],
  glossaryTerms: ['Verbo', 'Indicativo', 'Subjuntivo'],
})

register({
  topic: 'Pronomes',
  subject: 'portugues',
  title: 'Pronomes Pessoais, Demonstrativos e Possessivos',
  summary: 'Substituem ou acompanham nomes.',
  blocks: [
    { type: 'heading', text: 'Pessoais' },
    { type: 'list', items: ['eu, tu, ele/ela, nós, vós, eles/elas'] },
    { type: 'heading', text: 'Demonstrativos' },
    { type: 'list', items: [
      'este, esta, isto: perto de quem fala',
      'esse, essa, isso: perto de quem ouve',
      'aquele, aquela, aquilo: distante dos dois',
    ] },
    { type: 'heading', text: 'Possessivos' },
    { type: 'list', items: ['meu, teu, seu, nosso, vosso'] },
  ],
  tips: [
    'Este/esta/isto = aqui; esse/essa/isso = aí; aquele/aquela/aquilo = lá.',
  ],
  glossaryTerms: ['Pronome', 'Pronome pessoal', 'Pronome demonstrativo'],
})

register({
  topic: 'Ortografia',
  subject: 'portugues',
  title: 'Ortografia Oficial',
  summary: 'Forma correta de escrever as palavras conforme a norma-padrão.',
  blocks: [
    { type: 'paragraph', text: 'Ortografia é a forma correta de escrever as palavras, conforme a norma-padrão da língua.' },
    { type: 'heading', text: 'Dúvidas comuns' },
    { type: 'list', items: [
      'Usa-se "s": casa, rosa, depois de ditongo (pausa)',
      'Usa-se "z": fazer, azul, depois de ditongo (causa)',
      'Usa-se "ss" entre vogais: passar, essência',
      'Usa-se "ch" e não "x": chave, chuva (mas: flexível, mexer)',
      'h: inicial muda (hoje, hora) ou em dígrafos (ch, lh, nh)',
    ] },
  ],
  tips: [
    'Quando em dúvida, consulte um dicionário confiável.',
  ],
  glossaryTerms: ['Ortografia', 'Norma-padrão'],
})
