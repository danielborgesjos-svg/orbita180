'use client';

import React, { useState } from 'react';
import { KanbanColumn, KanbanCard } from '@/components/ui/Kanban';
import { 
  Search, 
  Filter, 
  Plus, 
  MessageCircle, 
  Phone, 
  MoreVertical,
  Send,
  User,
  Paperclip,
  Smile
} from 'lucide-react';

const CRMPage = () => {
  const [activeTab, setActiveTab] = useState<'funnel' | 'whatsapp'>('funnel');

  return (
    <div style={{ height: 'calc(100vh - var(--header-height) - 4rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>CRM & Leads</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie suas oportunidades e conversas em um só lugar.</p>
        </div>
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
      </div>

      {activeTab === 'funnel' ? (
        <div style={{ overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', minWidth: 'max-content' }}>
            <KanbanColumn id="novo-lead" title="Novo Lead" count={12} color="#3b82f6">
              <KanbanCard id="crm-lead-1" title="João Silva" subtitle="Projeto Educação" value="R$ 5.000" priority="Média" tags={[{label: 'Inbound', color: '#3b82f6'}]} />
              <KanbanCard id="crm-lead-2" title="Maria Oliveira" subtitle="Plataforma SaaS" value="R$ 12.000" priority="Alta" tags={[{label: 'Recomendação', color: '#8b5cf6'}]} />
            </KanbanColumn>
            
            <KanbanColumn id="qualificado" title="Qualificado" count={5} color="#8b5cf6">
              <KanbanCard id="crm-lead-3" title="Empresa ABC" subtitle="Consultoria B2B" value="R$ 25.000" priority="Alta" tags={[{label: 'Enterprise', color: '#10b981'}]} />
            </KanbanColumn>
            
            <KanbanColumn id="proposta" title="Proposta" count={3} color="#f59e0b">
              <KanbanCard id="crm-lead-4" title="Carlos Santos" subtitle="App Delivery" value="R$ 8.500" priority="Baixa" tags={[{label: 'Urgent', color: '#ef4444'}]} />
            </KanbanColumn>
            
            <KanbanColumn id="negociacao" title="Negociação" count={2} color="#10b981">
              <KanbanCard id="crm-lead-5" title="Tech Solutions" subtitle="Integração API" value="R$ 45.000" priority="Alta" />
            </KanbanColumn>
            
            <KanbanColumn id="fechado" title="Fechado" count={24} color="#059669">
              <KanbanCard id="crm-lead-6" title="Studio X" value="R$ 15.000" />
            </KanbanColumn>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '350px 1fr', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Chat List */}
          <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
                <Search size={16} color="var(--muted-foreground)" />
                <input placeholder="Buscar conversas..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem' }} />
              </div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {[1, 2, 3, 4, 5].map((chat) => (
                <div key={chat} style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f8fafc', cursor: 'pointer' }} className="chat-item">
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--secondary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Cliente {chat}</h5>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>10:30</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Olá, gostaria de saber mais sobre o plano institucional...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="var(--primary)" />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Cliente 1 (João Silva)</h5>
                  <p style={{ fontSize: '0.75rem', color: '#10b981' }}>Online</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted-foreground)' }}>
                <Phone size={18} />
                <MoreVertical size={18} />
              </div>
            </div>

            <div style={{ flex: 1, padding: '2rem', background: '#fafafa', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: 'white', padding: '0.75rem 1rem', borderRadius: '0 12px 12px 12px', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                Olá! Vi sua plataforma e fiquei interessado.
              </div>
              <div style={{ alignSelf: 'flex-end', maxWidth: '70%', background: 'var(--primary)', color: 'white', padding: '0.75rem 1rem', borderRadius: '12px 12px 0 12px', fontSize: '0.9rem' }}>
                Oi João! Tudo bem? Que ótimo. Como posso te ajudar hoje?
              </div>
            </div>

            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--muted)', padding: '0.75rem 1.25rem', borderRadius: '999px' }}>
                <Smile size={20} color="var(--muted-foreground)" />
                <Paperclip size={20} color="var(--muted-foreground)" />
                <input placeholder="Digite uma mensagem..." style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: '0.9rem' }} />
                <button style={{ color: 'var(--primary)' }}>
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-item:hover {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default CRMPage;
