// 协方差矩阵 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-covariance-matrix',
  categoryId: 'ml',
  title: { zh: '协方差矩阵', en: 'Covariance Matrix' },
  summary: { zh: '计算样本协方差矩阵。', en: 'Compute the sample covariance matrix.' },
  description: { zh: 'Σ=(1/(n-1))Σ(xᵢ-μ)(xᵢ-μ)ᵀ。', en: 'Σ=(1/(n-1))Σ(xᵢ-μ)(xᵢ-μ)ᵀ.' },
  tags: ['ml', 'statistics'],
  complexity: { time: 'O(nd^2)', space: 'O(d^2)' },
};
