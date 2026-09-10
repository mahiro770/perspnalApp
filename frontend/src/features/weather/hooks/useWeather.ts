import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, fetchFavorites, fetchForecast, fetchRegions, removeFavorite, setDefaultRegion } from '../api/weatherApi';

export function useWeatherRegions() {
  return useQuery({
    queryKey: ['weather', 'regions'],
    queryFn: fetchRegions,
    staleTime: 60 * 60 * 1000,
  });
}

export function useWeatherForecast(regionCode: string) {
  return useQuery({
    queryKey: ['weather', 'forecast', regionCode],
    queryFn: () => fetchForecast(regionCode),
    enabled: !!regionCode,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSetDefaultRegion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setDefaultRegion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weather'] }),
  });
}

export function useFavoriteRegions() {
  return useQuery({
    queryKey: ['weather', 'favorites'],
    queryFn: fetchFavorites,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weather', 'favorites'] }),
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weather', 'favorites'] }),
  });
}
