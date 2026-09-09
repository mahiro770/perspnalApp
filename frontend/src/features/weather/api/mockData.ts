import { DailyForecast, HourlyForecast, WeatherCondition, WeatherForecast, WeatherRegion } from './types';

// 気象庁の地域マスタと突き合わせた47都道府県ぶんのコード。バックエンドの
// regionCodes.ts と同じ内容(未接続時のモックフォールバック用に同梱)。
export const MOCK_REGIONS: WeatherRegion[] = [
  { code: '016000', name: '北海道(石狩・空知・後志地方)' },
  { code: '020000', name: '青森県' },
  { code: '030000', name: '岩手県' },
  { code: '040000', name: '宮城県' },
  { code: '050000', name: '秋田県' },
  { code: '060000', name: '山形県' },
  { code: '070000', name: '福島県' },
  { code: '080000', name: '茨城県' },
  { code: '090000', name: '栃木県' },
  { code: '100000', name: '群馬県' },
  { code: '110000', name: '埼玉県' },
  { code: '120000', name: '千葉県' },
  { code: '130000', name: '東京都' },
  { code: '140000', name: '神奈川県' },
  { code: '150000', name: '新潟県' },
  { code: '160000', name: '富山県' },
  { code: '170000', name: '石川県' },
  { code: '180000', name: '福井県' },
  { code: '190000', name: '山梨県' },
  { code: '200000', name: '長野県' },
  { code: '210000', name: '岐阜県' },
  { code: '220000', name: '静岡県' },
  { code: '230000', name: '愛知県' },
  { code: '240000', name: '三重県' },
  { code: '250000', name: '滋賀県' },
  { code: '260000', name: '京都府' },
  { code: '270000', name: '大阪府' },
  { code: '280000', name: '兵庫県' },
  { code: '290000', name: '奈良県' },
  { code: '300000', name: '和歌山県' },
  { code: '310000', name: '鳥取県' },
  { code: '320000', name: '島根県' },
  { code: '330000', name: '岡山県' },
  { code: '340000', name: '広島県' },
  { code: '350000', name: '山口県' },
  { code: '360000', name: '徳島県' },
  { code: '370000', name: '香川県' },
  { code: '380000', name: '愛媛県' },
  { code: '390000', name: '高知県' },
  { code: '400000', name: '福岡県' },
  { code: '410000', name: '佐賀県' },
  { code: '420000', name: '長崎県' },
  { code: '430000', name: '熊本県' },
  { code: '440000', name: '大分県' },
  { code: '450000', name: '宮崎県' },
  { code: '460100', name: '鹿児島県(奄美地方除く)' },
  { code: '471000', name: '沖縄県(沖縄本島地方)' },
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
  '040000': { high: 27, low: 19 },
  '130000': { high: 30, low: 23 },
  '140000': { high: 29, low: 23 },
  '230000': { high: 31, low: 24 },
  '270000': { high: 32, low: 25 },
  '400000': { high: 31, low: 25 },
  '471000': { high: 31, low: 27 },
};

export function buildMockForecast(regionCode: string): WeatherForecast {
  const region = MOCK_REGIONS.find((r) => r.code === regionCode) ?? MOCK_REGIONS[12];
  const base = REGION_BASE_TEMP[region.code] ?? { high: 28, low: 21 };

  return {
    regionCode: region.code,
    regionName: region.name,
    updatedAt: new Date().toISOString(),
    stale: false,
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
