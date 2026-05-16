'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Users, BarChart3, ChevronRight, Plus, ArrowRight, Building2, Star } from 'lucide-react';
import Link from 'next/link';
import { getProgramsByInstitution } from '@/lib/actions/programs';
import { getInstitutions } from '@/lib/actions/institutions';

export default function ProgramasPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ies = await getInstitutions();
      setInstitutions(ies);
      const all: any[] = [];
      for (const inst of ies) {
        const progs = await getProgramsByInstitution(inst.id);
        all.push(...progs.map((p: any) => ({ ...p, institution: inst })));
      }
      setPrograms(all);
      setLoading(false);
    }
    load();
  }, []);

  const typeColor: Record<string, string> = {
    ACELERACAO: '#6366f1',
    INCUBACAO: '#10b981',
    MENTORIA: '#f59e0b',
    CAPACITACAO: '#3b82f6',
  };

  const typeLabel: Record<string, string> = {
    ACELERACAO: 'Aceleração',
    INCUBACAO: 'Incubação',
    MENTORIA: 'Mentoria',
    CAPACITACAO: 'Capacitação',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
            Projetos & Programas
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
            Gerencie os programas de aceleração vinculados às instituições.
          </p>
        </div>
        <button className="premium-gradient" style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Novo Programa
        </button>
      </div>

      {/* Institutions quick nav */}
      {institutions.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {institutions.map(inst => (
            <Link key={inst.id} href={`/instituicoes/${inst.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', textDecoration: 'none', transition: 'all 0.2s' }}>
              <Building2 size={16} color="var(--primary)" />
              {inst.name}
              <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#64748B' }}>
                {inst._count?.programs || 0} prog.
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Programs grid */}
      {loading ? (
        <p style={{ color: '#94A3B8', padding: '2rem' }}>Carregando programas...</p>
      ) : programs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#F8FAFC', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
          <Briefcase size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748B', fontWeight: 700 }}>Nenhum programa cadastrado</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Crie uma instituição e adicione programas a ela.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {programs.map(prog => {
            const color = typeColor[prog.program_type || ''] || '#6366f1';
            const isGarage = prog.id === 'prog-garage-2026';
            return (
              <div key={prog.id} className="card premium-shadow"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', borderRadius: '24px', background: 'white', position: 'relative', overflow: 'hidden', border: isGarage ? `2px solid ${color}` : '1px solid #F1F5F9' }}>
                
                {isGarage && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FEF9C3', color: '#B45309', padding: '0.3rem 0.7rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800 }}>
                    <Star size={12} fill="#B45309" /> PROGRAMA ATIVO
                  </div>
                )}

                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }} />

                <div style={{ paddingLeft: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem', borderRadius: '6px', background: `${color}18`, color, fontWeight: 800, textTransform: 'uppercase' }}>
                      {typeLabel[prog.program_type || ''] || 'Programa'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>
                      {prog.institution?.name}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A' }}>{prog.name}</h3>
                  {prog.description && <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem', lineHeight: 1.5 }}>{prog.description}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '1rem', background: '#F8FAFC', borderRadius: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{prog._count?.startups || 0}</p>
                    <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, marginTop: '0.2rem' }}>Startups</p>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{prog._count?.founders || 0}</p>
                    <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, marginTop: '0.2rem' }}>Founders</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 900, color: prog.status === 'ACTIVE' ? '#10b981' : '#94A3B8' }}>
                      {prog.status === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, marginTop: '0.2rem' }}>Status</p>
                  </div>
                </div>

                {prog.start_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>
                    <Calendar size={14} />
                    {new Date(prog.start_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    {prog.end_date && <> → {new Date(prog.end_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</>}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link href={`/programas/${prog.id}/dashboard`}
                    style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', background: color, color: 'white', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                    <BarChart3 size={16} /> Ver Dashboard
                  </Link>
                  <Link href={`/programas/${prog.id}/founders`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', background: '#F1F5F9', color: '#475569', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                    <Users size={15} /> Founders
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
