'use client';

import React, { useState, useEffect } from 'react';
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
  Edit
} from 'lucide-react';
import { 
  getFinancialTransactions, 
  createFinancialTransaction, 
  updateFinancialTransaction, 
  deleteFinancialTransaction 
} from '@/lib/actions/financial';

const FinancePage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const STARTUP_ID = 'startup-123'; // Mock

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getFinancialTransactions(STARTUP_ID);
    setTransactions(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: STARTUP_ID,
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

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'INCOME') acc.income += Number(curr.amount);
    else acc.expense += Number(curr.amount);
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

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
            Exportar
          </button>
          <button 
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
            className="premium-gradient" 
            style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Nova Transação
          </button>
        </div>
      </div>

      {/* Finance Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Saldo Atual" value={`R$ ${balance.toLocaleString('pt-BR')}`} icon={Wallet} change={8} />
        <StatsCard title="Receitas" value={`R$ ${totals.income.toLocaleString('pt-BR')}`} icon={ArrowUpCircle} color="var(--primary)" />
        <StatsCard title="Despesas" value={`R$ ${totals.expense.toLocaleString('pt-BR')}`} icon={ArrowDownCircle} color="var(--destructive)" />
        <StatsCard title="Ticket Médio" value="R$ 1.250" icon={PieChart} change={15} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem' }}>
        {/* Cash Flow Simulation */}
        <div className="card premium-shadow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Fluxo de Caixa (Simulação)</h3>
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

        {/* Categories */}
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Distribuição de Gastos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Servidores & Infra', value: 'R$ 8.500', perc: 65, color: 'var(--primary)' },
              { label: 'Marketing', value: 'R$ 3.200', perc: 25, color: '#8b5cf6' },
              { label: 'Operacional', value: 'R$ 1.300', perc: 10, color: '#10b981' },
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

      {/* Transactions Table */}
      <div className="card premium-shadow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Extrato Detalhado</h3>
          <button style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={16} /> Filtrar
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>DESCRIÇÃO</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>CATEGORIA</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>DATA</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600', textAlign: 'right' }}>VALOR</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600', textAlign: 'center' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>Nenhuma transação encontrada.</td></tr>
              ) : transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--secondary)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '8px', background: t.type === 'INCOME' ? '#d1fae5' : '#fee2e2', color: t.type === 'INCOME' ? '#059669' : '#dc2626' }}>
                      {t.type === 'INCOME' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{t.description}</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--secondary)', fontSize: '0.7rem', fontWeight: '600' }}>{t.category || 'Geral'}</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '700', color: t.type === 'INCOME' ? '#059669' : '#dc2626' }}>
                    {t.type === 'INCOME' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }} style={{ color: 'var(--muted-foreground)' }}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(t.id)} style={{ color: 'var(--destructive)' }}><Trash2 size={16} /></button>
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
        title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Descrição</label>
            <input name="description" required defaultValue={editingTransaction?.description} placeholder="Ex: Pagamento AWS, Venda Plano Pro..." style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Valor (R$)</label>
              <input name="amount" type="number" step="0.01" required defaultValue={editingTransaction?.amount} placeholder="0.00" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tipo</label>
              <select name="type" required defaultValue={editingTransaction?.type || 'EXPENSE'} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white' }}>
                <option value="INCOME">Entrada (+)</option>
                <option value="EXPENSE">Saída (-)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Categoria</label>
              <input name="category" defaultValue={editingTransaction?.category} placeholder="Ex: Infra, Marketing..." style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Data</label>
              <input name="date" type="date" required defaultValue={editingTransaction?.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: '600' }}>Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinancePage;
