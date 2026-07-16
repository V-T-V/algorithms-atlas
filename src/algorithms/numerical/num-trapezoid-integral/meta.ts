// 梯形法积分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-trapezoid-integral',
  categoryId: 'numerical',
  title: { zh: '梯形法积分', en: 'Trapezoidal Rule Integration' },
  summary: { zh: '用梯形法数值积分。', en: 'Numerical integration via the trapezoidal rule.' },
  description: { zh: '∫f ≈ h·(f(a)/2 + Σf + f(b)/2)。', en: '∫f ≈ h·(f(a)/2 + Σf + f(b)/2).' },
  tags: ['numerical', 'integration'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
