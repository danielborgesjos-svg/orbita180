'use client';

import React from 'react';
import StatsCard from '@/components/ui/StatsCard';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  PieChart, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';

const FinancePage = () => {
  const transactions = [
    { id: 1, desc: 'Assinatura Plano Enterprise', amount: '+ R$ 5.400', date: 'Hoje', status: 'Confirmado', type: 'in' },
    { id: 2, desc: 'Servidores AWS', amount: '- R$ 1.200', date: 'Ontem', status: 'Processando', type: 'out' },
    { id: 3, desc: 'Consultoria Marketing', amount: '- R$ 3.000', date: '12 Mai', status: 'Confirmado', type: 'out' },
    { id: 4, desc: 'Venda Plano Basic', amount: '+ R$ 450', date: '11 Mai', status: 'Confirmado', type: 'in' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Gestão Financeira</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Acompanhe sua saúde financeira, burn rate e projeções.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} />
            Exportar Relatório
          </button>
          <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600' }}>
            Nova Transação
          </button>
        </div>
      </div>

      {/* Finance Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Saldo Atual" value="R$ 45.200" icon={Wallet} change={8} />
        <StatsCard title="Burn Rate" value="R$ 8.500" icon={TrendingUp} change={-2} />
        <StatsCard title="Runway" value="5.3 Meses" icon={Calendar} description="Baseado no burn médio" />
        <StatsCard title="Ticket Médio" value="R$ 1.250" icon={PieChart} change={15} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem' }}>
        {/* Cash Flow Simulation */}
        <div className="card premium-shadow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Fluxo de Caixa (6 Meses)</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div> Receita
              </span>
              <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--destructive)' }}></div> Despesa
              </span>
            </div>
          </div>

          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', gap: '1.5rem' }}>
            {[60, 45, 80, 55, 90, 75].map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%' }}>
                  <div style={{ flex: 1, height: `${val}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                  <div style={{ flex: 1, height: `${val - 20}%`, background: 'var(--destructive)', borderRadius: '4px 4px 0 0', opacity: 0.6 }}></div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Mês {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories / Revenue Mix */}
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Receita por Produto</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'SaaS Enterprise', value: 'R$ 8.500', perc: 65, color: 'var(--primary)' },
              { label: 'Consultoria', value: 'R$ 3.200', perc: 25, color: '#8b5cf6' },
              { label: 'Treinamentos', value: 'R$ 1.300', perc: 10, color: '#10b981' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '600' }}>{item.label}</span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{item.value}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.perc}%`, height: '100%', background: item.color, borderRadius: '999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card premium-shadow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Transações Recentes</h3>
          <button style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={16} /> Filtrar
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>DESCRIÇÃO</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>DATA</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>STATUS</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600', textAlign: 'right' }}>VALOR</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '8px', background: t.type === 'in' ? '#d1fae5' : '#fee2e2', color: t.type === 'in' ? '#059669' : '#dc2626' }}>
                    {t.type === 'in' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{t.desc}</span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{t.date}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'var(--secondary)', fontWeight: '600', color: 'var(--muted-foreground)' }}>{t.status}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '700', color: t.type === 'in' ? '#059669' : '#dc2626' }}>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancePage;
