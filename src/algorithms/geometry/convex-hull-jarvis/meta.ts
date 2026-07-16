// Jarvis Convex Hull · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'convex-hull-jarvis',
  categoryId: 'geometry',
  title: { zh: 'Jarvis凸包', en: 'Jarvis Convex Hull' },
  summary: {
    zh: 'Jarvis凸包属于geometry类别。',
    en: 'Jarvis Convex Hull is a geometry algorithm.',
  },
  description: {
    zh: 'Jarvis凸包（Jarvis Convex Hull）属于geometry类别的算法。',
    en: 'Jarvis Convex Hull is an algorithm in the geometry category.',
  },
  tags: ["geometry","computational-geometry"],
  complexity: { time: 'O(nh)', space: 'O(h)' },
};
