// 信息熵 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-entropy',
  categoryId: 'ml',
  title: { zh: '信息熵', en: 'Information Entropy' },
  summary: { zh: '衡量分布不确定性：-Σpᵢ log₂ pᵢ。', en: 'Uncertainty measure: -Σpᵢ log₂ pᵢ.' },
  description: {
    zh: '熵越大越混乱，ID3 决策树用它选择信息增益最大的特征。',
    en: 'Higher entropy = more uncertainty; ID3 uses it for information gain.',
  },
  tags: ['ml', 'decision-tree', 'impurity'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
