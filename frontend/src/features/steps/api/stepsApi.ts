import { api, withMockFallback } from '@/lib/api';
import { StepEntry, StepsGroupBy } from './types';
import { buildMockSteps } from './mockData';

export function fetchSteps(groupBy: StepsGroupBy): Promise<StepEntry[]> {
  return withMockFallback(
    () => api.get<StepEntry[]>(`/api/steps?groupBy=${groupBy}`),
    buildMockSteps(groupBy),
  );
}
