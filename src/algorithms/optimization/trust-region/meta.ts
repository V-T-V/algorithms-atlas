// 信赖域方法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trust-region',
  categoryId: 'optimization',
  title: { zh: '信赖域方法', en: 'Trust-Region Method' },
  summary: {
    zh: '在当前点周围定义「可信」半径 Δ，每步在该圆盘内最小化二次模型，按实际/预测下降比调节 Δ。',
    en: 'Defines a "trust" radius Δ around the current point, minimizes a quadratic model inside that disk each step, and tunes Δ by the actual/predicted reduction ratio.',
  },
  description: {
    zh: '信赖域法在每步构造目标的局部**二次模型** `m_k(p) = f_k + g_kᵀp + ½ pᵀB_k p`，并在信赖域 `‖p‖ ≤ Δ_k` 内求 `argmin m_k(p)`。\n\n评估**质量比** ρ = (实际下降) / (模型预测下降)：\n- ρ 接近 1 → 模型可信，**扩大** Δ；\n- ρ 较小或为负 → 模型不可信，**缩小** Δ 并拒绝该步。\n\n与线搜索（先方向后步长）不同，信赖域是「先步长范围后方向」，对非凸/病态问题更稳健。\n\n子问题用 **Dogleg**（折线）近似解：在 Cauchy 点（最速下降极小）与牛顿方向之间折线选择。',
    en: "The trust-region method builds a local **quadratic model** `m_k(p) = f_k + g_kᵀp + ½ pᵀB_k p` of the objective and minimizes it within the trust region `‖p‖ ≤ Δ_k`.\n\nA **quality ratio** ρ = (actual reduction) / (model predicted reduction) controls Δ:\n- ρ near 1 → trust the model, **grow** Δ;\n- ρ small or negative → don't trust, **shrink** Δ and reject the step.\n\nUnlike line-search (direction first, then step), trust-region fixes the step range first then the direction — more robust on non-convex / ill-conditioned problems.\n\nThe subproblem is solved approximately by the **Dogleg** path: a broken line between the Cauchy point (steepest-descent minimum) and the Newton direction.",
  },
  tags: ['optimization', 'trust-region', 'nonlinear', 'robust'],
  complexity: { time: 'O(n³·T)', space: 'O(n²)' },
};
