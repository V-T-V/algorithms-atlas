// Trie · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trie',
  categoryId: 'ds',
  title: { zh: '字典树', en: 'Trie' },
  summary: {
    zh: '字典树属于ds类别。',
    en: 'Trie is a ds algorithm.',
  },
  description: {
    zh: '字典树（Trie）属于ds类别的算法。',
    en: 'Trie is an algorithm in the ds category.',
  },
  tags: ["ds","trie"],
  complexity: { time: 'O(L) 插入/查找，L = 键长', space: 'O(Σ|键|)' },
};
