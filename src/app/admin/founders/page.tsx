'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, UserX, Clock, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPendingFounders, approveFounder, rejectFounder } from '@/lib/actions/admin';

export default function AdminFoundersPage() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const { user } = useAuth();

  async function load() {
    setLoading(true);
    const res = await getPendingFounders();
    if (res.success) setFounders(res.founders || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id: string) {
    setProcessing(id);
    const res = await approveFounder(id, user?.id);
    if (res.success) {
      setFounders(prev => prev.filter(f => f.id !== id));
    } else {
      alert(res.error || 'Erro ao aprovar.');
    }
    setProcessing(null);
  }

  async function handleReject(id: string) {
    setProcessing(id);
    const res = await rejectFounder(id);
    if (res.success) {
      setFounders(prev => prev.filter(f => f.id !== id));
    } else {
      alert(res.error || 'Erro ao rejeitar.');
    }
    setProcessing(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>Aprovações de Founders</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Gerencie as solicitações de cadastro de novos founders na plataforma.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>Carregando solicitações...</div>
        ) : founders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
            <ShieldCheck size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Tudo Limpo!</h3>
            <p style={{ color: '#64748B' }}>Não há novas solicitações de cadastro no momento.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {founders.map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} color="#6366f1" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>{f.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                      <strong>{f.startupName}</strong> • {f.role} • CPF: {f.cpf || 'N/D'}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>{f.email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => handleReject(f.id)} 
                    disabled={processing === f.id}
                    style={{ padding: '0.6rem 1rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                  >
                    <UserX size={16} /> Rejeitar
                  </button>
                  <button 
                    onClick={() => handleApprove(f.id)} 
                    disabled={processing === f.id}
                    style={{ padding: '0.6rem 1rem', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                  >
                    <UserCheck size={16} /> Aprovar Acesso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
