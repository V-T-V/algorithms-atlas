// 链表选择排序v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sort-selection-2',
  categoryId: 'list',
  title: { zh: '链表选择排序v2', en: 'Selection Sort List v2' },
  summary: {
    zh: '对链表做选择排序（交换值）。',
    en: 'Selection sort a linked list by swapping values.',
  },
  description: {
    zh: '每轮在剩余段中找最小值与当前位置交换。',
    en: 'Find min in remainder, swap with current. O(n^2), O(1).',
  },
  tags: ['list', 'sort', 'selection-sort'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
