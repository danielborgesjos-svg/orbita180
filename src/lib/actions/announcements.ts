'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getAnnouncements() {
  try {
    return await db.announcement.findMany({
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
}

export async function createAnnouncement(data: {
  title: string
  description: string
  type: string
  start_date?: Date
  end_date?: Date
  link?: string
}) {
  try {
    await db.announcement.create({
      data
    })
    revalidatePath('/eventos')
    return { success: true }
  } catch (error) {
    console.error('Error creating announcement:', error)
    return { success: false }
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await db.announcement.delete({ where: { id } })
    revalidatePath('/eventos')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
