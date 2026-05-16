'use client';

import React, { useState, useEffect } from 'react';
import { KanbanColumn, KanbanCard } from '@/components/ui/Kanban';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Phone, 
  MoreVertical,
  Send,
  User,
  Paperclip,
  Smile,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getLeads, createLead, updateLead, deleteLead } from '@/lib/actions/crm';
import Modal from '@/components/ui/Modal';

const CRMPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'funnel' | 'whatsapp'>('funnel');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.startupId) {
      loadLeads(user.startupId);
    }
  }, [user]);

  async function loadLeads(startupId: string) {
    setLoading(true);
    const data = await getLeads(startupId);
    setLeads(data);
    setLoading(false);
  }

  async function handleAddLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.startupId) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: user.startupId,
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      value: parseFloat(formData.get('value') as string) || 0,
      status: 'NEW',
      priority: formData.get('priority') as string,
      email: formData.get('email') as string,
    };

    const res = await createLead(data);
    if (res.success) {
      setIsModalOpen(false);
      loadLeads(user.startupId);
    }
  }

  const columns = [
    { id: 'NEW', title: 'Novo Lead', color: '#3b82f6' },
    { id: 'QUALIFIED', title: 'Qualificado', color: '#8b5cf6' },
    { id: 'PROPOSAL', title: 'Proposta', color: '#f59e0b' },
    { id: 'NEGOTIATION', title: 'Negociação', color: '#10b981' },
    { id: 'WON', title: 'Fechado', color: '#059669' },
  ];

  return (
    <div style={{ height: 'calc(100vh - var(--header-height) - 4rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>CRM & Leads</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie suas oportunidades e conversas em um só lugar.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--secondary)', padding: '0.4rem', borderRadius: 'var(--radius)' }}>
            <button 
              onClick={() => setActiveTab('funnel')}
              style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: 'calc(var(--radius) - 4px)', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                background: activeTab === 'funnel' ? 'white' : 'transparent',
                boxShadow: activeTab === 'funnel' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                color: activeTab === 'funnel' ? 'var(--primary)' : 'var(--muted-foreground)'
              }}
            >
              Funil de Vendas
            </button>
            <button 
              onClick={() => setActiveTab('whatsapp')}
              style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: 'calc(var(--radius) - 4px)', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                background: activeTab === 'whatsapp' ? 'white' : 'transparent',
                boxShadow: activeTab === 'whatsapp' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                color: activeTab === 'whatsapp' ? 'var(--primary)' : 'var(--muted-foreground)'
              }}
            >
              WhatsApp Web
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="premium-gradient" 
            style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Novo Lead
          </button>
        </div>
      </div>

      {activeTab === 'funnel' ? (
        <div style={{ overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', minWidth: 'max-content' }}>
            {columns.map(col => (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                count={leads.filter(l => l.status === col.id).length} 
                color={col.color}
              >
                {leads.filter(l => l.status === col.id).map(lead => (
                  <KanbanCard 
                    key={lead.id} 
                    id={lead.id} 
                    title={lead.name} 
                    subtitle={lead.company} 
                    value={`R$ ${lead.value.toLocaleString('pt-BR')}`} 
                    priority={lead.priority} 
                    tags={[]} 
                  />
                ))}
                {leads.filter(l => l.status === col.id).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.3, fontSize: '0.8rem' }}>Sem leads</div>
                )}
              </KanbanColumn>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '350px 1fr', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Chat List Placeholder */}
          <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <MessageCircle size={48} color="var(--muted-foreground)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Integre seu WhatsApp para ver as conversas aqui.</p>
          </div>
          <div style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <p style={{ color: 'var(--muted-foreground)' }}>Selecione uma conversa</p>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Lead">
        <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Nome do Contato</label>
            <input name="name" required placeholder="Ex: João Silva" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Empresa / Projeto</label>
            <input name="company" placeholder="Ex: Tech Solutions" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Valor Estimado (R$)</label>
              <input name="value" type="number" placeholder="5000" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Prioridade</label>
              <select name="priority" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>E-mail</label>
            <input name="email" type="email" placeholder="joao@email.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <button type="submit" className="premium-gradient" style={{ marginTop: '1rem', padding: '0.75rem', color: 'white', borderRadius: '8px', fontWeight: '700' }}>Salvar Lead</button>
        </form>
      </Modal>

      <style jsx>{`
        .chat-item:hover {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default CRMPage;
