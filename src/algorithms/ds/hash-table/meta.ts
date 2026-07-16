// Hash Table (Chaining) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-table',
  categoryId: 'ds',
  title: { zh: '哈希表（链地址）', en: 'Hash Table (Chaining)' },
  summary: {
    zh: '哈希表（链地址）属于ds类别。',
    en: 'Hash Table (Chaining) is a ds algorithm.',
  },
  description: {
    zh: '哈希表（链地址）（Hash Table (Chaining)）属于ds类别的算法。',
    en: 'Hash Table (Chaining) is an algorithm in the ds category.',
  },
  tags: ["ds","hashing"],
  complexity: { time: 'O(1) 平均，O(n) 最坏', space: 'O(n)' },
};
