// 优化鸡尾酒排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cocktail-sort-optimized',
  categoryId: 'sorting',
  title: { zh: '优化鸡尾酒排序', en: 'Optimized Cocktail Shaker Sort' },
  summary: {
    zh: '记录最后一次交换位置，跳跃式收缩未排序区间的双向冒泡。',
    en: 'Shaker sort that jumps the unsorted boundary to the last-swap position.',
  },
  description: {
    zh:
      '优化鸡尾酒排序（Optimized Cocktail Shaker Sort）在双向冒泡基础上增加「最后交换位置」优化：' +
      '\n- 正向扫描时记录最后一次发生交换的下标 `newHi`，则 `hi` 之后的元素均已就位，' +
      '下一轮直接把右界跳到 `newHi` 而非 `hi-1`。' +
      '\n- 反向扫描同理用 `newLo` 跳跃左界。' +
      '\n对于「尾部已基本有序」的输入，可显著减少比较次数。',
    en:
      'Optimized Cocktail Shaker Sort adds a "last-swap" optimization on top of bidirectional bubble: ' +
      '\n- During the forward pass, remember the index `newHi` of the last swap; elements past it are ' +
      'already in place, so next round jumps the right bound to `newHi` instead of `hi-1`. ' +
      '\n- The backward pass does the same with `newLo`. ' +
      '\nThis greatly reduces comparisons for inputs that are already nearly sorted at the tail.',
  },
  tags: ['sorting', 'exchange', 'in-place', 'stable', 'optimization'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
