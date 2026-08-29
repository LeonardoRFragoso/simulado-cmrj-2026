import type { Subject } from '../types/exam'
import { topicsBySubject } from '../data/edital-2026'
import { topicMastery } from '../stores/progress'

export interface StudyDay {
  dayNumber: number
  date: string
  subject: Subject
  topic: string
  topicLabel: string
  /** minutos estimados para estudar o tópico */
  estimatedMinutes: number
  /** status da atividade */
  status: 'pendente' | 'em-progresso' | 'concluido'
}

export interface StudyPlan {
  config: { minutesPerDay: number; startedAt: string }
  days: StudyDay[]
  totalDays: number
  totalTopics: number
}

/**
 * Gera um plano de estudos distribuindo todos os tópicos do edital
 * ao longo de dias, baseado em minutos por dia.
 *
 * Estimativa: ~3 minutos por questão de treino + 10 minutos de aula.
 * Tópicos com menor domínio são priorizados primeiro.
 */
export function generateStudyPlan(minutesPerDay: 15 | 30 | 45 | 60, startedAt: string): StudyPlan {
  const allTopics = [
    ...topicsBySubject('matematica').map((t) => ({ ...t, subject: 'matematica' as Subject })),
    ...topicsBySubject('portugues').map((t) => ({ ...t, subject: 'portugues' as Subject })),
  ]

  // Ordena por domínio (menos dominados primeiro)
  const withMastery = allTopics.map((t) => {
    const m = topicMastery(t.subject, t.topic)
    const priority = m.answered === 0 ? 0 : m.status === 'precisa-revisar' ? 1 : m.status === 'comecando' ? 2 : m.status === 'em-progresso' ? 3 : 4
    return { ...t, priority, mastery: m }
  })
  withMastery.sort((a, b) => a.priority - b.priority)

  // Estimativa de minutos por tópico: aula (10 min) + questões (3 min cada, ~5 questões)
  const minutesPerTopic = 10 + 5 * 3 // ~25 min por tópico

  const topicsPerDay = Math.max(1, Math.floor(minutesPerDay / minutesPerTopic))
  const days: StudyDay[] = []
  const startDate = new Date(startedAt)

  for (let i = 0; i < withMastery.length; i += topicsPerDay) {
    const dayNumber = Math.floor(i / topicsPerDay) + 1
    const date = new Date(startDate)
    date.setDate(date.getDate() + dayNumber - 1)
    const batch = withMastery.slice(i, i + topicsPerDay)
    for (const t of batch) {
      days.push({
        dayNumber,
        date: date.toISOString().slice(0, 10),
        subject: t.subject,
        topic: t.topic,
        topicLabel: t.label,
        estimatedMinutes: minutesPerTopic,
        status: t.mastery.status === 'dominado' ? 'concluido' : 'pendente',
      })
    }
  }

  return {
    config: { minutesPerDay, startedAt },
    days,
    totalDays: days[days.length - 1]?.dayNumber ?? 0,
    totalTopics: allTopics.length,
  }
}
