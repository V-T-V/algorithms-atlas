// Hash Set · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-set',
  categoryId: 'ds',
  title: { zh: '哈希集合', en: 'Hash Set' },
  summary: {
    zh: '哈希集合属于ds类别。',
    en: 'Hash Set is a ds algorithm.',
  },
  description: {
    zh: '哈希集合（Hash Set）属于ds类别的算法。',
    en: 'Hash Set is an algorithm in the ds category.',
  },
  tags: ["ds","hashing"],
  complexity: { time: 'O(1) 增删查（均摊）', space: 'O(n)' },
};
