import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { addMonths, formatMonthLabel } from '@/lib/date';

interface MonthSwitcherProps {
  month: string;
  onChange: (month: string) => void;
}

export function MonthSwitcher({ month, onChange }: MonthSwitcherProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => onChange(addMonths(month, -1))} aria-label="前の月">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span className="text-base font-semibold text-text">{formatMonthLabel(month)}</span>
      <Button variant="ghost" size="icon" onClick={() => onChange(addMonths(month, 1))} aria-label="次の月">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
