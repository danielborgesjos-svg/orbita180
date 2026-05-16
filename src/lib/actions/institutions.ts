'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getInstitutions() {
  try {
    return await db.institution.findMany({
      include: {
        _count: {
          select: { startups: true, programs: true }
        }
      },
      orderBy: { created_at: 'desc' }
    })
  } catch (e) {
    console.error(e);
    return []
  }
}

export async function createInstitution(data: {
  name: string
  description?: string
  logo?: string
  status?: string
}) {
  try {
    const institution = await db.institution.create({
      data: {
        ...data,
        status: data.status || 'ACTIVE'
      }
    })
    revalidatePath('/instituicoes')
    return { success: true, institution }
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Falha ao criar instituição.' }
  }
}

export async function deleteInstitution(id: string) {
  try {
    await db.institution.delete({ where: { id } })
    revalidatePath('/instituicoes')
    return { success: true }
  } catch (e) {
    console.error(e);
    return { success: false }
  }
}
