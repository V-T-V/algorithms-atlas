// Delaunay Triangulation · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'delaunay',
  categoryId: 'geometry',
  title: { zh: 'Delaunay三角剖分', en: 'Delaunay Triangulation' },
  summary: {
    zh: 'Delaunay三角剖分属于geometry类别。',
    en: 'Delaunay Triangulation is a geometry algorithm.',
  },
  description: {
    zh: 'Delaunay三角剖分（Delaunay Triangulation）属于geometry类别的算法。',
    en: 'Delaunay Triangulation is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n log n) optimal', space: 'O(n)' },
};
