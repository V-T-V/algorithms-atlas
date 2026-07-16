// 线性分位数（Linear Quantile）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quantile-linear',
  categoryId: 'selection',
  title: { zh: '线性分位数', en: 'Linear Quantile' },
  summary: {
    zh: '线性分位数：q∈[0,1]，rank = q·(n−1)。',
    en: 'Linear quantile: q∈[0,1], rank = q·(n−1).',
  },
  description: {
    zh: '线性分位数与线性百分位等价，只是用 q∈[0,1] 而非 p∈[0,100]。',
    en: 'Linear quantile is equivalent to linear percentile, using q∈[0,1] instead of p∈[0,100].',
  },
  tags: ['selection', 'quantile', 'statistics', 'interpolation'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
