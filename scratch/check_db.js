const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startup.findMany();
  const users = await prisma.user.findMany();
  const founders = await prisma.founder.findMany();
  
  console.log('--- DB STATS ---');
  console.log('Startups:', startups.length);
  console.log('Users:', users.length);
  console.log('Founders:', founders.length);
  
  if (startups.length > 0) {
    console.log('--- STARTUPS ---');
    startups.forEach(s => console.log(`- ${s.name} (${s.id})`));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
