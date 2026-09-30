export type StepsGroupBy = 'day' | 'month' | 'year';

export interface StepEntry {
  /** groupByにより 'YYYY-MM-DD' / 'YYYY-MM' / 'YYYY' */
  label: string;
  steps: number;
}
