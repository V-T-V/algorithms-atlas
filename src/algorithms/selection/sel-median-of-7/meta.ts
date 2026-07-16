// 7 元中位数（Median of 7）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-median-of-7',
  categoryId: 'selection',
  title: { zh: '7 元中位数', en: 'Median of 7' },
  summary: {
    zh: '通过排序网络求 7 个数的中位数。',
    en: 'Find the median of 7 elements via a sorting network.',
  },
  description: {
    zh: '7 元中位数最优比较次数约为 13。本实现用排序后取中位数（简单稳健）。',
    en: 'Median of 7 needs about 13 comparisons optimally. This impl sorts then takes the middle (simple and robust).',
  },
  tags: ['selection', 'median', 'small-n'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
