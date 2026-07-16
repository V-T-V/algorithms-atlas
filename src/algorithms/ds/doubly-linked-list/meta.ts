// Doubly Linked List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'doubly-linked-list',
  categoryId: 'ds',
  title: { zh: '双向链表', en: 'Doubly Linked List' },
  summary: {
    zh: '双向链表属于ds类别。',
    en: 'Doubly Linked List is a ds algorithm.',
  },
  description: {
    zh: '双向链表（Doubly Linked List）属于ds类别的算法。',
    en: 'Doubly Linked List is an algorithm in the ds category.',
  },
  tags: ["ds","dynamic-programming","linked-list"],
  complexity: { time: 'O(1) 端点增删 / O(n) 查找', space: 'O(n)' },
};
