// 交替方向乘子法（ADMM）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-alternating-direction',
  categoryId: 'optimization',
  title: { zh: '交替方向乘子法（ADMM）', en: 'Alternating Direction Method of Multipliers (ADMM)' },
  summary: {
    zh: '分解可分离目标 `f(x)+g(z)` 的约束问题，按 x、z、y 三步交替更新，适合大规模分布式。',
    en: 'Splits separable objectives f(x)+g(z) under a coupling constraint, alternating x-, z-, and dual-y-updates; well suited to large-scale distributed optimization.',
  },
  description: {
    zh: 'ADMM 求解形式为 `min f(x) + g(z)  s.t.  A x + B z = c` 的问题（变量分裂为 x、z 两块，目标可分但约束耦合）。其**增广拉格朗日**：\n\n`L_ρ = f(x) + g(z) + yᵀ(Ax+Bz-c) + (ρ/2)‖Ax+Bz-c‖²`。\n\n迭代（**Gauss–Seidel 风格**交替）：\n1. `x ← argmin_x L_ρ(x, z, y)`（固定 z、y 解 x 子问题）\n2. `z ← argmin_z L_ρ(x, z, y)`（固定 x、y 解 z 子问题）\n3. `y ← y + ρ·(Ax+Bz-c)`（对偶上升）\n\n- 当 f、g 都是凸函数时收敛；\n- 当 f、g 有解析 prox 算子（如 L1、非负约束）时各子问题闭式可解；\n- 三步可分，**天然并行**，被广泛用于 Lasso、共识优化、分布式 SVM。\n\n本实现支持线性约束 `x - z = 0`（一致性约束）形式，即 `min f(x)+g(z) s.t. x=z`，对应 Lasso 等典型场景。子问题需要用户提供 `proxF`、`proxG`（近端算子）。',
    en: 'ADMM solves problems of the form `min f(x) + g(z)  s.t.  A x + B z = c`, where the variables are split into x and z blocks, the objective is separable, but the constraint couples them. The **augmented Lagrangian** is:\n\n`L_ρ = f(x) + g(z) + yᵀ(Ax+Bz-c) + (ρ/2)‖Ax+Bz-c‖²`.\n\nIteration (**Gauss–Seidel style** alternation):\n1. `x ← argmin_x L_ρ(x, z, y)` (solve x-subproblem with z, y fixed)\n2. `z ← argmin_z L_ρ(x, z, y)` (solve z-subproblem with x, y fixed)\n3. `y ← y + ρ·(Ax+Bz-c)` (dual ascent)\n\n- Converges when f and g are convex;\n- Each subproblem admits a closed form when f and g have analytic prox operators (e.g. L1, nonnegativity);\n- The three steps are separable and **naturally parallel**, widely used for Lasso, consensus optimization, and distributed SVM.\n\nThis implementation handles the consensus form `min f(x)+g(z) s.t. x=z`, covering scenarios like Lasso. The user supplies `proxF` and `proxG` (proximal operators).',
  },
  tags: ['optimization', 'constrained', 'admm', 'distributed', 'convex', 'proximal'],
  complexity: { time: 'O(k·T_prox)', space: 'O(n)' },
};
