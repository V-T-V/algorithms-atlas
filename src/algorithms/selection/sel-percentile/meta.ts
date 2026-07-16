// 百分位数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-percentile',
  categoryId: 'selection',
  title: { zh: '百分位数', en: 'Percentile' },
  summary: {
    zh: '排序后用线性插值求第 p 百分位（p∈[0,100]）。',
    en: 'Sort then linearly interpolate to compute the p-th percentile (p∈[0,100]).',
  },
  description: {
    zh: '百分位数（NumPy linear 方法）：先排序，计算 rank = p/100*(n-1)，结果 = lower + frac*(upper-lower)。中位数即 p=50。',
    en: 'Percentile (NumPy linear method): sort, compute rank = p/100*(n-1), result = lower + frac*(upper-lower). The median is p=50.',
  },
  tags: ['selection', 'percentile', 'statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
