const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed GARAGE 2026...');
  const passwordHash = await bcrypt.hash('Garage2026!', 10);

  // 1. Roles
  console.log('Configurando Roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Acesso Total' }
  });

  const mentorRole = await prisma.role.upsert({
    where: { name: 'Mentor' },
    update: {},
    create: { name: 'Mentor', description: 'Acesso de Mentoria' }
  });

  // 2. Institution
  console.log('Criando Instituição SEBRAE PR...');
  const sebrae = await prisma.institution.create({
    data: {
      name: 'SEBRAE PR',
      description: 'Hub de Inovação e Aceleração SEBRAE PR'
    }
  });

  // 3. Program
  console.log('Criando Programa PROJETO GARAGE...');
  const garage = await prisma.program.create({
    data: {
      institution_id: sebrae.id,
      name: 'PROJETO GARAGE',
      cohort: '2026',
      program_type: 'ACELERACAO',
      status: 'ACTIVE'
    }
  });

  // 4. Users
  console.log('Criando Usuários Admin e Mentores...');
  const usersToCreate = [
    { name: 'Daniel Borges', email: 'daniel@magistertech.com.br', role: 'Admin', isMaster: true },
    { name: 'Aloisio Cirqueira', email: 'aloisio@sebraepr.com.br', role: 'Admin' },
    { name: 'Daiane Baragão', email: 'daiane@sebraepr.com.br', role: 'Admin' },
    { name: 'Angela Nardelli', email: 'angela@sebraepr.com.br', role: 'Admin' }
  ];

  for (const u of usersToCreate) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: {
        name: u.name,
        email: u.email,
        password_hash: passwordHash,
      }
    });

    // Assign Role
    const role = adminRole; // All as Admin as per request "Perfil Mentor / Administrador"
    await prisma.userRole.upsert({
      where: { user_id_role_id: { user_id: user.id, role_id: role.id } },
      update: {},
      create: { user_id: user.id, role_id: role.id }
    });

    // Link to Institution
    await prisma.institutionMember.create({
      data: {
        institution_id: sebrae.id,
        user_id: user.id,
        role: u.role,
        status: 'ACTIVE'
      }
    });
    
    // Create Mentor profile for the sebrae team
    if (u.name !== 'Daniel Borges') {
      await prisma.mentor.upsert({
        where: { user_id: user.id },
        update: {},
        create: {
          user_id: user.id,
          expertise: 'Estratégia, Gestão',
          verification_status: 'VERIFIED'
        }
      });
    }
  }

  // 5. Startups
  console.log('Semeando Startups (35 empresas)...');
  const startupNames = [
    "INOVA REABILITAR", "CENTRO CIRURGICO.5.0", "Ecolink", "Pede e Passa", "Arrendaí",
    "OwnCare", "MAVIE", "FUTURA TECH", "Taggon", "Magister Tech", "PetPerfect",
    "FLUX ID", "AgroBiotics", "KOMBUCHA PROTEICA", "TrueD", "ALIPASS", "FIT MOVE +",
    "GROWTH NEST", "Biodefenser", "TutorBooster", "DINOITE", "COLA NO JOGO",
    "Royal Cup", "4LIMC", "EQUIPE 6", "SeeWay", "CinePasse", "Particles4you",
    "CERES", "AKAY NUTRIBIOLOGIA", "SEE COLOR", "GAKSA", "EQUALYS", "Brassilo", "SuperADV"
  ];

  for (const name of startupNames) {
    const startup = await prisma.startup.create({
      data: {
        name,
        status: 'ACTIVE',
        stage: 'Ideação',
        maturity_level: 'Nível 1'
      }
    });

    // Link to Program
    await prisma.startupProgram.create({
      data: {
        startup_id: startup.id,
        program_id: garage.id,
        status: 'ACTIVE'
      }
    });

    // Link to Institution
    await prisma.startupInstitution.create({
      data: {
        startup_id: startup.id,
        institution_id: sebrae.id
      }
    });
  }

  console.log('✅ Seed GARAGE 2026 concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
