import { formatDateLabel } from '@/lib/date';
import { TodayWeatherCard } from './TodayWeatherCard';
import { TodayEventsCard } from './TodayEventsCard';
import { BudgetSummaryCard } from './BudgetSummaryCard';

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-text">おかえりなさい</h1>
        <p className="text-sm text-text-muted">{formatDateLabel(new Date())}</p>
      </div>
      <TodayWeatherCard />
      <TodayEventsCard />
      <BudgetSummaryCard />
    </div>
  );
}
