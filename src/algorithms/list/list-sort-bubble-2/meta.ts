// 链表冒泡v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sort-bubble-2',
  categoryId: 'list',
  title: { zh: '链表冒泡v2', en: 'Bubble Sort List v2' },
  summary: {
    zh: '对链表做冒泡排序（交换值）。',
    en: 'Bubble sort a linked list by swapping values.',
  },
  description: {
    zh: '每轮把最大值冒到末尾，n-1 轮。',
    en: 'Each pass bubbles the max to the end. O(n^2), O(1).',
  },
  tags: ['list', 'sort', 'bubble-sort'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
