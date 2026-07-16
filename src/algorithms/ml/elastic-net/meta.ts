// 弹性网络（Elastic Net）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'elastic-net',
  categoryId: 'ml',
  title: { zh: '弹性网络（L1+L2）', en: 'Elastic Net (L1+L2)' },
  summary: {
    zh: '混合 L1 与 L2 罚项，既鼓励稀疏（特征选择）又稳定相关特征分组，克服 Lasso 在强相关特征下的缺陷。',
    en: 'Blends L1 and L2 penalties — encourages sparsity (selection) while stabilizing correlated-feature groups, fixing Lasso pitfalls.',
  },
  description: {
    zh: '弹性网络在最小二乘损失上同时加 L1 与 L2 罚：\n\n  `min_w (1/2n)‖Xw − y‖² + λ(α‖w‖₁ + (1−α)/2·‖w‖²)`\n\n- `α=1` 退化为 Lasso；\n- `α=0` 退化为岭回归；\n- 中间值兼顾两者：稀疏 + 相关特征成组选择。\n\n用**坐标下降**求解，软阈值更新中额外含 L2 项：\n\n  `wⱼ ← S(rⱼ, nλα) / (‖xⱼ‖² + nλ(1−α))`',
    en: 'Elastic Net blends L1 and L2 penalties:\n\n  `min_w (1/2n)‖Xw − y‖² + λ(α‖w‖₁ + (1−α)/2·‖w‖²)`\n\n- `α=1` reduces to Lasso;\n- `α=0` reduces to Ridge;\n- intermediate values combine sparsity with stable grouping of correlated features.\n\nSolved by **coordinate descent** with an extra L2 term in the soft-threshold update:\n\n  `wⱼ ← S(rⱼ, nλα) / (‖xⱼ‖² + nλ(1−α))`',
  },
  tags: ['ml', 'regularization', 'regression', 'sparse'],
  complexity: { time: 'O(n·d·T)', space: 'O(n·d)' },
};
