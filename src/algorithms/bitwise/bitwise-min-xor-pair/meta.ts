// 最小异或对 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-min-xor-pair',
  categoryId: 'bitwise',
  title: { zh: '最小异或对', en: 'Minimum XOR Pair' },
  summary: {
    zh: '排序后比较相邻对，找出数组中异或值最小的两元素（O(n log n)）。',
    en: 'Sort then compare adjacent pairs to find the minimum XOR pair (O(n log n)).',
  },
  description: {
    zh:
      '最小异或对（Minimum XOR Pair）：在数组中找两个元素使其异或值最小。' +
      '\n关键性质：使异或最小的两数在排序后必然相邻。' +
      '\n- 直觉：异或值小意味着二进制高位尽量相同；排序后高位相同的数聚在一起，' +
      '最小的差异一定出现在某对相邻数之间。' +
      '\n- 算法：排序后扫描所有相邻对，取最小异或。' +
      '\n时间 `O(n log n)`，空间 `O(n)`（排序）。',
    en:
      'Minimum XOR Pair: find two array elements whose XOR is minimal. ' +
      '\nKey property: the XOR-minimizing pair must be adjacent after sorting. ' +
      '\n- Intuition: small XOR means high bits match; sorting groups such elements, ' +
      'so the smallest difference appears among some adjacent pair. ' +
      '\n- Algorithm: sort, scan adjacent pairs, take the min XOR. ' +
      'Time O(n log n), space O(n) (sort).',
  },
  tags: ['bitwise', 'xor', 'min-pair', 'sorting', 'greedy'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
