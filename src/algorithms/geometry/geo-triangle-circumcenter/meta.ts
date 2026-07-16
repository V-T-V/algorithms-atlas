// 三角形外心 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-triangle-circumcenter',
  categoryId: 'geometry',
  title: { zh: '三角形外心', en: 'Triangle Circumcenter' },
  summary: { zh: '求三角形外接圆圆心。', en: 'Compute the circumcenter of a triangle.' },
  description: {
    zh: '外心是三边中垂线交点，到三顶点等距。用垂直平分线线性方程联立求解。',
    en: 'Circumcenter is the intersection of perpendicular bisectors; equidistant from all three vertices.',
  },
  tags: ['geometry', 'triangle', 'circle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
