// Sort List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-list',
  categoryId: 'list',
  title: { zh: '链表排序', en: 'Sort List' },
  summary: {
    zh: '链表排序属于list类别。',
    en: 'Sort List is a list algorithm.',
  },
  description: {
    zh: '链表排序（Sort List）属于list类别的算法。',
    en: 'Sort List is an algorithm in the list category.',
  },
  tags: ["list","sorting","dynamic-programming","linked-list"],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
