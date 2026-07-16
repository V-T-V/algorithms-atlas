// 多边形周长 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-perimeter',
  categoryId: 'geometry',
  title: { zh: '多边形周长', en: 'Polygon Perimeter' },
  summary: { zh: '求简单多边形周长。', en: 'Perimeter of a simple polygon.' },
  description: {
    zh: '依次累加相邻顶点间欧氏距离，闭合（首尾相连）。',
    en: 'Sum of consecutive vertex distances, closing the loop.',
  },
  tags: ['geometry', 'polygon'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
