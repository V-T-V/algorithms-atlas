// Lasso 回归（L1 正则化）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lasso-regression',
  categoryId: 'ml',
  title: { zh: 'Lasso 回归（L1 正则化）', en: 'Lasso Regression (L1)' },
  summary: {
    zh: '用坐标下降最小化 ‖Xw−y‖² + λ‖w‖₁，能产生稀疏系数（部分权重精确为 0），自带特征选择。',
    en: 'Uses coordinate descent to minimize ‖Xw−y‖² + λ‖w‖₁, yielding sparse weights (exact zeros) — built-in feature selection.',
  },
  description: {
    zh: 'Lasso（Least Absolute Shrinkage and Selection Operator）在最小二乘损失上加 L1 罚：\n\n  `min_w (1/2n)‖Xw − y‖² + λ‖w‖₁`\n\nL1 罚项使解在坐标轴角点取得，故很多系数被**精确压缩为 0**，实现**特征选择**。\n\n求解用**坐标下降**：每次只优化一个 wⱼ，固定其余。闭式软阈值更新：\n\n  `wⱼ ← S(rⱼ, nλ) / ‖xⱼ‖²`，其中 `rⱼ = xⱼᵀ(y − Xw_{¬j})`，软阈值算子 `S(z,a) = sign(z)·max(|z|−a, 0)`。',
    en: 'Lasso adds an L1 penalty to the least-squares loss:\n\n  `min_w (1/2n)‖Xw − y‖² + λ‖w‖₁`\n\nThe L1 penalty makes optima land at axis corners, so many coefficients become **exactly 0** — built-in **feature selection**.\n\nSolved by **coordinate descent**: optimize one wⱼ at a time with soft-thresholding:\n\n  `wⱼ ← S(rⱼ, nλ) / ‖xⱼ‖²`, where `rⱼ = xⱼᵀ(y − Xw_{¬j})` and `S(z,a) = sign(z)·max(|z|−a, 0)`.',
  },
  tags: ['ml', 'regression', 'regularization', 'sparse', 'feature-selection'],
  complexity: { time: 'O(n·d·T)', space: 'O(n·d)' },
};
