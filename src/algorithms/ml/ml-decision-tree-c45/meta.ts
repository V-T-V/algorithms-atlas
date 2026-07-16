// C4.5 决策树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-decision-tree-c45',
  categoryId: 'ml',
  title: { zh: 'C4.5 决策树', en: 'C4.5 Decision Tree' },
  summary: {
    zh: '用信息增益率（gain ratio）构建决策树。',
    en: 'Build a decision tree using gain ratio.',
  },
  description: {
    zh: 'C4.5 改进 ID3：用信息增益率 = 信息增益/分裂信息，避免偏向多值特征。',
    en: 'C4.5 improves ID3 by using gain ratio = gain/split-info to avoid bias toward many-valued features.',
  },
  tags: ['ml', 'decision-tree'],
  complexity: { time: 'O(n·d·log n)', space: 'O(d)' },
};
