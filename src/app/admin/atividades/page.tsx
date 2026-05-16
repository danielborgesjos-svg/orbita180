'use client';

import React, { useEffect, useState } from 'react';
import { Activity, User, Calendar, Info } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

// Since we need to fetch logs, let's create a quick action or use a client-side fetch if possible
// But we'll create a server action for this.

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // We'll create this action next
      const { getActivityLogs } = await import('@/lib/actions/admin');
      const res = await getActivityLogs();
      if (res.success) setLogs(res.logs || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>Histórico de Atividades</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Registro completo de ações administrativas e aprovações no sistema.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>Carregando histórico...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
            <Activity size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Nenhuma atividade registrada</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#F8FAFC' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>{log.details}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.1rem' }}>
                    Por: <strong>{log.user?.name}</strong> • Em: {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div style={{ padding: '0.4rem 0.75rem', background: '#F1F5F9', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>
                  {log.action}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
