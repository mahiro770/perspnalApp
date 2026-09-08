import { ExternalApiError } from '../../core/errors';

const BASE_URL = 'https://www.jma.go.jp/bosai/forecast/data/forecast';

export async function fetchJmaForecast(areaCode: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}/${areaCode}.json`, {
    headers: { 'User-Agent': 'kurashi-log/1.0 (personal weather+calendar+budget app)' },
  });

  if (!response.ok) {
    throw new ExternalApiError(`JMA forecast fetch failed for ${areaCode}: ${response.status}`);
  }

  return response.json();
}
