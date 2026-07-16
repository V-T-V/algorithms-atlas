// Fibonacci Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-search-impl',
  categoryId: 'searching',
  title: { zh: '斐波那契搜索', en: 'Fibonacci Search' },
  summary: {
    zh: '用斐波那契数划分区间，仅靠加减法逼近目标，无乘除。',
    en: 'Splits the range with Fibonacci numbers, approaching the target using only add/subtract.',
  },
  description: {
    zh: '斐波那契搜索（Fibonacci Search）在已排序数组中查找目标，与二分搜索同为 O(log n)，但用斐波那契数列 F(k) 来划分区间：找到最小的 k 使 F(k)-1 >= n，把数组逻辑扩展到长度 F(k)-1（不足位补最后一个元素），然后用 fibM = F(k-2)、fib1 = F(k-1) 表示偏移，逐步缩小。\n\n核心优势在于只用到整数加减（i = offset + fibM），无需除法或中点计算，在除法昂贵的硬件上有利；且访问模式对分块存储更友好。空间 O(1)。',
    en: 'Fibonacci Search locates a target in a sorted array in O(log n), like binary search, but uses Fibonacci numbers F(k) to split the range: pick the smallest k with F(k)-1 >= n, logically pad the array to length F(k)-1 (with the last element), then track fibM = F(k-2), fib1 = F(k-1) as offsets and narrow in.\n\nThe key benefit is integer-only arithmetic (i = offset + fibM) — no division or midpoint — helpful on division-light hardware, and its access pattern is friendlier to block storage. Space O(1).',
  },
  tags: ['searching', 'fibonacci', 'ordered', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
