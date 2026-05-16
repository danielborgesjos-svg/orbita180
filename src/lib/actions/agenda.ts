'use server';

import db from '@/lib/db';

const prisma = db;

export async function getAgendaEvents(startupId: string) {
  try {
    const events = await prisma.agendaEvent.findMany({
      where: { startup_id: startupId },
      orderBy: { start_time: 'asc' }
    });
    return events;
  } catch (error) {
    console.error('Error fetching agenda events:', error);
    return [];
  }
}

export async function createAgendaEvent(data: any) {
  try {
    const event = await prisma.agendaEvent.create({
      data
    });
    return { success: true, event };
  } catch (error) {
    console.error('Error creating agenda event:', error);
    return { success: false, error: 'Falha ao criar evento.' };
  }
}

export async function updateAgendaEvent(id: string, data: any) {
  try {
    const event = await prisma.agendaEvent.update({
      where: { id },
      data
    });
    return { success: true, event };
  } catch (error) {
    console.error('Error updating agenda event:', error);
    return { success: false, error: 'Falha ao atualizar evento.' };
  }
}

export async function deleteAgendaEvent(id: string) {
  try {
    await prisma.agendaEvent.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting agenda event:', error);
    return { success: false, error: 'Falha ao deletar evento.' };
  }
}
