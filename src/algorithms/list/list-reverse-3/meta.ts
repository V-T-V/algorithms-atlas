// 反转链表v3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-reverse-3',
  categoryId: 'list',
  title: { zh: '反转链表v3', en: 'Reverse Linked List v3' },
  summary: {
    zh: '用三指针迭代原地反转单链表。',
    en: 'Reverse a singly linked list iteratively with three pointers.',
  },
  description: {
    zh: 'prev=null, cur=head；每步把 cur.next 指向 prev 并整体右移。',
    en: 'prev/cur/next pointers; flip each link. O(n), O(1).',
  },
  tags: ['list', 'reverse', 'iterative'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
