// Convex Hull (Graham Scan) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'convex-hull',
  categoryId: 'geometry',
  title: { zh: '凸包 Graham 扫描', en: 'Convex Hull (Graham Scan)' },
  summary: {
    zh: '凸包 Graham 扫描属于geometry类别。',
    en: 'Convex Hull (Graham Scan) is a geometry algorithm.',
  },
  description: {
    zh: '凸包 Graham 扫描（Convex Hull (Graham Scan)）属于geometry类别的算法。',
    en: 'Convex Hull (Graham Scan) is an algorithm in the geometry category.',
  },
  tags: ["geometry","computational-geometry"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
