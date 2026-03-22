import type { HealthLevel } from '../types/models';

const config = {
  healthy: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Healthy',
  },
  caution: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    label: 'Needs Attention',
  },
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    label: 'Needs Action',
  },
};

interface HealthBadgeProps {
  level: HealthLevel;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HealthBadge({
  level,
  label,
  size = 'md',
}: HealthBadgeProps) {
  const c = config[level];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {label || c.label}
    </span>
  );
}
