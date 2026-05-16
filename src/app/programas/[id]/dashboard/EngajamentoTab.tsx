'use client';

import React from 'react';
import { Activity } from 'lucide-react';

function EngBar({ label, value, color }: { label:string; value:number; color:string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', fontWeight:700 }}>
        <span style={{ color:'#475569' }}>{label}</span>
        <span style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height:'8px', background:'#F1F5F9', borderRadius:'99px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${Math.min(value,100)}%`, background:color, borderRadius:'99px', transition:'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export default function EngajamentoTab({ startups }: { startups: any[] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0F172A' }}>8. Engajamento das Startups</h2>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'1.5rem' }}>
        {startups.map(({ startup, engagement }) => {
          if (!engagement) return null;
          const score = Math.round(engagement.engagement_score || 0);
          const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <div key={startup.id} style={{ background:'white', borderRadius:'20px', padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
                <div>
                  <h4 style={{ fontWeight:900, fontSize:'1rem', color:'#0F172A' }}>{startup.name}</h4>
                  <p style={{ fontSize:'0.75rem', color:'#94A3B8', marginTop:'0.15rem' }}>{startup.segment || 'N/D'}</p>
                </div>
                <div style={{ width:52, height:52, borderRadius:'50%', background:`${scoreColor}18`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:`2px solid ${scoreColor}` }}>
                  <span style={{ fontSize:'1.1rem', fontWeight:900, color:scoreColor, lineHeight:1 }}>{score}</span>
                  <span style={{ fontSize:'0.5rem', color:scoreColor, fontWeight:700 }}>SCORE</span>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                <EngBar label="Participação na Trilha" value={engagement.trail_participation || 0} color="#6366f1" />
                <EngBar label="Uso da Biblioteca" value={engagement.library_usage || 0} color="#8b5cf6" />
                <EngBar label="Presença em Mentorias" value={engagement.mentoring_presence || 0} color="#10b981" />
                <EngBar label="Presença em Capacitações" value={engagement.training_presence || 0} color="#3b82f6" />
              </div>

              <div style={{ marginTop:'1rem', padding:'0.75rem', background:'#F8FAFC', borderRadius:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:'#64748B', fontWeight:700 }}>
                  <Activity size={14} /> Eventos participados
                </div>
                <span style={{ fontWeight:900, fontSize:'1.1rem', color:'#0F172A' }}>{engagement.events_count || 0}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
