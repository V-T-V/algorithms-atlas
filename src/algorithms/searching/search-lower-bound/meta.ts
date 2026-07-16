// 下界二分查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-lower-bound',
  categoryId: 'searching',
  title: { zh: '下界二分查找', en: 'Lower Bound Binary Search' },
  summary: {
    zh: '找第一个 >= target 的下标（标准 C++ lower_bound 语义）。',
    en: 'Find the first index with arr[i] >= target (C++ lower_bound semantics).',
  },
  description: {
    zh: '下界（lower_bound）二分查找：在升序数组中找第一个满足 arr[i] >= target 的下标 i。若所有元素都 < target，返回 n（数组长度，即「插入到末尾」位置）。循环不变量：lo 始终是候选答案，hi 是排除区。这是 C++ std::lower_bound 的经典实现，时间 O(log n)，空间 O(1)。',
    en: "Lower-bound binary search: find the first index i with arr[i] >= target in a sorted array. If all elements are < target, return n (the length, i.e. 'insert at end'). Loop invariant: lo is always the candidate answer, hi is excluded. This is the classic C++ std::lower_bound. Time O(log n), space O(1).",
  },
  tags: ['searching', 'binary-search', 'sorted', 'lower-bound'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
