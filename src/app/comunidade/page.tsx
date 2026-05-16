'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, MessageSquare, Heart, Share2, MoreHorizontal, Plus,
  Image as ImageIcon, Link as LinkIcon, Search, Award, Zap,
  TrendingUp, Bookmark, Send, Megaphone, Calendar, ExternalLink,
  ChevronRight, Sparkles, Globe, BookOpen, Rocket, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getCommunityPosts, createCommunityPost, likeCommunityPost } from '@/lib/actions/community';
import { getAnnouncements } from '@/lib/actions/announcements';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type PostCategory = 'Todos' | 'Dúvidas' | 'Conquistas' | 'Vagas' | 'Recursos' | 'Eventos';

interface Post {
  id: string | number;
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
  id: string;
  title: string;
  description: string;
  type: string;
  end_date?: Date;
  link?: string;
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<PostCategory>('Todos');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('Conquistas');
  const [announcementFolder, setAnnouncementFolder] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    loadPosts();
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const data = await getAnnouncements();
    setAnnouncements(data);
  }

  const loadPosts = async () => {
    setLoadingPosts(true);
    const res = await getCommunityPosts();
    if (res.success && res.posts) {
      const formattedPosts = res.posts.map((p: any) => {
        const roleName = p.user?.roles?.[0]?.role?.name || 'membro';
        const roleMap: Record<string, string> = {
          admin: 'Admin', startup_founder: 'Founder', startup_member: 'Membro',
          mentor: 'Mentor', institution: 'Instituição',
        };
        const roleKey = roleMap[roleName] || 'Membro';
        return {
          id: p.id,
          author: p.user?.name || 'Usuário',
          role: roleKey,
          content: p.content,
          time: formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: ptBR }),
          likes: p.likes,
          comments: p._count?.comments || 0,
          isVerified: roleName === 'admin' || roleName === 'institution',
          tags: p.tags ? p.tags.split(',') : [],
          category: p.category || 'Geral',
          liked: false,
          saved: false,
          roleBadge: roleStyles[roleKey] || roleStyles['Membro'],
        };
      });
      setPosts(formattedPosts);
    }
    setLoadingPosts(false);
  };

  const filteredPosts = activeCategory === 'Todos' ? posts : posts.filter(p => p.category === activeCategory);

  const toggleLike = async (id: string | number) => {
    if (typeof id === 'string') {
      await likeCommunityPost(id);
    }
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const toggleSave = (id: string | number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const handlePublish = async () => {
    if (!newPostText.trim() || !user) return;
    
    await createCommunityPost(user.id, newPostText, newPostCategory);
    setNewPostText('');
    loadPosts();
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
              />
            </div>
          </div>

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
                <button key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.7rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted-foreground)', cursor: 'pointer', fontWeight: '500' }}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
            <button
              onClick={handlePublish}
              disabled={!newPostText.trim()}
              className="premium-gradient"
              style={{ color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: newPostText.trim() ? 1 : 0.5, cursor: newPostText.trim() ? 'pointer' : 'not-allowed' }}
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
                  border: `1.5px solid ${cfg.color}`,
                  boxShadow: isActive ? `0 2px 8px ${cfg.color}40` : 'none',
                  transition: 'all 0.2s', flexShrink: 0
                }}
              >
                <Icon size={14} /> {cat}
              </button>
            );
          })}
        </div>

        {/* Posts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loadingPosts ? <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando posts...</p> : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
              <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: '600' }}>Nenhum post nesta categoria ainda.</p>
            </div>
          ) : filteredPosts.map(post => {
            const badge = post.roleBadge;
            const catCfg = categoryColors[post.category as PostCategory] ?? categoryColors['Todos'];
            return (
              <div key={post.id} className="card premium-shadow animate-fade-in" style={{ padding: '1.5rem', borderTop: `3px solid ${badge.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <AvatarPlaceholder name={post.author} color={badge.color} size={44} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{post.author}</h4>
                        {post.isVerified && <Award size={14} color={badge.color} />}
                        <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.55rem', borderRadius: '99px', background: badge.bg, color: badge.color, fontWeight: '800' }}>{badge.label}</span>
                        <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.55rem', borderRadius: '99px', background: catCfg.bg, color: catCfg.color, fontWeight: '700' }}>{post.category}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{post.time}</p>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1rem' }}>{post.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <button onClick={() => toggleLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: post.liked ? '#ef4444' : 'inherit' }}>
                      <Heart size={18} fill={post.liked ? '#ef4444' : 'none'} /> {post.likes}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MessageSquare size={18} /> {post.comments}
                    </button>
                  </div>
                  <button onClick={() => toggleSave(post.id)} style={{ color: post.saved ? '#2563eb' : 'inherit' }}>
                    <Bookmark size={18} fill={post.saved ? '#2563eb' : 'none'} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={18} color="var(--primary)" /> Mural IES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.length === 0 ? <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Nenhum anúncio no momento.</p> : announcements.map(ann => (
              <div key={ann.id} style={{ padding: '0.75rem', borderRadius: '10px', background: 'var(--muted)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '0.1rem 0.4rem', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', textTransform: 'uppercase' }}>{ann.type}</span>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '0.25rem' }}>{ann.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>{ann.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card premium-shadow">
           <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>Destaques</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#ecfdf5', borderRadius: '8px' }}>
                <Rocket size={16} color="#10b981" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Startup do Mês: EcoFlow</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#eff6ff', borderRadius: '8px' }}>
                <Award size={16} color="#2563eb" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Edital: FINEP 2026</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
