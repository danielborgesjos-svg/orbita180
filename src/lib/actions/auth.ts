'use server';

import db from '@/lib/db';
import bcrypt from 'bcryptjs';

const prisma = db;

export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: true } },
        startupMemberships: { include: { startup: true } },
        institutionMemberships: { include: { institution: true } },
        founderProfile: true
      }
    });

    if (!user) return { success: false, error: 'Usuário não encontrado.' };

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return { success: false, error: 'Senha incorreta.' };

    // Check if founder is approved if it's a founder
    if (user.founderProfile && user.founderProfile.status !== 'APPROVED') {
      return { success: false, error: 'Seu cadastro ainda está em análise.' };
    }

    // Determine role (for simplicity, take the first one or default to startup_founder if has membership)
    let role = 'startup_member';
    if (user.roles.some(r => r.role.name === 'Admin')) role = 'admin';
    else if (user.founderProfile) role = 'startup_founder';

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role,
      startupId: user.startupMemberships[0]?.startup_id,
      startupName: user.startupMemberships[0]?.startup?.name,
    };

    return { success: true, user: userData };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro interno no servidor.' };
  }
}
