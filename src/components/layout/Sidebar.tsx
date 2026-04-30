'use client';

import React from 'react';
import {
  LayoutDashboard, Users, Wallet, LayoutList, Calendar,
  MessageSquare, PieChart, Target, FileText, Globe,
  Settings, Building2, Users2, Compass, Briefcase,
  ShieldCheck, BarChart3, Presentation, UserCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  // Define menus per role
  const getMenuItems = () => {
    const role = user.role;
    
    const commonMenus = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
      { icon: Calendar, label: 'Agenda & Reuniões', href: '/agenda' },
      { icon: Users2, label: 'Comunidade', href: '/comunidade' },
      { icon: Globe, label: 'Eventos & Editais', href: '/eventos' },
    ];

    if (role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Visão Global', href: '/' },
        { icon: Building2, label: 'Instituições (IEs)', href: '/instituicoes' },
        { icon: Briefcase, label: 'Projetos & Programas', href: '/programas' },
        { icon: Users, label: 'Todas Startups', href: '/todas-startups' },
        { icon: Globe, label: 'Eventos & Editais', href: '/eventos' },
        { icon: ShieldCheck, label: 'Permissões Globais', href: '/permissoes' },
        ...commonMenus.slice(1)
      ];
    }

    if (role === 'institution') {
      return [
        { icon: LayoutDashboard, label: 'Meu Ecossistema', href: '/' },
        { icon: Briefcase, label: 'Meus Programas', href: '/programas' },
        { icon: Users, label: 'Startups Vinculadas', href: '/todas-startups' },
        { icon: BarChart3, label: 'Análise de Maturidade', href: '/maturidade-institucional' },
        ...commonMenus.slice(1)
      ];
    }

    if (role === 'mentor') {
      return [
        { icon: LayoutDashboard, label: 'Painel do Mentor', href: '/' },
        { icon: Users, label: 'Startups Acompanhadas', href: '/startups-mentor' },
        { icon: MessageSquare, label: 'Feedbacks & Avaliações', href: '/feedbacks' },
        ...commonMenus.slice(1)
      ];
    }

    // Default for startup_founder and startup_member
    return [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
      { icon: Building2, label: 'Minha Startup', href: '/startup' },
      { icon: FileText, label: 'Contratos', href: '/contratos' },
      { icon: Wallet, label: 'Financeiro', href: '/financeiro' },
      { icon: LayoutList, label: 'Kanban & Tarefas', href: '/kanban' },
      { icon: MessageSquare, label: 'CRM & WhatsApp', href: '/crm' },
      { icon: Target, label: 'Metas & Plano de Ação', href: '/metas' },
      { icon: Presentation, label: 'Canvas & Pitch', href: '/estrategia' },
      { icon: Compass, label: 'Maturidade', href: '/maturidade' },
      ...commonMenus.slice(1)
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar glass" style={{ width: 'var(--sidebar-width)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Compass size={20} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'Outfit', color: 'var(--primary)' }}>Órbita 180</span>
      </div>

      <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem', background: 'var(--secondary)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', textAlign: 'center' }}>
          Perfil: {user.role.replace('_', ' ')}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link href={item.href} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius)',
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  background: isActive ? 'var(--secondary)' : 'transparent',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }} className={isActive ? "" : "menu-item-hover"}>
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link href="/perfil" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          color: pathname === '/perfil' ? 'var(--primary)' : 'var(--muted-foreground)',
          background: pathname === '/perfil' ? 'var(--secondary)' : 'transparent',
          borderRadius: 'var(--radius)',
          fontSize: '0.9rem',
          fontWeight: pathname === '/perfil' ? '600' : '500',
          transition: 'all 0.2s'
        }} className={pathname === '/perfil' ? '' : 'menu-item-hover'}>
          <UserCircle size={18} />
          Meu Perfil
        </Link>
        <Link href="/configuracoes" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          color: 'var(--muted-foreground)',
          borderRadius: 'var(--radius)',
          fontSize: '0.9rem',
          fontWeight: '500',
          transition: 'all 0.2s'
        }} className="menu-item-hover">
          <Settings size={18} />
          Configurações
        </Link>
      </div>

      <style jsx>{`
        .menu-item-hover:hover {
          background: var(--secondary);
          color: var(--primary) !important;
          transform: translateX(4px);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
