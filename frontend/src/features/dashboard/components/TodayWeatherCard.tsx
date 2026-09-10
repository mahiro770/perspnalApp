import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, Select } from '@/components/ui';
import { useWeatherStore } from '@/stores/weatherStore';
import { useFavoriteRegions, useWeatherForecast } from '@/features/weather/hooks/useWeather';
import { WeatherIcon, WEATHER_LABEL } from '@/features/weather/components/weatherIcons';

export function TodayWeatherCard() {
  const { selectedRegionCode, setSelectedRegionCode } = useWeatherStore();
  const { data: forecast, isLoading } = useWeatherForecast(selectedRegionCode);
  const { data: favorites = [] } = useFavoriteRegions();

  return (
    <Card className="bg-weather/5">
      {favorites.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 pb-2 pt-3">
          <span className="whitespace-nowrap text-xs text-text-muted">お気に入り地域</span>
          <Select
            value={selectedRegionCode}
            onChange={(e) => setSelectedRegionCode(e.target.value)}
            className="!w-auto min-w-[8rem] flex-shrink-0"
          >
            {favorites.map((fav) => (
              <option key={fav.id} value={fav.regionCode}>
                {fav.regionName}
              </option>
            ))}
          </Select>
        </div>
      )}
      <Link to="/weather" className="block transition-colors hover:bg-weather/10">
        <CardContent className="flex items-center gap-4">
          {isLoading || !forecast ? (
            <div className="h-14 w-full animate-pulse rounded-lg bg-surface-alt" />
          ) : (
            <>
              <WeatherIcon condition={forecast.current.condition} className="h-12 w-12 flex-shrink-0 text-weather" />
              <div className="flex-1">
                <p className="text-xs text-text-muted">{forecast.regionName}の今日の天気</p>
                <p className="text-2xl font-bold text-text">
                  {forecast.current.temp}℃
                  <span className="ml-2 text-sm font-normal text-text-muted">
                    {WEATHER_LABEL[forecast.current.condition]}
                  </span>
                </p>
                {forecast.weekly[0] && (
                  <p className="text-xs text-text-muted">
                    最高 {forecast.weekly[0].high}℃ / 最低 {forecast.weekly[0].low}℃ ・ 降水確率{' '}
                    {forecast.weekly[0].precipitationProbability}%
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted" />
            </>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
