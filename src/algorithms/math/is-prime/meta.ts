// Is Prime · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'is-prime',
  categoryId: 'math',
  title: { zh: '素数判定', en: 'Is Prime' },
  summary: {
    zh: '素数判定属于math类别。',
    en: 'Is Prime is a math algorithm.',
  },
  description: {
    zh: '素数判定（Is Prime）属于math类别的算法。',
    en: 'Is Prime is an algorithm in the math category.',
  },
  tags: ["math","mst","greedy","number-theory"],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
