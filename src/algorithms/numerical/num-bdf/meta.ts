// BDF 向后差分公式（刚性 ODE）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-bdf',
  categoryId: 'numerical',
  title: { zh: 'BDF 向后差分公式', en: 'Backward Differentiation Formula (BDF)' },
  summary: {
    zh: 'BDF 是刚性 ODE 的隐式多步法；这里用 BDF2 固定步长 + 简单不动点迭代。',
    en: 'BDF: implicit multistep method for stiff ODEs; here BDF2 with fixed step and simple fixed-point iteration.',
  },
  description: {
    zh: '向后差分公式（BDF）通过差分近似导数，对刚性方程稳定。\n\nBDF2（2 阶）：\n```\n(3/2) y_{n+1} - 2 y_n + (1/2) y_{n-1} = h · f(t_{n+1}, y_{n+1})\n```\n即 y_{n+1} = (2/3)·[2 y_n - (1/2) y_{n-1} + h·f(t_{n+1}, y_{n+1})]\n\n隐式：用不动点迭代\n```\ny_{n+1}^{(k+1)} = (2/3)·[2 y_n - (1/2) y_{n-1} + h·f(t_{n+1}, y_{n+1}^{(k)})]\n```\n直到收敛（对适度刚性的问题 h·L < 1 时收敛）。\n\n起始点用 RK4 或后退欧拉。复杂度 O(n·iter)。',
    en: 'Backward Differentiation Formulas (BDF) approximate the derivative by differences, stable for stiff ODEs. BDF2: (3/2)y_{n+1}-2y_n+(1/2)y_{n-1}=h·f(t_{n+1},y_{n+1}); solved by fixed-point iteration y_{n+1}^{(k+1)}=(2/3)[2y_n-(1/2)y_{n-1}+h·f(t_{n+1},y_{n+1}^{(k)})] until convergence. Start point via RK4/backward Euler. Complexity O(n·iter).',
  },
  tags: ['numerical', 'ode', 'bdf', 'implicit', 'stiff'],
  complexity: { time: 'O(n·iter)', space: 'O(1)' },
};
