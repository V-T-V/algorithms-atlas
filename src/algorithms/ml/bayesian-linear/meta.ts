// 贝叶斯线性回归 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bayesian-linear',
  categoryId: 'ml',
  title: { zh: '贝叶斯线性回归', en: 'Bayesian Linear Regression' },
  summary: {
    zh: '对回归权重引入高斯先验，用贝叶斯定理得到后验分布，预测给出均值与不确定度。',
    en: 'Puts a Gaussian prior on the weights and applies Bayes rule to obtain a posterior, yielding predictive mean and uncertainty.',
  },
  description: {
    zh: '贝叶斯线性回归把权重 `w` 视为随机变量，赋予零均值高斯先验 `N(0, τ⁻¹I)`，噪声为 `N(0, σ²)`。\n\n给定数据后，后验仍是高斯：\n\n  `Λ = (1/σ²)XᵀX + τI`（精度矩阵）\n  `m = (1/σ²)Λ⁻¹Xᵀy`（后验均值）\n\n预测新点 `x*`：\n  - 预测均值 `μ* = mᵀx*`\n  - 预测方差 `σ*² = σ² + x*ᵀΛ⁻¹x*`（含噪声项 + 模型不确定度）\n\n与点估计的岭回归相比，贝叶斯回归还输出**预测不确定度**，可用于主动学习与风险评估。',
    en: 'Bayesian linear regression treats weights `w` as random variables with a zero-mean Gaussian prior `N(0, τ⁻¹I)` and Gaussian noise `N(0, σ²)`.\n\nThe posterior is also Gaussian:\n\n  `Λ = (1/σ²)XᵀX + τI` (precision matrix)\n  `m = (1/σ²)Λ⁻¹Xᵀy` (posterior mean)\n\nPrediction at `x*`:\n  - mean `μ* = mᵀx*`\n  - variance `σ*² = σ² + x*ᵀΛ⁻¹x*` (noise + epistemic uncertainty)\n\nUnlike point-estimate ridge regression, it also outputs **predictive uncertainty**, useful for active learning and risk assessment.',
  },
  tags: ['ml', 'regression', 'bayesian', 'probabilistic'],
  complexity: { time: 'O(d³ + nd²)', space: 'O(d²)' },
};
