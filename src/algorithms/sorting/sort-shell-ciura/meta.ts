// 希尔排序（Ciura 间隔） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-shell-ciura',
  categoryId: 'sorting',
  title: { zh: '希尔排序（Ciura 间隔）', en: 'Shell Sort (Ciura Gaps)' },
  summary: {
    zh: '使用 Marcin Ciura 实验得出的最优间隔序列的希尔排序。',
    en: "Shell sort using Marcin Ciura's experimentally-optimal gap sequence.",
  },
  description: {
    zh: '希尔排序（Shell Sort）是带间隔的插入排序：先按大间隔分组做插入排序，再逐步缩小间隔直到 1。间隔序列决定性能。Marcin Ciura 通过实验找到了一组接近最优的间隔 [1,4,10,23,57,132,301,701,1750]，实际复杂度约 O(n log n)~O(n^1.25)。本实现从不超过 n 的最大 Ciura 间隔开始递减。不稳定，原地。',
    en: 'Shell sort is insertion sort with a gap: sort groups spaced by gap, then shrink the gap to 1. The gap sequence dominates performance. Marcin Ciura experimentally found a near-optimal sequence [1,4,10,23,57,132,301,701,1750], giving roughly O(n log n)~O(n^1.25). This implementation starts from the largest Ciura gap not exceeding n. Unstable, in-place.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'shell'],
  complexity: { time: 'O(n^1.25)', space: 'O(1)' },
};
