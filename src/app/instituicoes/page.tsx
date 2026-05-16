'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Download, MoreVertical, MapPin, Users, Target, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getInstitutions, createInstitution, deleteInstitution } from '@/lib/actions/institutions';

export default function InstituicoesPage() {
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getInstitutions();
    setInstituicoes(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await createInstitution({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: 'ACTIVE'
    });

    if (res.success) {
      setIsModalOpen(false);
      load();
    } else {
      alert(res.error);
    }
  }

  const inp = {
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    width: '100%',
    outline: 'none',
    fontSize: '0.95rem',
    backgroundColor: '#F8FAFC',
    transition: 'all 0.2s',
    color: '#1E293B'
  };
  const lbl = {
    fontSize: '0.8rem',
    fontWeight: '700' as const,
    display: 'block' as const,
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    color: '#64748B'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>Gestão de Instituições</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>Controle os hubs clientes da Órbita 180.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'white', color: '#64748B' }}>
            <Download size={18} /> Relatório
          </button>
          <button className="premium-gradient" onClick={() => setIsModalOpen(true)}
            style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem', border: 'none', cursor: 'pointer' }}>
            <Plus size={18} /> Nova
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {loading ? (
          <p>Carregando instituições...</p>
        ) : instituicoes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#F8FAFC', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
            <Building2 size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#64748B', fontWeight: 700 }}>Nenhuma cadastrada</h3>
          </div>
        ) : (
          instituicoes.map(inst => (
            <div key={inst.id} className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', borderRadius: '24px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E293B' }}>{inst.name}</h3>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  background: inst.status === 'ACTIVE' ? '#D1FAE5' : '#FEF3C7',
                  color: inst.status === 'ACTIVE' ? '#059669' : '#D97706',
                  borderRadius: '99px',
                  fontWeight: '800'
                }}>{inst.status === 'ACTIVE' ? 'ATIVO' : 'EM SETUP'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.25rem 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Startups</p>
                  <p style={{ fontWeight: '900', marginTop: '0.4rem', fontSize: '1.5rem', color: '#1E293B' }}>{inst._count?.startups || 0}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Programas</p>
                  <p style={{ fontWeight: '900', marginTop: '0.4rem', fontSize: '1.5rem', color: '#1E293B' }}>{inst._count?.programs || 0}</p>
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: '1rem',
                color: 'var(--primary)',
                fontWeight: '800',
                fontSize: '0.95rem',
                background: 'var(--secondary)',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer'
              }}>
                Painel Estratégico
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Instituição">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={lbl}>Nome da Instituição *</label>
            <input name="name" required style={inp} placeholder="Ex: Hub de Inovação SENAI" />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', fontWeight: 700, color: '#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1.5, padding: '1rem', color: 'white', borderRadius: '14px', fontWeight: 800 }}>Criar</button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        @media (max-width: 768px) {
          .dash-header h1 { font-size: 1.75rem !important; }
        }
      `}</style>
    </div>
  );
}
