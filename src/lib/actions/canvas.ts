'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getCanvasData(startupId: string) {
  try {
    const data = await db.canvasData.findUnique({
      where: { startup_id: startupId }
    })
    return data
  } catch (error) {
    console.error('Error fetching canvas data:', error)
    return null
  }
}

export async function saveCanvasData(startupId: string, field: string, value: string) {
  try {
    await db.canvasData.upsert({
      where: { startup_id: startupId },
      create: { startup_id: startupId, [field]: value },
      update: { [field]: value }
    })
    revalidatePath('/estrategia')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error saving canvas data:', error)
    return { success: false }
  }
}

export async function saveCanvasBulk(startupId: string, data: Record<string, string>) {
  try {
    await db.canvasData.upsert({
      where: { startup_id: startupId },
      create: { startup_id: startupId, ...data },
      update: { ...data }
    })
    revalidatePath('/estrategia')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error bulk saving canvas data:', error)
    return { success: false }
  }
}
