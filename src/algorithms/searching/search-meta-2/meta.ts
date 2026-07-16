// Meta 二分查找（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-meta-2',
  categoryId: 'searching',
  title: { zh: 'Meta 二分查找（变体）', en: 'Meta Binary Search (Variant)' },
  summary: {
    zh: '用位构造法（不显式维护 lo/hi）直接构造目标索引。',
    en: 'Construct the target index by bit-by-bit decisions without explicit lo/hi maintenance.',
  },
  description: {
    zh: 'Meta Binary Search（又称 one-sided binary search）：\n1. 计算 bits = ⌈log₂(n)⌉\n2. 从 pos = 0 开始，按位从高到低尝试置 1：\n   - 设 new = pos | (1 << bit)\n   - 若 new < n 且 arr[new] <= target：pos = new\n3. 最后若 arr[pos] == target 返回 pos，否则 -1\n\n每一步通过位的「置 1 尝试 + 比较」逼近目标索引。与二分等价，复杂度 O(log n)，但代码风格更紧凑。',
    en: 'Meta binary search (one-sided): compute bits=⌈log₂ n⌉; start pos=0 and try setting each bit from high to low. Set pos|=1<<bit only if new<n and arr[new]<=target. Return pos if arr[pos]==target, else -1. Equivalent to binary search, complexity O(log n), but more compact.',
  },
  tags: ['searching', 'binary-search', 'bitwise', 'meta'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
