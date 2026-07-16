// Subset Sum · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'subset-sum',
  categoryId: 'dp',
  title: { zh: '子集和', en: 'Subset Sum' },
  summary: {
    zh: '子集和属于dp类别。',
    en: 'Subset Sum is a dp algorithm.',
  },
  description: {
    zh: '子集和（Subset Sum）属于dp类别的算法。',
    en: 'Subset Sum is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n·target)', space: 'O(target)' },
};
