// Polygon Centroid · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polygon-centroid',
  categoryId: 'geometry',
  title: { zh: '多边形重心', en: 'Polygon Centroid' },
  summary: {
    zh: '多边形重心属于geometry类别。',
    en: 'Polygon Centroid is a geometry algorithm.',
  },
  description: {
    zh: '多边形重心（Polygon Centroid）属于geometry类别的算法。',
    en: 'Polygon Centroid is an algorithm in the geometry category.',
  },
  tags: ["geometry","tree-decomposition"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
