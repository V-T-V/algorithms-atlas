// 拉格朗日乘子法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lagrange-multiplier',
  categoryId: 'optimization',
  title: { zh: '拉格朗日乘子法', en: 'Lagrange Multiplier' },
  summary: {
    zh: '通过引入乘子把约束优化转为无约束，求解驻点方程，给出最优解的必要条件。',
    en: 'Introduces multipliers to convert constrained optimization into an unconstrained stationarity system, giving necessary optimality conditions.',
  },
  description: {
    zh: '拉格朗日乘子法求解等式约束优化：\n\n  `min f(x)  s.t.  g_i(x) = 0`\n\n构造拉格朗日函数 `L(x, λ) = f(x) + Σ λ_i g_i(x)`，必要最优条件（一阶 KKT 驻点）：\n\n  `∇_x L = ∇f + Σ λ_i ∇g_i = 0`\n  `∇_λ L = g_i(x) = 0`\n\n求解这个（非）线性方程组即得候选最优。本实现用**牛顿法**联立求解 `(x, λ)`。',
    en: "The Lagrange-multiplier method solves equality-constrained optimization:\n\n  `min f(x)  s.t.  g_i(x) = 0`\n\nBuild the Lagrangian `L(x, λ) = f(x) + Σ λ_i g_i(x)`. First-order necessary (KKT stationarity) conditions:\n\n  `∇_x L = ∇f + Σ λ_i ∇g_i = 0`\n  `∇_λ L = g_i(x) = 0`\n\nSolving this system gives candidate optima. This implementation uses **Newton's method** on the joint `(x, λ)` system.",
  },
  tags: ['optimization', 'constrained', 'lagrangian', 'kkt'],
  complexity: { time: 'O((n+m)³·T)', space: 'O((n+m)²)' },
};
