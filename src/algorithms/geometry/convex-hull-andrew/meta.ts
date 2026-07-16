// Andrew Convex Hull · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'convex-hull-andrew',
  categoryId: 'geometry',
  title: { zh: 'Andrew凸包', en: 'Andrew Convex Hull' },
  summary: {
    zh: 'Andrew凸包属于geometry类别。',
    en: 'Andrew Convex Hull is a geometry algorithm.',
  },
  description: {
    zh: 'Andrew凸包（Andrew Convex Hull）属于geometry类别的算法。',
    en: 'Andrew Convex Hull is an algorithm in the geometry category.',
  },
  tags: ["geometry","computational-geometry"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
