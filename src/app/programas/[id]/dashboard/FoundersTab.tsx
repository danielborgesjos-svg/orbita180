'use client';

import React, { useState } from 'react';
import { Plus, User, Link2, ExternalLink, Brain } from 'lucide-react';
import { createFounder } from '@/lib/actions/founders';

const personalityColor: Record<string, string> = {
  Executor:'#6366f1', Visionário:'#f59e0b', Analítico:'#3b82f6', Conector:'#10b981'
};

export default function FoundersTab({ founders, programId, onRefresh }: { founders: any[]; programId: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const res = await createFounder({
      program_id: programId,
      startup_id: fd.get('startup_id') as string || undefined,
      name: fd.get('name') as string,
      email: fd.get('email') as string || undefined,
      phone: fd.get('phone') as string || undefined,
      role: fd.get('role') as string || undefined,
      linkedin: fd.get('linkedin') as string || undefined,
      instagram: fd.get('instagram') as string || undefined,
      personality_type: fd.get('personality_type') as string || undefined,
      bio: fd.get('bio') as string || undefined,
      coachability: parseFloat(fd.get('coachability') as string) || 0,
      execution_speed: parseFloat(fd.get('execution_speed') as string) || 0,
      resilience: parseFloat(fd.get('resilience') as string) || 0,
      leadership: parseFloat(fd.get('leadership') as string) || 0,
    });
    setSaving(false);
    if (res.success) { setShowForm(false); onRefresh(); }
    else alert(res.error);
  }

  const inp = { padding:'0.75rem 1rem', borderRadius:'10px', border:'1px solid #E2E8F0', width:'100%', outline:'none', fontSize:'0.9rem', background:'#F8FAFC', color:'#1E293B' };
  const lbl = { fontSize:'0.75rem', fontWeight:800 as const, display:'block' as const, marginBottom:'0.4rem', textTransform:'uppercase' as const, letterSpacing:'0.025em', color:'#64748B' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0F172A' }}>Founders Cadastrados ({founders.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="premium-gradient"
          style={{ color:'white', padding:'0.65rem 1.25rem', borderRadius:'12px', fontWeight:800, display:'flex', alignItems:'center', gap:'0.5rem', border:'none', cursor:'pointer' }}>
          <Plus size={16} /> Cadastrar Founder
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background:'white', borderRadius:'20px', padding:'2rem', border:'1px solid #E2E8F0', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontWeight:900, color:'#0F172A', marginBottom:'1.5rem', fontSize:'1.1rem' }}>Novo Founder</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lbl}>Nome *</label><input name="name" required style={inp} placeholder="Nome completo" /></div>
              <div><label style={lbl}>Cargo</label>
                <select name="role" style={inp}>
                  <option value="">Selecione</option>
                  <option value="CEO">CEO</option><option value="CTO">CTO</option>
                  <option value="CMO">CMO</option><option value="COO">COO</option>
                  <option value="CFO">CFO</option><option value="Co-fundador">Co-fundador</option>
                </select>
              </div>
              <div><label style={lbl}>E-mail</label><input name="email" type="email" style={inp} placeholder="email@exemplo.com" /></div>
              <div><label style={lbl}>Telefone</label><input name="phone" style={inp} placeholder="(41) 99999-9999" /></div>
              <div><label style={lbl}>LinkedIn</label><input name="linkedin" style={inp} placeholder="linkedin.com/in/..." /></div>
              <div><label style={lbl}>Instagram</label><input name="instagram" style={inp} placeholder="@handle" /></div>
              <div><label style={lbl}>Perfil Comportamental</label>
                <select name="personality_type" style={inp}>
                  <option value="">Selecione</option>
                  <option>Executor</option><option>Visionário</option>
                  <option>Analítico</option><option>Conector</option>
                </select>
              </div>
              <div><label style={lbl}>ID da Startup (opcional)</label><input name="startup_id" style={inp} placeholder="ID da startup vinculada" /></div>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lbl}>Bio</label>
              <textarea name="bio" rows={3} style={{ ...inp, resize:'none' }} placeholder="Breve descrição do founder..." />
            </div>
            {/* Scores comportamentais */}
            <p style={{ ...lbl, marginBottom:'0.75rem' }}>Diagnóstico Comportamental (0–10)</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
              {['coachability','execution_speed','resilience','leadership'].map(field => (
                <div key={field}>
                  <label style={{ ...lbl, textTransform:'capitalize' }}>{field.replace('_',' ')}</label>
                  <input name={field} type="number" min={0} max={10} step={0.1} defaultValue={7} style={inp} />
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'1rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'0.875rem', borderRadius:'12px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B', background:'white', cursor:'pointer' }}>Cancelar</button>
              <button type="submit" disabled={saving} className="premium-gradient" style={{ flex:2, padding:'0.875rem', color:'white', borderRadius:'12px', fontWeight:800, border:'none', cursor:'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Salvando...' : 'Cadastrar Founder'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.25rem' }}>
        {founders.map(f => {
          const pColor = personalityColor[f.personality_type] || '#6366f1';
          return (
            <div key={f.id} style={{ background:'white', borderRadius:'16px', padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
                <div style={{ width:48, height:48, borderRadius:'14px', background: f.photo_url ? `url(${f.photo_url}) center/cover` : `${pColor}18`, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${pColor}30` }}>
                  {!f.photo_url && <User size={22} color={pColor} />}
                </div>
                <div>
                  <h4 style={{ fontWeight:900, color:'#0F172A', fontSize:'1rem' }}>{f.name}</h4>
                  <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.25rem', flexWrap:'wrap' }}>
                    {f.role && <span style={{ fontSize:'0.7rem', padding:'0.15rem 0.5rem', background:'#F1F5F9', borderRadius:'6px', fontWeight:700, color:'#475569' }}>{f.role}</span>}
                    {f.personality_type && <span style={{ fontSize:'0.7rem', padding:'0.15rem 0.5rem', borderRadius:'6px', fontWeight:700, background:`${pColor}18`, color:pColor }}>{f.personality_type}</span>}
                  </div>
                </div>
              </div>

              {f.bio && <p style={{ fontSize:'0.8rem', color:'#64748B', lineHeight:1.5 }}>{f.bio}</p>}

              {/* Scores */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                {[
                  { label:'Coachability', value:f.coachability },
                  { label:'Execução', value:f.execution_speed },
                  { label:'Resiliência', value:f.resilience },
                  { label:'Liderança', value:f.leadership },
                ].map(s => (
                  <div key={s.label} style={{ padding:'0.6rem', background:'#F8FAFC', borderRadius:'8px' }}>
                    <p style={{ fontSize:'0.65rem', color:'#94A3B8', fontWeight:700, marginBottom:'0.3rem' }}>{s.label}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <div style={{ flex:1, height:'5px', background:'#E2E8F0', borderRadius:'99px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${((s.value||0)/10)*100}%`, background:pColor, borderRadius:'99px' }} />
                      </div>
                      <span style={{ fontSize:'0.75rem', fontWeight:800, color:pColor }}>{s.value||0}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div style={{ display:'flex', gap:'0.5rem', paddingTop:'0.5rem', borderTop:'1px solid #F1F5F9' }}>
                {f.email && <span style={{ fontSize:'0.75rem', color:'#64748B' }}>{f.email}</span>}
                {f.linkedin && <a href={f.linkedin.startsWith('http') ? f.linkedin : `https://${f.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ padding:'0.3rem', borderRadius:'6px', background:'#EEF2FF', color:'#6366f1', display:'flex' }}><Link2 size={12} /></a>}
              </div>
            </div>
          );
        })}
      </div>

      {founders.length === 0 && !showForm && (
        <div style={{ textAlign:'center', padding:'3rem', background:'#F8FAFC', borderRadius:'20px', border:'2px dashed #E2E8F0' }}>
          <Brain size={40} color="#CBD5E1" style={{ marginBottom:'1rem' }} />
          <p style={{ color:'#64748B', fontWeight:700 }}>Nenhum founder cadastrado</p>
          <p style={{ color:'#94A3B8', fontSize:'0.85rem', marginTop:'0.5rem' }}>Clique em "Cadastrar Founder" para começar.</p>
        </div>
      )}
    </div>
  );
}
