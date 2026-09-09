export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'snowy' | 'thunder';

export interface WeatherRegion {
  code: string;
  name: string;
}

export interface HourlyForecast {
  /** ISO日時文字列 */
  time: string;
  temp: number;
  precipitationProbability: number;
  condition: WeatherCondition;
}

export interface DailyForecast {
  /** YYYY-MM-DD */
  date: string;
  high: number;
  low: number;
  precipitationProbability: number;
  condition: WeatherCondition;
}

export interface WeatherForecast {
  regionCode: string;
  regionName: string;
  updatedAt: string;
  /** 気象庁への取得に失敗し、直近の有効なキャッシュを返している場合はtrue */
  stale: boolean;
  current: {
    temp: number;
    // 気象庁の予報APIは体感温度・湿度を提供しないため、実データ接続時はnullになりうる
    feelsLike: number | null;
    humidity: number | null;
    condition: WeatherCondition;
  };
  hourly: HourlyForecast[];
  weekly: DailyForecast[];
}
