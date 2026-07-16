// Extended Euclidean · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ext-gcd',
  categoryId: 'math',
  title: { zh: '扩展欧几里得', en: 'Extended Euclidean' },
  summary: {
    zh: '扩展欧几里得属于math类别。',
    en: 'Extended Euclidean is a math algorithm.',
  },
  description: {
    zh: '扩展欧几里得（Extended Euclidean）属于math类别的算法。',
    en: 'Extended Euclidean is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(log(min(a, b)))', space: 'O(1)' },
};
