'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Building2, TrendingUp, Users, DollarSign, Download, MoreVertical, Edit, Trash2, PowerOff, ShieldCheck } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { getAllStartupsDetailed, updateStartup, deleteStartup } from '@/lib/actions/startup';
import { getInstitutions } from '@/lib/actions/institutions';

export default function TodasStartupsPage() {
  const { user } = useAuth();
  const [startupsList, setStartupsList] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [s, i] = await Promise.all([
      getAllStartupsDetailed(),
      getInstitutions()
    ]);
    setStartupsList(s);
    setInstitutions(i);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta startup do ecossistema?')) {
      await deleteStartup(id);
      load();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateStartup(id, { status: newStatus });
    load();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await updateStartup(selectedStartup.id, {
      name: f.get('name') as string,
      cnpj: f.get('cnpj') as string,
      segment: f.get('segment') as string,
      stage: f.get('stage') as string,
    });
    setIsModalOpen(false);
    load();
  };

  const inp = { padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', outline: 'none', fontSize: '0.9rem', background: '#F8FAFC' };
  const lbl = { fontSize: '0.8rem', fontWeight: '700' as const, color: '#64748B', marginBottom: '0.4rem', display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem', color: '#0F172A', letterSpacing: '-0.04em' }}>Gestão de Startups</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>Painel administrativo para controle e monitoramento do ecossistema.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: '#64748B' }}>
            <Download size={18} /> Exportar CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#F1F5F9', padding: '0.6rem 1.25rem', borderRadius: '12px' }}>
          <Search size={18} color="#94A3B8" />
          <input placeholder="Buscar por nome, CNPJ, segmento ou instituição..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1E293B' }} />
        </div>
        <select style={{ padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem', background: 'white', color: '#475569', fontWeight: 600 }}>
          <option>Todos os Estágios</option>
          <option>Ideação</option>
          <option>MVP</option>
          <option>Validação</option>
          <option>Tração</option>
          <option>Escala</option>
        </select>
      </div>

      <div className="card premium-shadow" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Startup</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>CNPJ</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>IE Vinculada</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Estágio</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Carregando startups...</td></tr>
            ) : startupsList.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Nenhuma startup encontrada.</td></tr>
            ) : startupsList.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < startupsList.length - 1 ? '1px solid #F1F5F9' : 'none', transition: 'background 0.2s' }} className="hover-row">
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem', border: '1px solid rgba(37,99,235,0.1)' }}>{s.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B' }}>{s.name}</p>
                      <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{s.segment}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{s.cnpj || '---'}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
                  {s.institutions?.[0]?.institution?.name || 'Sem vínculo'}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', background: '#F1F5F9', color: '#475569', borderRadius: '99px', fontWeight: '800' }}>{s.stage}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.status === 'ACTIVE' ? '#10b981' : '#ef4444' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: s.status === 'ACTIVE' ? '#059669' : '#B91C1C' }}>{s.status === 'ACTIVE' ? 'ATIVA' : 'INATIVA'}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                   <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => { setSelectedStartup(s); setIsModalOpen(true); }} style={{ color: '#94A3B8', padding: '0.5rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }} title="Editar"><Edit size={16}/></button>
                      <button onClick={() => handleToggleStatus(s.id, s.status)} style={{ color: '#F59E0B', padding: '0.5rem', borderRadius: '10px', background: '#FFFBEB', border: '1px solid #FEF3C7' }} title="Inativar/Ativar"><PowerOff size={16}/></button>
                      {isAdmin && <button onClick={() => handleDelete(s.id)} style={{ color: '#EF4444', padding: '0.5rem', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FEE2E2' }} title="Excluir"><Trash2 size={16}/></button>}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Editar Startup (Admin)">
         <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={lbl}>Nome da Startup *</label>
                <input name="name" defaultValue={selectedStartup?.name} required style={inp} />
              </div>
              <div>
                <label style={lbl}>CNPJ</label>
                <input name="cnpj" defaultValue={selectedStartup?.cnpj} style={inp} placeholder="00.000.000/0000-00" />
              </div>
              <div>
                <label style={lbl}>Segmento</label>
                <input name="segment" defaultValue={selectedStartup?.segment} style={inp} placeholder="Ex: FinTech" />
              </div>
              <div>
                <label style={lbl}>Estágio Atual</label>
                <select name="stage" defaultValue={selectedStartup?.stage} style={inp}>
                  <option value="Ideação">Ideação</option>
                  <option value="MVP">MVP</option>
                  <option value="Validação">Validação</option>
                  <option value="Tração">Tração</option>
                  <option value="Escala">Escala</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', fontWeight: 700, color: '#64748B' }}>Cancelar</button>
              <button type="submit" className="premium-gradient" style={{ flex: 1.5, padding: '1rem', borderRadius: '14px', color: 'white', fontWeight: 800 }}>Salvar Alterações</button>
            </div>
         </form>
      </Modal>

      <style jsx>{`
        .hover-row:hover {
          background: #F8FAFC;
        }
      `}</style>
    </div>
  );
}
