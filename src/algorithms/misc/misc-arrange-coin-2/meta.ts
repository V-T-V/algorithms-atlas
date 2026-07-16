// 排列硬币 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-arrange-coin-2',
  categoryId: 'misc',
  title: { zh: '排列硬币', en: 'Arranging Coins' },
  summary: {
    zh: '搭 k 行阶梯共用 k(k+1)/2 枚硬币；求 n 枚最多能搭几完整行。',
    en: 'A k-row staircase uses k(k+1)/2 coins; find the max complete rows for n coins.',
  },
  description: {
    zh: 'LeetCode 441 排列硬币：求最大 k 使 k(k+1)/2 ≤ n，二分 O(log n)。',
    en: 'LeetCode 441 Arranging Coins: find max k with k(k+1)/2 ≤ n, binary search O(log n).',
  },
  tags: ['misc', 'math', 'binary-search', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
