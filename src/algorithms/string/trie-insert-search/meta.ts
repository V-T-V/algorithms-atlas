// Trie 插入与查找（精简版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trie-insert-search',
  categoryId: 'string',
  title: { zh: 'Trie 插入与查找（精简版）', en: 'Trie Insert and Search (Minimal)' },
  summary: {
    zh: '只支持插入与整串/前缀查找的精简前缀树实现。',
    en: 'A minimal prefix tree supporting insert and exact/prefix search only.',
  },
  description: {
    zh: '用 Map<char,number> 表示孩子数组，逐字符向下构建前缀树。提供 insert(word)、search(word)（整串精确匹配）、startsWith(prefix)（前缀存在性）。本实现刻意精简，便于教学；区别于已有的 trie-string（含前缀枚举、前缀计数、删除等完整功能）。',
    en: 'Children stored as Map<char,number>; builds the prefix tree character by character. Provides insert(word), search(word) (exact match), startsWith(prefix) (prefix existence). Intentionally minimal for teaching; distinct from the existing trie-string (with prefix enumeration, prefix count, deletion, etc.).',
  },
  tags: ['string', 'trie', 'prefix-tree', 'search'],
  complexity: { time: 'O(L) per op', space: 'O(sum |words|)' },
};
