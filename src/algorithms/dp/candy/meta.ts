// Candy · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'candy',
  categoryId: 'dp',
  title: { zh: '分糖果', en: 'Candy' },
  summary: {
    zh: '分糖果属于dp类别。',
    en: 'Candy is a dp algorithm.',
  },
  description: {
    zh: '分糖果（Candy）属于dp类别的算法。',
    en: 'Candy is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
