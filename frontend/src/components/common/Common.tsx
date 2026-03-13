import { type ReactNode } from 'react';

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 24 }: SpinnerProps) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid var(--color-border)`,
      borderTopColor: 'var(--color-primary)',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '16px',
    }}>
      <Spinner size={40} />
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Cargando...</p>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  color?: string;
  bg?: string;
}

export function Badge({ children, color = '#fff', bg = 'var(--color-primary)' }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: '20px',
      fontSize: '12px', fontWeight: 600,
      color, background: bg,
      lineHeight: 1,
    }}>
      {children}
    </span>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px',
      textAlign: 'center',
    }}>
      {icon && <div style={{ fontSize: '48px', color: 'var(--color-text-light)', marginBottom: '16px' }}>{icon}</div>}
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>{title}</h3>
      {description && <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '400px' }}>{description}</p>}
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
    </div>
  );
}
