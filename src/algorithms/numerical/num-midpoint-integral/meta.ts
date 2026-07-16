// 中点法积分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-midpoint-integral',
  categoryId: 'numerical',
  title: { zh: '中点法积分', en: 'Midpoint Rule Integration' },
  summary: { zh: '用中点法数值积分。', en: 'Numerical integration via the midpoint rule.' },
  description: {
    zh: '每段用中点函数值×宽，精度优于矩形法。',
    en: 'Use midpoint value per segment; more accurate than left-rectangle.',
  },
  tags: ['numerical', 'integration'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
