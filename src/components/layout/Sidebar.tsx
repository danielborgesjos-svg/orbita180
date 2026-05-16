'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Wallet, LayoutList, Calendar,
  MessageSquare, PieChart, Target, FileText, Globe,
  Settings, Building2, Users2, Compass, Briefcase,
  ShieldCheck, BarChart3, Presentation, UserCircle, GraduationCap, ClipboardCheck, GripVertical, Activity, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookOpen, Database, UserCheck } from 'lucide-react';

// --- SORTABLE NAV ITEM ---
function SortableNavItem({ item, isActive, pathname }: { item: any, isActive: boolean, pathname: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.label });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <Link href={item.href} 
        {...attributes} 
        {...listeners}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.75rem 1rem', 
          borderRadius: 'var(--radius)',
          color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
          background: isActive ? 'var(--secondary)' : 'transparent',
          fontSize: '0.9rem',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s',
          cursor: 'grab'
        }} className={isActive ? "" : "menu-item-hover"}>
        <item.icon size={18} />
        <span style={{ flex: 1 }}>{item.label}</span>
        <GripVertical size={14} style={{ opacity: 0.3 }} />
      </Link>
    </li>
  );
}

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (user) {
      const savedOrder = localStorage.getItem(`orbita_sidebar_order_${user.id}`);
      const initialItems = getInitialMenuItems(user.role);
      
      if (savedOrder) {
        const orderLabels = JSON.parse(savedOrder);
        const reordered = [...initialItems].sort((a, b) => {
          const idxA = orderLabels.indexOf(a.label);
          const idxB = orderLabels.indexOf(b.label);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
        setMenuItems(reordered);
      } else {
        setMenuItems(initialItems);
      }
    }
  }, [user]);

  if (!user) return null;

  const getInitialMenuItems = (role: string) => {
    const commonMenus = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
      { icon: BookOpen, label: 'Biblioteca', href: '/biblioteca' },
      { icon: Calendar, label: 'Agenda & Reuniões', href: '/agenda' },
      { icon: Users2, label: 'Comunidade', href: '/comunidade' },
    ];

    if (role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Visão Global', href: '/' },
        { icon: Building2, label: 'Instituições (IEs)', href: '/instituicoes' },
        { icon: Briefcase, label: 'Projetos & Programas', href: '/programas' },
        { icon: Users, label: 'Todas Startups', href: '/todas-startups' },
        { icon: UserCheck, label: 'Aprovações Founders', href: '/admin/founders' },
        { icon: Activity, label: 'Histórico de Atividades', href: '/admin/atividades' },
        { icon: UserCircle, label: 'Founders', href: '/programas/prog-garage-2026/founders' },
        { icon: BarChart3, label: 'Dashboard GARAGE', href: '/programas/prog-garage-2026/dashboard' },
        { icon: Database, label: 'Backup do Sistema', href: '/admin/backup' },
        { icon: GraduationCap, label: 'Educação & Turmas', href: '/admin/turmas' },
        { icon: ClipboardCheck, label: 'Forms & Due Diligence', href: '/admin/forms' },
        { icon: ShieldCheck, label: 'Permissões Globais', href: '/permissoes' },
        ...commonMenus.slice(1)
      ];
    }

    if (role === 'diretor_ies') {
      return [
        { icon: LayoutDashboard, label: 'Painel Executivo', href: '/' },
        { icon: Building2, label: 'Gestão da IES', href: '/instituicoes' },
        { icon: Users, label: 'Análise de Startups', href: '/todas-startups' },
        { icon: BarChart3, label: 'Matriz de Diagnóstico', href: '/diagnosticos' },
        { icon: ShieldCheck, label: 'Verificação de Mentores', href: '/admin/mentores' },
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

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(i => i.label === active.id);
        const newIndex = items.findIndex(i => i.label === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(`orbita_sidebar_order_${user?.id}`, JSON.stringify(newOrder.map(i => i.label)));
        return newOrder;
      });
    }
  }

  return (
    <aside className={`sidebar glass ${isOpen ? 'show' : ''}`} style={{ width: 'var(--sidebar-width)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Compass size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'Outfit', color: 'var(--primary)' }}>Órbita 180</span>
        </div>
        <button className="mobile-close-btn" onClick={onClose} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--muted-foreground)' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem', background: 'var(--secondary)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', textAlign: 'center' }}>
          Perfil: {user.role.replace('_', ' ')}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={menuItems.map(i => i.label)} strategy={verticalListSortingStrategy}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {menuItems.map((item) => (
                <SortableNavItem 
                  key={item.label} 
                  item={item} 
                  isActive={pathname === item.href} 
                  pathname={pathname} 
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
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
      </div>

      <style jsx>{`
        .menu-item-hover:hover {
          background: var(--secondary);
          color: var(--primary) !important;
          transform: translateX(4px);
        }
        
        @media (max-width: 968px) {
          .sidebar {
            position: fixed !important;
            left: -100%;
            transition: left 0.3s ease;
            background: white !important;
          }
          .sidebar.show {
            left: 0;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
