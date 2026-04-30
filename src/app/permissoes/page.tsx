'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, MoreVertical, Plus, UserCheck, Lock } from 'lucide-react';

export default function PermissoesGlobaisPage() {
  const users = [
    { id: 1, name: 'Administrador Órbita', email: 'admin@orbita180.com', role: 'Global Admin', scope: 'Sistema Completo', status: 'Ativo' },
    { id: 2, name: 'Prof. Carlos Mendes', email: 'carlos@ufpr.edu.br', role: 'Mentor', scope: 'UFPR Acelera', status: 'Ativo' },
    { id: 3, name: 'Carla Souza', email: 'carla@sebrae.com.br', role: 'Institution Admin', scope: 'Sebrae RS', status: 'Ativo' },
    { id: 4, name: 'Daniel Borges', email: 'daniel@techinova.com', role: 'Startup Founder', scope: 'TechInova', status: 'Ativo' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Permissões & Acessos Globais</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gestão centralizada de usuários, papéis e privilégios na plataforma.</p>
        </div>
        <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Novo Usuário
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '3px solid #3b82f6' }}>
          <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '12px', color: '#3b82f6' }}><UserCheck size={24} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Total de Usuários Ativos</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1.250</p></div>
        </div>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '3px solid #8b5cf6' }}>
          <div style={{ padding: '0.75rem', background: '#f3e8ff', borderRadius: '12px', color: '#8b5cf6' }}><ShieldCheck size={24} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Gestores Institucionais</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>42</p></div>
        </div>
        <div className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '3px solid #ef4444' }}>
          <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '12px', color: '#ef4444' }}><Lock size={24} /></div>
          <div><p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Contas Bloqueadas</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</p></div>
        </div>
      </div>

      <div className="card premium-shadow" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--muted)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <Search size={18} color="var(--muted-foreground)" />
            <input placeholder="Buscar usuário por e-mail ou nome..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
          </div>
          <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}>
            <option>Todos os Papéis</option>
            <option>Global Admin</option>
            <option>Institution Admin</option>
            <option>Mentor</option>
            <option>Startup Founder</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Usuário</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Papel (Role)</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Escopo / Vínculo</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{u.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{u.email}</p>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', background: u.role.includes('Admin') ? '#f3e8ff' : 'var(--muted)', color: u.role.includes('Admin') ? '#8b5cf6' : 'var(--foreground)', borderRadius: '4px', fontWeight: '700' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--muted-foreground)', fontWeight: '500' }}>{u.scope}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: u.status === 'Ativo' ? '#d1fae5' : '#fee2e2', color: u.status === 'Ativo' ? '#10b981' : '#ef4444', borderRadius: '4px', fontWeight: '700' }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
