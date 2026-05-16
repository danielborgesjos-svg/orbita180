'use client';

import React, { useState } from 'react';
import { BookOpen, Video, FileText, Link as LinkIcon, ExternalLink, Search } from 'lucide-react';

const LIBRARY_ITEMS = [
  { id: 1, title: 'Crie Planos de Negócios com o PNBOX', type: 'LINK', category: 'Planejamento', desc: 'Ferramenta Sebrae para criar planos de negócios.', url: 'https://sebraepr.com.br/servicos/pnbox/' },
  { id: 2, title: 'O QUE É STORYTELLING?', type: 'VIDEO', category: 'Vendas', desc: 'Saiba como vender mais contando histórias.', url: 'https://sebraepr.com.br/videos/o-que-e-storytelling-saiba-como-vender-mais-contando-historias/' },
  { id: 3, title: 'Como calcular o preço de VENDA de produto e serviço', type: 'VIDEO', category: 'Finanças', desc: 'Passo a passo de como calcular o preço de venda de produto e serviço.', url: 'https://sebraepr.com.br/videos/passo-a-passo-de-como-calcular-o-preco-de-venda-de-produto-e-servico/' },
  { id: 4, title: 'Sebrae Canvas', type: 'LINK', category: 'Estratégia', desc: 'A ferramenta essencial para empreendedores.', url: 'https://sebraepr.com.br/sebrae-canvas-a-ferramenta-essencial-para-empreendedores/' },
  { id: 5, title: '7 dicas para criar um negócio escalável', type: 'DOCUMENT', category: 'Crescimento', desc: 'Dicas práticas para tornar sua startup escalável.', url: 'https://sebraepr.com.br/7-dicas-para-criar-um-negocio-escalavel/' },
  { id: 6, title: '8 ideias de startups para você se inspirar', type: 'DOCUMENT', category: 'Ideação', desc: 'Inspirações e ideias para começar a inovar.', url: 'https://sebraepr.com.br/8-ideias-de-startups-para-voce-se-inspirar/' },
  { id: 7, title: 'Um guia sobre como ganhar seguidores no TIKTOK', type: 'VIDEO', category: 'Marketing', desc: 'Estratégias para redes sociais e TikTok.', url: 'https://sebraepr.com.br/videos/um-guia-sobre-como-ganhar-seguidores-no-tiktok/' },
  { id: 8, title: 'GUIA COMPLETO PARA INICIAR UMA STARTUP', type: 'DOCUMENT', category: 'Estratégia', desc: 'E-book completo para dar o pontapé inicial na sua startup.', url: 'https://sebraepr.com.br/ebooks/passo-a-passo-confira-o-guia-completo-para-iniciar-uma-startup/' },
  { id: 9, title: '4 Dicas para tornar a sua empresa mais inovadora', type: 'DOCUMENT', category: 'Inovação', desc: 'Práticas de inovação para aplicar na sua empresa.', url: 'https://sebraepr.com.br/4-dicas-para-tornar-a-sua-empresa-mais-inovadora/' },
  { id: 10, title: 'Qual a melhor hora para postar nas redes sociais', type: 'DOCUMENT', category: 'Marketing', desc: 'Otimize seus horários de postagem nas redes sociais.', url: 'https://sebraepr.com.br/qual-a-melhor-hora-para-postar-nas-redes-sociais/' },
  { id: 11, title: 'Dicas matadoras para criar post no Facebook', type: 'DOCUMENT', category: 'Marketing', desc: 'Melhore a comunicação da sua empresa no Facebook.', url: 'https://sebraepr.com.br/dicas-matadoras-para-criar-post-no-facebook-para-sua-empresa/' },
  { id: 12, title: 'CANVAS: Como estruturar seu modelo de negócios', type: 'DOCUMENT', category: 'Estratégia', desc: 'Guia definitivo para modelagem com Canvas.', url: 'https://sebraepr.com.br/canvas-como-estruturar-seu-modelo-de-negocios/' },
  { id: 13, title: 'Como usar a ferramenta Trello no seu planejamento', type: 'DOCUMENT', category: 'Produtividade', desc: 'Use o Trello para planejar e realizar promessas de ano novo.', url: 'https://sebraepr.com.br/como-usar-a-ferramenta-trello-no-seu-planejamento-e-realizar-as-promessas-de-ano-novo/' },
  { id: 14, title: 'Acelera FUSION Sebrae', type: 'COURSE', category: 'Aceleração', desc: 'Programa de Treinamento Fusion Sebrae', url: '#' },
];

export default function BibliotecaPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, COURSE, DOCUMENT, LINK

  const filtered = LIBRARY_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    if (type === 'COURSE' || type === 'VIDEO') return <Video size={20} color="#6366f1" />;
    if (type === 'DOCUMENT') return <FileText size={20} color="#10b981" />;
    return <LinkIcon size={20} color="#f59e0b" />;
  };

  const getColor = (type: string) => {
    if (type === 'COURSE' || type === 'VIDEO') return '#6366f1';
    if (type === 'DOCUMENT') return '#10b981';
    return '#f59e0b';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>Biblioteca & Cursos</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Acesso a materiais educativos, templates e links úteis para acelerar sua startup.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar material..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', width: '250px' }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['ALL', 'COURSE', 'VIDEO', 'DOCUMENT', 'LINK'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '99px', 
              fontWeight: 700, 
              fontSize: '0.8rem',
              cursor: 'pointer',
              border: filter === f ? 'none' : '1px solid #E2E8F0',
              background: filter === f ? '#0F172A' : 'white',
              color: filter === f ? 'white' : '#64748B'
            }}
          >
            {f === 'ALL' ? 'Todos' : f === 'COURSE' ? 'Cursos' : f === 'VIDEO' ? 'Vídeos' : f === 'DOCUMENT' ? 'Documentos' : 'Links Úteis'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${getColor(item.type)}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getIcon(item.type)}
              </div>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: '#F1F5F9', color: '#64748B' }}>
                {item.category}
              </span>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</p>
            </div>

            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', background: '#F8FAFC', color: getColor(item.type), borderRadius: '10px', fontWeight: 700, textDecoration: 'none', border: `1px solid ${getColor(item.type)}30`, transition: 'all 0.2s' }}>
              Acessar Conteúdo <ExternalLink size={16} />
            </a>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
            Nenhum material encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
