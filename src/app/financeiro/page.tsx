'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsCard from '@/components/ui/StatsCard';
import Modal from '@/components/ui/Modal';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  PieChart, 
  Download,
  Calendar,
  Filter,
  Plus,
  Trash2,
  Edit,
  BarChart3
} from 'lucide-react';
import { 
  getFinancialTransactions, 
  createFinancialTransaction, 
  updateFinancialTransaction, 
  deleteFinancialTransaction 
} from '@/lib/actions/financial';

const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.startupId) {
      loadData();
    }
  }, [user?.startupId]);

  async function loadData() {
    if (!user?.startupId) return;
    setLoading(true);
    const data = await getFinancialTransactions(user.startupId);
    setTransactions(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.startupId) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: user.startupId,
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      date: new Date(formData.get('date') as string)
    };

    if (editingTransaction) {
      await updateFinancialTransaction(editingTransaction.id, data);
    } else {
      await createFinancialTransaction(data);
    }

    setIsModalOpen(false);
    setEditingTransaction(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm('Deseja realmente excluir esta transação?')) {
      await deleteFinancialTransaction(id);
      loadData();
    }
  }

  // --- KPI CALCULATIONS ---
  const totals = useMemo(() => transactions.reduce((acc, curr) => {
    if (curr.type === 'INCOME') acc.income += Number(curr.amount);
    else acc.expense += Number(curr.amount);
    return acc;
  }, { income: 0, expense: 0 }), [transactions]);

  const balance = totals.income - totals.expense;

  const avgTicket = useMemo(() => {
    const incomeTransactions = transactions.filter(t => t.type === 'INCOME');
    return incomeTransactions.length > 0 ? totals.income / incomeTransactions.length : 0;
  }, [transactions, totals.income]);

  // --- EXPENSE DISTRIBUTION CALCULATION ---
  const expenseDistribution = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    const categories: Record<string, number> = {};
    let totalExpense = 0;

    expenses.forEach(t => {
      const cat = t.category || 'Outros';
      categories[cat] = (categories[cat] || 0) + Number(t.amount);
      totalExpense += Number(t.amount);
    });

    const colors = ['var(--primary)', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
    
    return Object.entries(categories)
      .map(([label, value], i) => ({
        label,
        value: `R$ ${value.toLocaleString('pt-BR')}`,
        amount: value,
        perc: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // --- CASH FLOW CALCULATION (Last 6 Months) ---
  const cashFlowData = useMemo(() => {
    const months: { label: string; month: number; year: number; income: number; expense: number; incomePerc?: number; expensePerc?: number; }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expense: 0
      });
    }

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthIdx = months.findIndex(m => m.month === tDate.getMonth() && m.year === tDate.getFullYear());
      if (monthIdx !== -1) {
        if (t.type === 'INCOME') months[monthIdx].income += Number(t.amount);
        else months[monthIdx].expense += Number(t.amount);
      }
    });

    const maxVal = Math.max(...months.map(m => Math.max(m.income, m.expense)), 1);

    return months.map(m => ({
      ...m,
      incomePerc: (m.income / maxVal) * 100,
      expensePerc: (m.expense / maxVal) * 100
    }));
  }, [transactions]);

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: 800 }}>Gestão Financeira</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Saúde financeira da <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.startupName}</span>.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
            <Download size={18} /> Exportar
          </button>
          <button 
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
            className="premium-gradient" 
            style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Nova Transação
          </button>
        </div>
      </div>

      {/* Finance Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Saldo em Caixa" value={`R$ ${balance.toLocaleString('pt-BR')}`} icon={Wallet} />
        <StatsCard title="Receita Total" value={`R$ ${totals.income.toLocaleString('pt-BR')}`} icon={ArrowUpCircle} color="#10b981" />
        <StatsCard title="Despesa Total" value={`R$ ${totals.expense.toLocaleString('pt-BR')}`} icon={ArrowDownCircle} color="#ef4444" />
        <StatsCard title="Ticket Médio" value={`R$ ${avgTicket.toLocaleString('pt-BR')}`} icon={PieChart} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '1.5rem' }}>
        {/* Cash Flow Real Data */}
        <div className="card premium-shadow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Fluxo de Caixa (6 meses)</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }}></div> ENTRADA
              </span>
              <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }}></div> SAÍDA
              </span>
            </div>
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 0.5rem', gap: '1.25rem' }}>
            {cashFlowData.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', height: '100%' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%', background: '#f8fafc', borderRadius: '8px 8px 0 0', padding: '0 4px' }}>
                  <div title={`Entrada: R$ ${m.income}`} style={{ flex: 1, height: `${m.incomePerc}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', minHeight: m.income > 0 ? '4px' : '0', transition: 'height 0.5s ease' }}></div>
                  <div title={`Saída: R$ ${m.expense}`} style={{ flex: 1, height: `${m.expensePerc}%`, background: '#ef4444', borderRadius: '4px 4px 0 0', minHeight: m.expense > 0 ? '4px' : '0', transition: 'height 0.5s ease', opacity: 0.8 }}></div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Distribution */}
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 800 }}>Distribuição de Gastos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {expenseDistribution.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Nenhum gasto registrado para análise.</div>
            ) : expenseDistribution.map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                    {item.label}
                  </span>
                  <span style={{ fontWeight: '800' }}>{item.value} <span style={{ color: 'var(--muted-foreground)', fontWeight: '400', marginLeft: '0.25rem' }}>({item.perc.toFixed(0)}%)</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.perc}%`, height: '100%', background: item.color, borderRadius: '999px', transition: 'width 1s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card premium-shadow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Extrato Financeiro</h3>
          <button style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Filter size={16} /> Filtrar Período
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase' }}>Descrição</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase' }}>Categoria</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase' }}>Data</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase', textAlign: 'right' }}>Valor</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Sincronizando dados...</td></tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ opacity: 0.4, marginBottom: '1rem' }}><BarChart3 size={48} style={{ margin: '0 auto' }} /></div>
                    <p style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Inicie sua gestão financeira adicionando a primeira transação.</p>
                  </td>
                </tr>
              ) : transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.type === 'INCOME' ? '#d1fae5' : '#fee2e2', color: t.type === 'INCOME' ? '#059669' : '#dc2626' }}>
                      {t.type === 'INCOME' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{t.description}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{t.category || 'Geral'}</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.95rem', fontWeight: '900', color: t.type === 'INCOME' ? '#059669' : '#dc2626' }}>
                    {t.type === 'INCOME' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }}><Edit size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        title={editingTransaction ? 'Editar Transação' : 'Nova Transação Financeira'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Descrição do Lançamento</label>
            <input name="description" required defaultValue={editingTransaction?.description} placeholder="Ex: Assinatura Google Workspace, Venda Consultoria..." style={{ padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Valor Real (R$)</label>
              <input name="amount" type="number" step="0.01" required defaultValue={editingTransaction?.amount} placeholder="0.00" style={{ padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Tipo de Movimentação</label>
              <select name="type" required defaultValue={editingTransaction?.type || 'EXPENSE'} style={{ padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', background: 'white' }}>
                <option value="INCOME">Receita / Entrada (+)</option>
                <option value="EXPENSE">Despesa / Saída (-)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Categoria / Centro de Custo</label>
              <input name="category" defaultValue={editingTransaction?.category} placeholder="Ex: Infra, Marketing, Pessoal..." style={{ padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Data do Lançamento</label>
              <input name="date" type="date" required defaultValue={editingTransaction?.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} style={{ padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.85rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700', background: 'white', cursor: 'pointer' }}>Descartar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.85rem', borderRadius: '10px', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Salvar Transação</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinancePage;
