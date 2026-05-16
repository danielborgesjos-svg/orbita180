'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

const prisma = db;

export async function getPendingFounders() {
  try {
    const founders = await prisma.founder.findMany({
      where: { status: 'PENDING' },
      include: {
        program: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    
    // get startup names for mapping
    const startups = await prisma.startup.findMany({ select: { id: true, name: true }});
    const map: Record<string, string> = {};
    startups.forEach(s => map[s.id] = s.name);
    
    return { success: true, founders: founders.map(f => ({ ...f, startupName: f.startup_id ? map[f.startup_id] : 'Sem Startup' })) };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao buscar founders pendentes.' };
  }
}

export async function approveFounder(founderId: string, adminId?: string) {
  try {
    const founder = await prisma.founder.update({
      where: { id: founderId },
      data: { status: 'APPROVED' }
    });

    if (founder.user_id && founder.startup_id) {
      // 1. Approve startup member
      await prisma.startupMember.updateMany({
        where: { user_id: founder.user_id, startup_id: founder.startup_id },
        data: { status: 'ACTIVE' }
      });

      // 2. Add Role
      const role = await prisma.role.findUnique({ where: { name: 'Founder' } });
      if (role) {
        await prisma.userRole.upsert({
          where: { 
            user_id_role_id: {
              user_id: founder.user_id,
              role_id: role.id
            }
          },
          update: {},
          create: {
            user_id: founder.user_id,
            role_id: role.id
          }
        });
      }

      // 3. Log Activity
      if (adminId) {
        await prisma.activityLog.create({
          data: {
            user_id: adminId,
            action: 'APPROVE_FOUNDER',
            entity_type: 'FOUNDER',
            entity_id: founderId,
            details: `Aprovado founder ${founder.name} (${founder.email})`
          }
        });
      }
    }
    
    revalidatePath('/admin/founders');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao aprovar.' };
  }
}

export async function rejectFounder(founderId: string) {
  try {
    const founder = await prisma.founder.update({
      where: { id: founderId },
      data: { status: 'REJECTED' }
    });

    if (founder.user_id && founder.startup_id) {
      // Reject startup member
      await prisma.startupMember.updateMany({
        where: { user_id: founder.user_id, startup_id: founder.startup_id },
        data: { status: 'REJECTED' }
      });
    }

    revalidatePath('/admin/founders');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao rejeitar.' };
  }
}

export async function getActivityLogs() {
  try {
    const logs = await prisma.activityLog.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
      take: 50
    });
    return { success: true, logs };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
