const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDB() {
  console.log('🧹 Limpando banco de dados (Reset total)...');
  
  // Ordem reversa de dependência
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.founder.deleteMany();
  await prisma.startupEngagement.deleteMany();
  await prisma.startupAchievement.deleteMany();
  await prisma.mentorshipSession.deleteMany();
  await prisma.maturityAssessment.deleteMany();
  await prisma.canvasData.deleteMany();
  await prisma.actionPlan.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.financialTransaction.deleteMany();
  await prisma.task.deleteMany();
  await prisma.startupJourneyProgress.deleteMany();
  await prisma.disciplinaEnrollment.deleteMany();
  await prisma.turmaEnrollment.deleteMany();
  await prisma.mentorStartup.deleteMany();
  await prisma.startupMember.deleteMany();
  await prisma.startupProgram.deleteMany();
  await prisma.startupInstitution.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.program.deleteMany();
  await prisma.institution.deleteMany();
  
  // Limpar usuários mantendo apenas o Admin se desejar, ou reset total
  // await prisma.userRole.deleteMany();
  // await prisma.user.deleteMany();
}

async function main() {
  await clearDB();
  console.log('🚀 Preparando plataforma para nova turma...');

  // 1. Instituição Base
  const sebraePR = await prisma.institution.upsert({
    where: { id: 'ies-sebrae-pr' },
    update: { name: 'SEBRAE PR', status: 'ACTIVE' },
    create: {
      id: 'ies-sebrae-pr',
      name: 'SEBRAE PR',
      description: 'Serviço Brasileiro de Apoio às Micro e Pequenas Empresas – Paraná',
      status: 'ACTIVE',
    }
  });

  // 2. Programa Ativo
  const garage2026 = await prisma.program.upsert({
    where: { id: 'prog-garage-2026' },
    update: { name: 'GARAGE 2026', status: 'ACTIVE' },
    create: {
      id: 'prog-garage-2026',
      institution_id: sebraePR.id,
      name: 'GARAGE 2026',
      description: 'Programa de aceleração de startups do SEBRAE PR – Edição 2026',
      program_type: 'ACELERACAO',
      cohort: '2026-01',
      status: 'ACTIVE',
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-12-31'),
    }
  });

  console.log('✅ Infraestrutura pronta: SEBRAE PR | GARAGE 2026');
  console.log('✅ Pronto para novos cadastros reais.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
