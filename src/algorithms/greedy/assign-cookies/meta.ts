// Assign Cookies · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'assign-cookies',
  categoryId: 'greedy',
  title: { zh: '分发饼干', en: 'Assign Cookies' },
  summary: {
    zh: '分发饼干属于greedy类别。',
    en: 'Assign Cookies is a greedy algorithm.',
  },
  description: {
    zh: '分发饼干（Assign Cookies）属于greedy类别的算法。',
    en: 'Assign Cookies is an algorithm in the greedy category.',
  },
  tags: ["greedy"],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
