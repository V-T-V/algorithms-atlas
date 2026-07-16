// 就近分位数（Nearest Quantile）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quantile-nearest',
  categoryId: 'selection',
  title: { zh: '就近分位数', en: 'Nearest Quantile' },
  summary: {
    zh: '就近分位数：rank = ceil(q·n)。',
    en: 'Nearest quantile: rank = ceil(q·n).',
  },
  description: {
    zh: '就近分位数与就近百分位等价，用 q∈[0,1]。',
    en: 'Nearest quantile is equivalent to nearest-rank percentile, using q∈[0,1].',
  },
  tags: ['selection', 'quantile', 'statistics', 'nearest'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
