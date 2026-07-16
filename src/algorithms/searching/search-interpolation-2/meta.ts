// 插值查找（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-interpolation-2',
  categoryId: 'searching',
  title: { zh: '插值查找（变体）', en: 'Interpolation Search (Variant)' },
  summary: {
    zh: '根据目标值在区间值的比例估计位置，对均匀分布数据期望 O(log log n)。',
    en: 'Estimate probe position from the value ratio; expected O(log log n) for uniformly distributed data.',
  },
  description: {
    zh: '插值查找：与二分类似，但用线性插值估计位置：pos = lo + ⌊(hi - lo) · (target - arr[lo]) / (arr[hi] - arr[lo])⌋。\n- arr[pos] == target → 返回 pos\n- arr[pos] < target → lo = pos + 1\n- arr[pos] > target → hi = pos - 1\n\n对均匀分布数据，期望复杂度 O(log log n)；最坏 O(n)。',
    en: 'Interpolation search: like binary search but probes via linear interpolation pos = lo + ⌊(hi-lo)·(target-arr[lo])/(arr[hi]-arr[lo])⌋. Recurse into the indicated half. Expected O(log log n) on uniform data; worst case O(n).',
  },
  tags: ['searching', 'interpolation-search', 'uniform-distribution'],
  complexity: { time: 'O(log log n) 期望', space: 'O(1)' },
};
