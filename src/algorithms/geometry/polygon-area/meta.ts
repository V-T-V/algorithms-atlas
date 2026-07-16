// Polygon Area (Shoelace) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polygon-area',
  categoryId: 'geometry',
  title: { zh: '多边形面积', en: 'Polygon Area (Shoelace)' },
  summary: {
    zh: '多边形面积属于geometry类别。',
    en: 'Polygon Area (Shoelace) is a geometry algorithm.',
  },
  description: {
    zh: '多边形面积（Polygon Area (Shoelace)）属于geometry类别的算法。',
    en: 'Polygon Area (Shoelace) is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
