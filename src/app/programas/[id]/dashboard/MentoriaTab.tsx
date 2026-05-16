'use client';

import React from 'react';
import { Clock, MessageSquare, BookOpen } from 'lucide-react';

export default function MentoriaTab({ sessions, startups }: { sessions: any[]; startups: any[] }) {
  const startupMap: Record<string, string> = {};
  startups.forEach(s => { startupMap[s.startup.id] = s.startup.name; });

  const totalMentoring = sessions.reduce((s, m) => s + (m.mentoring_hours || 0), 0);
  const totalTraining  = sessions.reduce((s, m) => s + (m.training_hours || 0), 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0F172A' }}>6–7. Mentorias, Capacitações & Feedbacks</h2>

      {/* Totals */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1.5rem' }}>
        {[
          { label:'Total Horas Mentoria', value:`${totalMentoring}h`, color:'#6366f1' },
          { label:'Total Horas Capacitação', value:`${totalTraining}h`, color:'#10b981' },
          { label:'Sessões Registradas', value:sessions.length, color:'#f59e0b' },
        ].map(k => (
          <div key={k.label} style={{ background:'white', borderRadius:'16px', padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', textAlign:'center' }}>
            <p style={{ fontSize:'2rem', fontWeight:900, color:k.color }}>{k.value}</p>
            <p style={{ fontSize:'0.75rem', color:'#94A3B8', fontWeight:700, marginTop:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Sessions list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        {sessions.map(s => {
          const topics = (() => { try { return JSON.parse(s.topics || '[]'); } catch { return []; } })();
          const others = (() => { try { return JSON.parse(s.other_mentors || '[]'); } catch { return []; } })();
          return (
            <div key={s.id} style={{ background:'white', borderRadius:'20px', padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.25rem' }}>
                <div>
                  <h4 style={{ fontWeight:900, fontSize:'1.05rem', color:'#0F172A' }}>{startupMap[s.startup_id] || s.startup_id}</h4>
                  <p style={{ fontSize:'0.85rem', color:'#64748B', marginTop:'0.25rem' }}>Mentor principal: <strong>{s.mentor_name}</strong>
                    {others.length > 0 && ` + ${others.join(', ')}`}
                  </p>
                  {s.trainer_name && <p style={{ fontSize:'0.85rem', color:'#64748B' }}>Capacitador: <strong>{s.trainer_name}</strong></p>}
                </div>
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <div style={{ textAlign:'center', padding:'0.6rem 1rem', background:'#EEF2FF', borderRadius:'10px' }}>
                    <p style={{ fontSize:'1.25rem', fontWeight:900, color:'#6366f1' }}>{s.mentoring_hours}h</p>
                    <p style={{ fontSize:'0.65rem', color:'#6366f1', fontWeight:700 }}>Mentoria</p>
                  </div>
                  <div style={{ textAlign:'center', padding:'0.6rem 1rem', background:'#F0FDF4', borderRadius:'10px' }}>
                    <p style={{ fontSize:'1.25rem', fontWeight:900, color:'#10b981' }}>{s.training_hours}h</p>
                    <p style={{ fontSize:'0.65rem', color:'#10b981', fontWeight:700 }}>Capacitação</p>
                  </div>
                </div>
              </div>

              {topics.length > 0 && (
                <div style={{ marginBottom:'1.25rem' }}>
                  <p style={{ fontSize:'0.75rem', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <BookOpen size={13} /> Temas Trabalhados
                  </p>
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                    {topics.map((t: string) => (
                      <span key={t} style={{ padding:'0.25rem 0.65rem', background:'#F1F5F9', borderRadius:'6px', fontSize:'0.78rem', fontWeight:700, color:'#475569' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedbacks */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                {[
                  { label:'Feedback do Mentor → Startup', text:s.mentor_feedback, color:'#6366f1' },
                  { label:'Feedback da Startup → Mentor', text:s.startup_mentor_feedback, color:'#10b981' },
                  { label:'Feedback da Startup → Programa', text:s.startup_program_feedback, color:'#f59e0b' },
                  { label:'Principais Necessidades', text:s.main_needs, color:'#ef4444' },
                ].filter(f => f.text).map(f => (
                  <div key={f.label} style={{ padding:'1rem', background:'#F8FAFC', borderRadius:'12px', borderLeft:`3px solid ${f.color}` }}>
                    <p style={{ fontSize:'0.7rem', fontWeight:800, color:f.color, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>{f.label}</p>
                    <p style={{ fontSize:'0.85rem', color:'#475569', lineHeight:1.5 }}>{f.text}</p>
                  </div>
                ))}
              </div>

              {s.curations && (
                <div style={{ marginTop:'1rem', padding:'1rem', background:'#FEF3C7', borderRadius:'12px' }}>
                  <p style={{ fontSize:'0.7rem', fontWeight:800, color:'#B45309', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>Curadoria / Recomendação</p>
                  <p style={{ fontSize:'0.85rem', color:'#78350F' }}>{s.curations}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
