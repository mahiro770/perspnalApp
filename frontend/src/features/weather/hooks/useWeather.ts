import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchForecast, fetchRegions, setDefaultRegion } from '../api/weatherApi';

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
