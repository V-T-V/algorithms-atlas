// 岭回归闭式解 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-ridge-regression-closed',
  categoryId: 'ml',
  title: { zh: '岭回归闭式解', en: 'Ridge Regression (Closed Form)' },
  summary: {
    zh: 'L2 正则化线性回归闭式解 w=(XᵀX+λI)⁻¹Xᵀy。',
    en: 'Closed-form ridge: w=(XᵀX+λI)⁻¹Xᵀy.',
  },
  description: {
    zh: '加入 L2 罚项防止过拟合与共线性。',
    en: 'Adds L2 penalty to avoid overfitting/collinearity.',
  },
  tags: ['ml', 'regression', 'regularization'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
