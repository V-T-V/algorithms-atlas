// 哨兵线性查找（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-sentinel-2',
  categoryId: 'searching',
  title: { zh: '哨兵线性查找（变体）', en: 'Sentinel Linear Search (Variant)' },
  summary: {
    zh: '把目标放到数组末尾作为哨兵，省去每次循环的越界判断。',
    en: 'Place the target as a sentinel at the end of the array to eliminate the bounds check from the inner loop.',
  },
  description: {
    zh: '哨兵线性查找：把 target 作为哨兵追加到数组末尾（不影响原数组，用副本），这样从前往后扫描时「必定会命中」，循环里只需比较值而无需检查 i < n。\n\n找到后判断 i 是否落在原始范围 [0, n)：是则返回 i，否则（i == n 即命中哨兵）返回 -1。\n\n相比朴素线性查找减少每次迭代的条件分支，常数更小。复杂度 O(n)。',
    en: 'Sentinel linear search: append target as a sentinel to a copy of the array so the forward scan is guaranteed to hit, removing the i<n check from the inner loop. If the found index is in [0,n) return it; if it equals n (sentinel hit) return -1. Smaller constant than naive linear search. Complexity O(n).',
  },
  tags: ['searching', 'linear-search', 'sentinel', 'optimization'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
