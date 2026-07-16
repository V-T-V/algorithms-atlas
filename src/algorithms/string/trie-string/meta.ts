// String Trie · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trie-string',
  categoryId: 'string',
  title: { zh: '字符串Trie', en: 'String Trie' },
  summary: {
    zh: '字符串Trie属于string类别。',
    en: 'String Trie is a string algorithm.',
  },
  description: {
    zh: '字符串Trie（String Trie）属于string类别的算法。',
    en: 'String Trie is an algorithm in the string category.',
  },
  tags: ["string","trie"],
  complexity: { time: 'O(L)', space: 'O(Σ|words|)' },
};
