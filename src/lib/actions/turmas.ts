'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ─── TURMAS ─────────────────────────────────────────────────────────────────

export async function getTurmas() {
  try {
    return await db.turma.findMany({
      include: {
        disciplinas: true,
        enrollments: { include: { startup: true } },
        mentorias: { include: { mentor: { include: { user: true } } } }
      },
      orderBy: { created_at: 'desc' }
    })
  } catch (e) { console.error(e); return [] }
}

export async function getTurmaById(id: string) {
  try {
    return await db.turma.findUnique({
      where: { id },
      include: {
        disciplinas: { orderBy: { order: 'asc' } },
        enrollments: { include: { startup: true } },
        mentorias: { include: { mentor: { include: { user: true } } }, orderBy: { scheduled_at: 'asc' } }
      }
    })
  } catch (e) { console.error(e); return null }
}

export async function createTurma(data: {
  name: string
  description?: string
  start_date?: Date
  end_date?: Date
  status?: string
}) {
  try {
    const turma = await db.turma.create({ data })
    revalidatePath('/admin/turmas')
    return { success: true, turma }
  } catch (e) { console.error(e); return { success: false } }
}

export async function updateTurma(id: string, data: any) {
  try {
    await db.turma.update({ where: { id }, data })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

export async function deleteTurma(id: string) {
  try {
    await db.turma.delete({ where: { id } })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

// ─── DISCIPLINAS ─────────────────────────────────────────────────────────────

export async function createDisciplina(data: {
  turma_id?: string
  name: string
  description?: string
  order?: number
  duration_h?: number
  content_url?: string
  payment_type: string
  price?: number
  is_global?: boolean
  status?: string
  support_material?: string
  mentors_info?: string
}) {
  try {
    const disciplina = await db.turmaDiscip.create({ data: data as any })
    revalidatePath('/admin/turmas')
    return { success: true, disciplina }
  } catch (e) { console.error(e); return { success: false } }
}

export async function getDisciplinaById(id: string) {
  try {
    return await db.turmaDiscip.findUnique({
      where: { id },
      include: {
        turma: true,
        enrollments: { include: { startup: true } }
      }
    })
  } catch (e) { console.error(e); return null }
}

export async function updateDisciplina(id: string, data: any) {
  try {
    await db.turmaDiscip.update({ where: { id }, data })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

export async function deleteDisciplina(id: string) {
  try {
    await db.turmaDiscip.delete({ where: { id } })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

// ─── MATRÍCULAS ──────────────────────────────────────────────────────────────

export async function enrollStartup(turma_id: string, startup_id: string, payment_status = 'FREE') {
  try {
    const existing = await db.turmaEnrollment.findFirst({ where: { turma_id, startup_id } })
    if (existing) return { success: false, error: 'Startup já matriculada nesta turma.' }
    const enrollment = await db.turmaEnrollment.create({
      data: { turma_id, startup_id, payment_status }
    })
    revalidatePath('/admin/turmas')
    return { success: true, enrollment }
  } catch (e) { console.error(e); return { success: false } }
}

export async function updateEnrollmentStatus(id: string, status: string) {
  try {
    await db.turmaEnrollment.update({ where: { id }, data: { status } })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

export async function issueDiploma(enrollmentId: string) {
  try {
    await db.turmaEnrollment.update({
      where: { id: enrollmentId },
      data: { diploma_issued: true, completed_at: new Date(), status: 'COMPLETED' }
    })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

// ─── MENTORIAS ───────────────────────────────────────────────────────────────

export async function createMentoria(data: {
  turma_id: string
  mentor_id: string
  scheduled_at: Date
  duration_min?: number
  topic?: string
  meet_url?: string
}) {
  try {
    const mentoria = await db.mentoriaTurma.create({ data })
    revalidatePath('/admin/turmas')
    return { success: true, mentoria }
  } catch (e) { console.error(e); return { success: false } }
}

export async function getMentores() {
  try {
    return await db.mentor.findMany({ include: { user: true } })
  } catch (e) { console.error(e); return [] }
}

export async function getAllStartups() {
  try {
    return await db.startup.findMany({ orderBy: { name: 'asc' } })
  } catch (e) { console.error(e); return [] }
}
