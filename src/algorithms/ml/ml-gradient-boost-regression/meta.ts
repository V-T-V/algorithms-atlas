// 梯度提升回归 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-gradient-boost-regression',
  categoryId: 'ml',
  title: { zh: '梯度提升回归', en: 'Gradient Boosting Regression' },
  summary: {
    zh: '用浅层回归树集成拟合负梯度。',
    en: 'Ensemble shallow regression trees fitting negative gradients.',
  },
  description: {
    zh: '每轮训练一棵拟合残差（负梯度）的回归树（深度=1 决策桩），累加预测。',
    en: 'Each round trains a depth-1 stump on residuals; predictions accumulate.',
  },
  tags: ['ml', 'gradient-boost', 'regression'],
  complexity: { time: 'O(M·n·d)', space: 'O(M·d)' },
};
