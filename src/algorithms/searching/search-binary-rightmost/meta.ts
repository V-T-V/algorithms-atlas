// 二分查找（最右命中） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-rightmost',
  categoryId: 'searching',
  title: { zh: '二分查找（最右命中）', en: 'Binary Search (Rightmost)' },
  summary: {
    zh: '在升序数组中找目标值最右一次出现的下标，不存在返回 -1。',
    en: 'Find the rightmost index of a target in a sorted array; -1 if absent.',
  },
  description: {
    zh: '二分查找最右命中变体：标准二分查找定位目标值，但当命中时不立即返回，而是继续向右半区收缩 lo = mid + 1，并用一个候选变量 ans 记录最近一次命中的 mid。循环结束后 ans 即最右命中下标（未命中则 ans 仍为 -1）。时间 O(log n)，空间 O(1)。适合含重复键时找最后一次出现。',
    en: 'Rightmost binary search: standard binary search for a target, but on a hit do not return immediately; instead shrink into the right half (lo = mid + 1) while recording the latest hit index in ans. After the loop, ans holds the rightmost hit index (-1 if never hit). Time O(log n), space O(1). Useful for finding the last occurrence among duplicate keys.',
  },
  tags: ['searching', 'binary-search', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
