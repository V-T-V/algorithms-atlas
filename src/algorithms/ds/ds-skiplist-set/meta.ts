// 跳表（有序集合）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-skiplist-set',
  categoryId: 'ds',
  title: { zh: '跳表（有序集合）', en: 'Skip List (Ordered Set)' },
  summary: {
    zh: '多层链表实现有序集合，期望 O(log n) 插入/删除/查找。',
    en: 'Multi-level linked list implementing an ordered set; expected O(log n) insert/delete/search.',
  },
  description: {
    zh: '跳表在最底层维护完整有序链表，上层抽取部分节点作为「快车道」，类似二分查找的链式版本。每个节点按几何分布随机决定其层数。本实现为整数值的有序集合，支持 insert、delete、search、ceiling、floor、min、max，期望 O(log n)。区别于已有的 skip-list（侧重不同接口）。零 DOM 依赖。',
    en: 'A skip list keeps a full sorted linked list at the bottom, with higher levels sampling some nodes as fast lanes, a linked version of binary search. Each node level follows a geometric distribution. This is an integer ordered set with insert, delete, search, ceiling, floor, min, max in expected O(log n). Distinct from the existing skip-list. Zero DOM dependency.',
  },
  tags: ['ds', 'skip-list', 'ordered-set', 'probabilistic'],
  complexity: { time: 'O(log n) expected', space: 'O(n)' },
};
