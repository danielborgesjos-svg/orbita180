'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Lightbulb, Target, Users, DollarSign, Zap, Layers, Download, 
  Plus, Edit3, MessageSquare, ChevronRight, Star, Clock, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useStartupData } from '@/context/StartupDataContext';
import { createGoal, getGoals, createActionPlan } from '@/lib/actions/goals';

type CanvasType = 'lean' | 'bmc' | 'value' | 'persona';
type TabType = 'canvas' | 'pitch' | 'plano';

const Award = ({size,color}:any)=><svg width={size} height={size} stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;

// Vibrant colors for canvas blocks
const colors = {
  problem: '#FF3B30',      // Vibrant Red
  solution: '#007AFF',     // Vibrant Blue
  value: '#34C759',        // Vibrant Green
  advantage: '#FF9500',    // Vibrant Orange
  segments: '#AF52DE',     // Vibrant Purple
  channels: '#5AC8FA',     // Vibrant Light Blue
  metrics: '#34C759',      // Vibrant Green
  costs: '#FF3B30',        // Vibrant Red
  revenue: '#34C759',      // Vibrant Green
  partners: '#AF52DE',     // Vibrant Purple
  activities: '#007AFF',   // Vibrant Blue
  resources: '#FF9500'     // Vibrant Orange
};

