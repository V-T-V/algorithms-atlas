// Closest Pair · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'closest-pair',
  categoryId: 'geometry',
  title: { zh: '最近点对', en: 'Closest Pair' },
  summary: {
    zh: '最近点对属于geometry类别。',
    en: 'Closest Pair is a geometry algorithm.',
  },
  description: {
    zh: '最近点对（Closest Pair）属于geometry类别的算法。',
    en: 'Closest Pair is an algorithm in the geometry category.',
  },
  tags: ["geometry","computational-geometry"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
