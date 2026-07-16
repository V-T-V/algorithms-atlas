// Skip List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'skip-list',
  categoryId: 'ds',
  title: { zh: '跳表', en: 'Skip List' },
  summary: {
    zh: '跳表属于ds类别。',
    en: 'Skip List is a ds algorithm.',
  },
  description: {
    zh: '跳表（Skip List）属于ds类别的算法。',
    en: 'Skip List is an algorithm in the ds category.',
  },
  tags: ["ds","dynamic-programming","linked-list"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
