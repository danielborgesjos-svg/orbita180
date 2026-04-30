'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateStartupDetails(id: string, data: {
  vision?: string
  mission?: string
  values?: string
  avg_ticket?: string
  brand_purpose?: string
  target_audience?: string
  [key: string]: any
}) {
  try {
    await db.startup.update({
      where: { id },
      data
    })
    revalidatePath('/startup')
    return { success: true }
  } catch (error) {
    console.error('Error updating startup details:', error)
    return { success: false, error: 'Falha ao atualizar detalhes da startup' }
  }
}

export async function getStartupById(id: string) {
  try {
    return await db.startup.findUnique({
      where: { id },
      include: {
        members: { include: { user: true } },
        contracts: true,
        goals: { include: { actionPlans: true } }
      }
    })
  } catch (error) {
    console.error('Error fetching startup:', error)
    return null
  }
}
