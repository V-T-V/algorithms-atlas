// 双峰数组查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-bitonic-2',
  categoryId: 'searching',
  title: { zh: '双峰数组查找', en: 'Search Bitonic Array' },
  summary: {
    zh: '先找双峰数组峰值，再在升序左半与降序右半各二分。',
    en: 'Find the bitonic peak, then binary-search the ascending left and descending right halves.',
  },
  description: {
    zh: '双峰数组（Bitonic Array）：先升后降的数组（无重复）。查找 target：先用二分找峰值下标 peak（比较 arr[mid] 与 arr[mid+1] 决定向升段还是降段走），然后在升序左半 [0,peak] 做标准二分，未命中再在降序右半 [peak+1,n-1] 做降序二分。时间 O(log n)，空间 O(1)。',
    en: 'Bitonic array search: an array that rises then falls (no duplicates). Find target: first binary-search for the peak index (compare arr[mid] with arr[mid+1] to go up or down), then standard binary search on the ascending left [0,peak]; if missed, descending binary search on the right [peak+1,n-1]. Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'bitonic', 'peak'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
