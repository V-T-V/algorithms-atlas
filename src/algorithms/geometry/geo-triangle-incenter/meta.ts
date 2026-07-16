// 三角形内心 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-triangle-incenter',
  categoryId: 'geometry',
  title: { zh: '三角形内心', en: 'Triangle Incenter' },
  summary: { zh: '求三角形内切圆圆心。', en: 'Compute the incenter of a triangle.' },
  description: {
    zh: '内心是三条角平分线交点，到三边等距。坐标按边长加权平均：I = (aA+bB+cC)/(a+b+c)。',
    en: 'Incenter is intersection of angle bisectors; weighted by side lengths I=(aA+bB+cC)/(a+b+c).',
  },
  tags: ['geometry', 'triangle', 'circle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
