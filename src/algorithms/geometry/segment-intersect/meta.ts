// Segment Intersection · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'segment-intersect',
  categoryId: 'geometry',
  title: { zh: '线段相交', en: 'Segment Intersection' },
  summary: {
    zh: '线段相交属于geometry类别。',
    en: 'Segment Intersection is a geometry algorithm.',
  },
  description: {
    zh: '线段相交（Segment Intersection）属于geometry类别的算法。',
    en: 'Segment Intersection is an algorithm in the geometry category.',
  },
  tags: ["geometry","range-query"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
