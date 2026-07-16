// Decision Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'decision-tree',
  categoryId: 'ml',
  title: { zh: '决策树ID3', en: 'Decision Tree' },
  summary: {
    zh: '决策树ID3属于ml类别。',
    en: 'Decision Tree is a ml algorithm.',
  },
  description: {
    zh: '决策树ID3（Decision Tree）属于ml类别的算法。',
    en: 'Decision Tree is an algorithm in the ml category.',
  },
  tags: ["ml","tree"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
