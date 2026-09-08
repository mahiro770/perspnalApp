import { api, withMockFallback } from '@/lib/api';
import { WeatherForecast, WeatherRegion } from './types';
import { MOCK_REGIONS, buildMockForecast } from './mockData';

export function fetchRegions(): Promise<WeatherRegion[]> {
  return withMockFallback(() => api.get<WeatherRegion[]>('/api/weather/regions'), MOCK_REGIONS);
}

export function fetchForecast(regionCode: string): Promise<WeatherForecast> {
  return withMockFallback(
    () => api.get<WeatherForecast>(`/api/weather/forecast?regionCode=${regionCode}`),
    buildMockForecast(regionCode),
  );
}

export function setDefaultRegion(regionCode: string): Promise<void> {
  return withMockFallback(
    () => api.post<void>('/api/weather/regions/default', { regionCode }),
    undefined,
  );
}
