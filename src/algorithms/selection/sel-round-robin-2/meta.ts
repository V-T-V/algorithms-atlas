// 循环赛选择 v2（Round-Robin Select v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-round-robin-2',
  categoryId: 'selection',
  title: { zh: '循环赛选择 v2', en: 'Round-Robin Select v2' },
  summary: {
    zh: '循环赛：每对选手比较一次，统计胜场排序。',
    en: 'Round-robin: compare every pair, rank by wins.',
  },
  description: {
    zh: '循环赛（double round-robin 简化）：对所有数两两比较，按「胜出次数」（小于对方的次数）排序得第 k 小。',
    en: 'Round-robin (simplified): compare every pair; rank by "win count" (number of elements beaten) to get the k-th smallest.',
  },
  tags: ['selection', 'round-robin', 'quadratic'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
