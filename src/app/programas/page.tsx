'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, Users, TrendingUp, Plus, Edit3, ChevronRight, Settings } from 'lucide-react';

const programas = [
  { id: 1, name: 'Aceleração Órbita 2024.1', status: 'Em Andamento', type: 'Aceleração', startups: 15, duration: '6 meses', nextEvent: 'Demo Day (15/06)' },
  { id: 2, name: 'Incubação Tecnológica (Sebrae)', status: 'Inscrições Abertas', type: 'Incubação', startups: 0, duration: '12 meses', nextEvent: 'Fim das Inscrições (30/05)' },
  { id: 3, name: 'Pré-Aceleração Universitária', status: 'Concluído', type: 'Pré-Aceleração', startups: 22, duration: '3 meses', nextEvent: '-' },
];

export default function ProgramasPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Meus Programas</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie programas de aceleração, incubação e editais de inovação.</p>
        </div>
        <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Novo Programa
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {programas.map((p) => (
          <div key={p.id} className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: p.status === 'Em Andamento' ? '#10b981' : p.status === 'Inscrições Abertas' ? '#3b82f6' : '#94a3b8' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--muted)', fontWeight: '700', color: 'var(--muted-foreground)' }}>{p.type}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.5rem' }}>{p.name}</h3>
              </div>
              <button style={{ color: 'var(--muted-foreground)' }}><Settings size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14}/> Startups</p>
                <p style={{ fontWeight: '700', marginTop: '0.25rem' }}>{p.startups}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> Duração</p>
                <p style={{ fontWeight: '700', marginTop: '0.25rem' }}>{p.duration}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <div>
                <p style={{ color: 'var(--muted-foreground)' }}>Status</p>
                <p style={{ fontWeight: '600', color: p.status === 'Em Andamento' ? '#10b981' : p.status === 'Inscrições Abertas' ? '#3b82f6' : '#94a3b8' }}>{p.status}</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '600' }}>
                Gerenciar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
