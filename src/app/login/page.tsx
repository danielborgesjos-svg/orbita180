'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="login-container" style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left Panel */}
      <div className="left-panel" style={{ flex: 1, background: 'linear-gradient(145deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', top: '-100px', left: '-100px' }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', bottom: '-200px', right: '-200px' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ margin: '0 auto 2rem', display: 'flex', justifyContent: 'center' }}>
            <img src="https://i.imgur.com/HopPpdl.png" alt="Órbita 180" style={{ width: '280px', height: 'auto', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>Órbita 180</h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '3rem' }}>
            Ecossistema de Inteligência Empreendedora para startups, instituições e programas de inovação.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Bem-vindo de volta</h2>
          <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Acesse sua conta para continuar sua jornada.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 3rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
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

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem', background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 size={20} className="spin" /> : <><span>Entrar na Plataforma</span><ArrowRight size={18} /></>}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Ainda não tem conta?{' '}
                <Link href="/cadastro" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>Cadastre-se aqui</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .spin { animation: spin 1s linear infinite; }
        
        @media (max-width: 968px) {
          .login-container { flex-direction: column; }
          .left-panel { 
            padding: 3rem 2rem !important; 
            flex: none !important; 
            min-height: auto !important; 
          }
          .left-panel h1 { font-size: 1.75rem !important; }
          .left-panel img { width: 180px !important; }
          .right-panel { padding: 2.5rem 1.5rem !important; flex: 1 !important; }
        }
      `}</style>
    </div>
  );
}
