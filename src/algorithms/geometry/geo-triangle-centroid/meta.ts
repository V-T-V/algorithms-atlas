// 三角形重心 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-triangle-centroid',
  categoryId: 'geometry',
  title: { zh: '三角形重心', en: 'Triangle Centroid' },
  summary: { zh: '求三角形重心（三中线交点）。', en: 'Compute the centroid of a triangle.' },
  description: {
    zh: '重心 = (A+B+C)/3，是三条中线的交点，把每条中线分为 2:1。',
    en: 'Centroid = (A+B+C)/3, intersection of medians, divides each in 2:1.',
  },
  tags: ['geometry', 'triangle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
