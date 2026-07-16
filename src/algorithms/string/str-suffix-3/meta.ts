import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-suffix-3',
  categoryId: 'string',
  title: { zh: '后缀树（朴素构造）', en: 'Suffix Tree (Naive Construction)' },
  summary: {
    zh: '所有后缀共享前缀的压缩 Trie，O(n^2) 朴素构造。',
    en: 'Compressed trie of all suffixes with shared prefixes; O(n^2) naive construction.',
  },
  description: {
    zh: '逐个插入后缀，沿共有前缀分裂节点，得到边标记为子串的压缩字典树。',
    en: 'Insert each suffix, splitting nodes at shared prefixes, yielding a compressed trie with substring edges.',
  },
  tags: ['string', 'suffix-tree', 'trie'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
};
