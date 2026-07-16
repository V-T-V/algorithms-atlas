// 归并排序（自顶向下） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-merge-topdown',
  categoryId: 'sorting',
  title: { zh: '归并排序（自顶向下）', en: 'Merge Sort (Top-Down Recursive)' },
  summary: {
    zh: '经典分治：递归拆半排序再归并，稳定 O(n log n)。',
    en: 'Classic divide-and-conquer: recursively split in half, sort, and merge; stable O(n log n).',
  },
  description: {
    zh: '归并排序自顶向下版：把数组从中间一分为二，递归排序左半与右半，再用双指针归并两段有序子数组。递归基为长度 <= 1（已有序）。每层归并 O(n)，共 O(log n) 层，总 O(n log n)。需要 O(n) 辅助数组。稳定（归并时左段优先）。适合需要稳定排序或链表场景。本实现即教科书经典版。',
    en: 'Top-down merge sort: split the array in half, recursively sort each half, then merge the two sorted runs with two pointers. The base case is length <= 1 (already sorted). Each level merges in O(n); there are O(log n) levels, total O(n log n). Needs O(n) auxiliary space. Stable (left run takes priority on ties). Good when a stable sort or linked-list handling is needed. This is the textbook version.',
  },
  tags: ['sorting', 'comparison', 'stable', 'divide-and-conquer', 'recursive'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
