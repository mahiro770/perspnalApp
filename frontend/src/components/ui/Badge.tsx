import { HTMLAttributes } from 'react';

type Tone = 'default' | 'weather' | 'calendar' | 'income' | 'expense' | 'warning';

const toneClasses: Record<Tone, string> = {
  default: 'bg-surface-alt text-text-muted',
  weather: 'bg-weather/10 text-weather',
  calendar: 'bg-calendar/10 text-calendar',
  income: 'bg-income/10 text-income',
  expense: 'bg-expense/10 text-expense',
  warning: 'bg-warning/10 text-warning',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className = '', tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
