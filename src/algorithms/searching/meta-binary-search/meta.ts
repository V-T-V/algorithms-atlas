// Meta Binary Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'meta-binary-search',
  categoryId: 'searching',
  title: { zh: 'Meta 二分搜索', en: 'Meta Binary Search' },
  summary: {
    zh: '用位运算逐位构造目标下标，无需显式中点比较。',
    en: 'Builds the target index bit by bit with shift operations, no explicit midpoint.',
  },
  description: {
    zh: 'Meta 二分搜索（Meta Binary Search，又称 One-Sided Binary Search）在已排序数组中查找目标时，预先算出 ⌈log₂(n+1)⌉，然后从最高位开始逐位「尝试置位」构造候选下标 pos：每当 1<<(k+1)-1 < n，就用 pos + (1<<k) 作为新候选；若 a[pos] < target 则保留该置位，否则撤销。最终若 a[pos] === target 即命中。\n\n本质是二分搜索的位运算实现，比较次数 O(log n)，无需维护 lo/hi 两个端点。空间 O(1)。',
    en: 'Meta Binary Search (a.k.a. One-Sided Binary Search) finds a target in a sorted array by first computing ⌈log₂(n+1)⌉, then constructing the candidate index pos one bit at a time from the most significant bit: try setting bit k when pos + (1<<k) is in range; keep the bit if a[pos] < target, otherwise clear it. When a[pos] === target the search succeeds.\n\nIt is a bit-manipulation reformulation of binary search: O(log n) comparisons, no need to maintain separate lo/hi bounds. Space O(1).',
  },
  tags: ['searching', 'binary-search', 'bit-manipulation', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
