import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-trie-2',
  categoryId: 'string',
  title: { zh: '字典树（Trie）', en: 'Trie (Prefix Tree)' },
  summary: {
    zh: '多分支树，公共前缀共享路径，支持插入/查询/前缀统计。',
    en: 'Multi-branch tree sharing common prefixes; supports insert / lookup / prefix-count.',
  },
  description: {
    zh: '每个节点存子节点映射与计数，沿字符向下走即完成操作。',
    en: 'Each node holds a child map and a counter; operations follow characters down the tree.',
  },
  tags: ['string', 'trie', 'prefix-tree'],
  complexity: { time: 'O(L)', space: 'O(总字符数)' },
};
