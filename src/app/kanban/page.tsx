'use client';

import React from 'react';
import { KanbanColumn, KanbanCard } from '@/components/ui/Kanban';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare
} from 'lucide-react';

export default function KanbanPage() {
  return (
    <div style={{ height: 'calc(100vh - var(--header-height) - 4rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Kanban & Tarefas</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie o fluxo de trabalho e atividades da sua startup.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)' }}>
            <Search size={18} color="var(--muted-foreground)" />
            <input placeholder="Buscar tarefas..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem' }} />
          </div>
          <button style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Filtrar
          </button>
          <button className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Nova Tarefa
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', minWidth: 'max-content', height: '100%' }}>
          <KanbanColumn title="Ideias / Backlog" count={5} color="#94a3b8">
            <KanbanCard title="Pesquisar concorrentes diretos" subtitle="Responsável: Daniel" priority="Média" tags={[{label: 'Pesquisa', color: '#3b82f6'}]} />
            <KanbanCard title="Definir paleta de cores do App" priority="Baixa" tags={[{label: 'Design', color: '#8b5cf6'}]} />
          </KanbanColumn>
          
          <KanbanColumn title="A Fazer" count={3} color="#f59e0b">
            <KanbanCard title="Finalizar Pitch Deck" subtitle="Responsável: Daniel" priority="Alta" tags={[{label: 'Investimento', color: '#ef4444'}]} />
            <KanbanCard title="Revisar contrato societário" priority="Alta" tags={[{label: 'Jurídico', color: '#10b981'}]} />
          </KanbanColumn>
          
          <KanbanColumn title="Em Andamento" count={2} color="#3b82f6">
            <KanbanCard title="Desenvolver MVP (Fase 1)" subtitle="Responsável: Aline" priority="Alta" tags={[{label: 'Produto', color: '#3b82f6'}]} />
          </KanbanColumn>
          
          <KanbanColumn title="Em Validação" count={1} color="#8b5cf6">
            <KanbanCard title="Testes com 10 beta testers" subtitle="Responsável: Ricardo" priority="Média" tags={[{label: 'Validação', color: '#f59e0b'}]} />
          </KanbanColumn>
          
          <KanbanColumn title="Concluído" count={12} color="#10b981">
            <KanbanCard title="Modelagem do Banco de Dados" priority="Baixa" tags={[{label: 'Tech', color: '#3b82f6'}]} />
          </KanbanColumn>
        </div>
      </div>
    </div>
  );
}
