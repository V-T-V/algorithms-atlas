// Adams-Bashforth 多步法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'adams-bashforth',
  categoryId: 'numerical',
  title: { zh: 'Adams-Bashforth 多步法', en: 'Adams-Bashforth Multistep Method' },
  summary: {
    zh: '显式 4 步法：用历史 4 点斜率外推下一步。',
    en: 'Explicit 4-step method: extrapolate using slopes from the past 4 points.',
  },
  description: {
    zh: 'Adams-Bashforth 是线性多步法：保存最近 4 个点的斜率 f_n, f_{n-1}, f_{n-2}, f_{n-3}，用拉格朗日插值多项式外推 y_{n+1} = y_n + (h/24)(55f_n - 59f_{n-1} + 37f_{n-2} - 9f_{n-3})。它是显式的，每步只需 1 次函数求值（前 4 步用 RK4 启动）。',
    en: 'Adams-Bashforth is a linear multistep method: keep the slopes of the last 4 points f_n, f_{n-1}, f_{n-2}, f_{n-3} and extrapolate with a Lagrange interpolant: y_{n+1} = y_n + (h/24)(55f_n - 59f_{n-1} + 37f_{n-2} - 9f_{n-3}). It is explicit, costing only one function evaluation per step (the first 4 points are bootstrapped by RK4).',
  },
  tags: ['numerical', 'ode', 'multistep'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
