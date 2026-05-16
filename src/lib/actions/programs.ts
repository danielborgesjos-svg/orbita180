'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ── DASHBOARD COMPLETO DO PROGRAMA ───────────────────────────────────
export async function getProgramDashboard(programId: string) {
  try {
    const program = await db.program.findUnique({
      where: { id: programId },
      include: {
        institution: true,
        startups: {
          include: {
            startup: true
          }
        },
        founders: true
      }
    })
    if (!program) return null

    const startupIds = program.startups.map(s => s.startup_id)

    const [maturityAssessments, engagements, achievements, mentorshipSessions] = await Promise.all([
      db.maturityAssessment.findMany({ where: { program_id: programId } }),
      db.startupEngagement.findMany({ where: { startup_id: { in: startupIds } } }),
      db.startupAchievement.findMany({ where: { startup_id: { in: startupIds } } }),
      db.mentorshipSession.findMany({ where: { program_id: programId } }),
    ])

    // ── Nível de maturidade
    const levelA = maturityAssessments.filter(m => m.maturity_level === 'A').length
    const levelB = maturityAssessments.filter(m => m.maturity_level === 'B').length
    const levelC = maturityAssessments.filter(m => m.maturity_level === 'C').length

    // ── Alcance territorial
    const territory = {
      PARANA: maturityAssessments.filter(m => m.territory_reach === 'PARANA').length,
      BRASIL: maturityAssessments.filter(m => m.territory_reach === 'BRASIL').length,
      INTERNACIONAL: maturityAssessments.filter(m => m.territory_reach === 'INTERNACIONAL').length,
    }

    // ── Status
    const active = program.startups.filter(s => s.startup.status === 'ACTIVE').length
    const inactive = program.startups.filter(s => s.startup.status !== 'ACTIVE').length
    const invested = maturityAssessments.filter(m => m.received_investment).length

    // ── Segmentação
    const segmentMap: Record<string, number> = {}
    for (const sp of program.startups) {
      const seg = sp.startup.segment || 'Outros'
      segmentMap[seg] = (segmentMap[seg] || 0) + 1
    }

    // ── Engajamento médio
    const avgEngagement = engagements.length > 0
      ? Math.round(engagements.reduce((sum, e) => sum + (e.engagement_score || 0), 0) / engagements.length)
      : 0

    // ── Total horas mentoria/capacitação
    const totalMentoringHours = mentorshipSessions.reduce((s, m) => s + m.mentoring_hours, 0)
    const totalTrainingHours = mentorshipSessions.reduce((s, m) => s + m.training_hours, 0)

    return {
      program,
      stats: {
        total: program.startups.length,
        levelA, levelB, levelC,
        territory,
        active, inactive, invested,
        segmentMap,
        avgEngagement,
        totalMentoringHours,
        totalTrainingHours,
        totalFounders: program.founders.length,
        totalAchievements: achievements.length,
      },
      startups: program.startups.map(sp => {
        const startup = sp.startup
        const maturity = maturityAssessments.find(m => m.startup_id === startup.id)
        const engagement = engagements.find(e => e.startup_id === startup.id)
        const ach = achievements.filter(a => a.startup_id === startup.id)
        const session = mentorshipSessions.find(s => s.startup_id === startup.id)
        const founders = program.founders.filter(f => f.startup_id === startup.id)
        return { startup, maturity, engagement, achievements: ach, session, founders }
      }),
      founders: program.founders,
      mentorshipSessions,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

// ── GET PROGRAM + BASIC INFO ─────────────────────────────────────────
export async function getProgramById(programId: string) {
  try {
    return await db.program.findUnique({
      where: { id: programId },
      include: {
        institution: true,
        _count: { select: { startups: true, founders: true } }
      }
    })
  } catch (e) {
    console.error(e)
    return null
  }
}

// ── GET ALL PROGRAMS BY INSTITUTION ─────────────────────────────────
export async function getProgramsByInstitution(institutionId: string) {
  try {
    return await db.program.findMany({
      where: { institution_id: institutionId },
      include: {
        _count: { select: { startups: true, founders: true } }
      },
      orderBy: { start_date: 'desc' }
    })
  } catch (e) {
    console.error(e)
    return []
  }
}

// ── CREATE MENTORSHIP SESSION ────────────────────────────────────────
export async function createMentorshipSession(data: {
  startup_id: string
  program_id?: string
  mentor_name: string
  other_mentors?: string[]
  conciliators?: string[]
  trainer_name?: string
  mentoring_hours: number
  training_hours: number
  topics?: string[]
  mentor_feedback?: string
  startup_mentor_feedback?: string
  startup_program_feedback?: string
  main_needs?: string
  curations?: string
  session_date?: Date
}) {
  try {
    const session = await db.mentorshipSession.create({
      data: {
        ...data,
        other_mentors: data.other_mentors ? JSON.stringify(data.other_mentors) : null,
        conciliators: data.conciliators ? JSON.stringify(data.conciliators) : null,
        topics: data.topics ? JSON.stringify(data.topics) : null,
      }
    })
    revalidatePath('/programas')
    return { success: true, session }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Falha ao salvar sessão de mentoria.' }
  }
}

// ── UPSERT MATURITY ASSESSMENT ───────────────────────────────────────
export async function upsertMaturityAssessment(startupId: string, programId: string, data: {
  deliveries_score?: number
  engagement_score?: number
  has_cnpj?: boolean
  employees_count?: number
  active_contracts?: number
  sales_made?: boolean
  negotiation_capacity?: number
  evolution_score?: number
  maturity_level?: string
  territory_reach?: string
  received_investment?: boolean
  investment_amount?: number
  key_achievements?: string[]
}) {
  try {
    const existing = await db.maturityAssessment.findFirst({ where: { startup_id: startupId, program_id: programId } })
    const payload = {
      ...data,
      key_achievements: data.key_achievements ? JSON.stringify(data.key_achievements) : undefined,
    }
    if (existing) {
      await db.maturityAssessment.update({ where: { id: existing.id }, data: payload })
    } else {
      await db.maturityAssessment.create({ data: { startup_id: startupId, program_id: programId, ...payload } })
    }
    revalidatePath('/programas')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false }
  }
}

// ── ADD ACHIEVEMENT ──────────────────────────────────────────────────
export async function addStartupAchievement(data: {
  startup_id: string
  type: string
  title: string
  description?: string
  date?: Date
  link?: string
}) {
  try {
    const ach = await db.startupAchievement.create({ data })
    revalidatePath('/programas')
    return { success: true, ach }
  } catch (e) {
    console.error(e)
    return { success: false }
  }
}
