// Double Hash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'double-hash',
  categoryId: 'string',
  title: { zh: '双哈希', en: 'Double Hash' },
  summary: {
    zh: '双哈希属于string类别。',
    en: 'Double Hash is a string algorithm.',
  },
  description: {
    zh: '双哈希（Double Hash）属于string类别的算法。',
    en: 'Double Hash is an algorithm in the string category.',
  },
  tags: ["string","hashing"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
