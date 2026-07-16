// Linked List Quick Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-sort-quick',
  categoryId: 'list',
  title: { zh: '链表快速排序', en: 'Linked List Quick Sort' },
  summary: {
    zh: '以头节点为基准三路划分后递归排序。',
    en: 'Three-way partition around the head pivot then recursively sort.',
  },
  description: {
    zh: '取头节点为基准，分成小于/等于/大于三段，递归排序后拼接，避免最坏情况。',
    en: 'Use the head as pivot, split into less/equal/greater, recurse, then concatenate.',
  },
  tags: ['list', 'sorting', 'divide-and-conquer', 'quick'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
