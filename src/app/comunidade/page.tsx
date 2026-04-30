'use client';

import React, { useState } from 'react';
import {
  Users, MessageSquare, Heart, Share2, MoreHorizontal, Plus,
  Image as ImageIcon, Link as LinkIcon, Search, Award, Zap,
  TrendingUp, Bookmark, Send, Megaphone, Calendar, ExternalLink,
  ChevronRight, Sparkles, Globe, BookOpen, Rocket, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type PostCategory = 'Todos' | 'Dúvidas' | 'Conquistas' | 'Vagas' | 'Recursos' | 'Eventos';

interface Post {
  id: number;
  author: string;
  role: string;
  avatar?: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  isVerified: boolean;
  tags: string[];
  category: string;
  liked: boolean;
  saved: boolean;
  roleBadge: { label: string; color: string; bg: string };
}

interface Announcement {
  id: number;
  ies: string;
  title: string;
  description: string;
  deadline: string;
  type: 'Edital' | 'Programa' | 'Bolsa' | 'Evento';
  color: string;
  url?: string;
}

const roleStyles: Record<string, { label: string; color: string; bg: string }> = {
  Instituição: { label: 'IES', color: '#0ea5e9', bg: '#e0f2fe' },
  Startup: { label: 'Startup', color: '#10b981', bg: '#d1fae5' },
  Founder: { label: 'Founder', color: '#8b5cf6', bg: '#ede9fe' },
  Mentor: { label: 'Mentor', color: '#f59e0b', bg: '#fef3c7' },
  Admin: { label: 'Admin', color: '#ef4444', bg: '#fee2e2' },
  Membro: { label: 'Membro', color: '#64748b', bg: '#f1f5f9' },
};

const categoryColors: Record<PostCategory, { color: string; bg: string; icon: React.ElementType }> = {
  Todos: { color: '#2563eb', bg: '#eff6ff', icon: Globe },
  Dúvidas: { color: '#f59e0b', bg: '#fffbeb', icon: Sparkles },
  Conquistas: { color: '#10b981', bg: '#ecfdf5', icon: Rocket },
  Vagas: { color: '#8b5cf6', bg: '#f5f3ff', icon: Users },
  Recursos: { color: '#0ea5e9', bg: '#e0f2fe', icon: BookOpen },
  Eventos: { color: '#ef4444', bg: '#fff1f2', icon: Calendar },
};

const tagColors = [
  { color: '#2563eb', bg: '#dbeafe' },
  { color: '#10b981', bg: '#d1fae5' },
  { color: '#8b5cf6', bg: '#ede9fe' },
  { color: '#f59e0b', bg: '#fef3c7' },
  { color: '#ef4444', bg: '#fee2e2' },
  { color: '#0ea5e9', bg: '#e0f2fe' },
];

const getTagColor = (tag: string) => tagColors[tag.length % tagColors.length];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: 'Aceleradora Órbita',
    role: 'Instituição',
    content: 'Parabéns às 10 novas startups selecionadas para o Ciclo de Inverno 2026! A jornada de evolução começa hoje. Bora voar alto! 🚀',
    time: '2h atrás',
    likes: 24,
    comments: 5,
    isVerified: true,
    tags: ['Inovação', 'Órbita180', 'CicloInverno'],
    category: 'Conquistas',
    liked: false,
    saved: false,
    roleBadge: roleStyles['Instituição'],
  },
  {
    id: 2,
    author: 'TechInova',
    role: 'Startup',
    content: 'Acabamos de validar nosso MVP com os primeiros 50 clientes pagantes! O dashboard de maturidade da Órbita foi essencial para focarmos no que realmente importa. MRR crescendo 40% MoM 📈',
    time: '5h atrás',
    likes: 56,
    comments: 12,
    isVerified: false,
    tags: ['MVP', 'Validação', 'B2B', 'Growth'],
    category: 'Conquistas',
    liked: false,
    saved: false,
    roleBadge: roleStyles['Startup'],
  },
  {
    id: 3,
    author: 'Daniel Borges',
    role: 'Founder',
    content: 'Alguém com experiência em integração de APIs de pagamento Stripe no mercado brasileiro? Gostaria de trocar uma ideia sobre taxas e compliance. Pode me marcar nos comentários!',
    time: 'Ontem',
    likes: 8,
    comments: 15,
    isVerified: false,
    tags: ['Stripe', 'Pagamentos', 'Dúvida', 'Fintech'],
    category: 'Dúvidas',
    liked: false,
    saved: false,
    roleBadge: roleStyles['Founder'],
  },
  {
    id: 4,
    author: 'Prof. Carlos Mendes',
    role: 'Mentor',
    content: 'Compartilhando um framework incrível para validação de hipóteses de negócio que uso com meus mentorados. Link nos comentários 👇 #CustomerDiscovery',
    time: '2 dias atrás',
    likes: 43,
    comments: 8,
    isVerified: true,
    tags: ['Mentoria', 'CustomerDiscovery', 'Framework', 'Lean'],
    category: 'Recursos',
    liked: false,
    saved: false,
    roleBadge: roleStyles['Mentor'],
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    ies: 'UFPR',
    title: 'Edital FINEP Subvenção 2026',
    description: 'Apoio a empresas inovadoras em fase de crescimento. Até R$ 500k.',
    deadline: '15/06/2026',
    type: 'Edital',
    color: '#2563eb',
  },
  {
    id: 2,
    ies: 'Sebrae-PR',
    title: 'Programa Sebraetec Digitalização',
    description: 'Consultoria gratuita para transformação digital de startups.',
    deadline: '30/05/2026',
    type: 'Programa',
    color: '#10b981',
  },
  {
    id: 3,
    ies: 'Órbita 180',
    title: 'Demo Day Ciclo de Inverno',
    description: 'Apresente sua startup para +30 investidores. Inscrições abertas.',
    deadline: '01/07/2026',
    type: 'Evento',
    color: '#8b5cf6',
  },
];

