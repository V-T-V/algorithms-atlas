// Middle of Linked List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-middle-node',
  categoryId: 'list',
  title: { zh: '链表的中间节点', en: 'Middle of Linked List' },
  summary: {
    zh: '快慢指针一次找到链表中间节点。',
    en: 'Fast and slow pointers find the middle node in one pass.',
  },
  description: {
    zh: '慢指针走一步、快指针走两步，快指针到尾时慢指针正好在中点（偶数取右中点）。',
    en: 'Slow moves one step, fast two; when fast reaches the end slow is at the middle.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
