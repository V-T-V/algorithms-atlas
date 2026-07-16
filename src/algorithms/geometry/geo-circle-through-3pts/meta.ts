// 三点定圆 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-circle-through-3pts',
  categoryId: 'geometry',
  title: { zh: '三点定圆', en: 'Circle Through Three Points' },
  summary: {
    zh: '过三点求唯一圆（同外心）。',
    en: 'Find the unique circle passing through three points.',
  },
  description: {
    zh: '三点不共线时存在唯一外接圆；圆心即外心，半径=圆心到任一顶点距离。',
    en: 'For three non-collinear points, the unique circumcircle has center = circumcenter.',
  },
  tags: ['geometry', 'circle', 'triangle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
