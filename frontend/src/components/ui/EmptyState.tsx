import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
      {Icon && <Icon className="mb-1 h-8 w-8 text-text-muted" strokeWidth={1.5} />}
      <p className="text-sm font-medium text-text">{title}</p>
      {description && <p className="text-xs text-text-muted">{description}</p>}
      {action}
    </div>
  );
}
