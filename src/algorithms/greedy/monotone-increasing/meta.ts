// Monotone Increasing Digits · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monotone-increasing',
  categoryId: 'greedy',
  title: { zh: '单调递增数字', en: 'Monotone Increasing Digits' },
  summary: {
    zh: '单调递增数字属于greedy类别。',
    en: 'Monotone Increasing Digits is a greedy algorithm.',
  },
  description: {
    zh: '单调递增数字（Monotone Increasing Digits）属于greedy类别的算法。',
    en: 'Monotone Increasing Digits is an algorithm in the greedy category.',
  },
  tags: ["greedy"],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
