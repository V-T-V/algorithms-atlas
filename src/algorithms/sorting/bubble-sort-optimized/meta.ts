// Optimized Bubble Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bubble-sort-optimized',
  categoryId: 'sorting',
  title: { zh: '优化冒泡排序', en: 'Optimized Bubble Sort' },
  summary: {
    zh: '提前终止 + 记录最后交换位置，跳过已有序尾部。',
    en: 'Early exit plus last-swap tracking to skip the already-ordered tail.',
  },
  description: {
    zh: '优化冒泡排序在经典冒泡基础上叠加两项优化：\n\n1. **提前终止**：若某一轮未发生任何交换，说明数组已全局有序，立即结束。\n2. **记录最后交换位置**：每轮扫描记下最后一次交换的下标 lastSwap；其后到当前上界之间的元素已有序，下一轮只需扫描到 lastSwap。\n\n最坏/平均仍为 O(n²)，但最好情况（已有序）降到 O(n)，对近有序数据非常高效。稳定，原地，空间 O(1)。',
    en: 'Optimized Bubble Sort layers two classic tweaks on plain bubble sort:\n\n1. **Early termination**: if a pass makes no swaps the array is fully sorted — stop.\n2. **Last-swap tracking**: record the index of the last swap in each pass; elements beyond it are already in order, so the next pass only needs to scan up to that index.\n\nWorst/average stay O(n²) but best case (already sorted) drops to O(n), making it very fast on nearly-ordered input. Stable, in-place, space O(1).',
  },
  tags: ['sorting', 'stable', 'in-place', 'bubble', 'optimized'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
  attributes: { stable: 'true', best: 'O(n)' },
};
