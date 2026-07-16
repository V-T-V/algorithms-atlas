// Flatten Multilevel Doubly Linked List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-flatten-multilevel',
  categoryId: 'list',
  title: { zh: '多级双向链表扁平化', en: 'Flatten Multilevel Doubly Linked List' },
  summary: {
    zh: '把带 child 指针的多级双向链表扁平化为单级（LeetCode 430）。',
    en: 'Flatten a multilevel doubly linked list into one level (LeetCode 430).',
  },
  description: {
    zh: '遇到 child 时递归扁平化子链表，插入到当前节点和 next 之间。',
    en: 'On encountering a child, recursively flatten the sublist and splice it between current and next.',
  },
  tags: ['list', 'doubly-linked', 'recursion'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};
