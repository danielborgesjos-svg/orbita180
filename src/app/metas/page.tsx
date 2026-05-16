'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { 
  Target, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Users, 
  MoreHorizontal,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getGoals, createGoal, updateGoal, deleteGoal, createActionPlan } from '@/lib/actions/goals';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.startupId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function loadData() {
    if (!user?.startupId) return;
    setLoading(true);
    const data = await getGoals(user.startupId);
    setGoals(data);
    setLoading(false);
  }

  async function handleGoalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.startupId) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: user.startupId,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      target_date: new Date(formData.get('target_date') as string)
    };

    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
    } else {
      await createGoal(data);
    }

    setIsGoalModalOpen(false);
    setEditingGoal(null);
    loadData();
  }

  async function handlePlanSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      goal_id: selectedGoal.id,
      description: formData.get('description') as string,
      responsible_id: formData.get('responsible_id') as string,
      due_date: new Date(formData.get('due_date') as string)
    };

    await createActionPlan(data);
    setIsPlanModalOpen(false);
    loadData();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>Metas & Plano de Ação</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>Defina objetivos estratégicos e desdobre em ações práticas.</p>
        </div>
        <button 
          onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
          className="premium-gradient" 
          style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} /> Nova Meta
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {loading ? (
          <p>Carregando metas...</p>
        ) : goals.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: '#F8FAFC', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
             <Target size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
             <h3 style={{ color: '#64748B', fontWeight: 700 }}>Nenhuma meta definida</h3>
             <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Comece definindo seu primeiro objetivo estratégico.</p>
          </div>
        ) : goals.map((goal) => (
          <div key={goal.id} className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', borderRadius: '24px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E293B' }}>{goal.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.35rem' }}>
                    <Clock size={14} /> Até {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }} style={{ color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><Edit size={16} /></button>
                 <button onClick={() => deleteGoal(goal.id).then(loadData)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6' }}>{goal.description}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>Plano de Ação</h4>
                <button 
                  onClick={() => { setSelectedGoal(goal); setIsPlanModalOpen(true); }}
                  style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={14} /> Add Ação
                </button>
              </div>

              {goal.actionPlans?.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
                  Nenhuma ação definida.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {goal.actionPlans.map((plan: any) => (
                    <div key={plan.id} style={{ padding: '1rem', borderRadius: '16px', border: '1px solid #F1F5F9', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: plan.status === 'DONE' ? '#10b981' : '#94A3B8' }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E293B' }}>{plan.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                            <Users size={12} /> {plan.responsible?.name || 'Membro'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>• {new Date(plan.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '100px', height: '8px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1E293B' }}>45%</span>
              </div>
              <button style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Detalhes <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isGoalModalOpen} 
        onClose={() => { setIsGoalModalOpen(false); setEditingGoal(null); }}
        title={editingGoal ? 'Editar Meta' : 'Nova Meta Estratégica'}
      >
        <form onSubmit={handleGoalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Título da Meta</label>
            <input name="title" required defaultValue={editingGoal?.title} placeholder="Ex: Atingir R$ 10k MRR" style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Descrição / OKR</label>
            <textarea name="description" required defaultValue={editingGoal?.description} rows={3} placeholder="Descreva o sucesso..." style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', resize: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Prazo Estimado</label>
            <input name="target_date" type="date" required defaultValue={editingGoal?.target_date ? new Date(editingGoal.target_date).toISOString().split('T')[0] : ''} style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setIsGoalModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', fontWeight: '700', color: '#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1.5, padding: '1rem', borderRadius: '14px', color: 'white', fontWeight: '800' }}>Salvar Meta</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)}
        title="Adicionar Ação ao Plano"
      >
        <form onSubmit={handlePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>O que precisa ser feito?</label>
            <input name="description" required placeholder="Ex: Contratar agência de marketing" style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Responsável (ID)</label>
            <input name="responsible_id" required placeholder="ID do usuário responsável" style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Prazo da Ação</label>
            <input name="due_date" type="date" required style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', fontWeight: '700', color: '#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1.5, padding: '1rem', borderRadius: '14px', color: 'white', fontWeight: '800' }}>Adicionar Ação</button>
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
};

export default GoalsPage;
