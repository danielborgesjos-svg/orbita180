import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description?: string;
}

const StatsCard = ({ title, value, change, icon: Icon, description }: StatsCardProps) => {
  const isPositive = change && change > 0;

  return (
    <div className="card premium-shadow">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
        <div style={{ padding: '0.5rem', background: 'var(--secondary)', borderRadius: '10px', color: 'var(--primary)' }}>
          <Icon size={20} />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{value}</h3>
        {change !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: '600', color: isPositive ? '#10b981' : '#ef4444' }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      {description && (
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>{description}</p>
      )}
    </div>
  );
};

export default StatsCard;
