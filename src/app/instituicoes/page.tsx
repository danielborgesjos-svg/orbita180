'use client';

import React from 'react';
import { Building2, Plus, Download, MoreVertical, MapPin, Users, Target } from 'lucide-react';

export default function InstituicoesPage() {
  const instituicoes = [
    { id: 1, name: 'Aceleradora Órbita', type: 'Aceleradora', location: 'São Paulo, SP', startups: 45, programs: 3, status: 'Ativo' },
    { id: 2, name: 'Sebrae RS', type: 'Hub de Inovação', location: 'Porto Alegre, RS', startups: 120, programs: 5, status: 'Ativo' },
    { id: 3, name: 'Parque Tecnológico UFPR', type: 'Universidade / Parque', location: 'Curitiba, PR', startups: 35, programs: 2, status: 'Ativo' },
    { id: 4, name: 'InovaGov', type: 'Governo', location: 'Brasília, DF', startups: 12, programs: 1, status: 'Em Setup' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Gestão de Instituições</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Controle os hubs, aceleradoras e universidades clientes da Órbita 180.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
            <Download size={18} /> Relatório CSV
          </button>
          <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Nova Instituição
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {instituicoes.map(inst => (
          <div key={inst.id} className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{inst.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}><MapPin size={12}/> {inst.location}</span>
                </div>
              </div>
              <button style={{ color: 'var(--muted-foreground)', background: 'transparent', border: 'none', cursor: 'pointer' }}><MoreVertical size={20}/></button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--muted)', borderRadius: '4px', fontWeight: '600', color: 'var(--muted-foreground)' }}>{inst.type}</span>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: inst.status === 'Ativo' ? '#d1fae5' : '#fef3c7', color: inst.status === 'Ativo' ? '#10b981' : '#f59e0b', borderRadius: '4px', fontWeight: '700' }}>{inst.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14}/> Startups Ativas</p>
                <p style={{ fontWeight: '700', marginTop: '0.25rem', fontSize: '1.25rem' }}>{inst.startups}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Target size={14}/> Programas</p>
                <p style={{ fontWeight: '700', marginTop: '0.25rem', fontSize: '1.25rem' }}>{inst.programs}</p>
              </div>
            </div>

            <button style={{ width: '100%', padding: '0.75rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', background: 'var(--secondary)', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              Acessar Painel da Instituição
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
