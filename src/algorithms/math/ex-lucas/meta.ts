// ExLucas · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ex-lucas',
  categoryId: 'math',
  title: { zh: '扩展Lucas', en: 'ExLucas' },
  summary: {
    zh: '扩展Lucas属于math类别。',
    en: 'ExLucas is a math algorithm.',
  },
  description: {
    zh: '扩展Lucas（ExLucas）属于math类别的算法。',
    en: 'ExLucas is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(M + log n · Σ p^q)', space: 'O(M)' },
};
