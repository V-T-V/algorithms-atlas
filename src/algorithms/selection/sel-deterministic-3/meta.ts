// 确定性选择 v3（Deterministic Select v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-deterministic-3',
  categoryId: 'selection',
  title: { zh: '确定性选择 v3', en: 'Deterministic Select v3' },
  summary: {
    zh: '线性时间确定性选择：递归中位数的中位数做 pivot。',
    en: 'Linear-time deterministic select: recurse on median-of-medians pivot.',
  },
  description: {
    zh: 'BFPRT 算法：把数组按 5 分组，每组取中位数，递归求中位数的中位数作 pivot，保证最坏 O(n)。',
    en: 'BFPRT algorithm: split into groups of 5, take each median, recurse to find median-of-medians as pivot, guaranteeing worst-case O(n).',
  },
  tags: ['selection', 'order-statistics', 'deterministic', 'linear', 'median-of-medians'],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
