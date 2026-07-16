// Fibonacci · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci',
  categoryId: 'recursion',
  title: { zh: '斐波那契', en: 'Fibonacci' },
  summary: {
    zh: '斐波那契属于recursion类别。',
    en: 'Fibonacci is a recursion algorithm.',
  },
  description: {
    zh: '斐波那契（Fibonacci）属于recursion类别的算法。',
    en: 'Fibonacci is an algorithm in the recursion category.',
  },
  tags: ["recursion"],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
