// Interval Cover · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'interval-cover',
  categoryId: 'greedy',
  title: { zh: '区间覆盖', en: 'Interval Cover' },
  summary: {
    zh: '区间覆盖属于greedy类别。',
    en: 'Interval Cover is a greedy algorithm.',
  },
  description: {
    zh: '区间覆盖（Interval Cover）属于greedy类别的算法。',
    en: 'Interval Cover is an algorithm in the greedy category.',
  },
  tags: ["greedy"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
