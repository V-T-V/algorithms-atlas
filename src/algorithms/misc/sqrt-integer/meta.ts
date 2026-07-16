// 整数平方根（牛顿法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sqrt-integer',
  categoryId: 'misc',
  title: { zh: '整数平方根（牛顿法）', en: 'Integer Square Root (Newton)' },
  summary: {
    zh: '用牛顿迭代 x←(x+n/x)/2 求 floor(√n)，O(log log n)。',
    en: 'Newton iteration x←(x+n/x)/2 to find floor(√n) in O(log log n).',
  },
  description: {
    zh: '整数平方根：求最大的 r 使 r² ≤ n，即 floor(√n)。牛顿法把它视为求 √n 的数值根：\n\n- 初值 x = n（或 n/2 + 1）\n- 迭代 x ← (x + floor(n/x)) / 2\n- 当 x 不再下降时收敛\n- 最后若 (x+1)² ≤ n 则 x++，确保取到下取整\n\n收敛速度二次方，约 O(log log n) 次迭代。仅用整数运算避免浮点误差。',
    en: "Integer square root: the largest r with r² ≤ n, i.e. floor(√n). Newton's method treats it as finding √n numerically:\n\n- Initial x = n (or n/2 + 1)\n- Iterate x ← (x + floor(n/x)) / 2\n- Converged when x stops decreasing\n- If (x+1)² ≤ n then x++ to ensure the floor\n\nQuadratic convergence, about O(log log n) iterations. Uses only integer arithmetic to avoid floating-point error.",
  },
  tags: ['numerical', 'newton-method'],
  complexity: { time: 'O(log log n)', space: 'O(1)' },
};