const CanvasBlock = ({ item, rowSpan = 1, colSpan = 1, style = {}, onEdit, onCreateAction, contextData }: any) => {
  const contentStr = contextData[item.field] || '';
  const contentList = contentStr ? contentStr.split('\n').filter(Boolean) : item.defaultContent;

  return (
    <div className="card premium-shadow animate-fade-in" style={{
      display: 'flex', flexDirection: 'column', gap: '0.75rem', 
      gridRow: `span ${rowSpan}`, gridColumn: `span ${colSpan}`, 
      borderTop: `4px solid ${item.color}`, 
      padding: '1.25rem', minHeight: '130px', 
      background: 'white',
      ...style
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ padding: '0.4rem', background: `${item.color}15`, borderRadius: '8px' }}>
            <item.icon size={18} color={item.color} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E293B' }}>{item.title}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
           <button onClick={() => onCreateAction(item)} title="Criar Ação" style={{ color: 'var(--primary)', padding: '0.2rem' }}><Target size={15} /></button>
           <button onClick={() => onEdit(item)} title="Editar" style={{ color: 'var(--muted-foreground)', padding: '0.2rem' }}><Edit3 size={15} /></button>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', marginTop: '0.5rem' }}>
        {contentList && contentList.length > 0 ? contentList.map((text: string, i: number) => (
          <div key={i} style={{ 
            padding: '0.6rem 0.8rem', 
            background: '#F8FAFC', 
            borderRadius: '6px', 
            fontSize: '0.85rem', 
            border: '1px solid #E2E8F0',
            color: '#334155',
            lineHeight: '1.4'
          }}>{text}</div>
        )) : (
          <div style={{ fontStyle: 'italic', color: 'var(--muted-foreground)', fontSize: '0.8rem', padding: '0.5rem' }}>Nenhuma informação preenchida.</div>
        )}
      </div>
      <button onClick={() => onEdit(item)} style={{ marginTop: 'auto', color: item.color, fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0' }}>
        <Plus size={14} /> Adicionar
      </button>
    </div>
  );
};

export default function StrategyPage() {
  const [tab, setTab] = useState<TabType>('canvas');
  const [canvasType, setCanvasType] = useState<CanvasType>('lean');
  const [pitchSection, setPitchSection] = useState(0);
  
  const { canvasData, updateCanvasField, startupId } = useStartupData();
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [editValue, setEditValue] = useState('');

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionBlock, setActionBlock] = useState<any>(null);

  // Goals state
  const [goals, setGoals] = useState<any[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  useEffect(() => {
    if (tab === 'plano') {
      loadGoals();
    }
  }, [tab]);

  async function loadGoals() {
    setLoadingGoals(true);
    const data = await getGoals(startupId);
    setGoals(data);
    setLoadingGoals(false);
  }

  const leanBlocks = [
    { id: 'problem', title: 'Problema', icon: Zap, color: colors.problem, field: 'lean_problem', defaultContent: [] },
    { id: 'solution', title: 'Solução', icon: Lightbulb, color: colors.solution, field: 'lean_solution', defaultContent: [] },
    { id: 'value', title: 'Proposta de Valor', icon: Target, color: colors.value, field: 'lean_value', defaultContent: [] },
    { id: 'advantage', title: 'Vantagem Injusta', icon: Award, color: colors.advantage, field: 'lean_advantage', defaultContent: [] },
    { id: 'segments', title: 'Segmentos', icon: Users, color: colors.segments, field: 'lean_segments', defaultContent: [] },
    { id: 'channels', title: 'Canais', icon: Layers, color: colors.channels, field: 'lean_channels', defaultContent: [] },
    { id: 'metrics', title: 'Métricas-Chave', icon: Target, color: colors.metrics, field: 'lean_metrics', defaultContent: [] },
    { id: 'costs', title: 'Estrutura de Custos', icon: DollarSign, color: colors.costs, field: 'lean_costs', defaultContent: [] },
    { id: 'revenue', title: 'Fontes de Receita', icon: DollarSign, color: colors.revenue, field: 'lean_revenue', defaultContent: [] },
  ];

  const bmcBlocks = [
    { id: 'partners', title: 'Parceiros-Chave', icon: Users, color: colors.partners, field: 'bmc_partners', defaultContent: [] },
    { id: 'activities', title: 'Atividades-Chave', icon: Zap, color: colors.activities, field: 'bmc_activities', defaultContent: [] },
    { id: 'resources', title: 'Recursos-Chave', icon: Layers, color: colors.resources, field: 'bmc_resources', defaultContent: [] },
    { id: 'value_bmc', title: 'Proposta de Valor', icon: Target, color: colors.value, field: 'bmc_value', defaultContent: [] },
    { id: 'customer_rel', title: 'Relacionamento', icon: MessageSquare, color: colors.solution, field: 'bmc_customer_rel', defaultContent: [] },
    { id: 'channels_bmc', title: 'Canais', icon: Layers, color: colors.channels, field: 'bmc_channels', defaultContent: [] },
    { id: 'segments_bmc', title: 'Segmentos', icon: Users, color: colors.segments, field: 'bmc_segments', defaultContent: [] },
    { id: 'costs_bmc', title: 'Estrutura de Custos', icon: DollarSign, color: colors.costs, field: 'bmc_costs', defaultContent: [] },
    { id: 'revenue_bmc', title: 'Receita', icon: DollarSign, color: colors.revenue, field: 'bmc_revenue', defaultContent: [] },
  ];

  const pitchSections = [
    { id: 'pitch_problem', title: 'Problema', icon: '🎯', desc: 'Qual dor você resolve?', field: 'pitch_problem', default: '' },
    { id: 'pitch_solution', title: 'Solução', icon: '💡', desc: 'Sua abordagem única', field: 'pitch_solution', default: '' },
    { id: 'pitch_market', title: 'Mercado', icon: '📊', desc: 'Tamanho da oportunidade', field: 'pitch_market', default: '' },
    { id: 'pitch_model', title: 'Modelo de Negócio', icon: '💰', desc: 'Como você ganha dinheiro', field: 'pitch_model', default: '' },
    { id: 'pitch_traction', title: 'Tração', icon: '🚀', desc: 'Seus resultados até agora', field: 'pitch_traction', default: '' },
    { id: 'pitch_team', title: 'Time', icon: '👥', desc: 'Quem está executando', field: 'pitch_team', default: '' },
    { id: 'pitch_ask', title: 'Pedido', icon: '🤝', desc: 'O que você está buscando', field: 'pitch_ask', default: '' },
  ];

  const handleEditClick = (block: any) => {
    setEditingBlock(block);
    const currentValue = canvasData[block.field] || (block.defaultContent ? block.defaultContent.join('\n') : '');
    setEditValue(currentValue);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlock) {
      await updateCanvasField(editingBlock.field, editValue);
      setIsEditModalOpen(false);
    }
  };

  const handleCreateActionClick = (block: any) => {
    setActionBlock(block);
    setIsActionModalOpen(true);
  };

  const handleSaveAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // First create a Goal for this block if we just want to create an action directly, 
    // or link it to a generic goal. Let's create a Goal named after the block.
    const goalData = {
      startup_id: startupId,
      title: `Melhoria em: ${actionBlock.title}`,
      description: `Ação estratégica vinculada ao bloco ${actionBlock.title} do Canvas.`,
      target_date: new Date(formData.get('due_date') as string)
    };

    const res = await createGoal(goalData);
    
    if (res.success && res.goal) {
      await createActionPlan({
        goal_id: res.goal.id,
        description: formData.get('description') as string,
        responsible_id: 'user-1', // Mock user
        due_date: new Date(formData.get('due_date') as string)
      });
      alert('Plano de Ação criado com sucesso!');
      setIsActionModalOpen(false);
      if (tab === 'plano') loadGoals();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Estratégia & Execução</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Modele seu negócio, prepare o pitch e defina planos de ação focados.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--secondary)', padding: '0.35rem', borderRadius: 'var(--radius)', width: 'fit-content' }}>
        {([
          ['canvas', '📋 Canvas Estratégico'],
          ['pitch', '🎤 Pitch Builder'],
          ['plano', '🎯 Plano de Ação']
        ] as [TabType, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ 
            padding: '0.6rem 1.25rem', 
            borderRadius: 'calc(var(--radius) - 4px)', 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            background: tab === id ? 'white' : 'transparent', 
            color: tab === id ? 'var(--primary)' : 'var(--muted-foreground)', 
            boxShadow: tab === id ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s'
          }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'canvas' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          {/* Canvas Sub-tabs */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            {([
              ['lean', 'Lean Canvas'],
              ['bmc', 'Business Model Canvas'],
              ['value', 'Value Proposition'],
              ['persona', 'Persona']
            ] as [CanvasType, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setCanvasType(id)} style={{ 
                padding: '0.75rem 0.25rem', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: canvasType === id ? 'var(--primary)' : 'var(--muted-foreground)', 
                borderBottom: canvasType === id ? '2px solid var(--primary)' : '2px solid transparent', 
                marginBottom: '-1px',
                transition: 'all 0.2s'
              }}>
                {label}
              </button>
            ))}
          </div>

          {(canvasType === 'lean' || canvasType === 'bmc') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 'minmax(180px, auto)', gap: '1rem', flex: 1, padding: '0.5rem' }}>
              {canvasType === 'lean' && <>
                <CanvasBlock item={leanBlocks[0]} rowSpan={2} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <CanvasBlock item={leanBlocks[1]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                  <CanvasBlock item={leanBlocks[6]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                </div>
                <CanvasBlock item={leanBlocks[2]} rowSpan={2} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <CanvasBlock item={leanBlocks[3]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                  <CanvasBlock item={leanBlocks[5]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                </div>
                <CanvasBlock item={leanBlocks[4]} rowSpan={2} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                <CanvasBlock item={leanBlocks[7]} style={{ gridColumn: 'span 2' }} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                <CanvasBlock item={leanBlocks[8]} style={{ gridColumn: 'span 3' }} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
              </>}
              {canvasType === 'bmc' && <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <CanvasBlock item={bmcBlocks[0]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                  <CanvasBlock item={bmcBlocks[1]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                  <CanvasBlock item={bmcBlocks[2]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                </div>
                <CanvasBlock item={bmcBlocks[3]} rowSpan={2} style={{ gridColumn: 'span 1' }} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <CanvasBlock item={bmcBlocks[4]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                  <CanvasBlock item={bmcBlocks[5]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                </div>
                <CanvasBlock item={bmcBlocks[6]} rowSpan={2} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <CanvasBlock item={bmcBlocks[7]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                  <CanvasBlock item={bmcBlocks[8]} onEdit={handleEditClick} onCreateAction={handleCreateActionClick} contextData={canvasData} />
                </div>
              </>}
            </div>
          )}

          {canvasType === 'value' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1, padding: '0.5rem' }} className="animate-fade-in">
              <div className="card premium-shadow" style={{ borderTop: `4px solid ${colors.value}`, padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: colors.value, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={24} /> Mapa de Valor (O que você entrega)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { title: 'Criadores de Ganho', field: 'vp_gain_creators' },
                    { title: 'Produtos & Serviços', field: 'vp_products' },
                    { title: 'Aliviadores de Dor', field: 'vp_pain_relievers' }
                  ].map((section, i) => (
                    <div key={i}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', color: '#475569' }}>{section.title}</p>
                      <textarea 
                        rows={3} 
                        value={canvasData[section.field] || ''}
                        onChange={(e) => updateCanvasField(section.field, e.target.value)}
                        placeholder={`Descreva ${section.title.toLowerCase()}...`} 
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1', resize: 'vertical', fontSize: '0.9rem', outline: 'none', background: '#F8FAFC' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="card premium-shadow" style={{ borderTop: `4px solid ${colors.solution}`, padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: colors.solution, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={24} /> Perfil do Cliente (O que ele precisa)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { title: 'Ganhos Esperados', field: 'vp_customer_gains' },
                    { title: 'Tarefas do Cliente', field: 'vp_customer_jobs' },
                    { title: 'Dores & Frustrações', field: 'vp_customer_pains' }
                  ].map((section, i) => (
                    <div key={i}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', color: '#475569' }}>{section.title}</p>
                      <textarea 
                        rows={3} 
                        value={canvasData[section.field] || ''}
                        onChange={(e) => updateCanvasField(section.field, e.target.value)}
                        placeholder={`Descreva ${section.title.toLowerCase()}...`} 
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1', resize: 'vertical', fontSize: '0.9rem', outline: 'none', background: '#F8FAFC' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {canvasType === 'persona' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '3rem' }} className="animate-fade-in">
              <div className="card premium-shadow" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px' }}>
                <Users size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Personas Dinâmicas</h3>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>A gestão de personas via JSON array será implementada na próxima iteração para suportar múltiplos perfis detalhados.</p>
                <button className="premium-gradient" style={{ color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: '600' }}>Adicionar Persona</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'pitch' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', flex: 1, minHeight: '500px' }}>
          {/* Pitch Navigation */}
          <div className="card premium-shadow" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'white' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--muted-foreground)', padding: '0.5rem', marginBottom: '0.25rem' }}>Slides do Pitch</p>
            {pitchSections.map((s, i) => (
              <button key={i} onClick={() => setPitchSection(i)} style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', textAlign: 'left', 
                background: pitchSection === i ? 'var(--primary)' : 'transparent', 
                color: pitchSection === i ? 'white' : 'var(--foreground)', 
                transition: 'all 0.2s',
                border: pitchSection === i ? 'none' : '1px solid transparent'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{s.title}</p>
                  <p style={{ fontSize: '0.7rem', opacity: pitchSection === i ? 0.9 : 0.6 }}>{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Pitch Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card premium-shadow" style={{ flex: 1, background: 'white', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
                  <span>{pitchSections[pitchSection].icon}</span> {pitchSections[pitchSection].title}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {pitchSection > 0 && <button onClick={() => setPitchSection(p => p - 1)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', background: '#F8FAFC' }}>← Anterior</button>}
                  {pitchSection < pitchSections.length - 1 && <button onClick={() => setPitchSection(p => p + 1)} className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>Próximo →</button>}
                </div>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>{pitchSections[pitchSection].desc}</p>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1E293B' }}>Sua Narrativa (Edite aqui):</label>
                <textarea 
                  rows={6} 
                  value={canvasData[pitchSections[pitchSection].field] || pitchSections[pitchSection].default.replace(/"/g, '')}
                  onChange={(e) => updateCanvasField(pitchSections[pitchSection].field, e.target.value)}
                  style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '1rem', lineHeight: '1.6', resize: 'vertical', outline: 'none', background: '#F8FAFC', color: '#334155' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'plano' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          <div className="card premium-shadow" style={{ padding: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Target size={24} color={colors.solution} /> Plano de Ação Estratégico
                </h2>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Metas e ações geradas a partir do seu Canvas Estratégico.</p>
              </div>
              <button className="premium-gradient" style={{ color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Nova Meta Avulsa
              </button>
            </div>

            {loadingGoals ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>Carregando plano de ação...</div>
            ) : goals.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed #CBD5E1' }}>
                <Target size={48} color="#94A3B8" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>Nenhuma ação definida</h3>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>Volte para a aba "Canvas Estratégico" e clique no ícone de alvo nos blocos para criar ações direcionadas.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {goals.map((goal) => (
                  <div key={goal.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={18} color={colors.advantage} /> {goal.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#E2E8F0', color: '#475569', borderRadius: '4px', fontWeight: '600' }}>
                        {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>{goal.description}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8' }}>Ações ({goal.actionPlans?.length || 0})</p>
                      {goal.actionPlans?.map((plan: any) => (
                        <div key={plan.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <CheckCircle2 size={18} color={plan.status === 'DONE' ? colors.value : '#CBD5E1'} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', textDecoration: plan.status === 'DONE' ? 'line-through' : 'none' }}>{plan.description}</p>
                            <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>Resp: {plan.responsible?.name || 'Não atribuído'} • Vence: {new Date(plan.due_date).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <button style={{ color: '#94A3B8' }}><MoreHorizontal size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Editar: ${editingBlock?.title}`}>
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Insira os itens separados por linha. Isso atualizará automaticamente o Canvas.</p>
          <textarea 
            rows={8} 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)} 
            placeholder="Item 1&#10;Item 2&#10;Item 3"
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', fontSize: '0.95rem', lineHeight: '1.5', fontFamily: 'inherit' }} 
            autoFocus
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Salvar Alterações</button>
          </div>
        </form>
      </Modal>

      {/* Create Action Modal */}
      <Modal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} title={`Nova Ação: ${actionBlock?.title}`}>
        <form onSubmit={handleSaveAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: `3px solid ${actionBlock?.color}` }}>
            Você está criando uma ação estratégica para o bloco <strong>{actionBlock?.title}</strong>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Descrição da Ação</label>
            <input name="description" required placeholder="O que precisa ser feito?" style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} autoFocus />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Prazo Estimado</label>
            <input name="due_date" type="date" required style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsActionModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', color: 'white', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Target size={18} /> Salvar Ação
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
