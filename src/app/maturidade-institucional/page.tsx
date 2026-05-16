'use client';

import React from 'react';
import { Target, TrendingUp, Users, AlertCircle, Award, BarChart3, ChevronRight } from 'lucide-react';

export default function InstitutionalMaturityPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Análise de Maturidade do Ecossistema</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Visão agregada do nível de maturidade de todas as startups do portfólio.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', outline: 'none' }}>
            <option>Aceleração Órbita 2024.1 (15 Startups)</option>
            <option>Todos os Programas (45 Startups)</option>
          </select>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
            Baixar Relatório
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {[
          { label: 'Maturidade Média', value: '68%', subtitle: 'Nível 3 (Tração)', icon: Target, color: '#10b981' },
          { label: 'Pilar Mais Forte', value: 'Produto', subtitle: 'Média de 82%', icon: Award, color: '#3b82f6' },
          { label: 'Gargalo Principal', value: 'Vendas', subtitle: 'Média de 41%', icon: AlertCircle, color: '#ef4444' },
          { label: 'Evolução Mensal', value: '+12%', subtitle: 'Em relação a Abr/24', icon: TrendingUp, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="card premium-shadow" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: `${s.color}15`, borderRadius: '12px', color: s.color }}><s.icon size={24} /></div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card premium-shadow" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Diagnóstico por Pilar (Radar Agregado)</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <BarChart3 size={48} color="var(--muted-foreground)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Gráfico Radar Agregado</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Produto • Mercado • Equipe • Financeiro • Jurídico</p>
            </div>
          </div>
        </div>

        <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Ranking de Startups</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: 'TechInova', score: 88, trend: 'up' },
              { name: 'AgroData', score: 75, trend: 'up' },
              { name: 'FinMatch', score: 62, trend: 'down' },
              { name: 'HealthAI', score: 45, trend: 'flat' },
              { name: 'EduVance', score: 30, trend: 'up' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--muted)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>{i+1}</div>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '700', color: s.score > 70 ? '#10b981' : s.score > 40 ? '#f59e0b' : '#ef4444' }}>{s.score}%</span>
                  <ChevronRight size={16} color="var(--muted-foreground)" />
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '0.75rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Ver Ranking Completo →</button>
        </div>
      </div>
    </div>
  );
}
