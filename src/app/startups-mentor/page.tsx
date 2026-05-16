'use client';

import React, { useState } from 'react';
import { Users, MessageSquare, Star, Clock, TrendingUp, Award, Calendar, ChevronRight, CheckCircle, AlertCircle, FileText, Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';

const startups = [
  { id: 1, name: 'TechInova', founder: 'Daniel Borges', stage: 'Tração', maturity: 72, mrr: 'R$ 12.500', pending: 2, lastContact: '2 dias' },
  { id: 2, name: 'EcoFlow', founder: 'Mariana Lima', stage: 'Validação', maturity: 45, mrr: 'R$ 1.800', pending: 0, lastContact: '5 dias' },
  { id: 3, name: 'HealthLink', founder: 'Pedro Costa', stage: 'MVP', maturity: 30, mrr: 'R$ 0', pending: 3, lastContact: '1 dia' },
  { id: 4, name: 'EduVance', founder: 'Carla Souza', stage: 'Ideação', maturity: 15, mrr: 'R$ 0', pending: 1, lastContact: '10 dias' },
];

export default function MentorStartupsPage() {
  const [selected, setSelected] = useState<typeof startups[0] | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Startups Acompanhadas</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Monitore a evolução e registre feedbacks das suas tutorias.</p>
        </div>
        <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Registrar Mentoria
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Startups Tutoradas', value: '4', icon: Users, color: '#3b82f6' },
          { label: 'Mentorias Realizadas', value: '28', icon: Calendar, color: '#10b981' },
          { label: 'Feedbacks Pendentes', value: '6', icon: MessageSquare, color: '#f59e0b' },
          { label: 'Avaliação Média', value: '4.8★', icon: Star, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: `${s.color}15`, borderRadius: '12px', color: s.color }}><s.icon size={24} /></div>
            <div><p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{s.label}</p><p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s.value}</p></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
        <div className="card premium-shadow" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Lista de Startups</h3>
          </div>
          <div>
            {startups.map((s, i) => (
              <div key={s.id} onClick={() => setSelected(s.id === selected?.id ? null : s)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: i < startups.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', background: selected?.id === s.id ? '#eff6ff' : 'white', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>{s.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: '600' }}>{s.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{s.founder}</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem', borderRadius: '999px', background: 'var(--secondary)', fontWeight: '600' }}>{s.stage}</span>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}><span>Maturidade</span><span style={{ fontWeight: 'bold' }}>{s.maturity}%</span></div>
                  <div style={{ height: '6px', background: 'var(--secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${s.maturity}%`, height: '100%', background: s.maturity > 60 ? '#10b981' : s.maturity > 30 ? 'var(--primary)' : '#f59e0b', borderRadius: '999px' }} />
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: s.mrr !== 'R$ 0' ? '#10b981' : 'var(--muted-foreground)' }}>{s.mrr}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {s.pending > 0 && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#fee2e2', color: '#dc2626', borderRadius: '999px', fontWeight: '700' }}>{s.pending} pendências</span>}
                  <ChevronRight size={16} color="var(--muted-foreground)" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className="card premium-shadow animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selected.name}</h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>{selected.founder}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[['Estágio', selected.stage], ['MRR', selected.mrr], ['Último Contato', selected.lastContact], ['Maturidade', `${selected.maturity}%`]].map(([l, v]) => (
                <div key={l} style={{ padding: '0.75rem', background: 'var(--muted)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{l}</p>
                  <p style={{ fontWeight: '700', marginTop: '0.25rem' }}>{v}</p>
                </div>
              ))}
            </div>

            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem' }}>Diagnóstico Rápido</p>
              {[['Produto & Tech', 65], ['Mercado & Vendas', 40], ['Equipe', 80], ['Financeiro', 30]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}><span>{label}</span><span style={{ fontWeight: '700' }}>{val}%</span></div>
                  <div style={{ height: '6px', background: 'var(--secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: (val as number) > 60 ? '#10b981' : (val as number) > 40 ? 'var(--primary)' : '#f59e0b', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => setFeedbackModal(true)} className="premium-gradient" style={{ color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} /> Registrar Feedback
              </button>
              <button style={{ padding: '0.75rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> Agendar Mentoria
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={feedbackModal} onClose={() => setFeedbackModal(false)} title={`Feedback — ${selected?.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Área Avaliada</label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}>
              <option>Pitch & Apresentação</option>
              <option>Produto & MVP</option>
              <option>Mercado & Vendas</option>
              <option>Modelo de Negócio</option>
              <option>Equipe & Governança</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Nota (1-5)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--secondary)', fontWeight: '700', fontSize: '1rem' }}>{'★'.repeat(n)}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Observações</label>
            <textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Descreva pontos fortes, melhorias sugeridas e próximos passos..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'none' }} />
          </div>
          <button onClick={() => { setFeedbackModal(false); setFeedback(''); }} style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '700' }}>
            Salvar Feedback
          </button>
        </div>
      </Modal>
    </div>
  );
}
