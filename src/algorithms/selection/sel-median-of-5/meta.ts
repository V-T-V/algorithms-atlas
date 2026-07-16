// 5 元中位数（Median of 5）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-median-of-5',
  categoryId: 'selection',
  title: { zh: '5 元中位数', en: 'Median of 5' },
  summary: {
    zh: '用最少比较（6 次）求 5 个数的中位数。',
    en: 'Find the median of 5 elements with minimal comparisons (6).',
  },
  description: {
    zh: '已知 5 元中位数至少需要 6 次比较。本实现用排序网络式分支结构精确求中位数。',
    en: 'The median of 5 needs at least 6 comparisons. This impl uses a sorting-network-style branching structure to compute it exactly.',
  },
  tags: ['selection', 'median', 'small-n', 'comparisons'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
