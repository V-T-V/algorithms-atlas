// 两个有序数组的中位数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'median-of-two-sorted',
  categoryId: 'selection',
  title: { zh: '两个有序数组的中位数', en: 'Median of Two Sorted Arrays' },
  summary: {
    zh: '在两个有序数组上二分划分，O(log(min(m,n))) 求合并后中位数。',
    en: 'Binary-search a partition across two sorted arrays to find the median in O(log(min(m,n))).',
  },
  description: {
    zh: '在较短数组 a 上二分切分点 i（j = (m+n+1)/2 - i 自动确定 b 的切分点），使得：\n\n- a[i-1] <= b[j] 且 b[j-1] <= a[i]\n- 左半元素数 = 右半元素数（或多一）\n\n合法划分下：\n- 总长奇数：中位数 = max(a[i-1], b[j-1])\n- 总长偶数：中位数 = (max(左半最大) + min(右半最小)) / 2\n\n时间 `O(log(min(m,n)))`，空间 `O(1)`。',
    en: 'Binary-search partition point i on the shorter array a (j = (m+n+1)/2 - i is fixed for b), requiring:\n\n- a[i-1] <= b[j] and b[j-1] <= a[i]\n- Left half size = right half size (or one more)\n\nUnder a valid partition:\n- Odd total: median = max(a[i-1], b[j-1])\n- Even total: median = (max(left) + min(right)) / 2\n\nTime `O(log(min(m,n)))`, space `O(1)`.',
  },
  tags: ['binary-search', 'divide-and-conquer', 'order-statistics'],
  complexity: { time: 'O(log(min(m,n)))', space: 'O(1)' },
};
