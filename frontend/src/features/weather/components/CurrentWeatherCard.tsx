import { Card, CardContent } from '@/components/ui';
import { WeatherForecast } from '../api/types';
import { WeatherIcon, WEATHER_LABEL } from './weatherIcons';

export function CurrentWeatherCard({ forecast }: { forecast: WeatherForecast }) {
  const updated = new Date(forecast.updatedAt);

  return (
    <Card className="bg-weather/5">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">{forecast.regionName}</p>
          <p className="mt-1 text-4xl font-bold text-text">{forecast.current.temp}℃</p>
          <p className="mt-1 text-sm text-text-muted">
            {WEATHER_LABEL[forecast.current.condition]}
            {forecast.current.feelsLike != null && ` ・ 体感 ${forecast.current.feelsLike}℃`}
            {forecast.current.humidity != null && ` ・ 湿度 ${forecast.current.humidity}%`}
          </p>
        </div>
        <WeatherIcon condition={forecast.current.condition} className="h-16 w-16 text-weather" />
      </CardContent>
      <p className="px-4 pb-3 text-[11px] text-text-muted">
        更新: {updated.getHours()}:{String(updated.getMinutes()).padStart(2, '0')}
      </p>
    </Card>
  );
}
