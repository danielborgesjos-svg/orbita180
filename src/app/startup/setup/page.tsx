'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Rocket, Building2, MapPin, Globe, Mail, Phone, 
  Target, Zap, Users, BarChart3, Presentation,
  Save, Loader2, CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStartupByUserId, updateStartupDetails } from '@/lib/actions/startup';

const STEPS = [
  { id: 'basic', label: 'Dados Básicos', icon: Building2 },
  { id: 'business', label: 'O Negócio', icon: Target },
  { id: 'market', label: 'Mercado', icon: BarChart3 },
  { id: 'pitch', label: 'Pitch', icon: Presentation },
];

export default function StartupSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startup, setStartup] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    cnpj: '',
    website: '',
    instagram: '',
    city: '',
    state: '',
    stage: 'IDEACAO',
    problem: '',
    solution: '',
    target_audience: '',
    value_proposition: '',
    market_size: '',
    competitors: '',
    competitive_advantages: '',
    revenue_sources: '',
    pitch_short: '',
    pitch_long: '',
  });

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const res = await getStartupByUserId(user.id);
      if (res.success && res.startup) {
        const startupData = res.startup;
        setStartup(startupData);
        setForm(prev => ({
          ...prev,
          name: startupData.name || '',
          cnpj: startupData.cnpj || '',
          website: startupData.website || '',
          instagram: startupData.instagram || '',
          city: startupData.city || '',
          state: startupData.state || '',
          stage: startupData.stage || 'IDEACAO',
          problem: startupData.problem || '',
          solution: startupData.solution || '',
          target_audience: startupData.target_audience || '',
          value_proposition: startupData.value_proposition || '',
          market_size: startupData.market_size || '',
          competitors: startupData.competitors || '',
          competitive_advantages: startupData.competitive_advantages || '',
          revenue_sources: startupData.revenue_sources || '',
          pitch_short: startupData.pitch_short || '',
          pitch_long: startupData.pitch_long || '',
        }));
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleSave = async () => {
    if (!startup?.id) return;
    setSaving(true);
    const res = await updateStartupDetails({ ...form, id: startup.id });
    setSaving(false);
    if (res.success) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        router.push('/');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="spin" color="#2563eb" />
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#334155',
    display: 'block',
    marginBottom: '0.5rem'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Rocket size={32} color="white" />
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>Bem-vindo ao Garage 2026!</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Vamos configurar o perfil da <strong>{form.name}</strong> para começar sua jornada.
        </p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0 }} />
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === idx;
          const isDone = currentStep > idx;
          return (
            <div key={step.id} style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: isActive ? '#2563eb' : isDone ? '#10b981' : 'white',
                color: isActive || isDone ? 'white' : '#94a3b8',
                border: isActive || isDone ? 'none' : '2px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s'
              }}>
                {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isActive ? '#2563eb' : '#94a3b8' }}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="card premium-shadow" style={{ padding: '2.5rem', background: 'white', borderRadius: '24px' }}>
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>CNPJ</label>
                <input type="text" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Estágio Atual</label>
                <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} style={inputStyle}>
                  <option value="IDEACAO">Ideação</option>
                  <option value="VALIDACAO">Validação</option>
                  <option value="MVP">MVP</option>
                  <option value="TRACTION">Tração</option>
                  <option value="SCALEUP">Scale-up</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Cidade</label>
                <input type="text" placeholder="Ex: Curitiba" value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <input type="text" placeholder="Ex: PR" value={form.state} onChange={e => setForm({...form, state: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Website</label>
                <input type="text" placeholder="https://..." value={form.website} onChange={e => setForm({...form, website: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input type="text" placeholder="@startup" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Qual problema você resolve?</label>
              <textarea 
                rows={3} 
                placeholder="Descreva a dor que seu cliente sente..." 
                value={form.problem} 
                onChange={e => setForm({...form, problem: e.target.value})} 
                style={{ ...inputStyle, resize: 'none' }} 
              />
            </div>
            <div>
              <label style={labelStyle}>Qual é a sua solução?</label>
              <textarea 
                rows={3} 
                placeholder="Como seu produto/serviço resolve esse problema..." 
                value={form.solution} 
                onChange={e => setForm({...form, solution: e.target.value})} 
                style={{ ...inputStyle, resize: 'none' }} 
              />
            </div>
            <div>
              <label style={labelStyle}>Proposta de Valor</label>
              <input 
                type="text" 
                placeholder="Ex: Reduzimos o custo de logística em 30%" 
                value={form.value_proposition} 
                onChange={e => setForm({...form, value_proposition: e.target.value})} 
                style={inputStyle} 
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Público-Alvo</label>
              <input type="text" placeholder="Ex: Pequenas empresas do setor têxtil" value={form.target_audience} onChange={e => setForm({...form, target_audience: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho do Mercado</label>
              <input type="text" placeholder="Ex: 50 mil empresas no Brasil" value={form.market_size} onChange={e => setForm({...form, market_size: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Concorrentes</label>
              <input type="text" placeholder="Liste seus principais competidores" value={form.competitors} onChange={e => setForm({...form, competitors: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fontes de Receita</label>
              <input type="text" placeholder="Ex: Assinatura mensal, Taxa de transação" value={form.revenue_sources} onChange={e => setForm({...form, revenue_sources: e.target.value})} style={inputStyle} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Elevator Pitch (Curto)</label>
              <textarea 
                rows={3} 
                placeholder="Sua startup em uma frase..." 
                value={form.pitch_short} 
                onChange={e => setForm({...form, pitch_short: e.target.value})} 
                style={{ ...inputStyle, resize: 'none' }} 
              />
            </div>
            <div>
              <label style={labelStyle}>História / Pitch Completo</label>
              <textarea 
                rows={6} 
                placeholder="Conte-nos mais sobre a visão da startup..." 
                value={form.pitch_long} 
                onChange={e => setForm({...form, pitch_long: e.target.value})} 
                style={{ ...inputStyle, resize: 'none' }} 
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <button 
            disabled={currentStep === 0 || saving}
            onClick={() => setCurrentStep(prev => prev - 1)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', 
              borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white',
              color: '#64748b', fontWeight: '700', cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={18} /> Voltar
          </button>

          <button 
            disabled={saving}
            onClick={handleSave}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', 
              borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            {saving ? <Loader2 size={18} className="spin" /> : currentStep === STEPS.length - 1 ? 'Finalizar Perfil' : 'Salvar e Continuar'} 
            {!saving && currentStep < STEPS.length - 1 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
      
      <style>{`
        .premium-shadow {
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
