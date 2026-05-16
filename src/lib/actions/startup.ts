'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getMyStartup() {
  try {
    // In a real app, we'd get the user from the session cookie
    // For now, we'll assume the client passes the context or we fetch based on some identifier
    // But since this is a server action, let's just make it return the first startup for the user
    // We'll need the userId. Let's pass it from the component for now or use a mock.
    
    // Better: let's just make it generic and the caller passes what they need
    return { success: true }; 
  } catch (error) {
    return { success: false };
  }
}

export async function getStartupByUserId(userId: string) {
  try {
    const membership = await db.startupMember.findFirst({
      where: { user_id: userId },
      include: { startup: true }
    });
    return { success: true, startup: membership?.startup };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function updateStartupDetails(data: any) {
  try {
    // We'll need the ID. Let's assume the data has it or we fetch it.
    // To make it simple for the onboarding, let's find the startup by the user.
    // But for now, let's just accept the ID in the data.
    const { id, ...details } = data;
    await db.startup.update({
      where: { id },
      data: details
    });
    revalidatePath('/startup');
    revalidatePath('/');
    return { success: true };
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
export async function getAllStartupsDetailed() {
  try {
    return await db.startup.findMany({
      include: {
        institutions: { include: { institution: true } },
        members: { include: { user: true } }
      },
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching all startups:', error)
    return []
  }
}

export async function deleteStartup(id: string) {
  try {
    await db.startup.delete({ where: { id } })
    revalidatePath('/todas-startups')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function updateStartup(id: string, data: any) {
  try {
    await db.startup.update({ where: { id }, data })
    revalidatePath('/todas-startups')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}
