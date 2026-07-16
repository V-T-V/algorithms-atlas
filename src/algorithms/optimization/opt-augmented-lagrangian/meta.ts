// 增广拉格朗日法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-augmented-lagrangian',
  categoryId: 'optimization',
  title: { zh: '增广拉格朗日法', en: 'Augmented Lagrangian Method' },
  summary: {
    zh: '在拉格朗日函数上加二次罚项，外层更新乘子 λ，内层解无约束子问题，避免 μ→∞ 病态。',
    en: 'Adds a quadratic penalty to the Lagrangian; outer loop updates multipliers λ, inner loop solves the unconstrained subproblem, avoiding μ→∞ ill-conditioning.',
  },
  description: {
    zh: '增广拉格朗日法（Method of Multipliers / Hestenes–Powell）针对等式约束 `h(x)=0` 的 `min f(x)`。增广拉格朗日函数定义为：\n\n`L_A(x, λ, μ) = f(x) - λᵀh(x) + (μ/2)·‖h(x)‖²`。\n\n- 对固定 (λ, μ)，内层用梯度下降（或牛顿）求 `argmin L_A`；\n- 外层更新乘子 `λ ← λ - μ·h(x)`（沿对偶上升方向）；\n- 若约束违反过大，增大 μ。\n\n与纯二次罚函数法相比，**乘子 λ 主动逼近最优乘子 λ★**，μ 不必趋向无穷即可收敛，子问题条件数稳定，是约束优化的工业级方法。本实现也可扩展到不等式（松弛变量法或 `max(0,·)` 半罚）。',
    en: 'The Augmented Lagrangian method (Method of Multipliers / Hestenes–Powell) targets equality-constrained `min f(x) s.t. h(x)=0`. The augmented Lagrangian is:\n\n`L_A(x, λ, μ) = f(x) - λᵀh(x) + (μ/2)·‖h(x)‖²`.\n\n- For fixed (λ, μ), the inner loop minimizes `argmin L_A` by gradient descent (or Newton);\n- The outer loop updates multipliers `λ ← λ - μ·h(x)` (dual ascent);\n- If constraint violation is too large, μ is increased.\n\nCompared with a pure quadratic penalty, **the multiplier λ actively approaches the optimal λ★**, so μ need not go to infinity for convergence. The subproblems stay well-conditioned, making this an industrial-strength method for constrained optimization. This implementation handles equality constraints; inequality extensions use slack variables or a `max(0,·)` half-penalty.',
  },
  tags: ['optimization', 'constrained', 'lagrangian', 'multiplier', 'duality'],
  complexity: { time: 'O(log(1/ε)·k·n²)', space: 'O(n+m)' },
};
