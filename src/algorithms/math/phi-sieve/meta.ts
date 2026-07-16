// Phi Sieve · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'phi-sieve',
  categoryId: 'math',
  title: { zh: '欧拉函数筛', en: 'Phi Sieve' },
  summary: {
    zh: '欧拉函数筛属于math类别。',
    en: 'Phi Sieve is a math algorithm.',
  },
  description: {
    zh: '欧拉函数筛（Phi Sieve）属于math类别的算法。',
    en: 'Phi Sieve is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
