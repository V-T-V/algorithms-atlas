// Set Cover · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'set-cover',
  categoryId: 'greedy',
  title: { zh: '集合覆盖', en: 'Set Cover' },
  summary: {
    zh: '集合覆盖属于greedy类别。',
    en: 'Set Cover is a greedy algorithm.',
  },
  description: {
    zh: '集合覆盖（Set Cover）属于greedy类别的算法。',
    en: 'Set Cover is an algorithm in the greedy category.',
  },
  tags: ["greedy"],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
