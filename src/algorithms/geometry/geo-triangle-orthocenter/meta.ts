// 三角形垂心 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-triangle-orthocenter',
  categoryId: 'geometry',
  title: { zh: '三角形垂心', en: 'Triangle Orthocenter' },
  summary: { zh: '求三角形垂心（三高线交点）。', en: 'Compute the orthocenter of a triangle.' },
  description: {
    zh: '垂心是三条高线的交点。利用关系：H = A+B+C - 2*O（O 为外心），或直接解高线方程。',
    en: 'Orthocenter is the intersection of altitudes.',
  },
  tags: ['geometry', 'triangle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
