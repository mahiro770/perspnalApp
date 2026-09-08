import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { weekdayLabel } from '@/lib/date';
import { DailyForecast } from '../api/types';
import { WeatherIcon } from './weatherIcons';

export function WeeklyForecastList({ weekly }: { weekly: DailyForecast[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>週間予報</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border p-0">
        {weekly.map((d, i) => {
          const date = new Date(`${d.date}T00:00:00`);
          return (
            <div key={d.date} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="w-16 text-text-muted">
                {i === 0 ? '今日' : `${date.getMonth() + 1}/${date.getDate()}`}
                <span className="ml-1 text-xs">({weekdayLabel(date)})</span>
              </span>
              <WeatherIcon condition={d.condition} className="h-5 w-5 text-weather" />
              <span className="w-10 text-xs text-weather">{d.precipitationProbability}%</span>
              <span className="ml-auto flex gap-2 font-medium text-text">
                <span className="text-text-muted">{d.low}℃</span>
                <span>{d.high}℃</span>
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
