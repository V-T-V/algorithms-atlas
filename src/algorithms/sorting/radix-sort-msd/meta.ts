// MSD Radix Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'radix-sort-msd',
  categoryId: 'sorting',
  title: { zh: 'MSD 基数排序', en: 'MSD Radix Sort' },
  summary: {
    zh: '从最高位（Most Significant Digit）开始，递归按位分桶。',
    en: 'Partitions by the most significant digit first, then recurses on each bucket.',
  },
  description: {
    zh: 'MSD 基数排序（Most Significant Digit Radix Sort）从数值的最高位起，把元素按当前位（0~9 共 10 个桶）分配，再对每个桶递归处理下一位。与 LSD（最低位优先，从低位向高位做稳定分配）不同，MSD 一旦分桶后桶内互不干扰，天然支持「按前缀排序」，适合定长字符串或整数的字典序/数值排序。\n\n对 n 个 d 位整数：时间 O(d·(n+10))，空间 O(n+b)（含递归栈与桶）。稳定。本实现处理非负十进制整数。',
    en: 'MSD Radix Sort starts from the most significant digit and distributes elements into 10 buckets (digits 0–9), then recurses on each bucket for the next lower digit. Unlike LSD (which distributes from least to most significant digit and is inherently stable), MSD lets buckets stay independent after partitioning — a natural fit for lexicographic / value ordering of fixed-length strings or integers.\n\nFor n d-digit integers: time O(d·(n+10)), space O(n+b) (recursion + buckets). Stable. This implementation handles non-negative decimal integers.',
  },
  tags: ['sorting', 'stable', 'non-comparison', 'radix', 'recursive', 'divide-and-conquer'],
  complexity: { time: 'O(d·(n+b))', space: 'O(n+b)' },
  attributes: { stable: 'true', radix: '10' },
};
