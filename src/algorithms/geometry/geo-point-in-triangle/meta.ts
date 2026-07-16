// 点在三角形内 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-point-in-triangle',
  categoryId: 'geometry',
  title: { zh: '点在三角形内', en: 'Point in Triangle' },
  summary: {
    zh: '判断点是否在三角形内部（含边界）。',
    en: 'Test if a point lies inside a triangle (boundary inclusive).',
  },
  description: {
    zh: '用重心坐标：u,v,w ≥ 0 则在内。',
    en: 'Using barycentric coordinates: u,v,w ≥ 0 means inside.',
  },
  tags: ['geometry', 'triangle', 'point-in-polygon'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
