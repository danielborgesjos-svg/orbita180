'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Eye, EyeOff, Mail, Lock, User, CheckCircle2, Building2, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getStartupsForRegistration, registerFounder } from '@/lib/actions/cadastro';

export default function CadastroPage() {
  const router = useRouter();
  const [startups, setStartups] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    startupId: '',
    role: 'Founder',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStartupsForRegistration().then(res => {
      if (res.success && res.startups) {
        setStartups(res.startups);
      }
    });
  }, []);

  const handleSubmit = async () => {
    setError('');
    
    if (!form.name || !form.email || !form.password || !form.cpf || !form.startupId) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    const res = await registerFounder({
      name: form.name,
      email: form.email,
      passwordHash: form.password,
      cpf: form.cpf,
      startupId: form.startupId,
      role: form.role,
    });
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Ocorreu um erro.');
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>Cadastro Realizado!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            Sua solicitação como {form.role} foi enviada com sucesso. Um administrador irá revisar seu acesso e vinculá-lo à sua startup.
          </p>
          <Link href="/login" style={{ display: 'inline-block', padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  const inp = { width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', background: 'white' };
  const lbl = { fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' };

  return (
    <div className="cadastro-container" style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left Panel */}
      <div className="left-panel" style={{ flex: 1, background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', backdropFilter: 'blur(10px)' }}>
            <Compass size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Junte-se ao Órbita 180</h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, lineHeight: 1.6 }}>
            Cadastre-se como Founder e impulsione a jornada da sua startup dentro do programa GARAGE 2026.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>Crie sua conta</h2>
          <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Preencha os dados abaixo para solicitar seu acesso.</p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={lbl}>Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Seu nome" style={inp} />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lbl}>CPF</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="text" required value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} placeholder="000.000.000-00" style={inp} />
                </div>
              </div>
              <div>
                <label style={lbl}>Cargo na Startup</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <select required value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ ...inp, appearance: 'none' }}>
                    <option value="Founder">Founder</option>
                    <option value="CEO">CEO</option>
                    <option value="CTO">CTO</option>
                    <option value="CMO">CMO</option>
                    <option value="COO">COO</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label style={lbl}>Selecione sua Startup</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <select required value={form.startupId} onChange={e => setForm({...form, startupId: e.target.value})} style={{ ...inp, appearance: 'none' }}>
                  <option value="" disabled>Escolha na lista...</option>
                  {startups.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={lbl}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="seu@email.com" style={inp} />
              </div>
            </div>

            <div>
              <label style={lbl}>Senha de Acesso</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={inp} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', background:'transparent', border:'none', cursor:'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '0.9rem', background: loading ? '#93c5fd' : '#1e293b', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
              {loading ? <Loader2 size={20} className="spin" /> : 'Criar Conta'}
            </button>
            
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
              Já tem uma conta? <Link href="/login" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>Fazer login</Link>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .spin { animation: spin 1s linear infinite; }
        
        @media (max-width: 968px) {
          .cadastro-container {
            flex-direction: column;
          }
          .left-panel {
            padding: 3rem 2rem !important;
            min-height: auto !important;
            flex: none !important;
          }
          .left-panel h1 {
            font-size: 1.75rem !important;
          }
          .left-panel p {
            font-size: 1rem !important;
          }
          .right-panel {
            padding: 2.5rem 1.5rem !important;
            flex: 1 !important;
          }
          .form-grid {
            grid-template_columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
