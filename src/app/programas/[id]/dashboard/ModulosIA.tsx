'use client';

import React, { useState } from 'react';
import { Brain, Rocket, TrendingUp, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const MODULES: Record<string, { title:string; icon:any; color:string; badge:string; items:{ title:string; desc:string }[] }> = {
  C: {
    title: 'Módulos Nível C — Estruturação Inicial',
    icon: Rocket,
    color: '#ef4444',
    badge: 'NÍVEL C',
    items: [
      { title:'Validação de Ideia & Problema', desc:'Metodologia Jobs-to-be-Done e entrevistas com potenciais clientes.' },
      { title:'Abertura de CNPJ', desc:'Guia completo MEI → Simples Nacional com análise de regime tributário.' },
      { title:'Proposta de Valor', desc:'Canvas VP e elaboração da proposta de valor diferenciada.' },
      { title:'Primeiros Clientes (0 → 1)', desc:'Técnicas de cold outreach, indicação e primeiro piloto pago.' },
      { title:'Pitch de 90 Segundos', desc:'Estrutura narrativa e prática com feedback de mentor.' },
    ]
  },
  B: {
    title: 'Módulos Nível B — Crescimento & Gestão',
    icon: TrendingUp,
    color: '#f59e0b',
    badge: 'NÍVEL B',
    items: [
      { title:'Processo de Vendas Estruturado', desc:'Funil de vendas, CRM e ciclo de vendas B2B/B2C.' },
      { title:'Contratos & Proteção Legal', desc:'Minutas padrão, NDA, termos de uso e LGPD.' },
      { title:'Negociação Avançada', desc:'BATNA, âncoragem e técnicas de fechamento.' },
      { title:'Métricas que Importam', desc:'LTV, CAC, Churn, MRR — definição e monitoramento.' },
      { title:'Gestão Financeira Intermediária', desc:'Fluxo de caixa, DRE simplificado e runway.' },
    ]
  },
  A: {
    title: 'Módulos Nível A — Escala & Governança',
    icon: Globe,
    color: '#10b981',
    badge: 'NÍVEL A',
    items: [
      { title:'Estratégia de Escala', desc:'Playbook de crescimento, hiring plan e estrutura organizacional.' },
      { title:'Captação de Investimento', desc:'Estrutura de rodada, data room, valuation e pitch para investidores.' },
      { title:'Internacionalização', desc:'Go-to-market internacional, adaptação cultural e canais globais.' },
      { title:'Governança Corporativa', desc:'Acordo de sócios, board, ESG e compliance.' },
      { title:'Inovação Aberta', desc:'Corporate ventures, parcerias estratégicas e P&D colaborativo.' },
    ]
  }
};

const FUTURE = [
  { icon:'🌐', label:'Rede de Ambientes', desc:'Mapeamento de espaços de coworking, labs e hubs parceiros.' },
  { icon:'💰', label:'Rede de Capital', desc:'Conexão com investidores-anjo, VCs e fundos de inovação.' },
  { icon:'👥', label:'Rede de Talentos', desc:'Pool de mentores, especialistas e potenciais co-fundadores.' },
  { icon:'📚', label:'Biblioteca', desc:'Acervo curado de materiais, casos e templates.' },
  { icon:'🏦', label:'Investidores', desc:'Base de dados e matchmaking automático com investidores.' },
  { icon:'🔬', label:'Inovação Aberta', desc:'Desafios corporativos e programas de P&D em parceria.' },
];

function ModuleCard({ level, data, count }: { level:string; data:any; count:number }) {
  const [open, setOpen] = useState(false);
  const Icon = data.icon;
  return (
    <div style={{ background:'white', borderRadius:'20px', border:`2px solid ${data.color}30`, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', background:`${data.color}06` }} onClick={() => setOpen(!open)}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ width:44, height:44, borderRadius:'12px', background:data.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={20} color="white" />
          </div>
          <div>
            <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.3rem' }}>
              <span style={{ padding:'0.15rem 0.6rem', borderRadius:'6px', fontSize:'0.65rem', fontWeight:900, background:`${data.color}20`, color:data.color }}>{data.badge}</span>
              <span style={{ fontSize:'0.75rem', color:'#94A3B8', fontWeight:600 }}>{count} startups neste nível</span>
            </div>
            <h3 style={{ fontWeight:900, fontSize:'1rem', color:'#0F172A' }}>{data.title}</h3>
          </div>
        </div>
        {open ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
      </div>

      {open && (
        <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {data.items.map((item: any, i: number) => (
            <div key={i} style={{ display:'flex', gap:'1rem', padding:'1rem', background:'#F8FAFC', borderRadius:'12px', borderLeft:`3px solid ${data.color}` }}>
              <div style={{ width:28, height:28, borderRadius:'8px', background:`${data.color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.85rem', fontWeight:900, color:data.color }}>
                {i+1}
              </div>
              <div>
                <p style={{ fontWeight:800, fontSize:'0.9rem', color:'#0F172A' }}>{item.title}</p>
                <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:'0.2rem', lineHeight:1.4 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModulosIA({ stats }: { stats: any }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <div>
        <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0F172A', marginBottom:'0.4rem' }}>10. Novos Módulos — Jornada com IA</h2>
        <p style={{ color:'#64748B', fontSize:'0.9rem' }}>Módulos sugeridos pela IA com base no nível de maturidade de cada startup.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {Object.entries(MODULES).reverse().map(([level, data]) => (
          <ModuleCard key={level} level={level} data={data} count={level==='A' ? stats.levelA : level==='B' ? stats.levelB : stats.levelC} />
        ))}
      </div>

      {/* Seção futura */}
      <div style={{ marginTop:'1rem' }}>
        <h2 style={{ fontSize:'1.1rem', fontWeight:900, color:'#0F172A', marginBottom:'0.5rem' }}>11. Módulos para Próxima Etapa</h2>
        <p style={{ color:'#64748B', fontSize:'0.85rem', marginBottom:'1.25rem' }}>Funcionalidades reservadas para implementação futura.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1rem' }}>
          {FUTURE.map(f => (
            <div key={f.label} style={{ padding:'1.25rem', background:'white', borderRadius:'16px', border:'2px dashed #E2E8F0', opacity:0.7 }}>
              <span style={{ fontSize:'1.5rem', display:'block', marginBottom:'0.5rem' }}>{f.icon}</span>
              <p style={{ fontWeight:800, color:'#475569', fontSize:'0.9rem' }}>{f.label}</p>
              <p style={{ fontSize:'0.8rem', color:'#94A3B8', marginTop:'0.3rem', lineHeight:1.4 }}>{f.desc}</p>
              <span style={{ display:'inline-block', marginTop:'0.75rem', padding:'0.2rem 0.6rem', background:'#F1F5F9', borderRadius:'6px', fontSize:'0.65rem', fontWeight:800, color:'#94A3B8' }}>EM BREVE</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
