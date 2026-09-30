import { useState } from 'react';
import { Footprints } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { useSteps } from '../hooks/useSteps';
import { StepsGroupBy } from '../api/types';
import { StepsBarChart } from './StepsBarChart';

const TABS: { key: StepsGroupBy; label: string }[] = [
  { key: 'day', label: '日' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
];

export function StepsPage() {
  const [groupBy, setGroupBy] = useState<StepsGroupBy>('day');
  const { data = [], isLoading } = useSteps(groupBy);

  const total = data.reduce((sum, d) => sum + d.steps, 0);
  const average = data.length > 0 ? Math.round(total / data.length) : 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="hidden text-xl font-bold text-text md:block">歩数</h1>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            size="sm"
            variant={groupBy === tab.key ? 'steps' : 'secondary'}
            onClick={() => setGroupBy(tab.key)}
            className="flex-1 justify-center"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>歩数の推移</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 animate-pulse rounded-lg bg-surface-alt" />
          ) : data.length === 0 ? (
            <EmptyState icon={Footprints} title="歩数データがまだありません" />
          ) : (
            <>
              <div className="mb-3 flex gap-6 text-sm">
                <div>
                  <p className="text-xs text-text-muted">合計</p>
                  <p className="font-bold text-text">{total.toLocaleString()}歩</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">平均</p>
                  <p className="font-bold text-text">{average.toLocaleString()}歩</p>
                </div>
              </div>
              <StepsBarChart data={data} groupBy={groupBy} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
