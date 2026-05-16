'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProgramDashboard } from '@/lib/actions/programs';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import StartupCards from './StartupCards';
import FoundersTab from './FoundersTab';
import MentoriaTab from './MentoriaTab';
import EngajamentoTab from './EngajamentoTab';
import ConquistasTab from './ConquistasTab';
import ModulosIA from './ModulosIA';

const TABS = [
  { id: 'visao', label: 'Visão Geral' },
  { id: 'startups', label: 'Startups' },
  { id: 'founders', label: 'Founders' },
  { id: 'mentorias', label: 'Mentorias & Capacitações' },
  { id: 'engajamento', label: 'Engajamento' },
  { id: 'conquistas', label: 'Conquistas' },
  { id: 'modulos', label: 'Módulos IA' },
];

export default function ProgramDashboardPage() {
  const params = useParams();
  const programId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visao');

  useEffect(() => {
    getProgramDashboard(programId).then(d => { setData(d); setLoading(false); });
  }, [programId]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'50vh', flexDirection:'column', gap:'1rem' }}>
      <div style={{ width:40, height:40, border:'4px solid #E2E8F0', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'#94A3B8', fontWeight:600 }}>Carregando dashboard...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!data) return (
    <div style={{ textAlign:'center', padding:'4rem' }}>
      <p style={{ color:'#EF4444', fontWeight:700 }}>Programa não encontrado.</p>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <DashboardHeader program={data.program} stats={data.stats} />

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', borderBottom:'2px solid #F1F5F9', overflowX:'auto', paddingBottom:'0' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding:'0.75rem 1.25rem', fontWeight:700, fontSize:'0.875rem', border:'none',
              background:'transparent', cursor:'pointer', whiteSpace:'nowrap',
              color: activeTab===tab.id ? 'var(--primary)' : '#64748B',
              borderBottom: activeTab===tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom:'-2px', transition:'all 0.2s'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'visao'       && <DashboardStats stats={data.stats} startups={data.startups} />}
      {activeTab === 'startups'    && <StartupCards startups={data.startups} programId={programId} />}
      {activeTab === 'founders'    && <FoundersTab founders={data.founders} programId={programId} onRefresh={() => getProgramDashboard(programId).then(d => setData(d))} />}
      {activeTab === 'mentorias'   && <MentoriaTab sessions={data.mentorshipSessions} startups={data.startups} />}
      {activeTab === 'engajamento' && <EngajamentoTab startups={data.startups} />}
      {activeTab === 'conquistas'  && <ConquistasTab startups={data.startups} />}
      {activeTab === 'modulos'     && <ModulosIA stats={data.stats} />}
    </div>
  );
}
