'use client';

import React, { useState } from 'react';
import { 
  Users, UserPlus, Award, Mail, Linkedin, ShieldCheck, Settings, Edit3, Trash2
} from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function StartupTeamPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'access'>('team');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const members = [
    { id: 1, name: 'Daniel Borges', role: 'CEO & Founder', bio: 'Estrategista de produto e visão de mercado.', skills: ['Liderança', 'Pitch', 'Vendas'], profile: 95, access: 'Admin' },
    { id: 2, name: 'Aline Souza', role: 'CTO', bio: 'Especialista em arquitetura escalável e IA.', skills: ['Next.js', 'Cloud', 'Python'], profile: 88, access: 'Admin' },
    { id: 3, name: 'Ricardo Lima', role: 'COO', bio: 'Focado em processos e sucesso do cliente.', skills: ['Operações', 'CRM', 'Dados'], profile: 82, access: 'Membro' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Minha Startup</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie os detalhes, a equipe e as permissões da sua startup.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="premium-gradient" 
            onClick={() => setIsInviteModalOpen(true)}
            style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} />
            Convidar Membro
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'overview', label: 'Detalhes da Startup' },
          { id: 'team', label: 'Equipe & Organograma' },
          { id: 'access', label: 'Perfis de Acesso' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            style={{ 
              padding: '1rem 0.5rem', 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Informações Básicas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Nome da Startup</label>
                  <input type="text" defaultValue="TechInova" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Segmento (Mercado)</label>
                  <input type="text" defaultValue="SaaS B2B" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Slogan / Propósito (One-liner)</label>
                  <input type="text" defaultValue="Inovação com direção para o seu ecossistema." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Descrição Resumida</label>
                  <textarea defaultValue="Plataforma de inteligência de dados focada em acelerar o processo de desenvolvimento e maturidade de startups dentro de ecossistemas corporativos e universitários." rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Redes Sociais & Contato</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Website</label>
                  <input type="url" defaultValue="https://techinova.com.br" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>LinkedIn</label>
                  <input type="url" defaultValue="linkedin.com/company/techinova" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Instagram</label>
                  <input type="text" defaultValue="@techinova" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Telefone / WhatsApp</label>
                  <input type="tel" defaultValue="(11) 99999-9999" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
                </div>
              </div>
              <button style={{ alignSelf: 'flex-end', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '600', marginTop: '1rem' }}>Salvar Alterações</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card premium-shadow" style={{ background: 'var(--primary)', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Status Atual</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Maturidade</span>
                  <span style={{ fontWeight: 'bold' }}>Nível 4 (Tração)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Fundação</span>
                  <span style={{ fontWeight: 'bold' }}>Mar/2023</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>CNPJ</span>
                  <span style={{ fontWeight: 'bold' }}>12.345.678/0001-99</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Vínculo Institucional</span>
                  <span style={{ fontWeight: 'bold' }}>Aceleradora Órbita</span>
                </div>
              </div>
            </div>

            <div className="card premium-shadow">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Documentos Anexos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--muted)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Contrato Social.pdf</span>
                  <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Baixar</span>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--muted)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Acordo de Sócios.pdf</span>
                  <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Baixar</span>
                </div>
                <button style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px dashed var(--primary)', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', background: 'transparent' }}>+ Anexar Documento</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Membros Atuais</h3>
            {members.map((member) => (
              <div key={member.id} className="card premium-shadow" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={32} color="var(--primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{member.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>{member.role}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}><Edit3 size={16} /></button>
                      <button style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--destructive)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card premium-shadow">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Organograma</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius)', fontSize: '0.85rem', fontWeight: 'bold' }}>CEO</div>
                <div style={{ width: '2px', height: '20px', background: 'var(--border)' }}></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>CTO</div>
                  <div style={{ padding: '0.5rem 1rem', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>COO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="card premium-shadow animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={24} color="var(--primary)" />
            Gestão de Permissões
          </h3>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Defina o que cada membro pode visualizar e editar dentro da plataforma.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>NOME</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>PERFIL ATUAL</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.95rem' }}>{m.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      defaultValue={m.access}
                      style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', outline: 'none' }}
                    >
                      <option value="Admin">Administrador (Acesso Total)</option>
                      <option value="Membro">Membro (Edição Limitada)</option>
                      <option value="Visualizador">Visualizador (Somente Leitura)</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Salvar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Convidar Novo Membro">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>E-mail do Convidado</label>
            <input type="email" placeholder="nome@email.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Cargo / Papel</label>
            <input type="text" placeholder="Ex: Desenvolvedor, Vendedor" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Perfil de Acesso</label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}>
              <option>Membro</option>
              <option>Administrador</option>
              <option>Visualizador</option>
            </select>
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(false)}
            style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '700' }}
          >
            Enviar Convite
          </button>
        </div>
      </Modal>

    </div>
  );
}
