'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ─── FORMS / QUESTIONNAIRES ──────────────────────────────────────────────────

export async function getFormTemplates() {
  try {
    return await db.formTemplate.findMany({
      include: { fields: { orderBy: { order: 'asc' } } },
      orderBy: { created_at: 'desc' }
    })
  } catch (e) { console.error(e); return [] }
}

export async function createFormTemplate(data: { title: string, description?: string, type?: string }) {
  try {
    const tpl = await db.formTemplate.create({ data })
    revalidatePath('/admin/forms')
    return { success: true, template: tpl }
  } catch (e) { console.error(e); return { success: false } }
}

export async function addFormField(data: { template_id: string, label: string, type: string, options?: string, required?: boolean, order?: number }) {
  try {
    const f = await db.formField.create({ data })
    revalidatePath('/admin/forms')
    return { success: true, field: f }
  } catch (e) { console.error(e); return { success: false } }
}

// ─── GRADES & ENROLLMENT ─────────────────────────────────────────────────────

export async function updateDisciplinaEnrollment(id: string, data: { grade?: number, attendance?: number, status?: string, payment_status?: string }) {
  try {
    await db.disciplinaEnrollment.update({
      where: { id },
      data: data as any
    })
    revalidatePath('/admin/turmas')
    return { success: true }
  } catch (e) { console.error(e); return { success: false } }
}

export async function getGlobalDisciplinas() {
  try {
    return await db.turmaDiscip.findMany({
      where: { is_global: true },
      include: { enrollments: { include: { startup: true } } }
    })
  } catch (e) { console.error(e); return [] }
}
