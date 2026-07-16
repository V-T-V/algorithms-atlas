// Hash Map · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-map',
  categoryId: 'ds',
  title: { zh: '哈希映射', en: 'Hash Map' },
  summary: {
    zh: '哈希映射属于ds类别。',
    en: 'Hash Map is a ds algorithm.',
  },
  description: {
    zh: '哈希映射（Hash Map）属于ds类别的算法。',
    en: 'Hash Map is an algorithm in the ds category.',
  },
  tags: ["ds","hashing"],
  complexity: { time: 'O(1) 读写（均摊）', space: 'O(n)' },
};
