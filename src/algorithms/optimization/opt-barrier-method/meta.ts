// 障碍（内点）法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-barrier-method',
  categoryId: 'optimization',
  title: { zh: '障碍（内点）法', en: 'Barrier (Interior) Method' },
  summary: {
    zh: '把不等式约束 `Ax ≤ b` 化为对数障碍项 `-μ·Σlog(b-Ax)`，从严格内部点出发逐步缩小 μ。',
    en: 'Converts inequalities `Ax ≤ b` into a logarithmic barrier `-μ·Σlog(b-Ax)`, starting from a strictly interior point and shrinking μ.',
  },
  description: {
    zh: '障碍法（内点法的一种）求解带**不等式约束**的优化 `min f(x) s.t. Ax ≤ b`。核心思想是把约束以**对数障碍函数**融入目标：\n\n`B(x, μ) = f(x) - μ·Σᵢ log(bᵢ - aᵢᵀx)`，其中 μ > 0。\n\n- 当 `bᵢ - aᵢᵀx → 0⁺`（接近边界），`-log(·) → +∞`，把迭代点「弹回」严格内部；\n- μ → 0 时，B(x,μ) 的极小点趋于原问题的 KKT 点。\n\n**外层 μ 序列**：取 μ₀ > 0，每轮以因子 τ（如 0.1～0.5）缩小 μ，对每个 μ 用牛顿法求 `argmin B(x,μ)`（**中心路径**）。初始点必须严格可行（`Ax < b`）。\n\n本实现：牛顿法解内层子问题（解析梯度和海森），μ 几何下降，直到 μ·m < ε 或达到外层迭代上限。',
    en: "The barrier method (a kind of interior-point method) solves **inequality-constrained** optimization `min f(x) s.t. Ax ≤ b`. Its core idea folds constraints into the objective via a **logarithmic barrier**:\n\n`B(x, μ) = f(x) - μ·Σᵢ log(bᵢ - aᵢᵀx)`, with μ > 0.\n\n- As `bᵢ - aᵢᵀx → 0⁺` (near the boundary), `-log(·) → +∞`, bouncing iterates back into the strict interior;\n- As μ → 0, the minimizer of B(x, μ) approaches the KKT point of the original problem.\n\n**Outer μ schedule**: pick μ₀ > 0, shrink μ by a factor τ (e.g. 0.1–0.5) each round, and for each μ solve `argmin B(x, μ)` with Newton's method (the **central path**). The starting point must be strictly feasible (`Ax < b`).\n\nThis implementation uses Newton's method on the inner subproblem (analytic gradient and Hessian), with μ decreasing geometrically until μ·m < ε or the outer iteration cap is hit.",
  },
  tags: ['optimization', 'constrained', 'interior-point', 'barrier', 'newton'],
  complexity: { time: 'O(log(1/ε)·k·n³)', space: 'O(n²)' },
};
