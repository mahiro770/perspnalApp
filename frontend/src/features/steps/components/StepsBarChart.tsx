import { StepEntry, StepsGroupBy } from '../api/types';

const CHART_HEIGHT = 130;

function formatLabel(label: string, groupBy: StepsGroupBy): string {
  if (groupBy === 'day') {
    const [, m, d] = label.split('-');
    return `${Number(m)}/${Number(d)}`;
  }
  if (groupBy === 'month') {
    const [, m] = label.split('-');
    return `${Number(m)}月`;
  }
  return `${label}年`;
}

export function StepsBarChart({ data, groupBy }: { data: StepEntry[]; groupBy: StepsGroupBy }) {
  const max = Math.max(...data.map((d) => d.steps), 1);

  return (
    <div className="flex items-end gap-2 overflow-x-auto pb-1" style={{ minHeight: CHART_HEIGHT + 44 }}>
      {data.map((entry) => {
        const height = entry.steps > 0 ? Math.max(Math.round((entry.steps / max) * CHART_HEIGHT), 3) : 0;
        return (
          <div key={entry.label} className="flex w-10 flex-shrink-0 flex-col items-center gap-1">
            <span className="whitespace-nowrap text-[10px] tabular-nums text-text-muted">
              {entry.steps > 0 ? entry.steps.toLocaleString() : ''}
            </span>
            <div className="flex w-full items-end" style={{ height: CHART_HEIGHT }}>
              <div className="w-full rounded-t-md bg-steps" style={{ height }} />
            </div>
            <span className="whitespace-nowrap text-[10px] text-text-muted">{formatLabel(entry.label, groupBy)}</span>
          </div>
        );
      })}
    </div>
  );
}
