import { useQuery } from '@tanstack/react-query';
import { StepsGroupBy } from '../api/types';
import { fetchSteps } from '../api/stepsApi';

export function useSteps(groupBy: StepsGroupBy) {
  return useQuery({
    queryKey: ['steps', groupBy],
    queryFn: () => fetchSteps(groupBy),
    staleTime: 5 * 60 * 1000,
  });
}
