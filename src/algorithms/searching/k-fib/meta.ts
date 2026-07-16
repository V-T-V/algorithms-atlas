// K-th Fibonacci · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'k-fib',
  categoryId: 'searching',
  title: { zh: '第 k 个斐波那契数', en: 'K-th Fibonacci' },
  summary: {
    zh: '第 k 个斐波那契数属于searching类别。',
    en: 'K-th Fibonacci is a searching algorithm.',
  },
  description: {
    zh: '第 k 个斐波那契数（K-th Fibonacci）属于searching类别的算法。',
    en: 'K-th Fibonacci is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
