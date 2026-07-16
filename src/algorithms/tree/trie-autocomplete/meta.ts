// Trie Autocomplete · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trie-autocomplete',
  categoryId: 'tree',
  title: { zh: '字典树自动补全', en: 'Trie Autocomplete' },
  summary: {
    zh: '字典树自动补全属于tree类别。',
    en: 'Trie Autocomplete is a tree algorithm.',
  },
  description: {
    zh: '字典树自动补全（Trie Autocomplete）属于tree类别的算法。',
    en: 'Trie Autocomplete is an algorithm in the tree category.',
  },
  tags: ["tree","trie"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
