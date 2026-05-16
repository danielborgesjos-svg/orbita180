'use server';

import db from '@/lib/db';

const prisma = db;

export async function getAdminGlobalStats() {
  try {
    const totalInstitutions = await prisma.institution.count();
    const totalStartups = await prisma.startup.count();
    const totalFounders = await prisma.founder.count();
    const totalUsers = await prisma.user.count();
    
    // Sum of all investments as pseudo-revenue/valuation, or contracts.
    const maturityAssessments = await prisma.maturityAssessment.findMany({ select: { investment_amount: true } });
    const totalInvestment = maturityAssessments.reduce((sum, item) => sum + (item.investment_amount || 0), 0);

    return {
      success: true,
      stats: {
        institutions: totalInstitutions,
        startups: totalStartups,
        users: totalUsers,
        founders: totalFounders,
        investment: totalInvestment
      }
    };
  } catch (error) {
    console.error('Error fetching admin global stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

export async function getStartupDashboardData(startupId: string) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        financials: true,
        members: { include: { user: true } },
      }
    });

    if (!startup) return { success: false, error: 'Startup não encontrada' };

    // Fetch the latest maturity assessment
    const latestAssessment = await prisma.maturityAssessment.findFirst({
      where: { startup_id: startupId },
      orderBy: { assessed_at: 'desc' }
    });

    let maturityLevel = 1;
    if (latestAssessment) {
      if (latestAssessment.maturity_level === 'A') maturityLevel = 4;
      else if (latestAssessment.maturity_level === 'B') maturityLevel = 3;
      else maturityLevel = 2;
    }

    // Calculate MRR (Monthly Recurring Revenue)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const mrr = startup.financials
      .filter(f => f.type === 'INCOME' && new Date(f.date).getMonth() === currentMonth && new Date(f.date).getFullYear() === currentYear)
      .reduce((sum, f) => sum + f.amount, 0);

    const members = startup.members.map(m => ({
      name: m.user?.name || 'Membro',
      role: m.role,
      joinedAt: m.joined_at || m.created_at
    }));

    // Fetch upcoming events
    const upcomingEvents = await prisma.agendaEvent.findMany({
      where: { 
        startup_id: startupId,
        start_time: { gte: new Date() }
      },
      orderBy: { start_time: 'asc' },
      take: 5
    });

    return {
      success: true,
      data: {
        maturityLevel: maturityLevel,
        mrr: mrr,
        members: members,
        events: upcomingEvents.map(e => ({
          title: e.title,
          time: e.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      }
    };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
