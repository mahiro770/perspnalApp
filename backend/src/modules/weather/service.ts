import { ExternalApiError, ValidationError } from '../../core/errors';
import type { Db } from '../../db';
import { fetchJmaForecast } from './jmaClient';
import { transformJmaForecast } from './jmaTransform';
import * as repo from './repository';
import { REGION_CODES } from './regionCodes';

const CACHE_TTL_MS = 60 * 60 * 1000; // cronの取得間隔(30分〜1時間)に合わせた目安値
const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // これを超えたキャッシュはオンデマンド再取得の対象

export function listRegions() {
  return REGION_CODES;
}

function findRegionName(areaCode: string): string | null {
  return REGION_CODES.find((r) => r.code === areaCode)?.name ?? null;
}

async function fetchAndCache(db: Db, areaCode: string) {
  const payload = await fetchJmaForecast(areaCode);
  const now = new Date();
  return repo.upsertCache(db, areaCode, 'forecast', JSON.stringify(payload), now, new Date(now.getTime() + CACHE_TTL_MS));
}

function toForecastDto(areaCode: string, fetchedAt: Date, rawPayload: string, stale: boolean) {
  const structured = transformJmaForecast(JSON.parse(rawPayload));
  return {
    regionCode: areaCode,
    regionName: findRegionName(areaCode) ?? areaCode,
    updatedAt: fetchedAt,
    stale,
    ...structured,
  };
}

export async function getForecast(db: Db, userId: string, regionCodeParam?: string) {
  let areaCode = regionCodeParam;
  if (!areaCode) {
    const primary = await repo.getPrimaryLocation(db, userId);
    if (!primary) throw new ValidationError('regionCode is required (no default region set)');
    areaCode = primary.areaCode;
  }

  const cached = await repo.getCache(db, areaCode, 'forecast');
  const isFresh = cached && Date.now() - cached.fetchedAt.getTime() <= STALE_THRESHOLD_MS;

  if (isFresh && cached) {
    return toForecastDto(areaCode, cached.fetchedAt, cached.rawPayload, false);
  }

  try {
    const fresh = await fetchAndCache(db, areaCode);
    return toForecastDto(areaCode, fresh.fetchedAt, fresh.rawPayload, false);
  } catch (err) {
    // 可用性優先: 取得に失敗しても直近キャッシュがあればそれを返す
    if (cached) {
      return toForecastDto(areaCode, cached.fetchedAt, cached.rawPayload, true);
    }
    throw err instanceof ExternalApiError ? err : new ExternalApiError('failed to fetch forecast');
  }
}

export async function setDefaultRegion(db: Db, userId: string, regionCode: string) {
  const name = findRegionName(regionCode);
  if (!name) throw new ValidationError('unknown regionCode');
  return repo.setPrimaryLocation(db, userId, regionCode, name);
}

export async function refreshAllCachedRegions(db: Db) {
  const locations = await repo.listAllLocations(db);
  const areaCodes = new Set(locations.map((l) => l.areaCode));

  const results = await Promise.allSettled(Array.from(areaCodes).map((code) => fetchAndCache(db, code)));
  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(`weather refresh: ${failures.length}/${areaCodes.size} region(s) failed`);
  }
}
