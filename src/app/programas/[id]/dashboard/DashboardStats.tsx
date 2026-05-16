'use client';

import React from 'react';

function StatCard({ label, value, sub, color }: { label:string; value:string|number; sub?:string; color:string }) {
  return (
    <div style={{ background:'white', borderRadius:'16px', padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', color:'#94A3B8', marginBottom:'0.75rem' }}>{label}</p>
      <p style={{ fontSize:'2.5rem', fontWeight:900, color, letterSpacing:'-0.04em', lineHeight:1 }}>{value}</p>
      {sub && <p style={{ fontSize:'0.8rem', color:'#94A3B8', marginTop:'0.4rem' }}>{sub}</p>}
    </div>
  );
}

function DonutBar({ label, value, total, color }: { label:string; value:number; total:number; color:string }) {
  const pct = total > 0 ? Math.round((value/total)*100) : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
      <div style={{ minWidth:'120px', fontSize:'0.85rem', fontWeight:700, color:'#1E293B' }}>{label}</div>
      <div style={{ flex:1, height:'10px', background:'#F1F5F9', borderRadius:'99px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:'99px', transition:'width 0.6s ease' }} />
      </div>
      <div style={{ minWidth:'50px', textAlign:'right', fontSize:'0.875rem', fontWeight:800, color:'#1E293B' }}>{value}</div>
      <div style={{ minWidth:'40px', textAlign:'right', fontSize:'0.75rem', color:'#94A3B8', fontWeight:600 }}>{pct}%</div>
    </div>
  );
}

export default function DashboardStats({ stats, startups }: { stats: any; startups: any[] }) {
  const total = stats.total || 1;
  const segEntries = Object.entries(stats.segmentMap || {}) as [string,number][];
  const segColors = ['#6366f1','#10b981','#f59e0b','#3b82f6','#ec4899','#8b5cf6','#14b8a6'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

      {/* Row 1: maturidade + alcance + status */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1.5rem' }}>

        {/* Maturidade */}
        <div style={{ background:'white', borderRadius:'20px', padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', color:'#94A3B8', marginBottom:'1.25rem' }}>
            1. Nível de Maturidade
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
            <DonutBar label="Nível A – Alta" value={stats.levelA} total={total} color="#10b981" />
            <DonutBar label="Nível B – Média" value={stats.levelB} total={total} color="#f59e0b" />
            <DonutBar label="Nível C – Inicial" value={stats.levelC} total={total} color="#ef4444" />
          </div>
        </div>

        {/* Alcance */}
        <div style={{ background:'white', borderRadius:'20px', padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', color:'#94A3B8', marginBottom:'1.25rem' }}>
            2. Alcance Territorial
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
            <DonutBar label="Paraná" value={stats.territory?.PARANA||0} total={total} color="#6366f1" />
            <DonutBar label="Brasil" value={stats.territory?.BRASIL||0} total={total} color="#3b82f6" />
            <DonutBar label="Internacional" value={stats.territory?.INTERNACIONAL||0} total={total} color="#8b5cf6" />
          </div>
        </div>

        {/* Status */}
        <div style={{ background:'white', borderRadius:'20px', padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', color:'#94A3B8', marginBottom:'1.25rem' }}>
            3. Status das Startups
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {[
              { label:'Ativas', value:stats.active, color:'#10b981', bg:'#D1FAE5' },
              { label:'Inativas', value:stats.inactive, color:'#EF4444', bg:'#FEE2E2' },
              { label:'Investidas', value:stats.invested, color:'#F59E0B', bg:'#FEF3C7' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem', background:s.bg, borderRadius:'12px' }}>
                <span style={{ fontSize:'0.875rem', fontWeight:700, color:s.color }}>{s.label}</span>
                <span style={{ fontSize:'1.5rem', fontWeight:900, color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Segmentação + Horas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

        {/* Segmentação */}
        <div style={{ background:'white', borderRadius:'20px', padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', color:'#94A3B8', marginBottom:'1.25rem' }}>
            4. Segmentação de Mercado
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {segEntries.map(([seg, count], i) => (
              <DonutBar key={seg} label={seg} value={count as number} total={total} color={segColors[i % segColors.length]} />
            ))}
          </div>
        </div>

        {/* Horas */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <StatCard label="Total Horas de Mentoria" value={`${stats.totalMentoringHours}h`} sub={`${stats.total} startups acompanhadas`} color="#6366f1" />
          <StatCard label="Total Horas de Capacitação" value={`${stats.totalTrainingHours}h`} sub={`Média ${Math.round(stats.totalTrainingHours/(stats.total||1))}h/startup`} color="#10b981" />
        </div>
      </div>

    </div>
  );
}
