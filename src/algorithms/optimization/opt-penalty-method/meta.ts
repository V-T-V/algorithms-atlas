// 罚函数法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-penalty-method',
  categoryId: 'optimization',
  title: { zh: '二次罚函数法', en: 'Quadratic Penalty Method' },
  summary: {
    zh: '把约束 `gᵢ(x)≤0` 转为罚项 `μ·Σ max(0, gᵢ)²`，从外部逼近可行域，μ 单调上升。',
    en: 'Turns constraints `gᵢ(x)≤0` into a penalty `μ·Σ max(0, gᵢ)²`, approaching the feasible region from outside as μ increases.',
  },
  description: {
    zh: '二次罚函数法求解带**不等式约束**（可含等式）的优化 `min f(x) s.t. gᵢ(x) ≤ 0`。把约束违反量平方后乘以罚参数 μ，构成无约束目标：\n\n`P(x, μ) = f(x) + μ·Σᵢ max(0, gᵢ(x))²`。\n\n- μ 小时罚太轻，迭代点会越界；\n- μ → ∞ 时，P 的极小点趋于原问题最优解（从**外部**逼近可行域）。\n\n**外层 μ 序列**：取 μ₀ > 0，每轮乘以因子 β（如 10）上升，对每个 μ 用梯度下降（或牛顿）求 `argmin P(x,μ)`，并把上一轮解作为下一轮初值（**热启动**）。\n\n与障碍法相比，罚函数法**不需要严格可行初值**，但 μ 过大会导致子问题病态（Hessian 条件数激增），精度有限。',
    en: 'The quadratic penalty method solves **inequality-constrained** (and equality) optimization `min f(x) s.t. gᵢ(x) ≤ 0`. It squares constraint violations and multiplies by a penalty μ to build an unconstrained objective:\n\n`P(x, μ) = f(x) + μ·Σᵢ max(0, gᵢ(x))²`.\n\n- Small μ → penalty too weak, iterates leave the feasible set;\n- As μ → ∞, the minimizer of P approaches the original optimum (from **outside** the feasible region).\n\n**Outer μ schedule**: pick μ₀ > 0, multiply by a factor β (e.g. 10) each round, solve `argmin P(x, μ)` for each μ by gradient descent (or Newton), warm-starting from the previous solution.\n\nUnlike the barrier method, the penalty method **does not require a strictly feasible starting point**, but very large μ makes subproblems ill-conditioned (Hessian condition number blows up), limiting achievable precision.',
  },
  tags: ['optimization', 'constrained', 'penalty', 'unconstrained-reduction'],
  complexity: { time: 'O(log(1/ε)·k·n²)', space: 'O(n)' },
};
