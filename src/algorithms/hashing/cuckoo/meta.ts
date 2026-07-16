// Cuckoo Hashing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cuckoo',
  categoryId: 'hashing',
  title: { zh: '布谷鸟哈希', en: 'Cuckoo Hashing' },
  summary: {
    zh: '布谷鸟哈希属于hashing类别。',
    en: 'Cuckoo Hashing is a hashing algorithm.',
  },
  description: {
    zh: '布谷鸟哈希（Cuckoo Hashing）属于hashing类别的算法。',
    en: 'Cuckoo Hashing is an algorithm in the hashing category.',
  },
  tags: ["hashing"],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
