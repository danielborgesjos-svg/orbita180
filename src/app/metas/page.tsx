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
import { getGoals, createGoal, updateGoal, deleteGoal, createActionPlan } from '@/lib/actions/goals';

const GoalsPage = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const STARTUP_ID = 'startup-123'; // Mock

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getGoals(STARTUP_ID);
    setGoals(data);
    setLoading(false);
  }

  async function handleGoalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: STARTUP_ID,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Metas & Plano de Ação</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Defina objetivos estratégicos e desdobre em ações práticas.</p>
        </div>
        <button 
          onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
          className="premium-gradient" 
          style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Nova Meta
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p>Carregando metas...</p>
        ) : goals.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'var(--secondary)30', borderRadius: 'var(--radius)' }}>
             <Target size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
             <p>Comece definindo sua primeira meta estratégica.</p>
          </div>
        ) : goals.map((goal) => (
          <div key={goal.id} className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)15', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{goal.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
                    <Clock size={14} /> Até {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }} style={{ color: 'var(--muted-foreground)' }}><Edit size={16} /></button>
                 <button onClick={() => deleteGoal(goal.id).then(loadData)} style={{ color: 'var(--destructive)' }}><Trash2 size={16} /></button>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: '1.5' }}>{goal.description}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Plano de Ação</h4>
                <button 
                  onClick={() => { setSelectedGoal(goal); setIsPlanModalOpen(true); }}
                  style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Plus size={14} /> Add Ação
                </button>
              </div>

              {goal.actionPlans?.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontStyle: 'italic', padding: '1rem', background: 'var(--secondary)30', borderRadius: '8px', textAlign: 'center' }}>
                  Nenhuma ação definida para esta meta.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {goal.actionPlans.map((plan: any) => (
                    <div key={plan.id} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: plan.status === 'DONE' ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{plan.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Users size={12} /> {plan.responsible?.name || 'Não atribuído'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>• {new Date(plan.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <button style={{ color: 'var(--muted-foreground)' }}><MoreHorizontal size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '100px', height: '6px', background: 'var(--secondary)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>45%</span>
              </div>
              <button style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Ver Detalhes <ArrowRight size={14} />
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
        <form onSubmit={handleGoalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Título da Meta</label>
            <input name="title" required defaultValue={editingGoal?.title} placeholder="Ex: Atingir R$ 10k MRR" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Descrição / OKR</label>
            <textarea name="description" required defaultValue={editingGoal?.description} rows={3} placeholder="Descreva o que significa o sucesso para esta meta..." style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Prazo Estimado</label>
            <input name="target_date" type="date" required defaultValue={editingGoal?.target_date ? new Date(editingGoal.target_date).toISOString().split('T')[0] : ''} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsGoalModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: '600' }}>Salvar Meta</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)}
        title="Adicionar Ação ao Plano"
      >
        <form onSubmit={handlePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>O que precisa ser feito?</label>
            <input name="description" required placeholder="Ex: Contratar agência de marketing" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Responsável (ID)</label>
            <input name="responsible_id" required placeholder="ID do usuário responsável" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Prazo da Ação</label>
            <input name="due_date" type="date" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: '600' }}>Adicionar Ação</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
