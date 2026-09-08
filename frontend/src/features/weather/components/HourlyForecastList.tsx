import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { HourlyForecast } from '../api/types';
import { WeatherIcon } from './weatherIcons';

export function HourlyForecastList({ hourly }: { hourly: HourlyForecast[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>時間別予報</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex gap-4">
          {hourly.slice(0, 12).map((h) => {
            const time = new Date(h.time);
            return (
              <div key={h.time} className="flex flex-shrink-0 flex-col items-center gap-1 text-xs">
                <span className="text-text-muted">{time.getHours()}時</span>
                <WeatherIcon condition={h.condition} className="h-6 w-6 text-weather" />
                <span className="font-semibold text-text">{h.temp}℃</span>
                <span className="text-weather">{h.precipitationProbability}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
