// Voronoi Diagram · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'voronoi',
  categoryId: 'geometry',
  title: { zh: 'Voronoi图', en: 'Voronoi Diagram' },
  summary: {
    zh: 'Voronoi图属于geometry类别。',
    en: 'Voronoi Diagram is a geometry algorithm.',
  },
  description: {
    zh: 'Voronoi图（Voronoi Diagram）属于geometry类别的算法。',
    en: 'Voronoi Diagram is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
