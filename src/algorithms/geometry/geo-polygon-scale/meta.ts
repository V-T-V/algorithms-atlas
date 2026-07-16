// 多边形缩放 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-scale',
  categoryId: 'geometry',
  title: { zh: '多边形缩放', en: 'Polygon Scaling' },
  summary: {
    zh: '以中心 C 对多边形按比例 k 缩放。',
    en: 'Scale a polygon about center C by ratio k.',
  },
  description: { zh: '每个顶点 P_i ← C + k(P_i - C)。', en: 'Each vertex P_i ← C + k(P_i - C).' },
  tags: ['geometry', 'polygon', 'transformation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
