// Prufer Code · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'prufer',
  categoryId: 'graph',
  title: { zh: 'Prufer编码', en: 'Prufer Code' },
  summary: {
    zh: 'Prufer编码属于graph类别。',
    en: 'Prufer Code is a graph algorithm.',
  },
  description: {
    zh: 'Prufer编码（Prufer Code）属于graph类别的算法。',
    en: 'Prufer Code is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
