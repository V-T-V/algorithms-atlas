// Union-Find by Rank · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'union-find-rank',
  categoryId: 'ds',
  title: { zh: '按秩并查集', en: 'Union-Find by Rank' },
  summary: {
    zh: '按秩并查集属于ds类别。',
    en: 'Union-Find by Rank is a ds algorithm.',
  },
  description: {
    zh: '按秩并查集（Union-Find by Rank）属于ds类别的算法。',
    en: 'Union-Find by Rank is an algorithm in the ds category.',
  },
  tags: ["ds","searching","union-find"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
