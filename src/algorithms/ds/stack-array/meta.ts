// Stack (Array) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stack-array',
  categoryId: 'ds',
  title: { zh: '数组栈', en: 'Stack (Array)' },
  summary: {
    zh: '数组栈属于ds类别。',
    en: 'Stack (Array) is a ds algorithm.',
  },
  description: {
    zh: '数组栈（Stack (Array)）属于ds类别的算法。',
    en: 'Stack (Array) is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(1) push/pop (均摊)', space: 'O(n)' },
};
