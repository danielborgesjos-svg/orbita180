'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, LogOut, Settings, UserCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  startup_founder: 'Founder',
  startup_member: 'Membro',
  mentor: 'Mentor',
  institution: 'Instituição',
};

const roleColors: Record<string, string> = {
  admin: '#ef4444',
  startup_founder: '#2563eb',
  startup_member: '#8b5cf6',
  mentor: '#f59e0b',
  institution: '#10b981',
};

const notifications = [
  { id: 1, text: 'Nova mentoria agendada para amanhã às 14h', time: '5 min', unread: true },
  { id: 2, text: 'TechInova atingiu 75% de maturidade!', time: '1h', unread: true },
  { id: 3, text: 'Novo comentário no seu post da Comunidade', time: '3h', unread: false },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const userName = user?.name ?? 'Usuário';
  const userRole = user?.role ?? 'startup_founder';
  const roleLabel = roleLabels[userRole] ?? userRole;
  const roleColor = roleColors[userRole] ?? 'var(--primary)';
  const subtitle = user?.startupName
    ? `${roleLabel} @ ${user.startupName}`
    : user?.institutionName
    ? `${roleLabel} @ ${user.institutionName}`
    : roleLabel;

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="glass" style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', width: '400px', border: '1px solid transparent', transition: 'border 0.2s' }}>
        <Search size={18} color="var(--muted-foreground)" />
        <input
          type="text"
          placeholder="Buscar startups, documentos, mentorias..."
          style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--foreground)' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
            style={{ position: 'relative', color: 'var(--muted-foreground)', padding: '0.5rem', borderRadius: '8px', background: notifOpen ? 'var(--secondary)' : 'transparent', transition: 'background 0.2s' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 0.75rem)',
              width: '320px', background: 'white', borderRadius: '12px',
              border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Notificações</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Marcar todas lidas</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '0.875rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  background: n.unread ? '#eff6ff' : 'white',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer'
                }}>
                  {n.unread && <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }} />}
                  {!n.unread && <span style={{ width: '8px', height: '8px', flexShrink: 0 }} />}
                  <div>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--foreground)', marginBottom: '0.25rem' }}>{n.text}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>há {n.time}</p>
                  </div>
                </div>
              ))}
              <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Ver todas</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.375rem 0.75rem', borderRadius: 'var(--radius)',
              cursor: 'pointer', background: profileOpen ? 'var(--secondary)' : 'transparent',
              transition: 'background 0.2s', userSelect: 'none'
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--foreground)', lineHeight: 1.2 }}>{userName}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{subtitle}</p>
            </div>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: `${roleColor}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${roleColor}40`,
              flexShrink: 0
            }}>
              <User size={18} color={roleColor} />
            </div>
            <ChevronDown size={14} color="var(--muted-foreground)" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>

          {profileOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 0.75rem)',
              width: '220px', background: 'white', borderRadius: '12px',
              border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 200, overflow: 'hidden'
            }}>
              {/* User header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: `${roleColor}08` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${roleColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${roleColor}40` }}>
                    <User size={16} color={roleColor} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{userName}</p>
                    <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '99px', background: `${roleColor}20`, color: roleColor, fontWeight: '700' }}>{roleLabel}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{user?.email}</p>
              </div>

              {/* Menu items */}
              <div style={{ padding: '0.5rem' }}>
                <Link
                  href="/perfil"
                  onClick={() => setProfileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: '500', transition: 'background 0.15s' }}
                  className="dropdown-item"
                >
                  <UserCircle size={16} color="var(--muted-foreground)" />
                  Meu Perfil
                </Link>
                <Link
                  href="/configuracoes"
                  onClick={() => setProfileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: '500', transition: 'background 0.15s' }}
                  className="dropdown-item"
                >
                  <Settings size={16} color="var(--muted-foreground)" />
                  Configurações
                </Link>
                <div style={{ margin: '0.375rem 0', height: '1px', background: 'var(--border)' }} />
                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem', color: '#ef4444', fontWeight: '500', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                  className="dropdown-item-danger"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dropdown-item:hover { background: var(--secondary); }
        .dropdown-item-danger:hover { background: #fff1f2; }
      `}</style>
    </header>
  );
};

export default Navbar;
