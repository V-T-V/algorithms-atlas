// 角平分线方向 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-angle-bisector-dir',
  categoryId: 'geometry',
  title: { zh: '角平分线方向', en: 'Angle Bisector Direction' },
  summary: {
    zh: '求以顶点 V 为角的两条角平分线方向。',
    en: 'Angle bisector direction at vertex V.',
  },
  description: {
    zh: '把两边单位方向向量相加得到内角平分线方向（相减得外角平分线）。',
    en: 'Sum of unit direction vectors of the two edges gives the internal bisector direction.',
  },
  tags: ['geometry', 'angle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
