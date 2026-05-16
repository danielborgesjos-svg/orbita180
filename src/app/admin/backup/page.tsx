'use client';

import React from 'react';
import { Database, Download, AlertTriangle } from 'lucide-react';

export default function BackupPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>Backup do Sistema</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Realize o download completo do banco de dados (SQLite) para garantir a segurança dos registros.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Database size={32} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Banco de Dados Principal</h3>
            <p style={{ color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Este backup inclui todas as instituições, programas, startups, founders, acessos e logs registrados até o momento. O arquivo gerado estará no formato <strong>.db</strong>.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href="/api/backup" download className="premium-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#0F172A', color: 'white', borderRadius: '12px', fontWeight: 800, textDecoration: 'none' }}>
                <Download size={18} />
                Fazer Download do Backup
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FECACA', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <AlertTriangle size={24} color="#DC2626" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: 800, color: '#991B1B', marginBottom: '0.25rem' }}>Aviso de Segurança</h4>
          <p style={{ color: '#B91C1C', fontSize: '0.85rem', lineHeight: 1.5 }}>
            O arquivo de backup contém dados sensíveis (hashes de senha, CPFs e dados financeiros). Armazene-o em um local seguro e restrito. Nunca compartilhe este arquivo publicamente.
          </p>
        </div>
      </div>
    </div>
  );
}
