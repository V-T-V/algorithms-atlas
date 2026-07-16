// XGBoost 回归 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-xgboost-regression',
  categoryId: 'ml',
  title: { zh: 'XGBoost 回归', en: 'XGBoost Regression' },
  summary: {
    zh: '二阶可导目标下的梯度提升（带正则）。',
    en: 'Gradient boosting with second-order gradients and regularization.',
  },
  description: {
    zh: '用一阶 g 与二阶 h 梯度求最优叶子权重 w*=-G/(H+λ)，目标含 L2 正则。',
    en: 'Optimal leaf weight w*=-G/(H+λ) using first/second-order gradients with L2 regularization.',
  },
  tags: ['ml', 'xgboost', 'regression'],
  complexity: { time: 'O(M·n·d)', space: 'O(M·d)' },
};
