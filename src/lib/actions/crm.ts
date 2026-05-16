'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

const prisma = db;

export async function getLeads(startupId: string) {
  try {
    const leads = await prisma.lead.findMany({
      where: { startup_id: startupId },
      orderBy: { created_at: 'desc' }
    });
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

export async function createLead(data: any) {
  try {
    const lead = await prisma.lead.create({
      data
    });
    return { success: true, lead };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, error: 'Falha ao criar lead.' };
  }
}

export async function updateLead(id: string, data: any) {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data
    });
    return { success: true, lead };
  } catch (error) {
    console.error('Error updating lead:', error);
    return { success: false, error: 'Falha ao atualizar lead.' };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, error: 'Falha ao deletar lead.' };
  }
}
