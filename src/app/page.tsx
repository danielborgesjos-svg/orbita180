'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsCard from '@/components/ui/StatsCard';
import { 
  Users, Target, DollarSign, Zap, Calendar, TrendingUp, Award, Building2, Briefcase, Activity, MessageSquare
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'admin') {
    return <AdminDashboard user={user} />;
  }
  if (user.role === 'institution') {
    return <InstitutionDashboard user={user} />;
  }
  if (user.role === 'mentor') {
    return <MentorDashboard user={user} />;
  }
  
  return <StartupDashboard user={user} />;
}

// --- STARTUP DASHBOARD ---
const StartupDashboard = ({ user }: { user: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Olá, {user.name.split(' ')[0]}! 👋</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Sua startup <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{user.startupName || 'TechInova'}</span> está evoluindo 15% mais rápido este mês.</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="premium-gradient" style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} /> Novo Registro
        </button>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Faturamento (MRR)" value="R$ 12.500" change={12} icon={DollarSign} description="Crescimento constante" />
      <StatsCard title="Maturidade" value="Nível 4" change={5} icon={TrendingUp} description="Fase de Tração" />
      <StatsCard title="Leads Ativos" value="142" change={24} icon={Users} description="+32 esta semana" />
      <StatsCard title="Metas Batidas" value="8/10" change={10} icon={Target} description="Meta trimestral" />
    </div>

    {/* ... rest of startup dashboard (radar chart placeholder, events) ... */}
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
      <div className="card premium-shadow" style={{ minHeight: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Evolução de Maturidade</h3>
          <select style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
            <option>Últimos 6 meses</option>
            <option>Este ano</option>
          </select>
        </div>
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)', borderRadius: 'var(--radius)', color: 'var(--muted-foreground)' }}>
          [ Gráfico de Radar / Linha de Evolução ]
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--primary)" /> Próximos Eventos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: 'Mentoria Estratégica', time: 'Hoje, 14:00', type: 'Sebrae' },
              { title: 'Demo Day Órbita', time: 'Amanhã, 09:00', type: 'Órbita 180' },
            ].map((event, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--muted)' }}>
                <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', textAlign: 'center', minWidth: '45px' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--primary)' }}>MAI</p>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{15 + i}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{event.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{event.time} • {event.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- INSTITUTION DASHBOARD ---
const InstitutionDashboard = ({ user }: { user: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Dashboard Institucional</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>Visão geral do ecossistema <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{user.institutionName}</span>.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Startups Ativas" value="45" change={12} icon={Building2} description="Em 3 programas" />
      <StatsCard title="Startups Vendendo" value="28" change={5} icon={DollarSign} description="62% do portfólio" />
      <StatsCard title="Maturidade Média" value="Nível 3.2" change={8} icon={TrendingUp} description="Validação/Tração" />
      <StatsCard title="Total de Membros" value="134" change={2} icon={Users} description="Empreendedores" />
    </div>
    <div className="card premium-shadow">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Desempenho por Programa</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
            <th style={{ padding: '1rem' }}>PROGRAMA</th>
            <th style={{ padding: '1rem' }}>STARTUPS</th>
            <th style={{ padding: '1rem' }}>MATURIDADE MÉDIA</th>
            <th style={{ padding: '1rem' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '1rem', fontWeight: '600' }}>Aceleração 2024.1</td>
            <td style={{ padding: '1rem' }}>15</td>
            <td style={{ padding: '1rem' }}>Nível 4.1</td>
            <td style={{ padding: '1rem' }}><span style={{ color: '#10b981', background: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Em Andamento</span></td>
          </tr>
          <tr>
            <td style={{ padding: '1rem', fontWeight: '600' }}>Incubação Tecnológica</td>
            <td style={{ padding: '1rem' }}>30</td>
            <td style={{ padding: '1rem' }}>Nível 2.5</td>
            <td style={{ padding: '1rem' }}><span style={{ color: '#3b82f6', background: '#dbeafe', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Inscrições Abertas</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- MENTOR DASHBOARD ---
const MentorDashboard = ({ user }: { user: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Painel do Mentor</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>Bem-vindo, {user.name}. Acompanhe as startups sob sua tutoria.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Startups Acompanhadas" value="6" icon={Building2} description="Neste ciclo" />
      <StatsCard title="Mentorias Realizadas" value="24" change={15} icon={MessageSquare} description="Este mês" />
      <StatsCard title="Avaliação Média" value="4.9/5" icon={Award} description="Feedback dos empreendedores" />
    </div>
    {/* Additional Mentor content could go here */}
  </div>
);

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ user }: { user: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Visão Global (Admin)</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>Controle total da plataforma Órbita 180.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Instituições Ativas" value="12" change={2} icon={Building2} />
      <StatsCard title="Total de Startups" value="340" change={45} icon={Briefcase} />
      <StatsCard title="Usuários na Plataforma" value="1.250" change={120} icon={Users} />
      <StatsCard title="Receita Gerada (Ecossistema)" value="R$ 15.4M" change={18} icon={DollarSign} />
    </div>
  </div>
);
