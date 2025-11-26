import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export function StatCard({ label, value, subValue, icon, variant = 'default' }: StatCardProps) {
  const valueColor = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
  }[variant];

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="result-label">{label}</p>
          <p className={`result-value ${valueColor}`}>{value}</p>
          {subValue && (
            <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground/50">{icon}</div>
        )}
      </div>
    </div>
  );
}
