// 递归链表长度 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-list-length',
  categoryId: 'recursion',
  title: { zh: '递归链表长度', en: 'Recursive List Length' },
  summary: {
    zh: '空链表返回 0，否则返回 1 + length(rest)。',
    en: 'Empty list returns 0; otherwise 1 + length(rest).',
  },
  description: {
    zh: '递归求单链表长度：\n- 基线：链表为 null → 返回 0\n- 递归：1 + length(head.next)\n\n每层计一个节点，递归深度 = 链表长度 n。时间 O(n)，空间 O(n)。',
    en: 'Recursively compute linked-list length: null returns 0; otherwise 1 + length(head.next). Depth = list length n. O(n) time and space.',
  },
  tags: ['recursion', 'linked-list', 'length', 'teaching'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
