'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsCard from '@/components/ui/StatsCard';
import { getAdminGlobalStats } from '@/lib/actions/dashboard';
import { 
  Users, Target, DollarSign, Zap, Calendar, TrendingUp, Award, Building2, Briefcase, Activity, MessageSquare, GripVertical
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- SORTABLE ITEM COMPONENT ---
function SortableItem({ id, children, isDraggingOverlay = false }: { id: string, children: React.ReactNode, isDraggingOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? '1.02' : '1',
    cursor: 'grab',
    position: 'relative' as const,
  };

  const overlayStyle = isDraggingOverlay ? {
    cursor: 'grabbing',
    scale: '1.05',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 1000,
  } : {};

  return (
    <div 
      ref={setNodeRef} 
      style={{ ...style, ...overlayStyle }} 
      {...attributes} 
      {...listeners}
    >
      <div 
        style={{ 
          position: 'absolute', 
          top: '1.25rem', 
          right: '1.25rem', 
          opacity: 0.4,
          zIndex: 20
        }}
      >
        <GripVertical size={18} />
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'admin') return <AdminDashboard user={user} />;
  if (user.role === 'institution') return <InstitutionDashboard user={user} />;
  if (user.role === 'diretor_ies') return <DirectorDashboard user={user} />;
  if (user.role === 'mentor') return <MentorDashboard user={user} />;
  
  return <StartupDashboard user={user} />;
}

// --- DIRECTOR DASHBOARD ---
const DirectorDashboard = ({ user }: { user: any }) => (
  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Diretoria Executiva</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Visão macro da IES: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.institutionName || 'Centro de Inovação'}</span></p>
      </div>
      <button className="premium-gradient" style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700' }}>Gerar Relatório</button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Maturidade do Ecossistema" value="Nível 3.8" change={12} icon={TrendingUp} description="Média de 45 startups" />
      <StatsCard title="NPS dos Mentores" value="9.4" icon={Award} description="Frequência e Impacto" />
      <StatsCard title="Taxa de Execução" value="78%" change={15} icon={Zap} description="Sprints finalizadas" />
      <StatsCard title="Captação de Investimento" value="R$ 4.2M" change={5} icon={DollarSign} description="Total acumulado" />
    </div>

    <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
      <div className="card premium-shadow">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Target size={20} color="var(--primary)" /> Matriz de Diagnóstico
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid #10b981' }}>
            <h4 style={{ color: '#065f46', fontSize: '0.9rem', fontWeight: 800 }}>ALTO DESEMPENHO</h4>
            <p style={{ fontSize: '0.8rem', color: '#047857' }}>Startups com foco em produto e vendas. Alta taxa de iteração técnica.</p>
          </div>
        </div>
      </div>

      <div className="card premium-shadow">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Verificação de Mentores</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'Dr. Roberto Silva', expertise: 'Estratégia', status: 'VERIFICADO', score: 9.8 },
            { name: 'Eng. Carla Dias', expertise: 'Produto', status: 'VERIFICADO', score: 9.5 },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--muted)', borderRadius: '10px' }}>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{m.name}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{m.expertise}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981' }}>{m.status}</span>
                <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>{m.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- STARTUP DASHBOARD ---
const StartupDashboard = ({ user }: { user: any }) => {
  const [statsIds, setStatsIds] = useState(['maturidade', 'mrr', 'leads', 'metas']);
  const [widgetIds, setWidgetIds] = useState(['chart', 'events']);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dashData, setDashData] = useState<any>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem(`orbita_stats_order_${user.id}`);
    const savedWidgets = localStorage.getItem(`orbita_widgets_order_${user.id}`);
    if (savedStats) setStatsIds(JSON.parse(savedStats));
    if (savedWidgets) setWidgetIds(JSON.parse(savedWidgets));

    if (user.startupId) {
      import('@/lib/actions/dashboard').then(({ getStartupDashboardData }) => {
        getStartupDashboardData(user.startupId).then(res => {
          if (res.success) {
            setDashData(res.data);
            if (res.data.maturityLevel < 4) {
              setStatsIds(prev => prev.filter(id => id !== 'mrr'));
            }
          }
        });
      });
    }
  }, [user.id, user.startupId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEndStats(event: any) {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStatsIds((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(`orbita_stats_order_${user.id}`, JSON.stringify(newOrder));
        return newOrder;
      });
    }
  }

  function handleDragEndWidgets(event: any) {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgetIds((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(`orbita_widgets_order_${user.id}`, JSON.stringify(newOrder));
        return newOrder;
      });
    }
  }

  const mrrValue = dashData?.mrr || 0;
  const maturityLevel = dashData?.maturityLevel || 1;

  const statsMap: Record<string, React.ReactNode> = {
    mrr: <StatsCard title="Faturamento (MRR)" value={`R$ ${mrrValue.toLocaleString('pt-BR')}`} change={0} icon={DollarSign} description="Receita Real" />,
    maturidade: <StatsCard title="Maturidade" value={`Nível ${maturityLevel}`} change={0} icon={TrendingUp} description={maturityLevel >= 4 ? 'Fase de Tração' : 'Fase Inicial'} />,
    leads: <StatsCard title="Leads Ativos" value="-" change={0} icon={Users} description="Aguardando integração" />,
    metas: <StatsCard title="Metas Batidas" value="0/0" change={0} icon={Target} description="Sem metas cadastradas" />,
  };

  const membersCount = dashData?.members?.length || 0;

  const widgetsMap: Record<string, React.ReactNode> = {
    chart: (
      <div className="card premium-shadow" style={{ minHeight: '400px', width: '100%', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Equipe da Startup</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {membersCount > 0 ? dashData.members.map((m: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
               <div>
                  <p style={{ fontWeight: 600 }}>{m.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{m.role}</p>
               </div>
            </div>
          )) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>Nenhum membro ativo.</div>
          )}
        </div>
      </div>
    ),
    events: (
      <div className="card premium-shadow" style={{ width: '100%', background: 'white' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--primary)" /> Agenda
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dashData?.events?.length > 0 ? dashData.events.map((event: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--muted)' }}>
              <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', textAlign: 'center', minWidth: '45px' }}>
                <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{i+1}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{event.title}</p>
              </div>
            </div>
          )) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Sem eventos.</p>
          )}
        </div>
      </div>
    )
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>Olá, {user.name?.split(' ')[0] || 'Empreendedor'}! 👋</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Sua startup <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{user.startupName || 'Nova Startup'}</span> está no Nível {maturityLevel}.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="premium-gradient" style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} /> Acelerar
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEndStats}>
        <SortableContext items={statsIds} strategy={rectSortingStrategy}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {statsIds.map((id) => (
              <SortableItem key={id} id={id}>
                {statsMap[id]}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && statsMap[activeId] ? (
            <div style={{ cursor: 'grabbing', scale: '1.05', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '24px', overflow: 'hidden' }}>
              {statsMap[activeId]}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEndWidgets}>
        <SortableContext items={widgetIds} strategy={verticalListSortingStrategy}>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
             {widgetIds.map((id) => (
                <SortableItem key={id} id={id}>
                   {widgetsMap[id]}
                </SortableItem>
             ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && widgetsMap[activeId] ? (
            <div style={{ cursor: 'grabbing', scale: '1.02', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '24px', overflow: 'hidden', background: 'white' }}>
              {widgetsMap[activeId]}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style jsx>{`
        @media (max-width: 968px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
          .dash-header {
            flex-direction: column;
            align-items: flex-start !important;
          }
          .dash-header h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

// --- INSTITUTION DASHBOARD ---
const InstitutionDashboard = ({ user }: { user: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div className="dash-header">
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Ecossistema</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>Visão geral de <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{user.institutionName}</span>.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Startups" value="45" change={12} icon={Building2} />
      <StatsCard title="Faturamento" value="62%" change={5} icon={DollarSign} />
      <StatsCard title="Maturidade" value="3.2" change={8} icon={TrendingUp} />
      <StatsCard title="Membros" value="134" change={2} icon={Users} />
    </div>
    <style jsx>{`
      @media (max-width: 768px) {
        .dash-header h1 { font-size: 1.5rem !important; }
      }
    `}</style>
  </div>
);

// --- MENTOR DASHBOARD ---
const MentorDashboard = ({ user }: { user: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div className="dash-header">
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Painel Mentor</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>Olá, {user.name}. Suas tutorias.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      <StatsCard title="Startups" value="6" icon={Building2} />
      <StatsCard title="Mentorias" value="24" change={15} icon={MessageSquare} />
      <StatsCard title="Avaliação" value="4.9/5" icon={Award} />
    </div>
    <style jsx>{`
      @media (max-width: 768px) {
        .dash-header h1 { font-size: 1.5rem !important; }
      }
    `}</style>
  </div>
);

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ user }: { user: any }) => {
  const [stats, setStats] = useState<any>({ institutions: 0, startups: 0, users: 0, investment: 0 });
  
  useEffect(() => {
    getAdminGlobalStats().then(res => {
      if (res.success) setStats(res.stats);
    });
  }, []);

  const formatMoney = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="dash-header">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Global Admin</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Controle total Órbita 180.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Instituições" value={stats.institutions.toString()} icon={Building2} />
        <StatsCard title="Startups" value={stats.startups.toString()} icon={Briefcase} />
        <StatsCard title="Usuários" value={stats.users.toString()} icon={Users} />
        <StatsCard title="Investimento" value={formatMoney(stats.investment)} icon={DollarSign} />
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .dash-header h1 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};
