// 岭回归（L2 正则化）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ridge-regression',
  categoryId: 'ml',
  title: { zh: '岭回归（L2 正则化）', en: 'Ridge Regression (L2)' },
  summary: {
    zh: '在线性回归损失上加 L2 罚项 λ‖w‖²，闭式解稳定且抑制过拟合与多重共线性。',
    en: 'Adds an L2 penalty λ‖w‖² to the linear-regression loss; closed-form, stable, mitigates overfitting and multicollinearity.',
  },
  description: {
    zh: '岭回归（Tikhonov 正则化）在最小二乘损失上加 L2 罚：\n\n  `min_w ‖Xw − y‖² + λ‖w‖²`\n\n存在闭式解（带截距时给截距项加一列 1，并不惩罚它）：\n\n  `w = (XᵀX + λI)⁻¹ Xᵀy`\n\nλ 越大，系数被收缩得越趋近 0（但永不为 0），方差减小、偏差增大，可缓解**多重共线性**导致的解不稳定。当 λ=0 退化为普通最小二乘。',
    en: 'Ridge regression (Tikhonov regularization) adds an L2 penalty to the least-squares loss:\n\n  `min_w ‖Xw − y‖² + λ‖w‖²`\n\nClosed-form solution (with intercept: prepend a column of 1s and do not penalize it):\n\n  `w = (XᵀX + λI)⁻¹ Xᵀy`\n\nLarger λ shrinks coefficients toward 0 (never exactly 0), reducing variance at the cost of bias and stabilizing the solution under **multicollinearity**. λ=0 reduces to ordinary least squares.',
  },
  tags: ['ml', 'regression', 'regularization', 'linear-model'],
  complexity: { time: 'O(d³ + nd²)', space: 'O(d²)' },
};
