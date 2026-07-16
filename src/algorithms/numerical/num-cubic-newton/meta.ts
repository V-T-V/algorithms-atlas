// 牛顿法求立方根 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-cubic-newton',
  categoryId: 'numerical',
  title: { zh: '牛顿法求立方根', en: 'Cube Root via Newton' },
  summary: { zh: '用牛顿迭代 x←(2x+a/x²)/3 求 ∛a。', en: 'Newton iteration x←(2x+a/x²)/3 for ∛a.' },
  description: {
    zh: '收敛阶 2，迭代至 |x³-a|<tol。',
    en: 'Quadratic convergence; iterate until |x³-a|<tol.',
  },
  tags: ['numerical', 'root-finding', 'newton'],
  complexity: { time: 'O(log(1/ε))', space: 'O(1)' },
};
