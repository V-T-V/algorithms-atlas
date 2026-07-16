// String Hashing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-string',
  categoryId: 'string',
  title: { zh: '字符串哈希', en: 'String Hashing' },
  summary: {
    zh: '字符串哈希属于string类别。',
    en: 'String Hashing is a string algorithm.',
  },
  description: {
    zh: '字符串哈希（String Hashing）属于string类别的算法。',
    en: 'String Hashing is an algorithm in the string category.',
  },
  tags: ["string","hashing"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
