'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Users, Award, Calendar, Trash2, Edit, ChevronRight, GraduationCap, DollarSign, Clock, CheckSquare, BarChart } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getTurmas, createTurma, deleteTurma, createDisciplina, deleteDisciplina, enrollStartup, issueDiploma, createMentoria, getMentores, getAllStartups } from '@/lib/actions/turmas';
import { getGlobalDisciplinas, updateDisciplinaEnrollment } from '@/lib/actions/forms';

const paymentBadge = (type: string) => {
  const map: any = { FREE: ['#10b981','Grátis'], BOLETO: ['#f59e0b','Boleto'], MENSALIDADE: ['#7c3aed','Mensalidade'] };
  const [color, label] = map[type] || ['#94a3b8', type];
  return <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:99, background:`${color}20`, color, border:`1px solid ${color}40` }}>{label}</span>;
};

export default function AdminTurmasPage() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [globalDisciplinas, setGlobalDisciplinas] = useState<any[]>([]);
  const [mentores, setMentores] = useState<any[]>([]);
  const [startups, setStartups] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null); // Pode ser uma Turma ou uma Disciplina Global
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'turmas'|'global'>('turmas');

  // Modals
  const [turmaModal, setTurmaModal] = useState(false);
  const [disciplinaModal, setDisciplinaModal] = useState(false);
  const [enrollModal, setEnrollModal] = useState(false);
  const [mentoriaModal, setMentoriaModal] = useState(false);
  const [gradeModal, setGradeModal] = useState<any>(null);
  const [diplomaId, setDiplomaId] = useState<string|null>(null);

  useEffect(() => { load(); }, [viewMode]);

  async function load() {
    setLoading(true);
    const [t, m, s, gd] = await Promise.all([getTurmas(), getMentores(), getAllStartups(), getGlobalDisciplinas()]);
    setTurmas(t);
    setMentores(m);
    setStartups(s);
    setGlobalDisciplinas(gd);
    if (selected) {
      if (viewMode === 'turmas') setSelected(t.find((x:any) => x.id === selected.id) || null);
      else setSelected(gd.find((x:any) => x.id === selected.id) || null);
    }
    setLoading(false);
  }

  async function handleCreateTurma(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await createTurma({
      name: f.get('name') as string,
      description: f.get('description') as string,
      start_date: f.get('start_date') ? new Date(f.get('start_date') as string) : undefined,
      end_date: f.get('end_date') ? new Date(f.get('end_date') as string) : undefined,
    });
    setTurmaModal(false); load();
  }

  async function handleCreateDisciplina(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const isGlobal = f.get('is_global') === 'on';
    await createDisciplina({
      turma_id: isGlobal ? undefined : selected?.id,
      name: f.get('name') as string,
      description: f.get('description') as string,
      duration_h: parseInt(f.get('duration_h') as string) || undefined,
      content_url: f.get('content_url') as string,
      payment_type: f.get('payment_type') as string,
      price: parseFloat(f.get('price') as string) || undefined,
      is_global: isGlobal,
      status: 'ACTIVE',
      support_material: f.get('support_material') as string,
      mentors_info: f.get('mentors_info') as string,
    } as any);
    setDisciplinaModal(false); load();
  }

  async function handleEnroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await enrollStartup(selected.id, f.get('startup_id') as string, f.get('payment_status') as string);
    if (!res.success && (res as any).error) alert((res as any).error);
    setEnrollModal(false); load();
  }

  async function handleSaveGrades(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await updateDisciplinaEnrollment(gradeModal.enrollment.id, {
      grade: parseFloat(f.get('grade') as string) || null,
      attendance: parseFloat(f.get('attendance') as string) || null,
      status: f.get('status') as string
    } as any);
    setGradeModal(null); load();
  }

  async function handleDiploma(enrollId: string) {
    await issueDiploma(enrollId);
    setDiplomaId(enrollId);
    load();
  }

  const inp = { 
    padding: '0.85rem 1rem', 
    borderRadius: '12px', 
    border: '1px solid #E2E8F0', 
    width: '100%', 
    outline: 'none', 
    fontSize: '0.95rem',
    backgroundColor: '#F8FAFC',
    transition: 'all 0.2s',
    color: '#1E293B'
  };
  const lbl = { 
    fontSize: '0.8rem', 
    fontWeight: '700' as const, 
    display: 'block' as const, 
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    color: '#64748B'
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontSize:'1.75rem', marginBottom:'0.25rem' }}>Educação & Programas</h1>
          <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem' }}>Gerencie Turmas, Disciplinas Globais, Lançamento de Notas e Frequência.</p>
        </div>
        <div style={{ display:'flex', gap:'1rem' }}>
          <button className="premium-gradient" onClick={() => setDisciplinaModal(true)}
            style={{ color:'white', padding:'0.6rem 1.25rem', borderRadius:'var(--radius)', fontWeight:700, display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <BookOpen size={18} /> Nova Disciplina Global
          </button>
          <button className="premium-gradient" onClick={() => setTurmaModal(true)}
            style={{ color:'white', padding:'0.6rem 1.25rem', borderRadius:'var(--radius)', fontWeight:700, display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <Plus size={18} /> Nova Turma
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', background:'var(--secondary)', padding:'0.35rem', borderRadius:'var(--radius)', width:'fit-content' }}>
        <button onClick={() => { setViewMode('turmas'); setSelected(null); }} style={{ padding:'0.6rem 1.25rem', borderRadius:'calc(var(--radius) - 4px)', fontSize:'0.9rem', fontWeight:600, background:viewMode==='turmas'?'white':'transparent', color:viewMode==='turmas'?'var(--primary)':'var(--muted-foreground)' }}>Turmas Fechadas</button>
        <button onClick={() => { setViewMode('global'); setSelected(null); }} style={{ padding:'0.6rem 1.25rem', borderRadius:'calc(var(--radius) - 4px)', fontSize:'0.9rem', fontWeight:600, background:viewMode==='global'?'white':'transparent', color:viewMode==='global'?'var(--primary)':'var(--muted-foreground)' }}>Disciplinas Globais</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '360px 1fr' : '1fr', gap:'1.5rem', alignItems:'start' }}>
        {/* List */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {loading ? <p style={{ color:'var(--muted-foreground)' }}>Carregando...</p> :
           viewMode === 'turmas' ? (
             turmas.length === 0 ? <p>Nenhuma turma criada.</p> : turmas.map((turma) => (
              <div key={turma.id} className="card premium-shadow" onClick={() => setSelected(turma)}
                style={{ cursor:'pointer', borderLeft: selected?.id === turma.id ? '4px solid var(--primary)' : '4px solid transparent', transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight:700, fontSize:'1.05rem' }}>{turma.name}</h3>
                    <p style={{ fontSize:'0.8rem', color:'var(--muted-foreground)' }}>{turma.description}</p>
                  </div>
                </div>
              </div>
            ))
           ) : (
             globalDisciplinas.length === 0 ? <p>Nenhuma disciplina global criada.</p> : globalDisciplinas.map((disc) => (
               <div key={disc.id} className="card premium-shadow" onClick={() => setSelected(disc)}
                 style={{ cursor:'pointer', borderLeft: selected?.id === disc.id ? '4px solid var(--primary)' : '4px solid transparent', transition:'all 0.2s' }}>
                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                   <div>
                     <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><h3 style={{ fontWeight:700, fontSize:'1.05rem' }}>{disc.name}</h3> {paymentBadge(disc.payment_type)}</div>
                     <p style={{ fontSize:'0.8rem', color:'var(--muted-foreground)' }}>{disc.description}</p>
                   </div>
                 </div>
               </div>
             ))
           )
          }
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            
            {viewMode === 'turmas' && (
              <>
                {/* Turma Detail (Disciplinas, Alunos, Mentorias) */}
                <div className="card premium-shadow">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
                    <h2 style={{ fontWeight:700, fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}><BookOpen size={20} color="var(--primary)"/> Grade Curricular</h2>
                    <button className="premium-gradient" onClick={() => setDisciplinaModal(true)} style={{ color:'white', padding:'0.4rem 0.9rem', borderRadius:'8px', fontWeight:700, fontSize:'0.85rem' }}>Adicionar Disciplina</button>
                  </div>
                  {selected.disciplinas.map((d: any) => (
                    <div key={d.id} style={{ padding:'0.9rem', borderRadius:'8px', border:'1px solid var(--border)', marginBottom:'0.5rem', background:'#F8FAFC' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><strong>{d.name}</strong> {paymentBadge(d.payment_type)}</div>
                      <div style={{ display:'flex', gap:'1rem', marginTop:'0.3rem', fontSize:'0.75rem', color:'var(--muted-foreground)' }}>
                        <span><Clock size={12}/> {d.duration_h}h</span>
                        <span><DollarSign size={12}/> R$ {d.price || '0,00'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Alunos / Notas (Both Turmas and Global Disciplinas have enrollments, but logic differs slightly. We'll show general enrollments for Turmas) */}
            <div className="card premium-shadow">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
                <h2 style={{ fontWeight:700, fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}><Users size={20} color="#7c3aed"/> Lançamento de Notas / Alunos</h2>
                <button onClick={() => setEnrollModal(true)} style={{ background:'#7c3aed', color:'white', padding:'0.4rem 0.9rem', borderRadius:'8px', fontWeight:700, fontSize:'0.85rem' }}>Matricular</button>
              </div>
              
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid var(--border)', textAlign:'left', color:'var(--muted-foreground)' }}>
                    <th style={{ padding:'0.75rem' }}>Startup</th>
                    {viewMode === 'global' && <th style={{ padding:'0.75rem' }}>Nota</th>}
                    {viewMode === 'global' && <th style={{ padding:'0.75rem' }}>Frequência</th>}
                    <th style={{ padding:'0.75rem' }}>Status</th>
                    <th style={{ padding:'0.75rem', textAlign:'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.enrollments.map((enroll: any) => (
                    <tr key={enroll.id} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'0.75rem', fontWeight:600 }}>{enroll.startup.name}</td>
                      {viewMode === 'global' && <td style={{ padding:'0.75rem' }}>{enroll.grade ? enroll.grade.toFixed(1) : '-'}</td>}
                      {viewMode === 'global' && <td style={{ padding:'0.75rem' }}>{enroll.attendance ? `${enroll.attendance}%` : '-'}</td>}
                      <td style={{ padding:'0.75rem' }}>
                        <span style={{ padding:'0.2rem 0.5rem', borderRadius:4, background:'#f1f5f9', fontWeight:600, fontSize:'0.7rem' }}>{enroll.status}</span>
                      </td>
                      <td style={{ padding:'0.75rem', textAlign:'right' }}>
                        {viewMode === 'global' ? (
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <Link href={`/admin/turmas/disciplina/${enroll.disciplina_id}`} style={{ padding:'0.3rem 0.6rem', background:'var(--secondary)', color:'var(--primary)', borderRadius:4, fontWeight:700, fontSize:'0.75rem', textDecoration:'none' }}>Gerenciar</Link>
                            <button onClick={() => setGradeModal({ enrollment: enroll })} style={{ padding:'0.3rem 0.6rem', background:'var(--primary)', color:'white', borderRadius:4, fontWeight:600, fontSize:'0.75rem' }}>Notas</button>
                          </div>
                        ) : (
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button onClick={() => handleDiploma(enroll.id)} style={{ padding:'0.3rem 0.6rem', background:'#10b981', color:'white', borderRadius:4, fontWeight:600, fontSize:'0.75rem' }}>Diploma</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

      {/* Modal: Nova Disciplina */}
      <Modal isOpen={disciplinaModal} onClose={() => setDisciplinaModal(false)} title="Nova Disciplina">
        <form onSubmit={handleCreateDisciplina} style={{ display:'flex', flexDirection:'column', gap:'1.25rem', paddingBottom:'1.5rem' }}>
          {viewMode === 'global' && (
            <div style={{ padding:'1rem 1.25rem', background:'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderRadius:'14px', color:'#92400e', fontSize:'0.85rem', border:'1px solid #FDE68A', display:'flex', alignItems:'flex-start', gap:'0.75rem' }}>
              <div style={{ background:'#F59E0B', color:'white', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, fontSize:'0.7rem' }}>!</div>
              <p><strong>Configuração Global:</strong> Esta disciplina será disponibilizada para adesão direta de qualquer startup da rede.</p>
            </div>
          )}
          <input type="hidden" name="is_global" value={viewMode === 'global' ? 'on' : 'off'} />
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
            <div style={{ gridColumn:'span 2' }}>
              <label style={lbl}>Nome da Disciplina / Módulo *</label>
              <input name="name" required style={inp} placeholder="Ex: Gestão Ágil e Scrum" />
            </div>
            
            <div style={{ gridColumn:'span 2' }}>
              <label style={lbl}>Descrição Detalhada do Conteúdo</label>
              <textarea name="description" rows={4} style={{ ...inp, resize:'none' }} placeholder="Descreva os tópicos que serão abordados..." />
            </div>
            
            <div>
              <label style={lbl}>Modalidade de Acesso</label>
              <select name="payment_type" style={inp}>
                <option value="FREE">Acesso Gratuito (Padrão)</option>
                <option value="BOLETO">Pagamento Único (Boleto)</option>
                <option value="MENSALIDADE">Assinatura Mensal</option>
              </select>
            </div>

            <div>
              <label style={lbl}>Carga Horária Total</label>
              <div style={{ position:'relative' }}>
                <input name="duration_h" type="number" style={inp} placeholder="40" />
                <span style={{ position:'absolute', right:'1.25rem', top:'50%', transform:'translateY(-50%)', fontSize:'0.85rem', color:'#94A3B8', fontWeight:700 }}>HORAS</span>
              </div>
            </div>

            <div>
              <label style={lbl}>Investimento da Startup</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'1.25rem', top:'50%', transform:'translateY(-50%)', fontSize:'1rem', color:'#94A3B8', fontWeight:800 }}>R$</span>
                <input name="price" type="number" step="0.01" style={{ ...inp, paddingLeft:'3rem' }} placeholder="0,00" />
              </div>
            </div>

            <div>
              <label style={lbl}>URL do Conteúdo (LMS/Vídeo)</label>
              <input name="content_url" style={inp} placeholder="https://link-da-aula.com" />
            </div>

            <div>
              <label style={lbl}>Material de Apoio (Links/Docs)</label>
              <input name="support_material" style={inp} placeholder="Link para Drive, PDF, etc." />
            </div>

            <div style={{ gridColumn:'span 2' }}>
              <label style={lbl}>Mentores / Consultores Responsáveis</label>
              <input name="mentors_info" style={inp} placeholder="Ex: João Silva (Finanças), Maria Oliveira (UX)" />
            </div>
          </div>

          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setDisciplinaModal(false)} 
              style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B', cursor:'pointer', backgroundColor:'white' }}>
              Cancelar
            </button>
            <button type="submit" className="premium-gradient" 
              style={{ flex:1.5, padding:'1rem', color:'white', borderRadius:'14px', fontWeight:800, cursor:'pointer', border:'none', boxShadow:'0 10px 15px -3px rgba(37, 99, 235, 0.2)' }}>
              Finalizar e Publicar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Lançar Notas */}
      {gradeModal && (
        <Modal isOpen={true} onClose={() => setGradeModal(null)} title={`Lançamento: ${gradeModal.enrollment.startup.name}`}>
          <form onSubmit={handleSaveGrades} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              <div><label style={lbl}>Nota Final (0 a 10)</label><input name="grade" type="number" step="0.1" defaultValue={gradeModal.enrollment.grade} style={inp} /></div>
              <div><label style={lbl}>Frequência (%)</label><input name="attendance" type="number" step="0.1" defaultValue={gradeModal.enrollment.attendance} style={inp} /></div>
            </div>
            <div>
              <label style={lbl}>Status na Disciplina</label>
              <select name="status" defaultValue={gradeModal.enrollment.status} style={inp}>
                <option value="ENROLLED">Cursando</option>
                <option value="PASSED">Aprovado</option>
                <option value="FAILED">Reprovado</option>
              </select>
            </div>
            <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
              <button type="button" onClick={() => setGradeModal(null)} 
                style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B', cursor:'pointer', backgroundColor:'white' }}>
                Cancelar
              </button>
              <button type="submit" className="premium-gradient" 
                style={{ flex:1.5, padding:'1rem', color:'white', borderRadius:'14px', fontWeight:800, cursor:'pointer', border:'none' }}>
                Salvar Histórico
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Nova Turma */}
      <Modal isOpen={turmaModal} onClose={() => setTurmaModal(false)} title="Nova Turma">
        <form onSubmit={handleCreateTurma} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div><label style={lbl}>Nome da Turma *</label><input name="name" required style={inp} placeholder="Ex: Aceleração 2024.1" /></div>
          <div><label style={lbl}>Descrição</label><textarea name="description" rows={3} style={{ ...inp, resize:'none' }} placeholder="Objetivos da turma..." /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <div><label style={lbl}>Início</label><input name="start_date" type="date" style={inp} /></div>
            <div><label style={lbl}>Término</label><input name="end_date" type="date" style={inp} /></div>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setTurmaModal(false)} style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex:1.5, padding:'1rem', color:'white', borderRadius:'14px', fontWeight:800 }}>Criar Turma</button>
          </div>
        </form>
      </Modal>

      {/* Modal: Matrícula */}
      <Modal isOpen={enrollModal} onClose={() => setEnrollModal(false)} title="Matricular Startup">
        <form onSubmit={handleEnroll} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div>
            <label style={lbl}>Selecionar Startup</label>
            <select name="startup_id" style={inp} required>
              <option value="">Selecione...</option>
              {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Status do Pagamento</label>
            <select name="payment_status" style={inp}>
              <option value="PAID">Pago / Liberado</option>
              <option value="PENDING">Aguardando Pagamento</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setEnrollModal(false)} style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex:1.5, padding:'1rem', color:'white', borderRadius:'14px', fontWeight:800 }}>Confirmar Matrícula</button>
          </div>
        </form>
      </Modal>

      {/* Diploma Preview */}
      <Modal isOpen={!!diplomaId} onClose={() => setDiplomaId(null)} title="Certificado de Conclusão">
        <div style={{ textAlign:'center', padding:'1rem' }}>
          <div style={{ border:'3px solid #F1F5F9', borderRadius:'24px', padding:'3rem', background:'linear-gradient(to bottom, #FFFFFF, #F8FAFC)' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1.5rem' }}>🎓</div>
            <h2 style={{ fontSize:'0.9rem', fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:'#94A3B8', marginBottom:'1rem' }}>Órbita 180 — Programa de Aceleração</h2>
            <h1 style={{ fontSize:'2.25rem', fontWeight:900, color:'#1E293B', margin:'1.5rem 0', letterSpacing:'-0.025em' }}>Certificado</h1>
            <p style={{ color:'#64748B', fontSize:'1.1rem', lineHeight:'1.6', maxWidth:'400px', margin:'0 auto 2.5rem' }}>Concedido com distinção à startup por completar com êxito todos os módulos acadêmicos.</p>
            <div style={{ display:'flex', justifyContent:'center', gap:'4rem', marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid #E2E8F0' }}>
              <div><div style={{ width:'140px', borderTop:'2px solid #1E293B', marginBottom:'0.75rem' }}></div><p style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748B' }}>Mentor Responsável</p></div>
              <div><div style={{ width:'140px', borderTop:'2px solid #1E293B', marginBottom:'0.75rem' }}></div><p style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748B' }}>Direção Órbita 180</p></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'2rem' }}>
            <button onClick={() => setDiplomaId(null)} style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B' }}>Fechar</button>
            <button onClick={() => window.print()} className="premium-gradient" style={{ flex:1.5, padding:'1rem', borderRadius:'14px', color:'white', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
              <CheckSquare size={20} /> Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
