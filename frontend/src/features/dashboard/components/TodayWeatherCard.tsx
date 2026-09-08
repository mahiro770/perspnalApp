import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { useWeatherStore } from '@/stores/weatherStore';
import { useWeatherForecast } from '@/features/weather/hooks/useWeather';
import { WeatherIcon, WEATHER_LABEL } from '@/features/weather/components/weatherIcons';

export function TodayWeatherCard() {
  const { selectedRegionCode } = useWeatherStore();
  const { data: forecast, isLoading } = useWeatherForecast(selectedRegionCode);

  return (
    <Link to="/weather">
      <Card className="bg-weather/5 transition-colors hover:bg-weather/10">
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
      </Card>
    </Link>
  );
}
