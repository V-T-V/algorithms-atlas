// Sieve of Eratosthenes · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sieve-eratosthenes',
  categoryId: 'math',
  title: { zh: '埃拉托斯特尼筛', en: 'Sieve of Eratosthenes' },
  summary: {
    zh: '埃拉托斯特尼筛属于math类别。',
    en: 'Sieve of Eratosthenes is a math algorithm.',
  },
  description: {
    zh: '埃拉托斯特尼筛（Sieve of Eratosthenes）属于math类别的算法。',
    en: 'Sieve of Eratosthenes is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
