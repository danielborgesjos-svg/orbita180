'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ── GET ALL FOUNDERS BY PROGRAM ───────────────────────────────────────
export async function getFoundersByProgram(programId: string) {
  try {
    return await db.founder.findMany({
      where: { program_id: programId },
      orderBy: { created_at: 'desc' }
    })
  } catch (e) {
    console.error(e)
    return []
  }
}

// ── GET FOUNDERS BY STARTUP ──────────────────────────────────────────
export async function getFoundersByStartup(startupId: string) {
  try {
    return await db.founder.findMany({
      where: { startup_id: startupId },
      orderBy: { created_at: 'desc' }
    })
  } catch (e) {
    console.error(e)
    return []
  }
}

// ── CREATE FOUNDER ────────────────────────────────────────────────────
export async function createFounder(data: {
  program_id: string
  startup_id?: string
  name: string
  email?: string
  phone?: string
  cpf?: string
  photo_url?: string
  role?: string
  bio?: string
  linkedin?: string
  instagram?: string
  coachability?: number
  execution_speed?: number
  resilience?: number
  leadership?: number
  personality_type?: string
  notes?: string
}) {
  try {
    const founder = await db.founder.create({ data })
    revalidatePath('/programas')
    return { success: true, founder }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Falha ao cadastrar founder.' }
  }
}

// ── UPDATE FOUNDER ────────────────────────────────────────────────────
export async function updateFounder(id: string, data: Partial<{
  name: string
  email: string
  phone: string
  role: string
  bio: string
  linkedin: string
  instagram: string
  coachability: number
  execution_speed: number
  resilience: number
  leadership: number
  personality_type: string
  notes: string
}>) {
  try {
    const founder = await db.founder.update({ where: { id }, data })
    revalidatePath('/programas')
    return { success: true, founder }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Falha ao atualizar founder.' }
  }
}

// ── DELETE FOUNDER ────────────────────────────────────────────────────
export async function deleteFounder(id: string) {
  try {
    await db.founder.delete({ where: { id } })
    revalidatePath('/programas')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false }
  }
}
