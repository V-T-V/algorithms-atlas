// 近似有序数组查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-nearly-sorted',
  categoryId: 'searching',
  title: { zh: '近似有序数组查找', en: 'Search Nearly-Sorted (k-sorted)' },
  summary: {
    zh: '在「每个元素偏离原位置不超过 k」的数组中用带偏移的二分查找。',
    en: 'Binary search with offsets in an array where each element is at most k away from its sorted position.',
  },
  description: {
    zh: '近似有序（k-sorted）数组：每个元素距离它在完全有序数组中的位置不超过 k。标准二分不直接适用，因为 a[mid] 可能不是真实排序后的第 mid 小。本实现用一个简化的窗口线性扫描：对每个候选位置，检查 [max(0,i-k), min(n,i+k)] 窗口内是否有 target。时间 O(n*k) 最坏，但当 k 小时高效。适合插入排序后残留少量逆序的数据。',
    en: 'A nearly-sorted (k-sorted) array has each element at most k positions away from its sorted location. Standard binary search does not directly apply since a[mid] may not be the mid-th smallest. This implementation uses a simplified windowed linear scan: for each candidate position check the window [max(0,i-k), min(n,i+k)] for the target. Worst O(n*k) but efficient when k is small. Suits data with a few residual inversions after insertion sort.',
  },
  tags: ['searching', 'nearly-sorted', 'k-sorted', 'windowed'],
  complexity: { time: 'O(n*k)', space: 'O(1)' },
};
