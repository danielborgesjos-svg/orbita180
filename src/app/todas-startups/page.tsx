'use client';

import React from 'react';
import { Search, Filter, Building2, TrendingUp, Users, DollarSign, Download, MoreVertical } from 'lucide-react';

export default function TodasStartupsPage() {
  const startupsList = [
    { id: 1, name: 'TechInova', institution: 'Aceleradora Órbita', segment: 'SaaS B2B', stage: 'Tração', mrr: 'R$ 12.500', team: 4, status: 'Ativa' },
    { id: 2, name: 'EcoFlow', institution: 'Sebrae', segment: 'Cleantech', stage: 'Validação', mrr: 'R$ 1.800', team: 2, status: 'Ativa' },
    { id: 3, name: 'HealthLink', institution: 'Universidade Federal', segment: 'HealthTech', stage: 'MVP', mrr: 'R$ 0', team: 3, status: 'Em Risco' },
    { id: 4, name: 'AgroData', institution: 'Aceleradora Órbita', segment: 'AgriTech', stage: 'Escala', mrr: 'R$ 45.000', team: 12, status: 'Ativa' },
    { id: 5, name: 'EduVance', institution: 'Hub Inovação S/A', segment: 'EdTech', stage: 'Ideação', mrr: 'R$ 0', team: 2, status: 'Inativa' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Gestão de Startups</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Visualize e filtre todas as startups registradas no ecossistema.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
            <Download size={18} /> Exportar CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--muted)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <Search size={18} color="var(--muted-foreground)" />
          <input placeholder="Buscar por nome, segmento ou instituição..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
        </div>
        <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}>
          <option>Todos os Estágios</option>
          <option>Ideação</option>
          <option>MVP</option>
          <option>Validação</option>
          <option>Tração</option>
          <option>Escala</option>
        </select>
        <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}>
          <option>Todas Instituições</option>
          <option>Aceleradora Órbita</option>
          <option>Sebrae</option>
        </select>
        <button style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} /> Mais Filtros
        </button>
      </div>

      <div className="card premium-shadow" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Startup</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Vínculo Institucional</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Estágio</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>MRR</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Equipe</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {startupsList.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < startupsList.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{s.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{s.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.segment}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--muted-foreground)', fontWeight: '500' }}>{s.institution}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--muted)', borderRadius: '4px', fontWeight: '600' }}>{s.stage}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', fontSize: '0.9rem', color: s.mrr !== 'R$ 0' ? '#10b981' : 'var(--foreground)' }}>{s.mrr}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted-foreground)' }}><Users size={16}/> {s.team}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.status === 'Ativa' ? '#10b981' : s.status === 'Em Risco' ? '#f59e0b' : '#ef4444' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{s.status}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--muted-foreground)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }} className="menu-item-hover"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
