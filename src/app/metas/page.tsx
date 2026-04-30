'use client';

import React from 'react';
import { Target, TrendingUp, CheckCircle, Clock, AlertCircle, Plus, Filter } from 'lucide-react';

export default function MetasPage() {
  const metas = [
    { id: 1, title: 'Alcançar R$ 15k de MRR', type: 'Financeiro', progress: 75, deadline: '30 Jun 2024', status: 'on-track' },
    { id: 2, title: 'Lançar App Mobile (Fase 1)', type: 'Produto', progress: 40, deadline: '15 Jul 2024', status: 'delayed' },
    { id: 3, title: 'Fechar 3 Parcerias Institucionais', type: 'Estratégico', progress: 100, deadline: '10 Mai 2024', status: 'completed' },
    { id: 4, title: 'Contratar 2 Devs Fullstack', type: 'Equipe', progress: 10, deadline: '20 Ago 2024', status: 'on-track' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Metas & Plano de Ação</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Acompanhe os OKRs e o progresso estratégico da startup.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Filtrar
          </button>
          <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Nova Meta
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--secondary)', borderRadius: '12px', color: 'var(--primary)' }}><Target size={28} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Total de Metas</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</p></div>
        </div>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#d1fae5', borderRadius: '12px', color: '#10b981' }}><CheckCircle size={28} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Concluídas</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5</p></div>
        </div>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '12px', color: '#3b82f6' }}><TrendingUp size={28} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Em Andamento</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>6</p></div>
        </div>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', color: '#ef4444' }}><AlertCircle size={28} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Em Atraso</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</p></div>
        </div>
      </div>

      {/* Goals List */}
      <div className="card premium-shadow" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Objetivos Principais (OKRs)</h3>
        </div>
        <div>
          {metas.map((meta, i) => (
            <div key={meta.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr', alignItems: 'center', padding: '1.5rem', borderBottom: i < metas.length - 1 ? '1px solid var(--border)' : 'none', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{meta.title}</h4>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: 'var(--secondary)', borderRadius: '4px', fontWeight: '600', color: 'var(--primary)' }}>{meta.type}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                <Clock size={16} /> {meta.deadline}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '600' }}>
                  <span>Progresso</span>
                  <span>{meta.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${meta.progress}%`, height: '100%', background: meta.progress === 100 ? '#10b981' : 'var(--primary)', borderRadius: '999px' }}></div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                {meta.status === 'on-track' && <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '999px', background: '#dbeafe', color: '#3b82f6', fontWeight: '600' }}>No Prazo</span>}
                {meta.status === 'delayed' && <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '999px', background: '#fee2e2', color: '#ef4444', fontWeight: '600' }}>Atrasado</span>}
                {meta.status === 'completed' && <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '999px', background: '#d1fae5', color: '#10b981', fontWeight: '600' }}>Concluído</span>}
              </div>

              <div style={{ textAlign: 'right' }}>
                <button style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Ver Plano</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
