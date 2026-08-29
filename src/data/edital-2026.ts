import type { ExamRules, Subject } from '../types/exam'

export const examRules: ExamRules = {
  edition: 'Processo Seletivo 2026/2027',
  admissionYear: 2027,
  examDate: '2026-10-18',
  totalMinutes: 270,
  mathQuestions: 20,
  portugueseQuestions: 20,
  minimumScorePerObjective: 5,
  essayMinLines: 15,
  essayMaxLines: 30,
  essayMinimumDescriptorPercentage: 50,
}

export interface TopicNode {
  /** chave canônica usada nas questões (topic) */
  topic: string
  /** rótulo exibido ao usuário */
  label: string
  /** área do edital */
  area: string
  subtopics?: string[]
}

export const mathTopics: TopicNode[] = [
  {
    topic: 'Sistema de numeração indo-arábico',
    label: 'Sistema de numeração indo-arábico',
    area: 'Números e Operações',
    subtopics: ['Leitura de números', 'Valor posicional'],
  },
  {
    topic: 'Classes e ordens',
    label: 'Classes e ordens',
    area: 'Números e Operações',
    subtopics: ['Classes', 'Ordens'],
  },
  {
    topic: 'Adição',
    label: 'Adição',
    area: 'Números e Operações',
  },
  {
    topic: 'Subtração',
    label: 'Subtração',
    area: 'Números e Operações',
  },
  {
    topic: 'Multiplicação',
    label: 'Multiplicação',
    area: 'Números e Operações',
  },
  {
    topic: 'Divisão',
    label: 'Divisão',
    area: 'Números e Operações',
  },
  {
    topic: 'Expressões numéricas',
    label: 'Expressões numéricas',
    area: 'Números e Operações',
  },
  {
    topic: 'Múltiplos e divisores',
    label: 'Múltiplos e divisores',
    area: 'Números e Operações',
  },
  {
    topic: 'MMC e MDC',
    label: 'MMC e MDC',
    area: 'Números e Operações',
  },
  {
    topic: 'Frações',
    label: 'Frações',
    area: 'Números e Operações',
    subtopics: ['Leitura', 'Partes de um todo'],
  },
  {
    topic: 'Números decimais',
    label: 'Números decimais',
    area: 'Números e Operações',
  },
  {
    topic: 'Frações equivalentes',
    label: 'Frações equivalentes',
    area: 'Números e Operações',
  },
  {
    topic: 'Relação fração e decimal',
    label: 'Relação fração/decimal',
    area: 'Números e Operações',
  },
  {
    topic: 'Operações com frações',
    label: 'Operações com frações',
    area: 'Números e Operações',
  },
  {
    topic: 'Operações com decimais',
    label: 'Operações com decimais',
    area: 'Números e Operações',
  },
  {
    topic: 'Porcentagem',
    label: 'Porcentagem',
    area: 'Números e Operações',
  },
  {
    topic: 'Sistema de numeração romano',
    label: 'Sistema de numeração romano',
    area: 'Números e Operações',
  },
  {
    topic: 'Figuras geométricas',
    label: 'Figuras geométricas e elementos',
    area: 'Espaço e Forma',
  },
  {
    topic: 'Polígonos',
    label: 'Polígonos',
    area: 'Espaço e Forma',
  },
  {
    topic: 'Perímetro e área',
    label: 'Perímetro e área',
    area: 'Espaço e Forma',
  },
  {
    topic: 'Sólidos geométricos',
    label: 'Sólidos geométricos e planificações',
    area: 'Espaço e Forma',
  },
  {
    topic: 'Vistas tridimensionais',
    label: 'Vistas tridimensionais',
    area: 'Espaço e Forma',
  },
  {
    topic: 'Volume de paralelepípedos',
    label: 'Volume de paralelepípedos',
    area: 'Espaço e Forma',
  },
  {
    topic: 'Grandezas e medidas',
    label: 'Grandezas e medidas',
    area: 'Grandezas e Medidas',
    subtopics: ['Comprimento', 'Superfície', 'Capacidade', 'Massa', 'Tempo'],
  },
  {
    topic: 'Transformação de unidades',
    label: 'Transformação de unidades',
    area: 'Grandezas e Medidas',
  },
  {
    topic: 'Sistema monetário brasileiro',
    label: 'Sistema monetário brasileiro',
    area: 'Grandezas e Medidas',
  },
  {
    topic: 'Tratamento da informação',
    label: 'Tabelas e gráficos',
    area: 'Tratamento da Informação',
    subtopics: ['Tabelas', 'Gráficos', 'Interpretação de dados', 'Organização de dados'],
  },
  {
    topic: 'Média aritmética',
    label: 'Média aritmética',
    area: 'Tratamento da Informação',
  },
  {
    topic: 'Probabilidade',
    label: 'Probabilidade',
    area: 'Tratamento da Informação',
  },
]

