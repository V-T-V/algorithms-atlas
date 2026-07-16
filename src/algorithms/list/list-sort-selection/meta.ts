// Linked List Selection Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-sort-selection',
  categoryId: 'list',
  title: { zh: '链表选择排序', en: 'Linked List Selection Sort' },
  summary: {
    zh: '每轮在剩余段中找最小值并与当前位置交换。',
    en: 'Each round find the minimum in the remaining sublist and swap into place.',
  },
  description: {
    zh: '从当前节点起扫描剩余链表，找最小值节点后交换数值到当前位置。',
    en: 'Scan the remaining list from the current node, find the minimum, swap its value in.',
  },
  tags: ['list', 'sorting', 'selection'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
