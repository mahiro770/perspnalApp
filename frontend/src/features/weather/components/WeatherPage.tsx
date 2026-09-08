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
          <CurrentWeatherCard forecast={forecast} />
          <HourlyForecastList hourly={forecast.hourly} />
          <WeeklyForecastList weekly={forecast.weekly} />
        </>
      )}
    </div>
  );
}
