import { Cloud, CloudDrizzle, CloudLightning, CloudSnow, CloudSun, Sun, type LucideIcon } from 'lucide-react';
import { WeatherCondition } from '../api/types';

export const WEATHER_ICON: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rainy: CloudDrizzle,
  snowy: CloudSnow,
  thunder: CloudLightning,
};

export const WEATHER_LABEL: Record<WeatherCondition, string> = {
  sunny: '晴れ',
  'partly-cloudy': '晴れ時々曇り',
  cloudy: '曇り',
  rainy: '雨',
  snowy: '雪',
  thunder: '雷雨',
};

export function WeatherIcon({ condition, className }: { condition: WeatherCondition; className?: string }) {
  const Icon = WEATHER_ICON[condition];
  return <Icon className={className} strokeWidth={1.75} />;
}
