import React from 'react';

interface KanbanColumnProps {
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

export const KanbanColumn = ({ title, count, color, children }: KanbanColumnProps) => (
  <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--foreground)' }}>{title}</h4>
        <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'var(--secondary)', borderRadius: '999px', color: 'var(--muted-foreground)' }}>{count}</span>
      </div>
      <button style={{ color: 'var(--muted-foreground)' }}>+</button>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {children}
    </div>
  </div>
);

interface KanbanCardProps {
  title: string;
  subtitle?: string;
  tags?: { label: string; color: string }[];
  priority?: 'Alta' | 'Média' | 'Baixa';
  value?: string;
}

export const KanbanCard = ({ title, subtitle, tags, priority, value }: KanbanCardProps) => (
  <div className="card premium-shadow" style={{ padding: '1rem', cursor: 'pointer', borderLeft: priority === 'Alta' ? '4px solid var(--destructive)' : '1px solid var(--border)' }}>
    <h5 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>{title}</h5>
    {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>{subtitle}</p>}
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
      {tags?.map((tag, i) => (
        <span key={i} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: tag.color + '20', color: tag.color, fontWeight: '600' }}>
          {tag.label}
        </span>
      ))}
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--muted)' }}>
      {value && <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>{value}</span>}
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--secondary)', border: '1px solid var(--border)' }}></div>
    </div>
  </div>
);
