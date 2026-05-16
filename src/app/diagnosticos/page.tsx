'use client';

import React, { useState } from 'react';
import { 
  Target, TrendingUp, Users, Award, 
  Search, Filter, Brain, Zap, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import StatsCard from '@/components/ui/StatsCard';

export default function DiagnosticosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const startupsAnalysis = [
    { 
      name: 'EcoFlow Tech', 
      entrepreneur: 'Marcos Vinícius', 
      type: 'Executor', 
      similarity: 92, 
      status: 'GOOD',
      kpis: { coachability: 9.5, execution: 9.2, mrr_growth: '25%' }
    },
    { 
      name: 'AgroSmart', 
      entrepreneur: 'Ana Paula', 
      type: 'Visionária Técnica', 
      similarity: 88, 
      status: 'GOOD',
      kpis: { coachability: 8.8, execution: 8.5, mrr_growth: '18%' }
    },
    { 
      name: 'Evently Pro', 
      entrepreneur: 'Ricardo Oliveira', 
      type: 'Social/Palco', 
      similarity: 45, 
      status: 'RISK',
      kpis: { coachability: 4.2, execution: 3.5, mrr_growth: '2%' }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Módulo de Inteligência Analítica</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Diagnósticos baseados em fatos, KPIs e comportamento empreendedor.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card premium-shadow" style={{ background: 'var(--primary)', color: 'white' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={20} /> Insight Antigravity (IA)
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>
            Identificamos um padrão de "Resiliência" superior na EcoFlow Tech. Empreendedores com esse perfil tendem a pivotar o modelo de negócio 3x mais rápido em crises, mantendo o burn rate controlado.
          </p>
        </div>
        <div className="card premium-shadow">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--primary)" /> Foco em Resultados
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
            85% das startups do ecossistema estão focadas em execução técnica. Recomendamos aumentar o suporte em "Go-to-market" para o próximo trimestre.
          </p>
        </div>
      </div>

      <div className="card premium-shadow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <h3 style={{ fontSize: '1.25rem' }}>Matriz de Empreendedores</h3>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} size={16} />
                <input 
                  placeholder="Buscar empreendedor..." 
                  style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <button style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <Filter size={16} /> Filtros
              </button>
           </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)', color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
              <th style={{ padding: '1rem' }}>EMPREENDEDOR / STARTUP</th>
              <th style={{ padding: '1rem' }}>PERFIL DNA</th>
              <th style={{ padding: '1rem' }}>COACHABILITY</th>
              <th style={{ padding: '1rem' }}>EXECUÇÃO</th>
              <th style={{ padding: '1rem' }}>CRESCIMENTO</th>
              <th style={{ padding: '1rem' }}>STATUS FINAL</th>
            </tr>
          </thead>
          <tbody>
            {startupsAnalysis.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1.25rem 1rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.entrepreneur}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{item.name}</p>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    background: 'var(--secondary)', 
                    color: 'var(--primary)' 
                  }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 800 }}>{item.kpis.coachability}/10</td>
                <td style={{ padding: '1rem', fontWeight: 800 }}>{item.kpis.execution}/10</td>
                <td style={{ padding: '1rem', color: '#10b981', fontWeight: 800 }}>{item.kpis.mrr_growth}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.status === 'GOOD' ? (
                      <><CheckCircle2 size={16} color="#10b981" /> <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>ALTO POTENCIAL</span></>
                    ) : (
                      <><AlertTriangle size={16} color="#f59e0b" /> <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>RISCO OPERACIONAL</span></>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPARAÇÃO DE BONS VS MAUS EMPREENDEDORES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
         <div className="card premium-shadow" style={{ borderLeft: '5px solid #10b981' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> Perfil de Sucesso (Bons)
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#047857', paddingLeft: '1.25rem' }}>
              <li>Foco total em vendas e validação de produto.</li>
              <li>Recebe feedbacks e itera em menos de 48h.</li>
              <li>Transparência total com mentores e diretoria.</li>
              <li>Equipe técnica com alta senioridade e baixo turnover.</li>
            </ul>
         </div>
         <div className="card premium-shadow" style={{ borderLeft: '5px solid #ef4444' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Sinais de Risco (Maus)
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#b91c1c', paddingLeft: '1.25rem' }}>
              <li>Foco excessivo em networking social e eventos.</li>
              <li>Resistência a mudanças no modelo de negócio (Teimosia).</li>
              <li>Ocultação de métricas financeiras negativas.</li>
              <li>Dependência total de editais ou aportes externos.</li>
            </ul>
         </div>
      </div>

      <style jsx>{`
        .table-row-hover:hover {
          background: #F8FAFC;
        }
      `}</style>
    </div>
  );
}
