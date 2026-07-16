// 多项式特征扩展 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-polynomial-features',
  categoryId: 'ml',
  title: { zh: '多项式特征扩展', en: 'Polynomial Features' },
  summary: {
    zh: '把特征扩展为多项式项以拟合非线性关系。',
    en: 'Expand features into polynomial terms for non-linear fitting.',
  },
  description: {
    zh: '对一维 x 与阶数 d 生成 [1, x, x², ..., xᵈ]。',
    en: 'For 1D x and degree d produce [1, x, x², ..., xᵈ].',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(d)', space: 'O(d)' },
};
