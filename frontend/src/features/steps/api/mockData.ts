import { toDateKey } from '@/lib/date';
import { StepEntry, StepsGroupBy } from './types';

// 日によって歩数が変動するように見せるための簡易な疑似乱数(実装は再現可能なシードベース)
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildDaily(): StepEntry[] {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    const base = 6000 + Math.round(pseudoRandom(d.getDate() + d.getMonth() * 31) * 6000);
    return { label: toDateKey(d), steps: base };
  });
}

function buildMonthly(): StepEntry[] {
  const now = new Date();
  return Array.from({ length: now.getMonth() + 1 }, (_, i) => {
    const label = `${now.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
    const base = 180000 + Math.round(pseudoRandom(i + 1) * 90000);
    return { label, steps: base };
  });
}

function buildYearly(): StepEntry[] {
  const now = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const year = now.getFullYear() - 4 + i;
    const base = 2000000 + Math.round(pseudoRandom(year) * 800000);
    return { label: String(year), steps: base };
  });
}

export function buildMockSteps(groupBy: StepsGroupBy): StepEntry[] {
  if (groupBy === 'month') return buildMonthly();
  if (groupBy === 'year') return buildYearly();
  return buildDaily();
}
