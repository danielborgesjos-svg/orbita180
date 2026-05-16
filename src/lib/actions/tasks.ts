'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getTasks(startupId: string) {
  try {
    return await db.task.findMany({
      where: { startup_id: startupId },
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export async function createTask(data: {
  startup_id: string
  title: string
  description?: string
  due_date?: Date
  status?: string
  order?: number
}) {
  try {
    const task = await db.task.create({
      data
    })
    revalidatePath('/kanban')
    return { success: true, task }
  } catch (error) {
    console.error('Error creating task:', error)
    return { success: false, error: 'Falha ao criar tarefa' }
  }
}

export async function updateTask(id: string, data: any) {
  try {
    await db.task.update({
      where: { id },
      data
    })
    revalidatePath('/kanban')
    return { success: true }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: 'Falha ao atualizar tarefa' }
  }
}

export async function moveTask(id: string, newStatus: string, newOrder: number) {
  try {
    await db.task.update({
      where: { id },
      data: {
        status: newStatus,
        order: newOrder
      }
    })
    revalidatePath('/kanban')
    return { success: true }
  } catch (error) {
    console.error('Error moving task:', error)
    return { success: false, error: 'Falha ao mover tarefa' }
  }
}

export async function deleteTask(id: string) {
  try {
    await db.task.delete({
      where: { id }
    })
    revalidatePath('/kanban')
    return { success: true }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: 'Falha ao excluir tarefa' }
  }
}
