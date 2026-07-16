// Union-Find (DSU) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'union-find',
  categoryId: 'ds',
  title: { zh: '并查集', en: 'Union-Find (DSU)' },
  summary: {
    zh: '并查集属于ds类别。',
    en: 'Union-Find (DSU) is a ds algorithm.',
  },
  description: {
    zh: '并查集（Union-Find (DSU)）属于ds类别的算法。',
    en: 'Union-Find (DSU) is an algorithm in the ds category.',
  },
  tags: ["ds","searching","union-find"],
  complexity: { time: 'O(α(n)) 摊还 / amortized', space: 'O(n)' },
};
