import { AlertTriangle, Star } from 'lucide-react';
import { Card } from '@/components/ui';
import { useWeatherStore } from '@/stores/weatherStore';
import { useAddFavorite, useFavoriteRegions, useRemoveFavorite, useWeatherForecast } from '../hooks/useWeather';
import { RegionSelect } from './RegionSelect';
import { FavoriteChips } from './FavoriteChips';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyForecastList } from './HourlyForecastList';
import { WeeklyForecastList } from './WeeklyForecastList';

export function WeatherPage() {
  const { selectedRegionCode, setSelectedRegionCode } = useWeatherStore();
  const { data: forecast, isLoading } = useWeatherForecast(selectedRegionCode);
  const { data: favorites = [] } = useFavoriteRegions();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const currentFavorite = favorites.find((f) => f.regionCode === selectedRegionCode);

  function toggleFavorite() {
    if (currentFavorite) {
      removeFavoriteMutation.mutate(currentFavorite.id);
    } else {
      addFavoriteMutation.mutate(selectedRegionCode);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="hidden text-xl font-bold text-text md:block">天気</h1>
        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <RegionSelect value={selectedRegionCode} onChange={setSelectedRegionCode} />
          <button
            onClick={toggleFavorite}
            aria-label={currentFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
            aria-pressed={!!currentFavorite}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border hover:bg-surface-alt"
          >
            <Star className={`h-4 w-4 ${currentFavorite ? 'fill-weather text-weather' : 'text-text-muted'}`} />
          </button>
        </div>
      </div>

      <FavoriteChips selectedRegionCode={selectedRegionCode} onSelect={setSelectedRegionCode} />

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
