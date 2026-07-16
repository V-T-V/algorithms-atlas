// 信息增益 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-information-gain',
  categoryId: 'ml',
  title: { zh: '信息增益', en: 'Information Gain' },
  summary: {
    zh: '分裂前后熵的减少量：ID3 选最大增益特征。',
    en: 'Entropy reduction after split; ID3 picks the max-gain feature.',
  },
  description: {
    zh: '信息增益 = 熵(父) - 加权和·熵(子)。',
    en: 'Gain = entropy(parent) - weighted sum of child entropies.',
  },
  tags: ['ml', 'decision-tree'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
