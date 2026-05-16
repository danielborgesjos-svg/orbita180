'use client';

import React from 'react';
import { Trophy, TrendingUp, Star, Handshake, FileText, Globe, DollarSign, Newspaper, Award } from 'lucide-react';

const ACHIEVEMENT_ICONS: Record<string, any> = {
  EVENTO: Star, PREMIO: Award, PUBLICACAO: Newspaper, PARCERIA: Handshake,
  CONTRATO: FileText, INVESTIMENTO: DollarSign, EXPANSAO: Globe, OUTRO: Trophy,
};
const ACHIEVEMENT_COLORS: Record<string, string> = {
  EVENTO:'#6366f1', PREMIO:'#f59e0b', PUBLICACAO:'#3b82f6', PARCERIA:'#10b981',
  CONTRATO:'#8b5cf6', INVESTIMENTO:'#ef4444', EXPANSAO:'#14b8a6', OUTRO:'#94A3B8',
};

export default function ConquistasTab({ startups }: { startups: any[] }) {
  const all = startups.flatMap(s => s.achievements.map((a: any) => ({ ...a, startupName: s.startup.name })));

  // Group by type
  const byType: Record<string, any[]> = {};
  all.forEach(a => { byType[a.type] = byType[a.type] || []; byType[a.type].push(a); });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0F172A' }}>9. Conquistas & Visibilidade ({all.length})</h2>
      </div>

      {/* Summary row */}
      <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
        {Object.entries(byType).map(([type, items]) => {
          const color = ACHIEVEMENT_COLORS[type] || '#94A3B8';
          const Icon = ACHIEVEMENT_ICONS[type] || Trophy;
          return (
            <div key={type} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 1rem', background:`${color}12`, borderRadius:'10px', border:`1px solid ${color}30` }}>
              <Icon size={14} color={color} />
              <span style={{ fontSize:'0.8rem', fontWeight:800, color }}>{type}</span>
              <span style={{ fontSize:'0.875rem', fontWeight:900, color }}>{items.length}</span>
            </div>
          );
        })}
      </div>

      {/* All achievements */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1rem' }}>
        {all.map(a => {
          const color = ACHIEVEMENT_COLORS[a.type] || '#94A3B8';
          const Icon = ACHIEVEMENT_ICONS[a.type] || Trophy;
          return (
            <div key={a.id} style={{ background:'white', borderRadius:'16px', padding:'1.25rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', borderLeft:`4px solid ${color}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem' }}>
                <div style={{ width:36, height:36, borderRadius:'10px', background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <p style={{ fontSize:'0.7rem', fontWeight:800, color, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.25rem' }}>{a.type}</p>
                  <h4 style={{ fontWeight:800, fontSize:'0.95rem', color:'#0F172A', lineHeight:1.3 }}>{a.title}</h4>
                  <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:'0.25rem', fontWeight:600 }}>{a.startupName}</p>
                  {a.description && <p style={{ fontSize:'0.8rem', color:'#94A3B8', marginTop:'0.35rem', lineHeight:1.4 }}>{a.description}</p>}
                  {a.date && <p style={{ fontSize:'0.75rem', color:'#CBD5E1', marginTop:'0.35rem' }}>{new Date(a.date).toLocaleDateString('pt-BR')}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {all.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', background:'#F8FAFC', borderRadius:'20px', border:'2px dashed #E2E8F0' }}>
          <Trophy size={40} color="#CBD5E1" style={{ marginBottom:'1rem' }} />
          <p style={{ color:'#64748B', fontWeight:700 }}>Nenhuma conquista registrada</p>
        </div>
      )}
    </div>
  );
}
