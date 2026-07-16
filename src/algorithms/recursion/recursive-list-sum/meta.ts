// 递归链表求和 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-list-sum',
  categoryId: 'recursion',
  title: { zh: '递归链表求和', en: 'Recursive List Sum' },
  summary: {
    zh: '链表为空返回 0，否则返回 head + sum(rest)。',
    en: 'Empty list returns 0; otherwise head + sum(rest).',
  },
  description: {
    zh: '递归遍历单链表求所有节点值之和：\n- 基线：链表为 null → 返回 0\n- 递归：head.value + sum(head.next)\n\n每层处理一个节点，递归深度 = 链表长度 n。时间 O(n)，空间 O(n)。',
    en: 'Recursively sum a singly linked list: base case null returns 0; otherwise head.value + sum(head.next). Depth = list length n. O(n) time and space.',
  },
  tags: ['recursion', 'linked-list', 'sum', 'teaching'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
