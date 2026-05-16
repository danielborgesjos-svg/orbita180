const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding...')

  // 1. Criar Usuário Admin
  const user = await prisma.user.upsert({
    where: { email: 'admin@orbita.com' },
    update: {},
    create: {
      email: 'admin@orbita.com',
      name: 'Admin JARVIS',
      password_hash: 'hashed_password_123'
    },
  })

  // 2. Criar Startup de Teste
  const startup = await prisma.startup.upsert({
    where: { id: 'startup-123' },
    update: {},
    create: {
      id: 'startup-123',
      name: 'TechInova Solutions',
      segment: 'SaaS B2B / IA',
      description_short: 'Plataforma de inteligência de dados focada em acelerar o processo de desenvolvimento e maturidade de startups.',
      brand_purpose: 'Democratizar o acesso a mentorias de alto nível via IA.',
      vision: 'Ser a maior plataforma de aceleração da América Latina até 2028.',
      mission: 'Conectar fundadores a recursos estratégicos de forma automatizada.',
      values: 'Transparência, Velocidade, Foco no Resultado.',
      target_audience: 'CEOs de Startups em estágio de Tração.',
      avg_ticket: '1.500,00',
      maturity_level: 'Tração',
      cnpj: '12.345.678/0001-99',
      website: 'https://techinova.example.com',
    },
  })

  // 3. Criar Transações Financeiras (Cards Aleatórios)
  await prisma.financialTransaction.createMany({
    data: [
      { startup_id: startup.id, description: 'Venda Plano Enterprise', amount: 15000, type: 'INCOME', category: 'Vendas', date: new Date() },
      { startup_id: startup.id, description: 'Mensalidade AWS', amount: 2400.50, type: 'EXPENSE', category: 'Infra', date: new Date() },
      { startup_id: startup.id, description: 'Marketing Facebook Ads', amount: 3000, type: 'EXPENSE', category: 'Marketing', date: new Date() },
      { startup_id: startup.id, description: 'Venda Plano Pro', amount: 4500, type: 'INCOME', category: 'Vendas', date: new Date() },
      { startup_id: startup.id, description: 'Consultoria Jurídica', amount: 1200, type: 'EXPENSE', category: 'Jurídico', date: new Date() },
    ],
  })

  // 4. Criar Tarefas Kanban (Cards Aleatórios)
  await prisma.task.createMany({
    data: [
      { startup_id: startup.id, title: 'Finalizar Pitch Deck V2', description: 'Revisar slides de tração e métricas financeiras.', status: 'TODO', order: 0 },
      { startup_id: startup.id, title: 'Refatorar API de Pagamentos', description: 'Integrar com novo checkout.', status: 'IN_PROGRESS', order: 1 },
      { startup_id: startup.id, title: 'Entrevistar 5 Beta Testers', description: 'Coletar feedback sobre a nova dashboard.', status: 'IN_VALIDATION', order: 0 },
      { startup_id: startup.id, title: 'Lançar Landing Page Nova', description: 'Deploy realizado na Vercel.', status: 'DONE', order: 0 },
      { startup_id: startup.id, title: 'Contratar Designer UI/UX', description: 'Publicar vaga no LinkedIn.', status: 'TODO', order: 1 },
    ],
  })

  // 5. Criar Metas & Planos de Ação
  const goal = await prisma.goal.create({
    data: {
      startup_id: startup.id,
      title: 'Atingir 100k MRR',
      description: 'Dobrar o faturamento recorrente mensal nos próximos 6 meses.',
      target_date: new Date('2026-12-31'),
    },
  })

  await prisma.actionPlan.createMany({
    data: [
      { goal_id: goal.id, description: 'Lançar campanha de Inbound Marketing', due_date: new Date(), status: 'PENDING', responsible_id: user.id },
      { goal_id: goal.id, description: 'Contratar 2 SDRs para o time de vendas', due_date: new Date(), status: 'DONE', responsible_id: user.id },
    ],
  })

  // 6. Criar Contratos
  await prisma.contract.createMany({
    data: [
      { startup_id: startup.id, title: 'Acordo de Sócios (SHA)', type: 'SOCIETARY', url: 'https://docs.google.com/sha', status: 'ACTIVE' },
      { startup_id: startup.id, title: 'Contrato Cliente Master - Global Corp', type: 'CLIENT', url: 'https://docs.google.com/contract', status: 'ACTIVE' },
    ],
  })

  console.log('✅ Seeding finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
