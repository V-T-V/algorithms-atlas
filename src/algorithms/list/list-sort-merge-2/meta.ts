// 链表归并排序v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sort-merge-2',
  categoryId: 'list',
  title: { zh: '链表归并排序v2', en: 'Merge Sort Linked List v2' },
  summary: {
    zh: '对链表做归并排序（O(n log n) 时间 O(1) 空间）。',
    en: 'Merge sort a linked list in O(n log n), O(1).',
  },
  description: {
    zh: '快慢找中点 → 分两段 → 递归排序 → 合并。',
    en: 'Split by mid, recurse, merge. O(n log n), O(log n) stack.',
  },
  tags: ['list', 'sort', 'merge-sort'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
