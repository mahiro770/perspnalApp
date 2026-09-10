import { api, withMockFallback } from '@/lib/api';
import { WeatherFavorite, WeatherForecast, WeatherRegion } from './types';
import {
  MOCK_REGIONS,
  buildMockForecast,
  mockAddFavorite,
  mockListFavorites,
  mockRemoveFavorite,
} from './mockData';

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

export function fetchFavorites(): Promise<WeatherFavorite[]> {
  return withMockFallback(() => api.get<WeatherFavorite[]>('/api/weather/favorites'), mockListFavorites());
}

export function addFavorite(regionCode: string): Promise<WeatherFavorite> {
  return withMockFallback(
    () => api.post<WeatherFavorite>('/api/weather/favorites', { regionCode }),
    mockAddFavorite(regionCode),
  );
}

export function removeFavorite(id: string): Promise<void> {
  return withMockFallback(() => api.delete<void>(`/api/weather/favorites/${id}`), mockRemoveFavorite(id));
}
