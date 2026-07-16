// 随机快排 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-randomized-qsort',
  categoryId: 'randomized',
  title: { zh: '随机化快速排序', en: 'Randomized Quicksort' },
  summary: {
    zh: '随机选 pivot 的快排：期望 O(n log n)，规避最坏输入。',
    en: 'Quicksort with a uniformly random pivot; expected O(n log n), avoids worst-case inputs.',
  },
  description: {
    zh: '随机化快速排序在每段 [lo,hi] 中等概率随机选取 pivot 索引并交换到端点，再做经典 Lomuto/Hoare 划分。随机性使任何输入的期望比较数为 O(n log n)，且无确定性最坏。',
    en: 'Randomized quicksort picks a uniformly random pivot index in each segment [lo,hi], swaps it to the end, then runs the standard partition. Randomness gives expected O(n log n) comparisons on any input, with no deterministic worst case.',
  },
  tags: ['randomized', 'quicksort', 'divide-and-conquer', 'sort'],
  complexity: { time: 'O(n log n) 期望', space: 'O(log n)' },
};
