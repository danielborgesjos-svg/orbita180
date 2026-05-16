'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDisciplinaById, updateDisciplina } from '@/lib/actions/turmas';
import { updateDisciplinaEnrollment } from '@/lib/actions/forms';
import { 
  ChevronLeft, Users, BookOpen, GraduationCap, 
  FileText, UserCircle, DollarSign, CheckCircle, 
  AlertCircle, Clock, ExternalLink, Mail, Phone
} from 'lucide-react';
import Link from 'next/link';

export default function DisciplinaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [disciplina, setDisciplina] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    const data = await getDisciplinaById(id as string);
    setDisciplina(data);
    setLoading(false);
  }

  async function toggleStatus() {
    const newStatus = disciplina.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateDisciplina(disciplina.id, { status: newStatus });
    load();
  }

  async function handlePaymentToggle(enrollId: string, currentStatus: string) {
    const newStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    await updateDisciplinaEnrollment(enrollId, { payment_status: newStatus } as any);
    load();
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando dados da disciplina...</div>;
  if (!disciplina) return <div style={{ padding: '2rem', textAlign: 'center' }}>Disciplina não encontrada.</div>;

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    border: '1px solid #F1F5F9'
  };

  const badgeStyle = (type: string, val: string) => {
    const configs: any = {
      status: {
        ACTIVE: ['#10B981', 'Ativa'],
        INACTIVE: ['#EF4444', 'Inativa']
      },
      payment: {
        PAID: ['#10B981', 'Pago'],
        PENDING: ['#F59E0B', 'Pendente'],
        FREE: ['#64748B', 'Grátis']
      }
    };
    const [color, label] = configs[type][val] || ['#94A3B8', val];
    return (
      <span style={{ 
        padding: '0.35rem 0.85rem', 
        borderRadius: '99px', 
        fontSize: '0.75rem', 
        fontWeight: 800, 
        background: `${color}15`, 
        color,
        border: `1px solid ${color}30`
      }}>
        {label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* Top Navigation & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={() => router.back()} style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'#64748B', background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.9rem' }}>
            <ChevronLeft size={18} /> Voltar para Gestão
          </button>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em' }}>{disciplina.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {badgeStyle('status', disciplina.status)}
            <span style={{ color: '#94A3B8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> {disciplina.duration_h} horas de carga horária
            </span>
          </div>
        </div>
        <button 
          onClick={toggleStatus}
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '14px', 
            background: disciplina.status === 'ACTIVE' ? '#FEE2E2' : '#D1FAE5',
            color: disciplina.status === 'ACTIVE' ? '#B91C1C' : '#047857',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {disciplina.status === 'ACTIVE' ? 'Desativar Disciplina' : 'Ativar Disciplina'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Details and Students */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={cardStyle}>
            <h2 style={{ fontSize:'1.25rem', fontWeight:800, marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <BookOpen size={22} color="#2563EB" /> Detalhes do Módulo
            </h2>
            <p style={{ color:'#475569', lineHeight:'1.7', marginBottom:'2rem' }}>{disciplina.description || 'Sem descrição cadastrada.'}</p>
            
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
              <div>
                <h3 style={{ fontSize:'0.75rem', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.75rem' }}>Material de Apoio</h3>
                {disciplina.support_material ? (
                  <a href={disciplina.support_material} target="_blank" style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'#2563EB', fontWeight:700, textDecoration:'none', fontSize:'0.95rem' }}>
                    <ExternalLink size={18} /> Acessar Documentação <ChevronRight size={14} />
                  </a>
                ) : <p style={{ fontSize:'0.9rem', color:'#94A3B8' }}>Nenhum material anexado.</p>}
              </div>
              <div>
                <h3 style={{ fontSize:'0.75rem', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.75rem' }}>Mentores & Consultores</h3>
                <p style={{ fontSize:'0.95rem', fontWeight:600, color:'#1E293B' }}>{disciplina.mentors_info || 'Não especificado.'}</p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'1.25rem', fontWeight:800, display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <Users size={22} color="#7C3AED" /> Alunos Matriculados
              </h2>
              <span style={{ background:'#F1F5F9', padding:'0.4rem 0.8rem', borderRadius:'10px', fontSize:'0.85rem', fontWeight:700, color:'#475569' }}>
                {disciplina.enrollments.length} Startups
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {disciplina.enrollments.map((en: any) => (
                <div key={en.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem', borderRadius:'16px', border:'1px solid #F1F5F9', background:'#F8FAFC' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'white', border:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#2563EB' }}>
                      {en.startup.name[0]}
                    </div>
                    <div>
                      <h4 style={{ fontWeight:700, color:'#1E293B' }}>{en.startup.name}</h4>
                      <p style={{ fontSize:'0.75rem', color:'#94A3B8' }}>{en.startup.email || 'startup@email.com'}</p>
                    </div>
                  </div>
                  
                  <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontSize:'0.7rem', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', marginBottom:'0.25rem' }}>Pagamento</p>
                      <button 
                        onClick={() => handlePaymentToggle(en.id, en.payment_status)}
                        style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}
                      >
                        {badgeStyle('payment', en.payment_status)}
                      </button>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontSize:'0.7rem', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', marginBottom:'0.25rem' }}>Nota</p>
                      <span style={{ fontWeight:800, color:'#1E293B' }}>{en.grade ? en.grade.toFixed(1) : '-'}</span>
                    </div>
                    <Link 
                      href={`/admin/turmas?id=${disciplina.turma_id}&enroll=${en.id}`}
                      style={{ padding:'0.5rem', borderRadius:'10px', background:'white', border:'1px solid #E2E8F0', color:'#64748B' }}
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Info / Support Material */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ ...cardStyle, background:'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color:'white', border:'none' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:800, marginBottom:'1.5rem', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Dados Rápidos</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <div>
                <p style={{ color:'#94A3B8', fontSize:'0.8rem', marginBottom:'0.25rem' }}>Investimento Individual</p>
                <p style={{ fontSize:'1.5rem', fontWeight:900 }}>R$ {disciplina.price ? disciplina.price.toLocaleString('pt-BR') : '0,00'}</p>
              </div>
              <div>
                <p style={{ color:'#94A3B8', fontSize:'0.8rem', marginBottom:'0.25rem' }}>URL de Acesso</p>
                <a href={disciplina.content_url} target="_blank" style={{ color:'#38BDF8', fontSize:'0.85rem', textDecoration:'none', wordBreak:'break-all' }}>{disciplina.content_url || 'Nenhuma URL configurada'}</a>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize:'1rem', fontWeight:800, marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <UserCircle size={20} color="#64748B" /> Dados de Contato
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.9rem', color:'#475569' }}>
                <Mail size={16} /> suporte@magistertech.com
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.9rem', color:'#475569' }}>
                <Phone size={16} /> (41) 99999-9999
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
