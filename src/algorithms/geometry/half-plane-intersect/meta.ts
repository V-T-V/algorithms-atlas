// Half-Plane Intersection · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'half-plane-intersect',
  categoryId: 'geometry',
  title: { zh: '半平面交', en: 'Half-Plane Intersection' },
  summary: {
    zh: '半平面交属于geometry类别。',
    en: 'Half-Plane Intersection is a geometry algorithm.',
  },
  description: {
    zh: '半平面交（Half-Plane Intersection）属于geometry类别的算法。',
    en: 'Half-Plane Intersection is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
