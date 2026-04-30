'use client';

import React, { useState } from 'react';
import { FileText, Lightbulb, Target, Users, DollarSign, Zap, Layers, Download, Plus, Edit3, MessageSquare, ChevronRight, Star, Clock } from 'lucide-react';

type CanvasType = 'lean' | 'bmc' | 'value' | 'persona';
type TabType = 'canvas' | 'pitch';

const Award = ({size,color}:any)=><svg width={size} height={size} stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;

const CanvasBlock = ({item,rowSpan=1,colSpan=1,style={}}:any)=>(
  <div className="card premium-shadow" style={{display:'flex',flexDirection:'column',gap:'0.75rem',gridRow:`span ${rowSpan}`,gridColumn:`span ${colSpan}`,borderTop:`3px solid ${item.color}`,padding:'1rem',minHeight:'120px',...style}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
        <item.icon size={15} color={item.color}/>
        <span style={{fontSize:'0.75rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.05em'}}>{item.title}</span>
      </div>
      <button style={{color:'var(--muted-foreground)'}}><Edit3 size={14}/></button>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',gap:'0.4rem',overflowY:'auto'}}>
      {item.content.map((text:string,i:number)=>(
        <div key={i} style={{padding:'0.5rem 0.6rem',background:'var(--muted)',borderRadius:'6px',fontSize:'0.8rem',border:'1px solid var(--border)',cursor:'pointer'}}>{text}</div>
      ))}
      <button style={{marginTop:'auto',color:'var(--muted-foreground)',fontSize:'0.75rem',display:'flex',alignItems:'center',gap:'0.25rem'}}><Plus size={12}/>Adicionar</button>
    </div>
  </div>
);

export default function StrategyPage() {
  const [tab, setTab] = useState<TabType>('canvas');
  const [canvasType, setCanvasType] = useState<CanvasType>('lean');
  const [pitchSection, setPitchSection] = useState(0);

  const leanBlocks = [
    {id:'problem',title:'Problema',icon:Zap,content:['Falta de dados centralizados','Métricas soltas','Acompanhamento manual e ineficiente'],color:'#ef4444'},
    {id:'solution',title:'Solução',icon:Lightbulb,content:['Dashboard de Maturidade','CRM + WhatsApp integrado','Plano de ação estruturado'],color:'#3b82f6'},
    {id:'value',title:'Proposta de Valor Única',icon:Target,content:['Inovação com direção: transforme dados em jornadas de crescimento estruturadas'],color:'#10b981'},
    {id:'advantage',title:'Vantagem Injusta',icon:Award,content:['Algoritmo proprietário de maturidade','Integração nativa com Hubs e IES'],color:'#f59e0b'},
    {id:'segments',title:'Segmento de Clientes',icon:Users,content:['Hubs de Inovação','Universidades e IES','Aceleradoras B2B'],color:'#8b5cf6'},
    {id:'channels',title:'Canais',icon:Layers,content:['Venda direta institucional','Parceria com Sebrae/BNDES','Conteúdo B2B especializado'],color:'#06b6d4'},
    {id:'metrics',title:'Métricas-Chave',icon:Target,content:['MRR / ARR','Maturidade Média do Portfolio','NPS do Ecossistema','CAC < R$500'],color:'#10b981'},
    {id:'costs',title:'Estrutura de Custos',icon:DollarSign,content:['Infraestrutura AWS','Equipe de Produto','Marketing e CAC'],color:'#ef4444'},
    {id:'revenue',title:'Fontes de Receita',icon:DollarSign,content:['SaaS B2B Mensal (por startup)','Setup institucional anual','Módulos premium'],color:'#10b981'},
  ];

  const bmcBlocks = [
    {id:'partners',title:'Parceiros-Chave',icon:Users,content:['Sebrae','BNDES/Finep','Aceleradoras nacionais'],color:'#8b5cf6'},
    {id:'activities',title:'Atividades-Chave',icon:Zap,content:['Desenvolvimento da plataforma','Sucesso do cliente (CS)','Geração de conteúdo educativo'],color:'#3b82f6'},
    {id:'resources',title:'Recursos-Chave',icon:Layers,content:['Time de produto','Infraestrutura cloud','Base de dados de benchmarks'],color:'#f59e0b'},
    {id:'value_bmc',title:'Proposta de Valor',icon:Target,content:['Centralização de dados de startups','Análise de maturidade em tempo real','Jornada estruturada de evolução'],color:'#10b981'},
    {id:'customer_rel',title:'Relacionamento',icon:MessageSquare,content:['Onboarding dedicado','Comunidade ativa','Suporte via WhatsApp'],color:'#06b6d4'},
    {id:'channels_bmc',title:'Canais',icon:Layers,content:['Plataforma web','App mobile','Email e webinars'],color:'#3b82f6'},
    {id:'segments_bmc',title:'Segmentos',icon:Users,content:['IES com programas de inovação','Hubs e aceleradoras','Startups em estágio inicial'],color:'#8b5cf6'},
    {id:'costs_bmc',title:'Estrutura de Custos',icon:DollarSign,content:['OPEX: time + infra','CAPEX: P&D inicial'],color:'#ef4444'},
    {id:'revenue_bmc',title:'Receita',icon:DollarSign,content:['Assinatura mensal (SaaS)','Licença institucional anual'],color:'#10b981'},
  ];

  const pitchSections = [
    {title:'Problema',icon:'🎯',desc:'Qual dor você resolve?',content:'"Gestores de ecossistemas de inovação perdem dados críticos de suas startups em planilhas, e-mails e reuniões. Não há visibilidade real de progresso, maturidade ou impacto."'},
    {title:'Solução',icon:'💡',desc:'Sua abordagem única',content:'"A Órbita 180 é uma plataforma SaaS que centraliza toda a jornada de uma startup: maturidade, CRM, plano de ação, financeiro e comunidade — em um único ecossistema inteligente."'},
    {title:'Mercado',icon:'📊',desc:'Tamanho da oportunidade',content:'"O mercado de EdTech + Gestão de Inovação no Brasil movimenta R$ 4,2 bilhões/ano. Existem +500 hubs, 100+ aceleradoras e 2.500 IES potencialmente clientes."'},
    {title:'Modelo de Negócio',icon:'💰',desc:'Como você ganha dinheiro',content:'"SaaS B2B com cobrança por startup ativa (R$ 99/mês) + licença institucional anual (R$ 2.400 a R$ 12.000/ano). LTV estimado de R$ 36.000 por instituição."'},
    {title:'Tração',icon:'🚀',desc:'Seus resultados até agora',content:'"3 IES parceiras pilotos. 45 startups ativas na plataforma. MRR de R$ 12.500. NPS de 87. Crescimento de 15% mês a mês."'},
    {title:'Time',icon:'👥',desc:'Quem está executando',content:'"Time fundador com 10+ anos em inovação e tecnologia. CEO ex-Sebrae, CTO ex-TOTVS, COO com background em aceleração de startups."'},
    {title:'Pedido',icon:'🤝',desc:'O que você está buscando',content:'"Buscamos R$ 800k em investimento Seed para: 40% Produto, 35% Growth/CS, 25% Infra. Meta: 200 startups ativas e R$ 80k MRR em 18 meses."'},
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',minHeight:'calc(100vh - 120px)'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'1.75rem',marginBottom:'0.25rem'}}>Canvas & Pitch</h1>
          <p style={{color:'var(--muted-foreground)',fontSize:'0.9rem'}}>Modele seu negócio e prepare sua apresentação para investidores.</p>
        </div>
        <div style={{display:'flex',gap:'1rem'}}>
          <button style={{padding:'0.6rem 1.2rem',borderRadius:'var(--radius)',border:'1px solid var(--border)',fontSize:'0.85rem',fontWeight:'600',display:'flex',alignItems:'center',gap:'0.5rem',background:'white'}}>
            <Download size={18}/> Exportar PDF
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{display:'flex',gap:'0.5rem',background:'var(--secondary)',padding:'0.35rem',borderRadius:'var(--radius)',width:'fit-content'}}>
        {([['canvas','📋 Canvas Estratégico'],['pitch','🎤 Pitch Builder']] as [TabType,string][]).map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'0.6rem 1.25rem',borderRadius:'calc(var(--radius) - 4px)',fontSize:'0.9rem',fontWeight:'600',background:tab===id?'white':'transparent',color:tab===id?'var(--primary)':'var(--muted-foreground)',boxShadow:tab===id?'0 2px 4px rgba(0,0,0,0.08)':'none'}}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'canvas' && (
        <div className="animate-fade-in" style={{display:'flex',flexDirection:'column',gap:'1.5rem',flex:1}}>
          {/* Canvas Sub-tabs */}
          <div style={{display:'flex',gap:'1.5rem',borderBottom:'1px solid var(--border)'}}>
            {([['lean','Lean Canvas'],['bmc','Business Model Canvas'],['value','Value Proposition'],['persona','Persona']] as [CanvasType,string][]).map(([id,label])=>(
              <button key={id} onClick={()=>setCanvasType(id)} style={{padding:'0.75rem 0.25rem',fontSize:'0.9rem',fontWeight:'600',color:canvasType===id?'var(--primary)':'var(--muted-foreground)',borderBottom:canvasType===id?'2px solid var(--primary)':'2px solid transparent',marginBottom:'-1px'}}>
                {label}
              </button>
            ))}
          </div>

          {(canvasType === 'lean' || canvasType === 'bmc') && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gridAutoRows:'minmax(180px, auto)',gap:'0.75rem',flex:1}}>
              {canvasType === 'lean' && <>
                <CanvasBlock item={leanBlocks[0]} rowSpan={2}/>
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <CanvasBlock item={leanBlocks[1]}/>
                  <CanvasBlock item={leanBlocks[6]}/>
                </div>
                <CanvasBlock item={leanBlocks[2]} rowSpan={2}/>
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <CanvasBlock item={leanBlocks[3]}/>
                  <CanvasBlock item={leanBlocks[5]}/>
                </div>
                <CanvasBlock item={leanBlocks[4]} rowSpan={2}/>
                <CanvasBlock item={leanBlocks[7]} style={{gridColumn:'span 2'}}/>
                <CanvasBlock item={leanBlocks[8]} style={{gridColumn:'span 3'}}/>
              </>}
              {canvasType === 'bmc' && <>
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <CanvasBlock item={bmcBlocks[0]}/>
                  <CanvasBlock item={bmcBlocks[1]}/>
                  <CanvasBlock item={bmcBlocks[2]}/>
                </div>
                <CanvasBlock item={bmcBlocks[3]} rowSpan={2} style={{gridColumn:'span 1'}}/>
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <CanvasBlock item={bmcBlocks[4]}/>
                  <CanvasBlock item={bmcBlocks[5]}/>
                </div>
                <CanvasBlock item={bmcBlocks[6]} rowSpan={2}/>
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <CanvasBlock item={bmcBlocks[7]}/>
                  <CanvasBlock item={bmcBlocks[8]}/>
                </div>
              </>}
            </div>
          )}

          {canvasType === 'value' && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',flex:1}} className="animate-fade-in">
              <div className="card premium-shadow" style={{borderTop:'3px solid #10b981'}}>
                <h3 style={{fontSize:'1.1rem',marginBottom:'1.5rem',color:'#10b981'}}>Mapa de Valor (O que você entrega)</h3>
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {['Criadores de Ganho','Produtos & Serviços','Aliviadores de Dor'].map((section,i)=>(
                    <div key={i}>
                      <p style={{fontSize:'0.8rem',fontWeight:'700',textTransform:'uppercase',marginBottom:'0.5rem',color:'var(--muted-foreground)'}}>{section}</p>
                      <textarea rows={3} placeholder={`Descreva ${section.toLowerCase()}...`} style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid var(--border)',resize:'none',fontSize:'0.9rem',outline:'none'}}/>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card premium-shadow" style={{borderTop:'3px solid #3b82f6'}}>
                <h3 style={{fontSize:'1.1rem',marginBottom:'1.5rem',color:'#3b82f6'}}>Perfil do Cliente (O que ele precisa)</h3>
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {['Ganhos Esperados','Tarefas do Cliente','Dores & Frustrações'].map((section,i)=>(
                    <div key={i}>
                      <p style={{fontSize:'0.8rem',fontWeight:'700',textTransform:'uppercase',marginBottom:'0.5rem',color:'var(--muted-foreground)'}}>{section}</p>
                      <textarea rows={3} placeholder={`Descreva ${section.toLowerCase()}...`} style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid var(--border)',resize:'none',fontSize:'0.9rem',outline:'none'}}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {canvasType === 'persona' && (
            <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:'1.5rem',flex:1}} className="animate-fade-in">
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div className="card premium-shadow" style={{textAlign:'center',padding:'2rem'}}>
                  <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'var(--secondary)',margin:'0 auto 1rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>👩‍💼</div>
                  <h3 style={{fontSize:'1.1rem'}}>Carla, Gestora de Hub</h3>
                  <p style={{fontSize:'0.85rem',color:'var(--muted-foreground)'}}>38 anos • Porto Alegre, RS</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',justifyContent:'center',marginTop:'1rem'}}>
                    {['Gestão','Inovação','Dados'].map(t=><span key={t} style={{fontSize:'0.7rem',padding:'0.2rem 0.5rem',background:'#dbeafe',color:'#3b82f6',borderRadius:'4px',fontWeight:'600'}}>{t}</span>)}
                  </div>
                </div>
                <button style={{width:'100%',padding:'0.75rem',border:'1px dashed var(--border)',borderRadius:'var(--radius)',color:'var(--primary)',fontWeight:'600',fontSize:'0.85rem',background:'white'}}>+ Nova Persona</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                {[{title:'Objetivos',emoji:'🎯',color:'#10b981',items:['Mostrar impacto das startups','Atrair mais programas']},{title:'Dores',emoji:'😤',color:'#ef4444',items:['Dados espalhados','Relatórios manuais lentos']},{title:'Comportamentos',emoji:'🧠',color:'#3b82f6',items:['Usa LinkedIn intensamente','Lê relatórios do Sebrae']},{title:'Canais Preferidos',emoji:'📱',color:'#8b5cf6',items:['WhatsApp Business','Webinars e eventos']}].map((s,i)=>(
                  <div key={i} className="card premium-shadow" style={{borderLeft:`4px solid ${s.color}`}}>
                    <p style={{fontSize:'1rem',marginBottom:'0.75rem'}}>{s.emoji} <strong>{s.title}</strong></p>
                    {s.items.map((item,j)=><p key={j} style={{fontSize:'0.85rem',padding:'0.4rem 0',borderBottom:'1px solid var(--muted)',color:'var(--foreground)'}}>{item}</p>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'pitch' && (
        <div className="animate-fade-in" style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:'2rem',flex:1,minHeight:'500px'}}>
          {/* Pitch Navigation */}
          <div className="card premium-shadow" style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
            <p style={{fontSize:'0.75rem',fontWeight:'700',textTransform:'uppercase',color:'var(--muted-foreground)',padding:'0.5rem',marginBottom:'0.25rem'}}>Slides do Pitch</p>
            {pitchSections.map((s,i)=>(
              <button key={i} onClick={()=>setPitchSection(i)} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem',borderRadius:'8px',textAlign:'left',background:pitchSection===i?'var(--primary)':'transparent',color:pitchSection===i?'white':'var(--foreground)',transition:'all 0.2s'}}>
                <span style={{fontSize:'1.1rem'}}>{s.icon}</span>
                <div>
                  <p style={{fontSize:'0.85rem',fontWeight:'600'}}>{s.title}</p>
                  <p style={{fontSize:'0.7rem',opacity:0.7}}>{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Pitch Section */}
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            <div className="card premium-shadow" style={{flex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.5rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <span>{pitchSections[pitchSection].icon}</span> {pitchSections[pitchSection].title}
                </h2>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  {pitchSection > 0 && <button onClick={()=>setPitchSection(p=>p-1)} style={{padding:'0.5rem 1rem',borderRadius:'8px',border:'1px solid var(--border)',fontSize:'0.85rem',fontWeight:'600',background:'white'}}>← Anterior</button>}
                  {pitchSection < pitchSections.length - 1 && <button onClick={()=>setPitchSection(p=>p+1)} className="premium-gradient" style={{color:'white',padding:'0.5rem 1rem',borderRadius:'8px',fontSize:'0.85rem',fontWeight:'600'}}>Próximo →</button>}
                </div>
              </div>
              <p style={{fontSize:'0.9rem',color:'var(--muted-foreground)',marginBottom:'1.5rem'}}>{pitchSections[pitchSection].desc}</p>
              <div style={{padding:'1.5rem',background:'#f8fafc',borderRadius:'12px',borderLeft:'4px solid var(--primary)',marginBottom:'1.5rem'}}>
                <p style={{fontSize:'1.05rem',lineHeight:'1.7',fontStyle:'italic',color:'var(--foreground)'}} dangerouslySetInnerHTML={{__html:pitchSections[pitchSection].content}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'0.85rem',fontWeight:'600',marginBottom:'0.5rem'}}>Editar sua versão:</label>
                <textarea rows={5} defaultValue={pitchSections[pitchSection].content.replace(/<[^>]*>/g,'')} style={{width:'100%',padding:'1rem',borderRadius:'8px',border:'1px solid var(--border)',fontSize:'0.9rem',lineHeight:'1.6',resize:'none',outline:'none'}}/>
              </div>
            </div>

            <div className="card premium-shadow">
              <h3 style={{fontSize:'1.1rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><MessageSquare size={20} color="var(--primary)"/> Feedback dos Mentores</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                <div style={{padding:'1rem',background:'#f0fdf4',borderRadius:'8px',borderLeft:'3px solid #10b981'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                    <span style={{fontWeight:'600',fontSize:'0.9rem'}}>Prof. Carlos Mendes</span>
                    <div style={{display:'flex',gap:'2px'}}>{[1,2,3,4,5].map(s=><Star key={s} size={14} fill={s<=4?'#f59e0b':'none'} color="#f59e0b"/>)}</div>
                  </div>
                  <p style={{fontSize:'0.85rem',color:'var(--foreground)'}}>O problema está claro e bem articulado. Sugiro adicionar dados do IBGE sobre o mercado para reforçar o "Mercado".</p>
                  <p style={{fontSize:'0.75rem',color:'var(--muted-foreground)',marginTop:'0.5rem',display:'flex',alignItems:'center',gap:'0.25rem'}}><Clock size={12}/> há 2 dias</p>
                </div>
                <button style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px dashed var(--primary)',color:'var(--primary)',fontWeight:'600',fontSize:'0.85rem',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
                  <MessageSquare size={16}/> Solicitar Avaliação de Mentor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
