// Sqrt Decomposition · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sqrt-decomposition',
  categoryId: 'math',
  title: { zh: '分块', en: 'Sqrt Decomposition' },
  summary: {
    zh: '分块属于math类别。',
    en: 'Sqrt Decomposition is a math algorithm.',
  },
  description: {
    zh: '分块（Sqrt Decomposition）属于math类别的算法。',
    en: 'Sqrt Decomposition is an algorithm in the math category.',
  },
  tags: ["math","range-query"],
  complexity: { time: 'O(√n) per query', space: 'O(n)' },
};
