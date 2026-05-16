'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Award, Mail, ShieldCheck, Settings, Edit3, Trash2,
  Eye, Target, Heart, Rocket, DollarSign, FileText, CheckCircle, AlertCircle
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getStartupById, updateStartupDetails } from '@/lib/actions/startup';
import { useAuth } from '@/context/AuthContext';

export default function StartupTeamPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'access'>('overview');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { user } = useAuth();
  const [startup, setStartup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user === undefined) return; // Wait for auth to initialize
    
    if (user?.startupId) {
      loadStartup(user.startupId);
    } else {
      setLoading(false); // No startup to load
    }
  }, [user]);

  async function loadStartup(id: string) {
    setLoading(true);
    try {
      const data = await getStartupById(id);
      setStartup(data);
      if (data?.members) {
        setMembers(data.members.map((m: any) => ({
          id: m.id,
          name: m.user?.name || 'Membro',
          role: m.role || 'Colaborador',
          bio: m.bio || '',
          skills: [],
          profile: 100,
          access: m.status
        })));
      }
    } catch (error) {
      console.error('Error loading startup:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.startupId) return;
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Fix: passing object with id
    await updateStartupDetails({ id: user.startupId, ...data });
    alert('Detalhes atualizados com sucesso!');
    loadStartup(user.startupId);
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--secondary)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
      <p style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Sincronizando dados da startup...</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );

  if (!user?.startupId) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Startup não Vinculada</h2>
      <p style={{ color: 'var(--muted-foreground)', maxWidth: '400px', margin: '0 auto' }}>
        Você ainda não está vinculado a nenhuma startup. Entre em contato com seu administrador ou solicite acesso.
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontWeight: 800 }}>Minha Startup</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie o core business, equipe e permissões da <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{startup?.name}</span>.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="premium-gradient" 
            onClick={() => setIsInviteModalOpen(true)}
            style={{ color: 'white', padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
            <UserPlus size={18} />
            Convidar Membro
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'overview', label: 'Estratégia & Detalhes' },
          { id: 'team', label: 'Equipe & Organograma' },
          { id: 'access', label: 'Perfis de Acesso' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            style={{ 
              padding: '1rem 0.5rem', 
              fontSize: '0.95rem', 
              fontWeight: '700', 
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
              marginBottom: '-1px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <form onSubmit={handleSaveDetails} className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Identity Section */}
            <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <Rocket size={22} color="var(--primary)" /> Identidade Estratégica
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Propósito da Marca</label>
                    <input name="brand_purpose" type="text" defaultValue={startup?.brand_purpose} placeholder="O 'porquê' da sua existência..." style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>CNPJ</label>
                    <input name="cnpj" type="text" defaultValue={startup?.cnpj} placeholder="00.000.000/0000-00" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Visão</label>
                  <textarea name="vision" defaultValue={startup?.vision} placeholder="Onde querem chegar?" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none', resize: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Missão</label>
                  <textarea name="mission" defaultValue={startup?.mission} placeholder="Como vão chegar lá?" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none', resize: 'none' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Valores Nucleares</label>
                  <input name="values" type="text" defaultValue={startup?.values} placeholder="Ex: Transparência, Velocidade, Foco no Cliente" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none' }} />
                </div>
              </div>
            </div>

            {/* Business Section */}
            <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <DollarSign size={22} color="var(--primary)" /> Modelo de Negócio
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Público Alvo Primário</label>
                  <input name="target_audience" type="text" defaultValue={startup?.target_audience} placeholder="Ex: Gestores de RH" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Ticket Médio Esperado</label>
                  <input name="avg_ticket" type="text" defaultValue={startup?.avg_ticket} placeholder="Ex: R$ 500,00" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Problema Central</label>
                  <textarea name="problem" defaultValue={startup?.problem} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid var(--border)', outline: 'none', resize: 'vertical' }} />
                </div>
              </div>
              <button type="submit" className="premium-gradient" style={{ alignSelf: 'flex-end', padding: '0.85rem 2.5rem', color: 'white', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Atualizar Planejamento</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div className="card premium-shadow" style={{ background: 'var(--primary)', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 800 }}>Ficha Técnica</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Maturidade</span>
                  <span style={{ fontWeight: '800' }}>{startup?.maturity_level || 'Nível 1'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Segmento</span>
                  <span style={{ fontWeight: '800' }}>{startup?.segment || 'Não definido'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Website</span>
                  <a href={startup?.website} target="_blank" style={{ color: 'white', fontWeight: '800', textDecoration: 'underline' }}>Acessar Link</a>
                </div>
              </div>
            </div>
            
            <div className="card premium-shadow">
               <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                 <FileText size={18} color="var(--primary)" /> Documentos
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--secondary)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>PITCH DECK (PDF)</span>
                      {startup?.pitch_deck_url ? <CheckCircle size={16} color="#10b981" /> : <AlertCircle size={16} color="#f59e0b" />}
                    </div>
                    
                    <button type="button" onClick={() => document.getElementById('pitch-upload')?.click()} style={{ width: '100%', padding: '0.7rem', background: 'white', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', color: '#475569', border: '1.5px solid #E2E8F0', cursor: 'pointer' }}>
                      {startup?.pitch_deck_url ? 'Substituir Arquivo' : 'Fazer Upload'}
                    </button>
                    <input id="pitch-upload" type="file" accept=".pdf" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && user?.startupId) {
                        const mockUrl = `/uploads/${file.name}`;
                        await updateStartupDetails({ id: user.startupId, pitch_deck_url: mockUrl });
                        loadStartup(user.startupId);
                        alert('Pitch Deck atualizado!');
                      }
                    }} />
                  </div>
               </div>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'team' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>Membros da Equipe</h3>
            {members.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: '#94a3b8', fontWeight: '600' }}>Nenhum membro vinculado ainda.</p>
              </div>
            ) : members.map((member) => (
              <div key={member.id} className="card premium-shadow" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={32} color="#2563eb" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>{member.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '700' }}>{member.role}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }}><Edit3 size={16} /></button>
                      <button style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card premium-shadow">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 800 }}>Hierarquia Nominal</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem 1.75rem', background: '#1e293b', color: 'white', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '800', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>FOUNDER / CEO</div>
                <div style={{ width: '2px', height: '24px', background: '#e2e8f0' }}></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '0.6rem 1.2rem', border: '2px solid #2563eb', color: '#2563eb', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800' }}>PRODUTO</div>
                  <div style={{ padding: '0.6rem 1.2rem', border: '2px solid #10b981', color: '#10b981', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800' }}>OPERAÇÃO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="card premium-shadow animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={28} color="#2563eb" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Gestão de Permissões</h3>
          </div>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
            Configure os níveis de acesso para garantir a segurança da <span style={{ fontWeight: 700 }}>{startup?.name}</span>.
          </p>

          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Nome do Membro</th>
                  <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Perfil de Acesso</th>
                  <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '1.25rem', fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{m.name}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <select 
                        defaultValue={m.access}
                        style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', fontWeight: '600', outline: 'none', background: 'white' }}
                      >
                        <option value="Admin">Administrador (Total)</option>
                        <option value="Membro">Editor (Parcial)</option>
                        <option value="Visualizador">Visualizador (Leitura)</option>
                      </select>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <span style={{ padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '800', background: '#d1fae5', color: '#059669', textTransform: 'uppercase' }}>Ativo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Convidar Novo Membro">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>E-mail corporativo</label>
            <input type="email" placeholder="colaborador@suastartup.com" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>Função na Startup</label>
            <input type="text" placeholder="Ex: Lead Developer, Sales Manager" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>Permissão Inicial</label>
            <select style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', background: 'white' }}>
              <option>Membro (Padrão)</option>
              <option>Administrador</option>
              <option>Visualizador</option>
            </select>
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(false)}
            className="premium-gradient"
            style={{ marginTop: '1rem', padding: '0.9rem', color: 'white', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
          >
            Enviar Convite por E-mail
          </button>
        </div>
      </Modal>

    </div>
  );
}
