import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';
import { useWeatherStore } from '@/stores/weatherStore';
import { useWeatherForecast } from '../hooks/useWeather';
import { RegionSelect } from './RegionSelect';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyForecastList } from './HourlyForecastList';
import { WeeklyForecastList } from './WeeklyForecastList';

export function WeatherPage() {
  const { selectedRegionCode, setSelectedRegionCode } = useWeatherStore();
  const { data: forecast, isLoading } = useWeatherForecast(selectedRegionCode);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-xl font-bold text-text md:block">天気</h1>
        <RegionSelect value={selectedRegionCode} onChange={setSelectedRegionCode} />
      </div>

      {isLoading || !forecast ? (
        <div className="h-32 animate-pulse rounded-xl bg-surface-alt" />
      ) : (
        <>
          {forecast.stale && (
            <Card className="flex items-start gap-2 border-danger/30 bg-danger/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger" />
              <p className="text-xs text-danger">
                気象庁への取得に失敗したため、エラーとして直近の有効なデータを取得しています。最新の状況と異なる場合があります。
              </p>
            </Card>
          )}
          <CurrentWeatherCard forecast={forecast} />
          <HourlyForecastList hourly={forecast.hourly} />
          <WeeklyForecastList weekly={forecast.weekly} />
        </>
      )}
    </div>
  );
}
