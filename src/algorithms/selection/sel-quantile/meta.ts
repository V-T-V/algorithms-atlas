// 分位数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quantile',
  categoryId: 'selection',
  title: { zh: '分位数（q-quantile）', en: 'Quantile' },
  summary: {
    zh: '把数据等分为 q 份，返回 q-1 个切点。',
    en: 'Split data into q equal parts, returning q-1 cut points.',
  },
  description: {
    zh: '分位数：把排序数据分成 q 个等概率的区间，返回各切点位置。如 q=4 即四分位、q=10 为十分位、q=100 为百分位。用线性插值。',
    en: 'Quantiles split sorted data into q equal-probability intervals, returning the cut points. q=4 gives quartiles, q=10 deciles, q=100 percentiles. Uses linear interpolation.',
  },
  tags: ['selection', 'quantile', 'statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
