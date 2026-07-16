// Singly Linked List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'linked-list',
  categoryId: 'ds',
  title: { zh: '单链表', en: 'Singly Linked List' },
  summary: {
    zh: '单链表属于ds类别。',
    en: 'Singly Linked List is a ds algorithm.',
  },
  description: {
    zh: '单链表（Singly Linked List）属于ds类别的算法。',
    en: 'Singly Linked List is an algorithm in the ds category.',
  },
  tags: ["ds","dynamic-programming","linked-list"],
  complexity: { time: 'O(1) 头插 / O(n) 查找', space: 'O(n)' },
};
