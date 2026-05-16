'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Calendar, Users, Trophy, TrendingUp } from 'lucide-react';

export default function DashboardHeader({ program, stats }: { program: any; stats: any }) {
  return (
    <div>
      <Link href="/programas" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', color:'#64748B', fontSize:'0.85rem', fontWeight:600, textDecoration:'none', marginBottom:'1rem' }}>
        <ArrowLeft size={16} /> Programas
      </Link>

      <div style={{ background:'linear-gradient(135deg,#1E293B 0%,#1e3a5f 50%,#0f172a 100%)', borderRadius:'24px', padding:'2.5rem', color:'white', position:'relative', overflow:'hidden' }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'240px', height:'240px', background:'rgba(99,102,241,0.2)', borderRadius:'50%', filter:'blur(60px)' }} />
        
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1.5rem', position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
              <div style={{ padding:'0.4rem 0.9rem', background:'rgba(99,102,241,0.3)', borderRadius:'99px', fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.05em', border:'1px solid rgba(99,102,241,0.5)' }}>
                ACELERAÇÃO
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', opacity:0.7 }}>
                <Building2 size={14} /> {program?.institution?.name}
              </div>
            </div>
            <h1 style={{ fontSize:'2.5rem', fontWeight:900, letterSpacing:'-0.04em', marginBottom:'0.5rem' }}>{program?.name}</h1>
            <p style={{ opacity:0.7, fontSize:'0.95rem' }}>{program?.description}</p>

            {program?.start_date && (
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'1rem', fontSize:'0.85rem', opacity:0.8 }}>
                <Calendar size={14} />
                {new Date(program.start_date).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}
                {program.end_date && <> — {new Date(program.end_date).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</>}
              </div>
            )}
          </div>

          {/* Quick KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              { icon: Users, label:'Startups', value: stats.total, color:'#6366f1' },
              { icon: Users, label:'Founders', value: stats.totalFounders, color:'#10b981' },
              { icon: Trophy, label:'Investidas', value: stats.invested, color:'#f59e0b' },
              { icon: TrendingUp, label:'Engajamento', value: `${stats.avgEngagement}%`, color:'#3b82f6' },
            ].map((kpi,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.25rem', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', minWidth:'120px' }}>
                <div style={{ width:32, height:32, borderRadius:'8px', background:kpi.color, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.6rem' }}>
                  <kpi.icon size={16} color="white" />
                </div>
                <p style={{ fontSize:'1.75rem', fontWeight:900, lineHeight:1 }}>{kpi.value}</p>
                <p style={{ fontSize:'0.75rem', opacity:0.7, marginTop:'0.25rem', fontWeight:600 }}>{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
