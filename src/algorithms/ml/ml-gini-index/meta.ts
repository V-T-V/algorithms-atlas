// 基尼指数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-gini-index',
  categoryId: 'ml',
  title: { zh: '基尼指数', en: 'Gini Index' },
  summary: { zh: '衡量集合不纯度：1 - Σpᵢ²。', en: 'Impurity measure: 1 - Σpᵢ².' },
  description: { zh: '基尼越小越纯，CART 决策树常用。', en: 'Smaller Gini = purer; used by CART.' },
  tags: ['ml', 'decision-tree', 'impurity'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