export const portugueseTopics: TopicNode[] = [
  { topic: 'Informações explícitas', label: 'Informações explícitas', area: 'Compreensão textual' },
  { topic: 'Inferência de palavras', label: 'Inferência do significado de palavras', area: 'Compreensão textual' },
  { topic: 'Inferência de expressões', label: 'Inferência de expressões', area: 'Compreensão textual' },
  { topic: 'Informações implícitas', label: 'Informações implícitas', area: 'Compreensão textual' },
  { topic: 'Narrador', label: 'Narrador', area: 'Compreensão textual' },
  { topic: 'Foco narrativo', label: 'Foco narrativo', area: 'Compreensão textual' },
  { topic: 'Personagens', label: 'Personagens', area: 'Compreensão textual' },
  { topic: 'Enredo', label: 'Enredo', area: 'Compreensão textual' },
  { topic: 'Tempo e espaço', label: 'Tempo e espaço', area: 'Compreensão textual' },
  { topic: 'Textos multimodais', label: 'Textos multimodais', area: 'Compreensão textual' },
  { topic: 'Finalidade dos gêneros', label: 'Finalidade dos gêneros', area: 'Compreensão textual' },
  { topic: 'Relações entre partes do texto', label: 'Relações entre partes do texto', area: 'Compreensão textual' },
  { topic: 'Repetições e substituições', label: 'Repetições e substituições', area: 'Compreensão textual' },
  { topic: 'Fato x opinião', label: 'Fato x opinião', area: 'Compreensão textual' },
  { topic: 'Tema', label: 'Tema', area: 'Compreensão textual' },
  { topic: 'Ironia e humor', label: 'Ironia e humor', area: 'Análise linguística' },
  { topic: 'Vírgula', label: 'Efeitos de sentido da vírgula', area: 'Análise linguística' },
  { topic: 'Sinonímia e antonímia', label: 'Sinonímia e antonímia', area: 'Análise linguística' },
  { topic: 'Sinais de pontuação', label: 'Outros sinais de pontuação', area: 'Análise linguística' },
  { topic: 'Linguagem figurada', label: 'Linguagem figurada', area: 'Análise linguística' },
  { topic: 'Classes de palavras', label: 'Classes de palavras', area: 'Análise linguística' },
  { topic: 'Flexão e derivação', label: 'Flexão e derivação', area: 'Análise linguística' },
  { topic: 'Sílaba tônica e tonicidade', label: 'Sílaba tônica e tonicidade', area: 'Análise linguística' },
  { topic: 'Verbos: indicativo e subjuntivo', label: 'Verbos: indicativo e subjuntivo', area: 'Análise linguística' },
  { topic: 'Pronomes', label: 'Pronomes pessoais, demonstrativos e possessivos', area: 'Análise linguística' },
  { topic: 'Ortografia', label: 'Ortografia oficial', area: 'Análise linguística' },
]

export const essayCompetencies = [
  'Modalidade escrita',
  'Tipo de texto narrativo',
  'Atendimento ao tema',
  'Coerência',
  'Coesão',
]

/** Descritores da redação usados para o critério de APTO (>=50%). */
export const essayDescriptors = [
  'Texto narrativo com situação inicial, desenvolvimento e desfecho',
  'Atendimento ao tema proposto',
  'Coerência entre as partes do texto',
  'Uso adequado de coesão (conectivos e referências)',
  'Modalidade escrita adequada (norma-padrão)',
]

export const officialReferences = [
  {
    label: 'Edital nº 1, de 31 de julho de 2026 — Processo Seletivo 2026/2027 aos Colégios Militares',
    url: 'https://www.in.gov.br/web/dou/-/edital-n-1-de-31-de-julho-de-2026-722685770',
  },
  {
    label: 'Colégio Militar do Rio de Janeiro',
    url: 'https://cmrj.eb.mil.br',
  },
]

export function topicsBySubject(subject: Subject): TopicNode[] {
  return subject === 'matematica' ? mathTopics : portugueseTopics
}
