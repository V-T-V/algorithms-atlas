// Convex Polygon Check · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'convex-polygon',
  categoryId: 'geometry',
  title: { zh: '凸多边形判定', en: 'Convex Polygon Check' },
  summary: {
    zh: '凸多边形判定属于geometry类别。',
    en: 'Convex Polygon Check is a geometry algorithm.',
  },
  description: {
    zh: '凸多边形判定（Convex Polygon Check）属于geometry类别的算法。',
    en: 'Convex Polygon Check is an algorithm in the geometry category.',
  },
  tags: ["geometry","computational-geometry"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
