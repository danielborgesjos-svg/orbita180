'use client';

import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Award
} from 'lucide-react';

const MaturityPage = () => {
  const categories = [
    { name: 'Equipe & Cultura', score: 85, icon: Users, color: '#3b82f6' },
    { name: 'Produto & Tecnologia', score: 65, icon: Zap, color: '#8b5cf6' },
    { name: 'Mercado & Vendas', score: 45, icon: Target, color: '#f59e0b' },
    { name: 'Financeiro', score: 70, icon: DollarSign, color: '#10b981' },
    { name: 'Governança', score: 30, icon: ShieldCheck, color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Análise de Maturidade</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Diagnóstico detalhado do estágio atual da sua startup.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600' }}>
            Refazer Diagnóstico
          </button>
          <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600' }}>
            Gerar Relatório Completo
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Radar Map Placeholder */}
        <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '450px', background: 'white' }}>
          <h3 style={{ alignSelf: 'flex-start', fontSize: '1.25rem', marginBottom: '2rem' }}>Mapa Radar de Maturidade</h3>
          <div style={{ position: 'relative', width: '300px', height: '300px', border: '1px dashed var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Simulated Radar Chart */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed var(--border)', borderRadius: '50%', transform: 'scale(0.7)' }}></div>
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed var(--border)', borderRadius: '50%', transform: 'scale(0.4)' }}></div>
            <svg width="300" height="300" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <polygon points="50,10 85,35 75,80 25,80 15,35" fill="rgba(37, 99, 235, 0.2)" stroke="var(--primary)" strokeWidth="0.5" />
              {/* Points */}
              <circle cx="50" cy="10" r="1.5" fill="var(--primary)" />
              <circle cx="85" cy="35" r="1.5" fill="var(--primary)" />
              <circle cx="75" cy="80" r="1.5" fill="var(--primary)" />
              <circle cx="25" cy="80" r="1.5" fill="var(--primary)" />
              <circle cx="15" cy="35" r="1.5" fill="var(--primary)" />
            </svg>
            <div style={{ position: 'absolute', top: '-25px', fontSize: '0.7rem', fontWeight: 'bold' }}>EQUIPE</div>
            <div style={{ position: 'absolute', right: '-45px', top: '90px', fontSize: '0.7rem', fontWeight: 'bold' }}>PRODUTO</div>
            <div style={{ position: 'absolute', right: '10px', bottom: '-20px', fontSize: '0.7rem', fontWeight: 'bold' }}>MERCADO</div>
            <div style={{ position: 'absolute', left: '10px', bottom: '-20px', fontSize: '0.7rem', fontWeight: 'bold' }}>FINANCEIRO</div>
            <div style={{ position: 'absolute', left: '-50px', top: '90px', fontSize: '0.7rem', fontWeight: 'bold' }}>GOVERNANÇA</div>
          </div>
          <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Última atualização: 12 de Maio de 2024</p>
        </div>

        {/* Detailed Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card premium-shadow" style={{ background: 'var(--primary)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Score Global Órbita</h3>
              <Award size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>7.2</span>
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>/ 10</span>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>Sua startup está no Top 15% do ecossistema.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map((cat) => (
              <div key={cat.name} className="card premium-shadow" style={{ padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <cat.icon size={18} color={cat.color} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{cat.name}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: cat.score < 50 ? 'var(--destructive)' : 'var(--foreground)' }}>{cat.score}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.score}%`, height: '100%', background: cat.color, borderRadius: '999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Plan based on maturity */}
      <div className="card premium-shadow">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recomendações Estratégicas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            { title: 'Estruturar Funil de Vendas', category: 'Mercado', action: 'Configurar CRM', impact: 'Alto' },
            { title: 'Definir Acordo de Sócios', category: 'Governança', action: 'Consultar Jurídico', impact: 'Crítico' },
            { title: 'Validar Canais de Tração', category: 'Mercado', action: 'Testes A/B', impact: 'Médio' },
          ].map((rec, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', background: 'var(--secondary)', borderRadius: '4px', textTransform: 'uppercase' }}>{rec.category}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: rec.impact === 'Crítico' ? 'var(--destructive)' : 'var(--primary)' }}>Impacto {rec.impact}</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{rec.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Para subir de nível em {rec.category.toLowerCase()}, você precisa {rec.action.toLowerCase()}.</p>
              <button style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                Iniciar Ação <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaturityPage;
