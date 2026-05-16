'use client';

import React from 'react';
import { Link2, Globe, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const levelColor: Record<string, string> = { A:'#10b981', B:'#f59e0b', C:'#ef4444' };
const levelBg: Record<string, string>    = { A:'#D1FAE5', B:'#FEF3C7', C:'#FEE2E2' };
const reachLabel: Record<string, string> = { PARANA:'Paraná', BRASIL:'Brasil', INTERNACIONAL:'Internacional' };

export default function StartupCards({ startups, programId }: { startups: any[]; programId: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0F172A' }}>5. Startups Acompanhadas ({startups.length})</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'1.5rem' }}>
        {startups.map(({ startup, maturity, engagement }) => {
          const lvl = maturity?.maturity_level || 'C';
          return (
            <div key={startup.id} className="card" style={{ padding:'1.5rem', borderRadius:'20px', background:'white', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

              {/* Top row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                    <span style={{ padding:'0.2rem 0.6rem', borderRadius:'6px', fontSize:'0.7rem', fontWeight:800, background:levelBg[lvl], color:levelColor[lvl] }}>
                      Nível {lvl}
                    </span>
                    <span style={{ padding:'0.2rem 0.6rem', borderRadius:'6px', fontSize:'0.7rem', fontWeight:700, background:'#F1F5F9', color:'#64748B' }}>
                      {startup.segment || 'N/D'}
                    </span>
                    <span style={{ padding:'0.2rem 0.6rem', borderRadius:'6px', fontSize:'0.7rem', fontWeight:700, background:'#EEF2FF', color:'#6366f1' }}>
                      {reachLabel[maturity?.territory_reach] || 'Paraná'}
                    </span>
                  </div>
                  <h3 style={{ fontSize:'1.1rem', fontWeight:900, color:'#0F172A' }}>{startup.name}</h3>
                  <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:'0.25rem' }}>{startup.description_short || '—'}</p>
                </div>
                <span style={{ padding:'0.3rem 0.7rem', borderRadius:'99px', fontSize:'0.7rem', fontWeight:800, background: startup.status === 'ACTIVE' ? '#D1FAE5' : '#F1F5F9', color: startup.status === 'ACTIVE' ? '#059669' : '#94A3B8' }}>
                  {startup.status === 'ACTIVE' ? 'ATIVA' : 'INATIVA'}
                </span>
              </div>

              {/* Info grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div style={{ padding:'0.75rem', background:'#F8FAFC', borderRadius:'10px' }}>
                  <p style={{ fontSize:'0.7rem', color:'#94A3B8', fontWeight:700, marginBottom:'0.25rem' }}>CNPJ</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    {startup.cnpj ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                    <span style={{ fontSize:'0.8rem', fontWeight:700, color: startup.cnpj ? '#10b981' : '#ef4444' }}>
                      {startup.cnpj ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
                <div style={{ padding:'0.75rem', background:'#F8FAFC', borderRadius:'10px' }}>
                  <p style={{ fontSize:'0.7rem', color:'#94A3B8', fontWeight:700, marginBottom:'0.25rem' }}>Investimento</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    {maturity?.received_investment ? <CheckCircle size={14} color="#f59e0b" /> : <XCircle size={14} color="#94A3B8" />}
                    <span style={{ fontSize:'0.8rem', fontWeight:700, color: maturity?.received_investment ? '#f59e0b' : '#94A3B8' }}>
                      {maturity?.received_investment ? (maturity.investment_amount ? `R$ ${(maturity.investment_amount/1000).toFixed(0)}k` : 'Sim') : 'Não'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Engajamento */}
              {engagement && (
                <div style={{ padding:'0.75rem', background:'#F8FAFC', borderRadius:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                    <p style={{ fontSize:'0.7rem', color:'#94A3B8', fontWeight:700 }}>ENGAJAMENTO</p>
                    <p style={{ fontSize:'0.875rem', fontWeight:900, color:'#6366f1' }}>{Math.round(engagement.engagement_score || 0)}%</p>
                  </div>
                  <div style={{ height:'6px', background:'#E2E8F0', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${engagement.engagement_score||0}%`, background:'#6366f1', borderRadius:'99px' }} />
                  </div>
                </div>
              )}

              {/* Redes sociais */}
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {startup.instagram && (
                  <a href={startup.instagram} target="_blank" rel="noopener noreferrer"
                    style={{ padding:'0.4rem', borderRadius:'8px', background:'#FEF3C7', color:'#D97706', display:'flex' }}>
                    <Link2 size={14} />
                  </a>
                )}
                {startup.linkedin && (
                  <a href={startup.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{ padding:'0.4rem', borderRadius:'8px', background:'#EEF2FF', color:'#6366f1', display:'flex' }}>
                    <Globe size={14} />
                  </a>
                )}
                {startup.website && (
                  <a href={startup.website} target="_blank" rel="noopener noreferrer"
                    style={{ padding:'0.4rem', borderRadius:'8px', background:'#F0FDF4', color:'#10b981', display:'flex' }}>
                    <Globe size={14} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
