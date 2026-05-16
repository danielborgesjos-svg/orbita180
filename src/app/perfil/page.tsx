'use client';

import React, { useState } from 'react';
import {
  User, Mail, Building2, Globe, Phone,
  Edit3, Save, X, Camera, Award, Zap, Target, TrendingUp,
  Calendar, MessageSquare, Heart, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  startup_founder: 'Founder',
  startup_member: 'Membro',
  mentor: 'Mentor',
  institution: 'Instituição',
};

const roleColors: Record<string, { color: string; bg: string; gradient: string }> = {
  admin: { color: '#ef4444', bg: '#fee2e2', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
  startup_founder: { color: '#2563eb', bg: '#dbeafe', gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
  startup_member: { color: '#8b5cf6', bg: '#ede9fe', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  mentor: { color: '#f59e0b', bg: '#fef3c7', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  institution: { color: '#0ea5e9', bg: '#e0f2fe', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' },
};

const stats = [
  { label: 'Posts', value: '12', icon: MessageSquare, color: '#2563eb' },
  { label: 'Curtidas recebidas', value: '148', icon: Heart, color: '#ef4444' },
  { label: 'Mentorias', value: '6', icon: Target, color: '#10b981' },
  { label: 'Maturidade', value: '73%', icon: TrendingUp, color: '#8b5cf6' },
];

const activities = [
  { text: 'Publicou no feed da comunidade', time: '2h atrás', icon: MessageSquare, color: '#2563eb' },
  { text: 'Completou milestone de MRR', time: '1 dia atrás', icon: Award, color: '#f59e0b' },
  { text: 'Mentoria com Prof. Carlos', time: '3 dias atrás', icon: Calendar, color: '#10b981' },
  { text: 'Atualizou maturidade da startup', time: '5 dias atrás', icon: Zap, color: '#8b5cf6' },
];

export default function PerfilPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    bio: 'Empreendedor apaixonado por tecnologia e inovação. Fundador da TechInova, focado em soluções B2B para o mercado de saúde digital.',
    website: 'https://techinova.com.br',
    linkedin: 'linkedin.com/in/danielborges',
    instagram: '@danielborges.tech',
    phone: '(41) 99999-0000',
    location: 'Curitiba, PR',
  });
  const [draft, setDraft] = useState(form);

  if (!user) return null;

  const roleStyle = roleColors[user.role] ?? roleColors['startup_founder'];
  const roleLabel = roleLabels[user.role] ?? user.role;
  const subtitle = user.startupName ?? user.institutionName ?? '';

  const handleSave = () => {
    setForm(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDraft(form);
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Cover + Avatar */}
      <div className="card premium-shadow" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Cover */}
        <div style={{ height: '140px', background: roleStyle.gradient, position: 'relative' }}>
          <button style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
            <Camera size={14} /> Alterar capa
          </button>
        </div>

        {/* Profile info */}
        <div style={{ padding: '0 1.75rem 1.75rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', marginTop: '-36px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: `${roleStyle.color}20`, border: `4px solid white`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', fontWeight: '800', color: roleStyle.color,
                boxShadow: `0 4px 16px ${roleStyle.color}40`
              }}>
                {user.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <button style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', background: roleStyle.color, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={11} color="white" />
              </button>
            </div>
            <div style={{ paddingBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{user.name}</h1>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '99px', background: roleStyle.bg, color: roleStyle.color, fontWeight: '800' }}>
                  {roleLabel}
                </span>
              </div>
              {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>{subtitle}</p>}
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Mail size={13} /> {user.email}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.25rem' }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700', animation: 'fadeIn 0.3s' }}>
                <Check size={16} /> Salvo!
              </div>
            )}
            {editing ? (
              <>
                <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                  <X size={15} /> Cancelar
                </button>
                <button onClick={handleSave} className="premium-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', borderRadius: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}>
                  <Save size={15} /> Salvar
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', borderRadius: '8px', border: `1.5px solid ${roleStyle.color}`, color: roleStyle.color, fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', background: roleStyle.bg, transition: 'opacity 0.2s' }}>
                <Edit3 size={15} /> Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
            {stats.map(s => (
              <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center', border: `1px solid ${s.color}20` }}>
                <div style={{ width: '36px', height: '36px', background: `${s.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', marginTop: '0.25rem', fontWeight: '600' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="card premium-shadow">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>Sobre mim</h3>
            {editing ? (
              <textarea
                value={draft.bio}
                onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                rows={4}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', resize: 'none', outline: 'none', lineHeight: '1.6', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            ) : (
              <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--foreground)' }}>{form.bio}</p>
            )}
          </div>

          {/* Contact & Links */}
          <div className="card premium-shadow">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>Contato & Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: Globe, label: 'Website', key: 'website', placeholder: 'https://seusite.com.br' },
                { icon: Globe, label: 'LinkedIn', key: 'linkedin', placeholder: 'linkedin.com/in/seuperfil' },
                { icon: Globe, label: 'Instagram', key: 'instagram', placeholder: '@seuperfil' },
                { icon: Phone, label: 'Telefone', key: 'phone', placeholder: '(00) 00000-0000' },
                { icon: Building2, label: 'Localização', key: 'location', placeholder: 'Cidade, Estado' },
              ].map(({ icon: Icon, label, key, placeholder }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '34px', height: '34px', background: 'var(--secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--muted-foreground)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>{label}</p>
                    {editing ? (
                      <input
                        type="text" placeholder={placeholder}
                        value={draft[key as keyof typeof draft]}
                        onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: '6px', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    ) : (
                      <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: '500' }}>
                        {form[key as keyof typeof form] || <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>Não informado</span>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Role badge */}
          <div className="card premium-shadow" style={{ background: roleStyle.gradient, border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontWeight: '700', textTransform: 'uppercase' }}>Seu papel</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>{roleLabel}</p>
              </div>
            </div>
            {subtitle && <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontWeight: '600' }}>{subtitle}</p>}
          </div>

          {/* Activity Feed */}
          <div className="card premium-shadow">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="#f59e0b" /> Atividade Recente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activities.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '30px', height: '30px', background: `${a.color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <a.icon size={14} color={a.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--foreground)', fontWeight: '500', lineHeight: 1.4 }}>{a.text}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', marginTop: '0.15rem' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="card premium-shadow">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={16} color="#f59e0b" /> Conquistas
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                { label: 'MVP Validado', color: '#10b981', icon: '🚀' },
                { label: 'Primeiro Cliente', color: '#2563eb', icon: '🎯' },
                { label: 'Pitch Realizado', color: '#8b5cf6', icon: '🎤' },
                { label: 'Comunidade Ativa', color: '#f59e0b', icon: '🌟' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '99px', background: `${b.color}12`, border: `1.5px solid ${b.color}30`, fontSize: '0.75rem', fontWeight: '700', color: b.color }}>
                  <span>{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
