// 线性回归梯度下降 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-gradient-descent-linear',
  categoryId: 'ml',
  title: { zh: '线性回归梯度下降', en: 'Linear Regression via Gradient Descent' },
  summary: {
    zh: '用批量梯度下降拟合线性回归。',
    en: 'Fit linear regression by batch gradient descent.',
  },
  description: {
    zh: '迭代 w ← w - η·∇L，L 为 MSE 损失。',
    en: 'Iterate w ← w - η·∇L with MSE loss.',
  },
  tags: ['ml', 'regression', 'optimization'],
  complexity: { time: 'O(epochs*n*d)', space: 'O(d)' },
};
