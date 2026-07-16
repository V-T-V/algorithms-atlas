// Consistent Hashing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'consistent-hash',
  categoryId: 'hashing',
  title: { zh: '一致性哈希', en: 'Consistent Hashing' },
  summary: {
    zh: '一致性哈希属于hashing类别。',
    en: 'Consistent Hashing is a hashing algorithm.',
  },
  description: {
    zh: '一致性哈希（Consistent Hashing）属于hashing类别的算法。',
    en: 'Consistent Hashing is an algorithm in the hashing category.',
  },
  tags: ["hashing"],
  complexity: { time: 'O(log(N·R))', space: 'O(N·R)' },
};
