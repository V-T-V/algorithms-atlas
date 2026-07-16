// Insertion Sort List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'insert-sort-list',
  categoryId: 'list',
  title: { zh: '链表插入排序', en: 'Insertion Sort List' },
  summary: {
    zh: '链表插入排序属于list类别。',
    en: 'Insertion Sort List is a list algorithm.',
  },
  description: {
    zh: '链表插入排序（Insertion Sort List）属于list类别的算法。',
    en: 'Insertion Sort List is an algorithm in the list category.',
  },
  tags: ["list","sorting","dynamic-programming","linked-list"],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
