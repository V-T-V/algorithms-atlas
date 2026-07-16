// L1 正则化项 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-l1-regularize',
  categoryId: 'ml',
  title: { zh: 'L1 正则化项', en: 'L1 Regularization Term' },
  summary: { zh: '权重绝对值之和，促稀疏。', en: 'Sum of absolute weights; promotes sparsity.' },
  description: {
    zh: 'R(w)=λΣ|wᵢ|，实现特征选择。',
    en: 'R(w)=λΣ|wᵢ| drives weights to zero for feature selection.',
  },
  tags: ['ml', 'regularization'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
