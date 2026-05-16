const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  // Delete all records in dependent tables first to avoid foreign key constraints
  await prisma.canvasData.deleteMany();
  await prisma.actionPlan.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.financialTransaction.deleteMany();
  await prisma.task.deleteMany();
  await prisma.startupJourneyProgress.deleteMany();
  await prisma.startupProgram.deleteMany();
  await prisma.startupInstitution.deleteMany();
  await prisma.startupMember.deleteMany();
  await prisma.mentoriaTurma.deleteMany();
  await prisma.disciplinaEnrollment.deleteMany();
  await prisma.turmaEnrollment.deleteMany();
  await prisma.turmaDiscip.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.mentorStartup.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating Admin User...');
  const admin = await prisma.user.create({
    data: {
      id: 'admin-1',
      email: 'admin@orbita180.com',
      name: 'Admin Global',
      password_hash: 'hash_here',
    }
  });

  console.log('Creating Mentor User...');
  const mentorUser = await prisma.user.create({
    data: {
      id: 'user-mentor-1',
      email: 'mentor@orbita180.com',
      name: 'Mentor Especialista',
      password_hash: 'hash_here',
    }
  });

  const mentor = await prisma.mentor.create({
    data: {
      id: 'mentor-1',
      user_id: mentorUser.id,
      expertise: 'Growth & Strategy',
      bio: 'Especialista em alavancagem de startups B2B'
    }
  });

  console.log('Creating Startup User and Startup...');
  const startupUser = await prisma.user.create({
    data: {
      id: 'user-startup-1',
      email: 'founder@startup.com',
      name: 'Startup Founder',
      password_hash: 'hash_here',
    }
  });

  const startup = await prisma.startup.create({
    data: {
      id: 'startup-123',
      name: 'TechInova Solutions',
      segment: 'EdTech',
      status: 'ACTIVE',
      stage: 'Seed',
      city: 'Curitiba',
      state: 'PR'
    }
  });

  console.log('Creating Example Disciplines...');
  const disc = await prisma.turmaDiscip.create({
    data: {
      id: 'disc-example-1',
      name: 'Modelagem de Negócios B2B',
      description: 'Aprenda a estruturar processos de vendas e modelagem financeira para o mercado corporativo.',
      duration_h: 24,
      is_global: true,
      status: 'ACTIVE',
      payment_type: 'BOLETO',
      price: 199.90,
      support_material: 'https://docs.google.com/presentation/d/example',
      mentors_info: 'Ricardo Santos (Strategy), Ana Clara (Financial Modeling)'
    }
  });

  await prisma.disciplinaEnrollment.create({
    data: {
      disciplina_id: disc.id,
      startup_id: startup.id,
      payment_status: 'PENDING',
      grade: 8.5,
      attendance: 90
    }
  });

  console.log('Database seeded with 1 Admin, 1 Mentor, 1 Startup and 1 Global Discipline.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
