// Circular Linked List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'circular-linked-list',
  categoryId: 'ds',
  title: { zh: '循环链表', en: 'Circular Linked List' },
  summary: {
    zh: '循环链表属于ds类别。',
    en: 'Circular Linked List is a ds algorithm.',
  },
  description: {
    zh: '循环链表（Circular Linked List）属于ds类别的算法。',
    en: 'Circular Linked List is an algorithm in the ds category.',
  },
  tags: ["ds","dynamic-programming","linked-list"],
  complexity: { time: 'O(1) 尾插 / O(n) 遍历', space: 'O(n)' },
};
