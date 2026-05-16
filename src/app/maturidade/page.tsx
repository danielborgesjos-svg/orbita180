'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Award,
  Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { prisma } from '@/lib/prisma';
import { getStartupDashboardData } from '@/lib/actions/dashboard';

const MaturityPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.startupId) {
      loadData(user.startupId);
    }
  }, [user]);

  async function loadData(startupId: string) {
    setLoading(true);
    const dashboardData = await getStartupDashboardData(startupId);
    setData(dashboardData);
    setLoading(false);
  }

  const categories = [
    { name: 'Equipe & Cultura', score: 0, icon: Users, color: '#3b82f6' },
    { name: 'Produto & Tecnologia', score: 0, icon: Zap, color: '#8b5cf6' },
    { name: 'Mercado & Vendas', score: 0, icon: Target, color: '#f59e0b' },
    { name: 'Financeiro', score: 0, icon: DollarSign, color: '#10b981' },
    { name: 'Governança', score: 0, icon: ShieldCheck, color: '#ef4444' },
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
          <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> Salvar Diagnóstico
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Radar Map Placeholder */}
        <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '450px', background: 'white' }}>
          <h3 style={{ alignSelf: 'flex-start', fontSize: '1.25rem', marginBottom: '2rem' }}>Mapa Radar de Maturidade</h3>
          <div style={{ position: 'relative', width: '300px', height: '300px', border: '1px dashed var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed var(--border)', borderRadius: '50%', transform: 'scale(0.7)' }}></div>
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed var(--border)', borderRadius: '50%', transform: 'scale(0.4)' }}></div>
            <svg width="300" height="300" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <polygon points="50,50 50,50 50,50 50,50 50,50" fill="rgba(37, 99, 235, 0.2)" stroke="var(--primary)" strokeWidth="0.5" />
            </svg>
            <div style={{ position: 'absolute', top: '-25px', fontSize: '0.7rem', fontWeight: 'bold' }}>EQUIPE</div>
            <div style={{ position: 'absolute', right: '-45px', top: '90px', fontSize: '0.7rem', fontWeight: 'bold' }}>PRODUTO</div>
            <div style={{ position: 'absolute', right: '10px', bottom: '-20px', fontSize: '0.7rem', fontWeight: 'bold' }}>MERCADO</div>
            <div style={{ position: 'absolute', left: '10px', bottom: '-20px', fontSize: '0.7rem', fontWeight: 'bold' }}>FINANCEIRO</div>
            <div style={{ position: 'absolute', left: '-50px', top: '90px', fontSize: '0.7rem', fontWeight: 'bold' }}>GOVERNANÇA</div>
          </div>
          <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Aguardando primeiro diagnóstico...</p>
        </div>

        {/* Detailed Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card premium-shadow" style={{ background: 'var(--primary)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Nível de Maturidade</h3>
              <Award size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{data?.maturityLevel || 1}</span>
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>/ 10</span>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>
              {data?.maturityLevel < 4 ? 'Fase de Validação e Ideação.' : 'Startup em tração.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map((cat) => (
              <div key={cat.name} className="card premium-shadow" style={{ padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <cat.icon size={18} color={cat.color} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{cat.name}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>0%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `0%`, height: '100%', background: cat.color, borderRadius: '999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturityPage;
