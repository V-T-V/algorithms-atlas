// 三点共线判定 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-points-collinear',
  categoryId: 'geometry',
  title: { zh: '三点共线判定', en: 'Collinearity Test' },
  summary: { zh: '判断三点是否共线。', en: 'Test whether three points are collinear.' },
  description: {
    zh: '三点 a,b,c 共线 ⟺ 叉积 (b-a)×(c-a) = 0。',
    en: 'a,b,c collinear ⟺ cross (b-a)×(c-a) = 0.',
  },
  tags: ['geometry', 'collinearity'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
