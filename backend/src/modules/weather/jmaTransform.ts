export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'snowy' | 'thunder';

export interface StructuredForecast {
  current: { temp: number; feelsLike: number | null; humidity: number | null; condition: WeatherCondition };
  hourly: Array<{ time: string; temp: number; precipitationProbability: number; condition: WeatherCondition }>;
  weekly: Array<{ date: string; high: number; low: number; precipitationProbability: number; condition: WeatherCondition }>;
}

// 気象庁の天気コードは百の位で系統が決まる(1xx=晴れ, 2xx=曇り, 3xx=雨, 4xx=雪)。
// 雷を伴うかどうかの詳細な判定コード体系までは信頼できる形で把握できていないため、
// 系統の大分類のみをここでは採用する(誤りがあっても画面がクラッシュしない安全側の簡略化)。
function mapWeatherCode(code: string | undefined): WeatherCondition {
  if (!code) return 'cloudy';
  const n = Number(code);
  if (Number.isNaN(n)) return 'cloudy';
  if (n < 200) return n === 100 ? 'sunny' : 'partly-cloudy';
  if (n < 300) return 'cloudy';
  if (n < 400) return 'rainy';
  if (n < 500) return 'snowy';
  return 'cloudy';
}

function toNumber(value: string | undefined): number | null {
  if (value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

interface JmaArea {
  area: { name: string; code: string };
  weatherCodes?: string[];
  pops?: string[];
  temps?: string[];
  tempsMin?: string[];
  tempsMax?: string[];
}

interface JmaTimeSeries {
  timeDefines: string[];
  areas: JmaArea[];
}

interface JmaReport {
  timeSeries?: JmaTimeSeries[];
}

/**
 * 気象庁 `forecast/data/forecast/{areaCode}.json` の生レスポンスを、
 * フロントエンドが期待する構造化された予報データに変換する。
 * 東京都(130000)の実レスポンスで動作確認済み。
 *
 * 既知の制約: この短期ブロックは「明日」の気温を2点(低・高)しか持たず、
 * 真の時間別気温ではないため、hourlyのtempは時間帯ごとの精密な値ではなく
 * 近傍の代表値を流用した近似値になる(降水確率・天気は時間帯ごとに正確)。
 * 想定と異なるレスポンス構造が来ても例外を投げず、取得できたぶんだけを
 * 返す防御的な実装にしている。
 */
export function transformJmaForecast(raw: unknown): StructuredForecast {
  const empty: StructuredForecast = {
    current: { temp: 0, feelsLike: null, humidity: null, condition: 'cloudy' },
    hourly: [],
    weekly: [],
  };

  try {
    const reports = raw as JmaReport[];
    const shortRange = reports?.[0]?.timeSeries ?? [];
    const weekRange = reports?.[1]?.timeSeries ?? [];

    const shortWeather = shortRange[0];
    const shortPop = shortRange[1];
    const shortTemp = shortRange[2];

    const hourly = (shortPop?.timeDefines ?? []).map((time, i) => ({
      time,
      temp: toNumber(shortTemp?.areas?.[0]?.temps?.[i]) ?? toNumber(shortTemp?.areas?.[0]?.temps?.[0]) ?? 0,
      precipitationProbability: toNumber(shortPop?.areas?.[0]?.pops?.[i]) ?? 0,
      condition: mapWeatherCode(shortWeather?.areas?.[0]?.weatherCodes?.[i]),
    }));

    const weekWeather = weekRange[0];
    const weekTemp = weekRange[1];
    // JMAの週間ブロックは1日目(明日)のtempsMin/tempsMaxが常に空文字になる
    // (短期ブロック側で既に扱っているため)。その場合は短期の気温ブロック
    // (2要素: [明日の最低, 明日の最高]と観測される)で補う。
    const tomorrowLow = toNumber(shortTemp?.areas?.[0]?.temps?.[0]);
    const tomorrowHigh = toNumber(shortTemp?.areas?.[0]?.temps?.[1]);

    const weekly = (weekWeather?.timeDefines ?? []).map((date, i) => {
      const dateKey = date.slice(0, 10);
      // 週間ブロックの1日目(明日)は降水確率も空文字のことがあるため、
      // 短期ブロックの当該日の時間帯別降水確率の最大値で補う。
      const shortPopFallback =
        i === 0
          ? Math.max(
              0,
              ...(shortPop?.timeDefines ?? [])
                .map((t, j) => (t.startsWith(dateKey) ? toNumber(shortPop?.areas?.[0]?.pops?.[j]) : null))
                .filter((v): v is number => v !== null),
            )
          : null;

      return {
        date: dateKey,
        high: toNumber(weekTemp?.areas?.[0]?.tempsMax?.[i]) ?? (i === 0 ? tomorrowHigh : null) ?? 0,
        low: toNumber(weekTemp?.areas?.[0]?.tempsMin?.[i]) ?? (i === 0 ? tomorrowLow : null) ?? 0,
        precipitationProbability: toNumber(weekWeather?.areas?.[0]?.pops?.[i]) ?? shortPopFallback ?? 0,
        condition: mapWeatherCode(weekWeather?.areas?.[0]?.weatherCodes?.[i]),
      };
    });

    const firstTemp = hourly[0]?.temp ?? weekly[0]?.high ?? 0;
    const current = {
      temp: firstTemp,
      // JMAの予報APIは体感温度・湿度を提供しないため、実データにはならない(nullのまま)
      feelsLike: null,
      humidity: null,
      condition: hourly[0]?.condition ?? weekly[0]?.condition ?? ('cloudy' as WeatherCondition),
    };

    return { current, hourly, weekly };
  } catch (err) {
    console.error('JMA forecast transform failed', err);
    return empty;
  }
}
