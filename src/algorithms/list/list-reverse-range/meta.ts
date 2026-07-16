// Reverse Linked List Range · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-reverse-range',
  categoryId: 'list',
  title: { zh: '反转区间链表', en: 'Reverse Linked List Range' },
  summary: {
    zh: '反转链表中从位置 left 到 right 的一段。',
    en: 'Reverse the sublist between positions left and right (1-based).',
  },
  description: {
    zh: '定位到 left 前驱，对 right-left+1 个节点逐个头插反转区间。',
    en: 'Locate the predecessor of left, then head-insert each node of the range to reverse it.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
