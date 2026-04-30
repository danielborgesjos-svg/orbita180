import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { MoreVertical } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

export const KanbanColumn = ({ id, title, count, color, children }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      style={{ 
        flex: 1, 
        minWidth: '300px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        background: 'var(--secondary)30',
        padding: '1rem',
        borderRadius: 'var(--radius)',
        height: '100%',
        minHeight: '500px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--foreground)' }}>{title}</h4>
          <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'var(--secondary)', borderRadius: '999px', color: 'var(--muted-foreground)' }}>{count}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

interface KanbanCardProps {
  id: string;
  title: string;
  subtitle?: string;
  tags?: { label: string; color: string }[];
  priority?: 'Alta' | 'Média' | 'Baixa' | string;
  value?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const KanbanCard = ({ id, title, subtitle, tags, priority, value, onEdit, onDelete }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const getPriorityColor = (p?: string) => {
    switch (p) {
      case 'Alta': return 'var(--destructive)';
      case 'Média': return '#f59e0b';
      case 'Baixa': return '#10b981';
      default: return 'var(--border)';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="card premium-shadow"
    >
      <div 
        {...attributes} 
        {...listeners}
        style={{ 
          padding: '1rem', 
          cursor: 'grab', 
          borderLeft: `4px solid ${getPriorityColor(priority)}`,
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <h5 style={{ fontSize: '0.9rem', fontWeight: '600', flex: 1, marginRight: '1.5rem' }}>{title}</h5>
          <div style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}>
             {/* Note: In a real app, I'd use a dropdown here */}
             <button onClick={(e) => { e.stopPropagation(); onEdit?.(); }} style={{ color: 'var(--muted-foreground)', padding: '0.25rem' }}>
                <MoreVertical size={14} />
             </button>
          </div>
        </div>
        
        {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>{subtitle}</p>}
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
          {tags?.map((tag, i) => (
            <span key={i} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: tag.color + '20', color: tag.color, fontWeight: '600' }}>
              {tag.label}
            </span>
          ))}
          {priority && (
            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: getPriorityColor(priority) + '15', color: getPriorityColor(priority), fontWeight: '700' }}>
              {priority}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)50' }}>
          {value && <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>{value}</span>}
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--secondary)', border: '1px solid var(--border)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--muted-foreground)' }}>
            D
          </div>
        </div>
      </div>
    </div>
  );
};
