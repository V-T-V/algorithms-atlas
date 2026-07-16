// CART 决策树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-decision-tree-cart',
  categoryId: 'ml',
  title: { zh: 'CART 决策树', en: 'CART Decision Tree' },
  summary: {
    zh: '用基尼指数构建二叉决策树。',
    en: 'Build a binary decision tree using the Gini index.',
  },
  description: {
    zh: 'CART 每次选使基尼增益最大的特征与阈值进行二分裂。',
    en: 'CART picks the feature/threshold maximizing Gini gain at each binary split.',
  },
  tags: ['ml', 'decision-tree'],
  complexity: { time: 'O(n·d·log n)', space: 'O(d)' },
};
