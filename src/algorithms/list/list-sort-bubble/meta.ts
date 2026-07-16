// Linked List Bubble Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-sort-bubble',
  categoryId: 'list',
  title: { zh: '链表冒泡排序', en: 'Linked List Bubble Sort' },
  summary: {
    zh: '相邻节点比较并在需要时交换数值。',
    en: 'Compare adjacent nodes and swap values when out of order.',
  },
  description: {
    zh: '每轮从头扫描相邻节点，逆序则交换数值，最多 n-1 轮后有序。',
    en: 'Each pass scans adjacent pairs swapping values when unordered; at most n-1 passes.',
  },
  tags: ['list', 'sorting', 'bubble'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
