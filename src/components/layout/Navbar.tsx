'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, LogOut, Settings, UserCircle, X, Menu } from 'lucide-react';
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

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
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
    <header className="glass navbar-responsive" style={{
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
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={onMenuClick}
        style={{ display: 'none', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.5rem' }}
      >
        <Menu size={24} />
      </button>

      {/* Search */}
      <div className="search-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', width: '400px', border: '1px solid transparent', transition: 'border 0.2s' }}>
        <Search size={18} color="var(--muted-foreground)" />
        <input
          type="text"
          placeholder="Buscar..."
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
            <div className="dropdown-notif" style={{
              position: 'absolute', right: 0, top: 'calc(100% + 0.75rem)',
              width: '320px', background: 'white', borderRadius: '12px',
              border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Notificações</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.875rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    background: n.unread ? '#eff6ff' : 'white',
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                  }}>
                    {n.unread && <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }} />}
                    <div>
                      <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{n.text}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
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
            <div className="nav-user-info" style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{userName}</p>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{subtitle}</p>
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
          </div>

          {profileOpen && (
            <div className="dropdown-profile" style={{
              position: 'absolute', right: 0, top: 'calc(100% + 0.75rem)',
              width: '220px', background: 'white', borderRadius: '12px',
              border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '0.5rem' }}>
                <Link href="/perfil" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem' }} className="dropdown-item">
                  <UserCircle size={16} />
                  Meu Perfil
                </Link>
                <div style={{ margin: '0.375rem 0', height: '1px', background: '#F1F5F9' }} />
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem', color: '#ef4444', width: '100%', textAlign: 'left' }} className="dropdown-item-danger">
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
        
        @media (max-width: 768px) {
          .navbar-responsive {
            padding: 0 1rem !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .search-container, .nav-user-info {
            display: none !important;
          }
          .dropdown-notif, .dropdown-profile {
            right: -1rem !important;
            width: calc(100vw - 2rem) !important;
            max-width: 320px;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
