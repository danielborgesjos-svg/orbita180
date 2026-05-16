'use client';
import React, { useState, useEffect } from 'react';
import { Plus, ClipboardCheck, Trash2, Edit, ChevronRight, HelpCircle, Save, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getFormTemplates, createFormTemplate, addFormField } from '@/lib/actions/forms';

export default function AdminFormsPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [templateModal, setTemplateModal] = useState(false);
  const [fieldModal, setFieldModal] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const t = await getFormTemplates();
    setTemplates(t);
    if (selected) setSelected(t.find((x:any) => x.id === selected.id) || null);
    setLoading(false);
  }

  async function handleCreateTemplate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await createFormTemplate({
      title: f.get('title') as string,
      description: f.get('description') as string,
      type: f.get('type') as string,
    });
    setTemplateModal(false); load();
  }

  async function handleAddField(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await addFormField({
      template_id: selected.id,
      label: f.get('label') as string,
      type: f.get('type') as string,
      options: f.get('options') as string,
      required: f.get('required') === 'on',
      order: parseInt(f.get('order') as string) || 0,
    });
    setFieldModal(false); load();
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
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontSize:'1.75rem', marginBottom:'0.25rem' }}>Questionários & Due Diligence</h1>
          <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem' }}>Crie formulários de avaliação, mentorias e processos de Due Diligence.</p>
        </div>
        <button className="premium-gradient" onClick={() => setTemplateModal(true)}
          style={{ color:'white', padding:'0.6rem 1.25rem', borderRadius:'var(--radius)', fontWeight:700, display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <Plus size={18} /> Novo Questionário
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '360px 1fr' : '1fr', gap:'1.5rem', alignItems:'start' }}>
        {/* Templates List */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {loading ? <p>Carregando...</p> : templates.map((tpl) => (
            <div key={tpl.id} className="card premium-shadow" onClick={() => setSelected(tpl)}
              style={{ cursor:'pointer', borderLeft: selected?.id === tpl.id ? '4px solid var(--primary)' : '4px solid transparent' }}>
              <h3 style={{ fontWeight:700 }}>{tpl.title}</h3>
              <p style={{ fontSize:'0.8rem', color:'var(--muted-foreground)' }}>{tpl.type} • {tpl.fields.length} perguntas</p>
            </div>
          ))}
        </div>

        {/* Editor Panel */}
        {selected && (
          <div className="card premium-shadow" style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ fontWeight:700, fontSize:'1.25rem' }}>Estrutura do Formulário</h2>
              <button className="premium-gradient" onClick={() => setFieldModal(true)} style={{ color:'white', padding:'0.4rem 0.9rem', borderRadius:'8px', fontSize:'0.85rem' }}>Adicionar Pergunta</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {selected.fields.length === 0 ? <p style={{ textAlign:'center', padding:'2rem', color:'var(--muted-foreground)' }}>Nenhuma pergunta adicionada.</p> :
               selected.fields.map((field: any) => (
                <div key={field.id} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem', borderRadius:'8px', border:'1px solid var(--border)', background:'#F8FAFC' }}>
                  <div style={{ width:'32px', height:'32px', background:'var(--primary)', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700 }}>{field.order}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600 }}>{field.label} {field.required && <span style={{ color:'red' }}>*</span>}</p>
                    <p style={{ fontSize:'0.75rem', color:'var(--muted-foreground)' }}>Tipo: {field.type}</p>
                  </div>
                  <button style={{ color:'var(--destructive)' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Novo Template */}
      <Modal isOpen={templateModal} onClose={() => setTemplateModal(false)} title="Novo Questionário">
        <form onSubmit={handleCreateTemplate} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div><label style={lbl}>Título do Formulário *</label><input name="title" required style={inp} placeholder="Ex: Due Diligence - Caráter Empreendedor" /></div>
          <div><label style={lbl}>Descrição / Instruções</label><textarea name="description" rows={3} style={{ ...inp, resize:'none' }} placeholder="Instruções para quem irá responder..." /></div>
          <div>
            <label style={lbl}>Finalidade do Questionário</label>
            <select name="type" style={inp}>
              <option value="DUE_DILIGENCE">Processo de Due Diligence</option>
              <option value="MENTORING">Mentoria Empreendedor</option>
              <option value="FEEDBACK">Feedback de Ciclo</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setTemplateModal(false)} style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex:1.5, padding:'1rem', color:'white', borderRadius:'14px', fontWeight:800 }}>Criar Questionário</button>
          </div>
        </form>
      </Modal>

      {/* Modal: Nova Pergunta */}
      <Modal isOpen={fieldModal} onClose={() => setFieldModal(false)} title="Adicionar Pergunta">
        <form onSubmit={handleAddField} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div><label style={lbl}>Enunciado da Pergunta *</label><input name="label" required style={inp} placeholder="Ex: Qual sua experiência anterior com gestão?" /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <div>
              <label style={lbl}>Tipo de Resposta</label>
              <select name="type" style={inp}>
                <option value="TEXT">Texto Curto</option>
                <option value="TEXTAREA">Texto Longo</option>
                <option value="RATING">Escala (0-10)</option>
                <option value="BOOLEAN">Sim / Não</option>
                <option value="SELECT">Múltipla Escolha</option>
              </select>
            </div>
            <div><label style={lbl}>Ordem Exibição</label><input name="order" type="number" style={inp} defaultValue={selected?.fields.length + 1} /></div>
          </div>
          <div><label style={lbl}>Opções de Resposta (Separar por vírgula)</label><input name="options" style={inp} placeholder="Opção A, Opção B, Opção C..." /></div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem' }}>
            <input type="checkbox" name="required" id="req" defaultChecked style={{ width:'20px', height:'20px', cursor:'pointer' }} />
            <label htmlFor="req" style={{ fontSize:'0.9rem', fontWeight:600, color:'#1E293B', cursor:'pointer' }}>Campo Obrigatório</label>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
            <button type="button" onClick={() => setFieldModal(false)} style={{ flex:1, padding:'1rem', borderRadius:'14px', border:'1px solid #E2E8F0', fontWeight:700, color:'#64748B' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex:1.5, padding:'1rem', color:'white', borderRadius:'14px', fontWeight:800 }}>Salvar Pergunta</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
