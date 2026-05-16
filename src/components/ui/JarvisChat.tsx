'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Terminal, Zap, Bot, Mic, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JarvisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Olá! Sou o JARVIS. Como posso otimizar seu ecossistema agora?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    
    if (lower.includes('financeiro')) {
      router.push('/financeiro');
      return 'Navegando para o módulo Financeiro...';
    }
    if (lower.includes('startup') && (lower.includes('nova') || lower.includes('criar'))) {
      router.push('/todas-startups');
      return 'Abrindo gestão de startups para novo cadastro...';
    }
    if (lower.includes('ies') || lower.includes('instituicao')) {
      router.push('/instituicoes');
      return 'Acessando Gestão de Instituições.';
    }
    if (lower.includes('agenda') || lower.includes('reuniao')) {
      router.push('/agenda');
      return 'Consultando sua agenda de reuniões.';
    }
    if (lower.includes('educacao') || lower.includes('turma')) {
      router.push('/admin/turmas');
      return 'Acessando módulo de Educação e Turmas.';
    }
    
    return 'Entendido. Estou processando essa solicitação e integrando ao Knowledge Graph...';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsThinking(true);

    // Simulação de Inteligência
    setTimeout(() => {
      const response = handleCommand(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
          zIndex: 9999,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className={isOpen ? 'chat-open' : 'chat-closed'}
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
           <span style={{ 
             position: 'absolute', 
             top: '-5px', 
             right: '-5px', 
             background: '#ef4444', 
             width: '12px', 
             height: '12px', 
             borderRadius: '50%',
             border: '2px solid white'
           }} />
        )}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '7rem',
          right: '2rem',
          width: '400px',
          height: '550px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9998,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.3)',
          animation: 'chatSlideUp 0.4s ease-out'
        }}>
          {/* Header */}
          <div style={{ padding: '1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>JARVIS Core</h4>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} /> Sistema Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '1rem 1.25rem',
                borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                background: msg.role === 'user' ? 'var(--primary)' : '#F1F5F9',
                color: msg.role === 'user' ? 'white' : '#1E293B',
                fontSize: '0.9rem',
                fontWeight: 500,
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
            {isThinking && (
              <div style={{ alignSelf: 'flex-start', padding: '1rem', background: '#F1F5F9', borderRadius: '20px', display: 'flex', gap: '0.3rem' }}>
                <div className="dot-pulse" />
                <div className="dot-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="dot-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', borderTop: '1px solid #F1F5F9', background: 'white' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Dê um comando para o JARVIS..."
                style={{
                  flex: 1,
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#1E293B'
                }}
              />
              <button type="submit" style={{ 
                width: '45px', 
                height: '45px', 
                borderRadius: '14px', 
                background: 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes chatSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .dot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94A3B8;
          animation: dotPulse 1.4s infinite ease-in-out;
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .chat-open { transform: scale(0.9) rotate(90deg); }
        .chat-closed:hover { transform: scale(1.1); }
      `}</style>
    </>
  );
}
