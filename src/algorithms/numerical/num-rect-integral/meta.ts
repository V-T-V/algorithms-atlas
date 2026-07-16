// 矩形法积分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-rect-integral',
  categoryId: 'numerical',
  title: { zh: '矩形法积分', en: 'Rectangle Rule Integration' },
  summary: { zh: '用矩形法数值积分。', en: 'Numerical integration via the rectangle rule.' },
  description: {
    zh: '把 [a,b] 等分，每段用左端点函数值×宽求和。',
    en: 'Partition [a,b]; sum left-endpoint values times width.',
  },
  tags: ['numerical', 'integration'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
