// Collatz Max Steps · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'collatz-max-steps',
  categoryId: 'math',
  title: { zh: 'Collatz 最大步数统计', en: 'Collatz Max Steps' },
  summary: {
    zh: '统计 [1,n] 中 Collatz 步数最大的数（记录保持者）。',
    en: 'Find the number in [1,n] with the most Collatz steps (record holder).',
  },
  description: {
    zh: '对区间 [1, n] 中每个整数跑 Collatz (3n+1) 迭代，统计步数，找出「步数记录保持者」—— 即步数比所有更小数都大的数。本实现用记忆化（缓存已算步数）大幅加速，并返回所有记录保持者序列。与 misc/collatz-conjecture 不同，这里聚焦区间统计。时间约 O(n·L)，L 为平均步数。',
    en: 'Run Collatz (3n+1) for each integer in [1, n], count steps, and find the record holders — numbers whose step count exceeds all smaller numbers. We use memoization to speed up and return the sequence of record holders. Unlike misc/collatz-conjecture, we focus on range statistics. Time ~O(n·L), L the average step count.',
  },
  tags: ['math', 'number-theory', 'collatz', 'sequence', 'statistics'],
  complexity: { time: 'O(n·L)', space: 'O(n)' },
};
