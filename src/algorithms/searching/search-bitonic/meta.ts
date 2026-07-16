// 双调数组查找 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-bitonic',
  categoryId: 'searching',
  title: { zh: '双调数组查找', en: 'Bitonic Array Search' },
  summary: {
    zh: '在先增后减的双调数组中 O(log n) 查找目标：先找峰值再两段二分。',
    en: 'Search a bitonic (first-increasing then-decreasing) array in O(log n): find the peak then binary-search each side.',
  },
  description: {
    zh: '双调数组：存在一个峰值索引 p，使得 arr[0..p] 严格递增、arr[p..n-1] 严格递减。\n\n查找目标 target：\n1. 用二分找峰值 p（O(log n)，与 find-peak 同理）\n2. 在递增段 [0, p] 上做升序二分（O(log n)）\n3. 若未找到，在递减段 [p+1, n-1] 上做降序二分（O(log n)）\n\n总复杂度 O(log n)。',
    en: 'Bitonic array: there is a peak index p with arr[0..p] strictly increasing and arr[p..n-1] strictly decreasing. To find target: (1) find peak p by binary search in O(log n); (2) ascending binary search on [0,p]; (3) if not found, descending binary search on [p+1,n-1]. Total complexity O(log n).',
  },
  tags: ['searching', 'bitonic', 'binary-search', 'peak'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
