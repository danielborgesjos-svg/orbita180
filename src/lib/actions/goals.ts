'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getGoals(startupId: string) {
  try {
    return await db.goal.findMany({
      where: { startup_id: startupId },
      include: { actionPlans: { include: { responsible: true } } },
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return []
  }
}

export async function createGoal(data: {
  startup_id: string
  title: string
  description?: string
  target_date?: Date
}) {
  try {
    const goal = await db.goal.create({
      data
    })
    revalidatePath('/metas')
    return { success: true, goal }
  } catch (error) {
    console.error('Error creating goal:', error)
    return { success: false, error: 'Falha ao criar meta' }
  }
}

export async function createActionPlan(data: {
  goal_id: string
  description: string
  responsible_id: string
  due_date?: Date
}) {
  try {
    const plan = await db.actionPlan.create({
      data
    })
    revalidatePath('/metas')
    return { success: true, plan }
  } catch (error) {
    console.error('Error creating action plan:', error)
    return { success: false, error: 'Falha ao criar plano de ação' }
  }
}

export async function updateGoal(id: string, data: any) {
  try {
    await db.goal.update({
      where: { id },
      data
    })
    revalidatePath('/metas')
    return { success: true }
  } catch (error) {
    console.error('Error updating goal:', error)
    return { success: false, error: 'Falha ao atualizar meta' }
  }
}

export async function deleteGoal(id: string) {
  try {
    await db.goal.delete({
      where: { id }
    })
    revalidatePath('/metas')
    return { success: true }
  } catch (error) {
    console.error('Error deleting goal:', error)
    return { success: false, error: 'Falha ao excluir meta' }
  }
}
