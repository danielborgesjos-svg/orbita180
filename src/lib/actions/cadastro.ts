'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function getStartupsForRegistration() {
  try {
    const startups = await prisma.startup.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true }
    });
    return { success: true, startups };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao carregar startups.' };
  }
}

export async function registerFounder(data: {
  name: string;
  email: string;
  passwordHash: string; // The client should probably not hash, let's just receive plain password and hash here.
  cpf: string;
  startupId: string;
  role: string;
}) {
  try {
    // 1. Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { success: false, error: 'E-mail já está em uso.' };
    }

    // Hash password
    const hashed = await bcrypt.hash(data.passwordHash, 10);

    // 2. Create User
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: hashed,
      }
    });

    // 3. Create Founder with PENDING status
    const program = await prisma.program.findFirst({
      where: { id: 'prog-garage-2026' } // Default to Garage 2026 for now, or find the first active program
    });

    await prisma.founder.create({
      data: {
        user_id: user.id,
        program_id: program?.id || 'prog-garage-2026',
        startup_id: data.startupId,
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        role: data.role,
        status: 'PENDING',
      }
    });

    // Also add as StartupMember but pending or inactive
    await prisma.startupMember.create({
      data: {
        startup_id: data.startupId,
        user_id: user.id,
        role: data.role,
        status: 'PENDING'
      }
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao registrar. Tente novamente mais tarde.' };
  }
}