const CATEGORIES: PostCategory[] = ['Todos', 'Dúvidas', 'Conquistas', 'Vagas', 'Recursos', 'Eventos'];

const AvatarPlaceholder = ({ name, color, size = 40 }: { name: string; color: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: size > 36 ? '12px' : '50%',
    background: `${color}20`, border: `2px solid ${color}40`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: size > 36 ? '1rem' : '0.75rem',
    color: color, flexShrink: 0
  }}>
    {name.split(' ').map(w => w[0]).slice(0, 2).join('')}
  </div>
);

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<PostCategory>('Todos');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('Conquistas');
  const [showPostCategories, setShowPostCategories] = useState(false);
  const [announcementFolder, setAnnouncementFolder] = useState(false);

  const filteredPosts = activeCategory === 'Todos' ? posts : posts.filter(p => p.category === activeCategory);

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const handlePublish = () => {
    if (!newPostText.trim() || !user) return;
    const roleMap: Record<string, string> = {
      admin: 'Admin', startup_founder: 'Founder', startup_member: 'Membro',
      mentor: 'Mentor', institution: 'Instituição',
    };
    const roleKey = roleMap[user.role] ?? 'Membro';
    const newPost: Post = {
      id: Date.now(),
      author: user.name,
      role: roleKey,
      content: newPostText,
      time: 'Agora',
      likes: 0,
      comments: 0,
      isVerified: user.role === 'admin' || user.role === 'institution',
      tags: [],
      category: newPostCategory,
      liked: false,
      saved: false,
      roleBadge: roleStyles[roleKey] ?? roleStyles['Membro'],
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
  };

  const typeColors: Record<string, string> = {
    Edital: '#2563eb', Programa: '#10b981', Bolsa: '#f59e0b', Evento: '#8b5cf6'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
      {/* Main Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Create Post */}
        <div className="card premium-shadow" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1rem' }}>
            <AvatarPlaceholder
              name={user?.name ?? 'U'}
              color={roleStyles[user?.role === 'institution' ? 'Instituição' : user?.role === 'mentor' ? 'Mentor' : user?.role === 'admin' ? 'Admin' : 'Founder']?.color ?? '#2563eb'}
              size={44}
            />
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="O que está acontecendo no seu ecossistema?"
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                style={{
                  width: '100%', border: '1.5px solid var(--border)', background: 'var(--muted)',
                  borderRadius: '10px', padding: '0.875rem 1rem', resize: 'none', outline: 'none',
                  minHeight: '90px', fontSize: '0.925rem', lineHeight: '1.5', fontFamily: 'inherit',
                  boxSizing: 'border-box', transition: 'border 0.2s'
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          {/* Category picker */}
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.filter(c => c !== 'Todos').map(cat => {
              const cfg = categoryColors[cat];
              const isSelected = newPostCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setNewPostCategory(cat)}
                  style={{
                    padding: '0.3rem 0.7rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                    background: isSelected ? cfg.color : cfg.bg,
                    color: isSelected ? 'white' : cfg.color,
                    border: `1.5px solid ${cfg.color}30`
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[{ icon: ImageIcon, label: 'Foto' }, { icon: LinkIcon, label: 'Link' }, { icon: Zap, label: 'Insight' }].map(({ icon: Icon, label }) => (
                <button key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.7rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted-foreground)', cursor: 'pointer', fontWeight: '500', transition: 'background 0.15s' }} className="toolbar-btn">
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
            <button
              onClick={handlePublish}
              disabled={!newPostText.trim()}
              className="premium-gradient"
              style={{ color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: newPostText.trim() ? 1 : 0.5, cursor: newPostText.trim() ? 'pointer' : 'not-allowed', transition: 'opacity 0.2s' }}
            >
              <Send size={15} /> Publicar
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {CATEGORIES.map(cat => {
            const cfg = categoryColors[cat];
            const Icon = cfg.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.45rem 1rem', borderRadius: '99px', fontSize: '0.82rem', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', cursor: 'pointer',
                  background: isActive ? cfg.color : 'white',
                  color: isActive ? 'white' : cfg.color,
                  border: `1.5px solid ${isActive ? cfg.color : cfg.color}`,
                  boxShadow: isActive ? `0 2px 8px ${cfg.color}40` : 'none',
                  transition: 'all 0.2s', flexShrink: 0
                }}
              >
                <Icon size={14} /> {cat}
              </button>
            );
          })}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
              <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: '600' }}>Nenhum post nesta categoria ainda.</p>
            </div>
          )}

          {filteredPosts.map(post => {
            const badge = post.roleBadge;
            const catCfg = categoryColors[post.category as PostCategory] ?? categoryColors['Todos'];
            return (
              <div key={post.id} className="card premium-shadow animate-fade-in" style={{ padding: '1.5rem', borderTop: `3px solid ${badge.color}` }}>
                {/* Post header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <AvatarPlaceholder name={post.author} color={badge.color} size={44} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--foreground)' }}>{post.author}</h4>
                        {post.isVerified && <Award size={14} color={badge.color} />}
                        {/* Role badge */}
                        <span style={{
                          fontSize: '0.68rem', padding: '0.15rem 0.55rem', borderRadius: '99px',
                          background: badge.bg, color: badge.color, fontWeight: '800', letterSpacing: '0.03em'
                        }}>
                          {badge.label}
                        </span>
                        {/* Category badge */}
                        <span style={{
                          fontSize: '0.68rem', padding: '0.15rem 0.55rem', borderRadius: '99px',
                          background: catCfg.bg, color: catCfg.color, fontWeight: '700',
                          border: `1px solid ${catCfg.color}30`
                        }}>
                          {post.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.15rem' }}>{post.time}</p>
                    </div>
                  </div>
                  <button style={{ color: 'var(--muted-foreground)', padding: '0.25rem', borderRadius: '8px', flexShrink: 0 }} className="toolbar-btn">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Content */}
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', color: 'var(--foreground)', marginBottom: '1rem' }}>{post.content}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
                    {post.tags.map((tag, i) => {
                      const tc = getTagColor(tag);
                      return (
                        <span key={i} style={{
                          fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '99px',
                          background: tc.bg, color: tc.color, fontWeight: '700', cursor: 'pointer',
                          border: `1px solid ${tc.color}30`, transition: 'opacity 0.15s'
                        }}>
                          #{tag}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => toggleLike(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', color: post.liked ? '#ef4444' : 'var(--muted-foreground)', background: post.liked ? '#fff1f2' : 'transparent' }}
                      className={post.liked ? '' : 'toolbar-btn'}
                    >
                      <Heart size={16} fill={post.liked ? '#ef4444' : 'none'} /> {post.likes}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', color: 'var(--muted-foreground)', transition: 'background 0.15s' }} className="toolbar-btn">
                      <MessageSquare size={16} /> {post.comments}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', color: 'var(--muted-foreground)', transition: 'background 0.15s' }} className="toolbar-btn">
                      <Share2 size={16} /> Compartilhar
                    </button>
                  </div>
                  <button
                    onClick={() => toggleSave(post.id)}
                    style={{ padding: '0.4rem 0.625rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', color: post.saved ? '#2563eb' : 'var(--muted-foreground)', background: post.saved ? '#eff6ff' : 'transparent' }}
                    className={post.saved ? '' : 'toolbar-btn'}
                  >
                    <Bookmark size={16} fill={post.saved ? '#2563eb' : 'none'} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Search Community */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.625rem 1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <Search size={16} color="var(--muted-foreground)" />
          <input type="text" placeholder="Buscar na comunidade..." style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
        </div>

        {/* Announcements / IES Folder */}
        <div className="card premium-shadow" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '1rem 1.25rem', margin: '-1.25rem -1.25rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Megaphone size={18} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', lineHeight: 1.2 }}>Mural IES</h3>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }}>Editais, programas e bolsas</p>
                </div>
              </div>
              <button
                onClick={() => setAnnouncementFolder(v => !v)}
                style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {announcementFolder ? 'menos' : 'ver todos'} <ChevronRight size={14} style={{ transform: announcementFolder ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ANNOUNCEMENTS.slice(0, announcementFolder ? ANNOUNCEMENTS.length : 2).map(ann => {
              const tColor = typeColors[ann.type] ?? '#2563eb';
              return (
                <div key={ann.id} style={{ padding: '0.875rem', borderRadius: '10px', background: 'var(--muted)', border: `1px solid ${tColor}20`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: tColor }} />
                  <div style={{ paddingLeft: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '99px', background: `${tColor}15`, color: tColor }}>{ann.type}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>{ann.ies}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--foreground)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{ann.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.625rem', lineHeight: 1.4 }}>{ann.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>
                        <Calendar size={12} /> Até {ann.deadline}
                      </span>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: tColor, fontWeight: '700', cursor: 'pointer' }}>
                        Ver mais <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add announcement button (for IES/Admin) */}
          <button style={{
            marginTop: '0.875rem', width: '100%', padding: '0.6rem', border: '1.5px dashed #93c5fd', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
            background: '#eff6ff', transition: 'background 0.2s'
          }} className="add-ann-btn">
            <Plus size={15} /> Publicar anúncio
          </button>
        </div>

        {/* Highlights */}
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" /> Destaques
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Startup do Mês', name: 'EcoFlow', icon: Rocket, color: '#10b981', bg: '#d1fae5' },
              { label: 'Novo Edital', name: 'FINEP 2026', icon: Award, color: '#2563eb', bg: '#dbeafe' },
              { label: 'Em Alta', name: '#Web3Brasil', icon: Zap, color: '#8b5cf6', bg: '#ede9fe' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.625rem', borderRadius: '10px', background: item.bg, cursor: 'pointer', transition: 'opacity 0.15s' }} className="highlight-item">
                <div style={{ padding: '0.5rem', background: item.color, borderRadius: '8px', flexShrink: 0 }}>
                  <item.icon size={16} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '0.68rem', color: item.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--foreground)' }}>{item.name}</p>
                </div>
                <ChevronRight size={14} color={item.color} style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Mentorships */}
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#f59e0b" /> Próximas Mentorias
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { title: 'Pitch Review com Sebrae', time: 'Qua, 14:00', color: '#f59e0b' },
              { title: 'Mentoria de Marketing Digital', time: 'Sex, 10:00', color: '#10b981' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '0.875rem', borderRadius: '10px', background: 'var(--muted)', border: '1px solid var(--border)', borderLeft: `3px solid ${m.color}` }}>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>{m.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={12} /> {m.time}
                </p>
                <button style={{ width: '100%', padding: '0.4rem', borderRadius: '7px', background: 'white', border: `1.5px solid ${m.color}50`, fontSize: '0.75rem', fontWeight: '700', color: m.color, cursor: 'pointer', transition: 'background 0.15s' }} className="subscribe-btn">
                  Inscrever-se
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Members */}
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="#8b5cf6" /> Membros Ativos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Aceleradora Órbita', role: 'Instituição', color: '#0ea5e9' },
              { name: 'Prof. Carlos Mendes', role: 'Mentor', color: '#f59e0b' },
              { name: 'TechInova', role: 'Startup', color: '#10b981' },
              { name: 'Daniel Borges', role: 'Founder', color: '#8b5cf6' },
            ].map((m, i) => {
              const badge = roleStyles[m.role] ?? roleStyles['Membro'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }} className="member-item">
                  <AvatarPlaceholder name={m.name} color={m.color} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</p>
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '99px', background: badge.bg, color: badge.color, fontWeight: '800' }}>{badge.label}</span>
                  </div>
                  <button style={{ fontSize: '0.72rem', padding: '0.25rem 0.625rem', borderRadius: '99px', border: `1.5px solid ${m.color}40`, color: m.color, fontWeight: '700', cursor: 'pointer', flexShrink: 0, background: `${m.color}08` }}>
                    Seguir
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .toolbar-btn:hover { background: var(--secondary); }
        .highlight-item:hover { opacity: 0.85; }
        .member-item:hover { background: var(--secondary); }
        .add-ann-btn:hover { background: #dbeafe; }
        .subscribe-btn:hover { background: #f8fafc; }
      `}</style>
    </div>
  );
}
