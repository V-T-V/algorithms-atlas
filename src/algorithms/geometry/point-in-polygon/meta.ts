// Point in Polygon · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'point-in-polygon',
  categoryId: 'geometry',
  title: { zh: '点在多边形内', en: 'Point in Polygon' },
  summary: {
    zh: '点在多边形内属于geometry类别。',
    en: 'Point in Polygon is a geometry algorithm.',
  },
  description: {
    zh: '点在多边形内（Point in Polygon）属于geometry类别的算法。',
    en: 'Point in Polygon is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
