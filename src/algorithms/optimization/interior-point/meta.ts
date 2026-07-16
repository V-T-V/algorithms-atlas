// 内点法（线性规划）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'interior-point',
  categoryId: 'optimization',
  title: { zh: '内点法（线性规划）', en: 'Interior-Point Method (LP)' },
  summary: {
    zh: '从可行域内部出发，沿仿射尺度方向逼近最优解，多面体顶点之间「抄近路」，多项式时间。',
    en: 'Starts inside the feasible region and follows an affine-scaling direction toward the optimum, "cutting through" the polytope in polynomial time.',
  },
  description: {
    zh: '内点法（Karmarkar, 1984）是多项式时间的线性规划算法。\n\n**仿射尺度法**（简化版）求解 `max cᵀx s.t. Ax ≤ b, x ≥ 0`：\n1. 从严格正的可行内点 `x > 0` 出发；\n2. 在当前点用 `D = diag(x)` 把空间「归一化」，使约束在归一化空间中各向同性；\n3. 沿投影后的梯度方向走一步 `x ← x + α·D²·(c_proj)`；\n4. 步长 α 取 0.9 倍最大可行步长（贴边但不碰壁）。\n\n迭代收敛到最优（不严格沿边走，故比单纯形更平滑、对大规模稀疏问题更稳）。',
    en: 'Interior-point methods (Karmarkar, 1984) solve LPs in polynomial time.\n\nThe **affine-scaling** variant (simplified) for `max cᵀx s.t. Ax ≤ b, x ≥ 0`:\n1. start from a strictly positive feasible interior point `x > 0`;\n2. normalize the space with `D = diag(x)` so constraints look isotropic;\n3. step along the projected gradient `x ← x + α·D²·(c_proj)`;\n4. take α = 0.9 × the max feasible step (close to the wall but not touching).\n\nIterates converge to the optimum without hugging edges, making it smoother and robust for large sparse LPs.',
  },
  tags: ['optimization', 'linear-programming', 'interior-point', 'polynomial'],
  complexity: { time: 'O((m+n)³·L)', space: 'O((m+n)²)' },
};
