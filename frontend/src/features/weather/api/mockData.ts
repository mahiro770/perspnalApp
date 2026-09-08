import { DailyForecast, HourlyForecast, WeatherCondition, WeatherForecast, WeatherRegion } from './types';

export const MOCK_REGIONS: WeatherRegion[] = [
  { code: '016000', name: '石狩・空知・後志地方' },
  { code: '040010', name: '宮城県東部' },
  { code: '130000', name: '東京地方' },
  { code: '140000', name: '神奈川県東部' },
  { code: '230000', name: '愛知県西部' },
  { code: '270000', name: '大阪府' },
  { code: '400010', name: '福岡県福岡地方' },
  { code: '471000', name: '沖縄本島地方' },
];

const CONDITION_CYCLE: WeatherCondition[] = [
  'sunny',
  'sunny',
  'partly-cloudy',
  'cloudy',
  'rainy',
  'partly-cloudy',
  'sunny',
];

function seededCondition(seed: number): WeatherCondition {
  return CONDITION_CYCLE[seed % CONDITION_CYCLE.length];
}

function buildHourly(baseTemp: number): HourlyForecast[] {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now);
    time.setHours(now.getHours() + i);
    const hour = time.getHours();
    // 日中に気温が上がり、夜間に下がるおおまかなカーブ
    const diurnal = Math.round(Math.sin(((hour - 6) / 24) * Math.PI * 2) * 4);
    return {
      time: time.toISOString(),
      temp: baseTemp + diurnal,
      precipitationProbability: [0, 0, 10, 10, 20, 30, 40, 20, 10, 0][i % 10],
      condition: seededCondition(i + hour),
    };
  });
}

function buildWeekly(baseHigh: number, baseLow: number): DailyForecast[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const wobble = (i % 3) - 1;
    return {
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      high: baseHigh + wobble,
      low: baseLow + wobble,
      precipitationProbability: [10, 30, 60, 20, 0, 40, 10][i],
      condition: seededCondition(i),
    };
  });
}

const REGION_BASE_TEMP: Record<string, { high: number; low: number }> = {
  '016000': { high: 24, low: 16 },
  '040010': { high: 27, low: 19 },
  '130000': { high: 30, low: 23 },
  '140000': { high: 29, low: 23 },
  '230000': { high: 31, low: 24 },
  '270000': { high: 32, low: 25 },
  '400010': { high: 31, low: 25 },
  '471000': { high: 31, low: 27 },
};

export function buildMockForecast(regionCode: string): WeatherForecast {
  const region = MOCK_REGIONS.find((r) => r.code === regionCode) ?? MOCK_REGIONS[2];
  const base = REGION_BASE_TEMP[region.code] ?? { high: 28, low: 21 };

  return {
    regionCode: region.code,
    regionName: region.name,
    updatedAt: new Date().toISOString(),
    current: {
      temp: base.high - 2,
      feelsLike: base.high - 1,
      humidity: 68,
      condition: seededCondition(new Date().getHours()),
    },
    hourly: buildHourly(base.high - 2),
    weekly: buildWeekly(base.high, base.low),
  };
}
