// 四分位数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quartile',
  categoryId: 'selection',
  title: { zh: '四分位数', en: 'Quartiles (Q1, Q2, Q3)' },
  summary: {
    zh: 'Q1=25%分位、Q2=中位数、Q3=75%分位。',
    en: 'Q1=25th percentile, Q2=median, Q3=75th percentile.',
  },
  description: {
    zh: '四分位数把排序数据分成四等份：Q1（下四分位）、Q2（中位数）、Q3（上四分位）。用线性插值法（与百分位一致）。',
    en: 'Quartiles split sorted data into quarters: Q1 (lower), Q2 (median), Q3 (upper). Uses the same linear interpolation as the percentile method.',
  },
  tags: ['selection', 'quartile', 'statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
