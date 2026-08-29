import type { Question } from '../types/exam'

// Questões ORIGINAIS apenas para validar o fluxo inicial.
// Questões históricas devem ser adicionadas somente com fonte oficial rastreável.
export const sampleQuestions: Question[] = [
  {
    id: 'mat-original-001',
    subject: 'matematica',
    topic: 'Porcentagem',
    sourceType: 'original',
    sourceLabel: 'Questão autoral de treinamento',
    statement: 'Uma biblioteca possui 240 livros de aventura. Se 25% deles estão emprestados, quantos livros de aventura permanecem na biblioteca?',
    options: [
      { id: 'A', text: '60' },
      { id: 'B', text: '120' },
      { id: 'C', text: '160' },
      { id: 'D', text: '180' },
      { id: 'E', text: '200' }
    ],
    correctOption: 'D',
    explanation: '25% de 240 = 60. Logo, 240 - 60 = 180 livros permanecem na biblioteca.',
    difficulty: 'facil',
    tags: ['porcentagem', 'subtracao'],
  },
  {
    id: 'port-original-001',
    subject: 'portugues',
    topic: 'Informações implícitas',
    sourceType: 'original',
    sourceLabel: 'Questão autoral de treinamento',
    statement: 'Leia: “Quando Lucas abriu a janela, viu as calçadas molhadas e várias pessoas guardando os guarda-chuvas.” O que é possível inferir?',
    options: [
      { id: 'A', text: 'Estava começando a nevar.' },
      { id: 'B', text: 'Havia chovido pouco antes.' },
      { id: 'C', text: 'As pessoas estavam indo à praia.' },
      { id: 'D', text: 'A rua estava interditada.' },
      { id: 'E', text: 'Era obrigatoriamente noite.' }
    ],
    correctOption: 'B',
    explanation: 'Calçadas molhadas e pessoas guardando guarda-chuvas indicam, pelo contexto, que havia chovido recentemente.',
    difficulty: 'facil',
    tags: ['interpretacao', 'inferencia'],
  }
]
