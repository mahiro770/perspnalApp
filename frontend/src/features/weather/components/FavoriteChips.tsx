import { X } from 'lucide-react';
import { useFavoriteRegions, useRemoveFavorite } from '../hooks/useWeather';

interface FavoriteChipsProps {
  selectedRegionCode: string;
  onSelect: (regionCode: string) => void;
}

export function FavoriteChips({ selectedRegionCode, onSelect }: FavoriteChipsProps) {
  const { data: favorites = [] } = useFavoriteRegions();
  const removeMutation = useRemoveFavorite();

  if (favorites.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {favorites.map((fav) => {
        const active = fav.regionCode === selectedRegionCode;
        return (
          <div
            key={fav.id}
            className={`flex flex-shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs ${
              active ? 'border-weather bg-weather/10 text-weather' : 'border-border text-text-muted'
            }`}
          >
            <button onClick={() => onSelect(fav.regionCode)} className="whitespace-nowrap">
              {fav.regionName}
            </button>
            <button
              onClick={() => removeMutation.mutate(fav.id)}
              aria-label={`${fav.regionName}をお気に入りから削除`}
              className="text-text-muted hover:text-danger"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
