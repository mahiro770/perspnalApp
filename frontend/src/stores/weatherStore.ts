import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherUiState {
  selectedRegionCode: string;
  setSelectedRegionCode: (code: string) => void;
}

// 初期値は東京地方(JMA地域コード)。/api/weather/regions/default 取得後に上書きされる想定
export const useWeatherStore = create<WeatherUiState>()(
  persist(
    (set) => ({
      selectedRegionCode: '130000',
      setSelectedRegionCode: (code) => set({ selectedRegionCode: code }),
    }),
    { name: 'kurashi-log-weather' },
  ),
);
