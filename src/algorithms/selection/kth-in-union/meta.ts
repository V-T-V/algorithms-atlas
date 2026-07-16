// 两个有序数组并集第 k 小 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kth-in-union',
  categoryId: 'selection',
  title: { zh: '两有序数组并集第 k 小', en: 'K-th in Union of Two Sorted Arrays' },
  summary: {
    zh: '在两个升序数组的并集中用二分找第 k 小，O(log(m+n))。',
    en: 'Binary-search the k-th element across two sorted arrays in O(log(m+n)).',
  },
  description: {
    zh: '经典「两个有序数组第 k 小」：每次比较 a[i+k/2-1] 与 b[j+k/2-1]（i、j 为已消费数），较小者所在数组可安全跳过 k/2 个元素，从而每轮把 k 砍半。\n\n- 起始 i = j = 0（已消费数）\n- 取 aMidIdx = i + k/2 - 1，bMidIdx = j + k/2 - 1（越界用 +∞）\n- 若 a[aMidIdx] <= b[bMidIdx]，则排除 a[i..aMidIdx]；否则排除 b[j..bMidIdx]\n- k 归约到 k - 排除数，递归到 k == 1 时取两者较小\n\n时间 O(log(m+n))。',
    en: 'Classic "k-th of two sorted arrays": compare a[i+k/2-1] with b[j+k/2-1] (i, j = consumed counts); the smaller side can safely skip k/2 elements, halving k each round.\n\n- Start i = j = 0 (consumed)\n- aMidIdx = i + k/2 - 1, bMidIdx = j + k/2 - 1 (use +∞ if out of range)\n- If a[aMidIdx] <= b[bMidIdx] drop a[i..aMidIdx]; else drop b[j..bMidIdx]\n- Reduce k to k - dropped; recurse until k == 1, take the smaller\n\nTime O(log(m+n)).',
  },
  tags: ['binary-search', 'divide-and-conquer', 'order-statistics'],
  complexity: { time: 'O(log(m+n))', space: 'O(log(m+n))' },
};
