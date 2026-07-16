// 斐波那契查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-fibonacci-3',
  categoryId: 'searching',
  title: { zh: '斐波那契查找', en: 'Fibonacci Search' },
  summary: {
    zh: '用斐波那契数划分区间代替二分，避免除法，适合某些硬件。',
    en: 'Partition the range with Fibonacci numbers instead of halving; division-free, suits some hardware.',
  },
  description: {
    zh: '斐波那契查找（Fibonacci Search）与二分类似，但用斐波那契数列划分区间：找到最小 F(k) >= n，把数组视为长度 F(k)-1（不足补 +∞）。每次比较下标 i = offset + F(k-2)，根据比较结果把范围收缩到前 F(k-2)-1 段或后 F(k-1)-1 段，并递减 k。所有运算只用加减，无除法（历史上有硬件优势）。时间 O(log n)，空间 O(1)。',
    en: 'Fibonacci search resembles binary search but partitions the range with Fibonacci numbers: find the smallest F(k) >= n, treat the array as length F(k)-1 (pad with +Infinity). Each step compares index i = offset + F(k-2) and narrows into the front F(k-2)-1 segment or the back F(k-1)-1 segment, decrementing k. All arithmetic is add/subtract only, no division (a historical hardware advantage). Time O(log n), space O(1).',
  },
  tags: ['searching', 'fibonacci', 'sorted', 'division-free'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
