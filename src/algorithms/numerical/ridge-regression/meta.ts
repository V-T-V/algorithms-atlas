// 岭回归 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-ridge-regression',
  categoryId: 'numerical',
  title: { zh: '岭回归（L2 正则化）', en: 'Ridge Regression (L2 Regularization)' },
  summary: {
    zh: '解 (XᵀX + λI)β = Xᵀy，用 L2 惩罚抑制多重共线性与过拟合。',
    en: 'Solve (XᵀX + λI)β = Xᵀy with an L2 penalty to tame multicollinearity and overfitting.',
  },
  description: {
    zh:
      '岭回归（Ridge Regression）：线性回归的 L2 正则化版本，损失为 ' +
      '`L(β) = ||y − Xβ||² + λ·||β||²`。' +
      '\n- 闭式解（正规方程）：β = (XᵀX + λI)⁻¹ · Xᵀy' +
      '\n- λ > 0 使 XᵀX + λI 始终正定可逆，解决多重共线性下的数值不稳定' +
      '\n- λ 越大，系数 β 越向 0 收缩（shrinkage），方差减小、偏差增大' +
      '\n- 通常对 X 做标准化（按列减均值除标准差）后再求解' +
      '\n- 本实现：构造增广正规方程后用高斯消元求逆解' +
      '\n- 时间 `O(n³ + n²m)`（n 特征数，m 样本数），空间 `O(n²)`。',
    en:
      'Ridge Regression: L2-regularized linear regression with loss ' +
      'L(β) = ||y − Xβ||² + λ·||β||². ' +
      '\n- Closed form (normal equations): β = (XᵀX + λI)⁻¹ · Xᵀy ' +
      '\n- λ > 0 keeps XᵀX + λI positive-definite and invertible, fixing numerical instability under multicollinearity ' +
      '\n- Larger λ shrinks β toward 0 (bias up, variance down) ' +
      '\n- Typically standardize X (per-column mean/std) before fitting ' +
      '\n- This implementation builds the regularized normal equations and solves via Gaussian elimination ' +
      '\nTime O(n³ + n²m) (n features, m samples), space O(n²).',
  },
  tags: ['numerical', 'regression', 'ridge', 'regularization'],
  complexity: { time: 'O(n³+n²m)', space: 'O(n²)' },
};
