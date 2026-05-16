const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Criando papéis e usuário administrador...');

  // 1. Criar Role Admin
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrador Global' }
  });

  const founderRole = await prisma.role.upsert({
    where: { name: 'Founder' },
    update: {},
    create: { name: 'Founder', description: 'Founder de Startup' }
  });

  // 2. Criar Usuário Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@orbita180.com' },
    update: { password_hash: hashedPassword },
    create: {
      email: 'admin@orbita180.com',
      name: 'Administrador Órbita',
      password_hash: hashedPassword,
    }
  });

  // 3. Vincular Role ao Admin
  await prisma.userRole.upsert({
    where: { 
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id
      }
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id
    }
  });

  console.log('✅ Admin criado com sucesso!');
  console.log('📧 Email: admin@orbita180.com');
  console.log('🔑 Senha: admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
