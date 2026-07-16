// 拼接最大数（Create Maximum Number, LeetCode 321）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'create-maximum-number',
  categoryId: 'greedy',
  title: { zh: '拼接最大数', en: 'Create Maximum Number' },
  summary: {
    zh: '从两个数组各取若干位保持相对顺序，拼成最大的 k 位数。',
    en: 'Pick digits from two arrays (keeping order) to form the largest k-digit number.',
  },
  description: {
    zh: '给定两个长度分别为 m、n 的数字数组 nums1、nums2 和整数 k（1<=k<=m+n），从 nums1 中取 i 个、从 nums2 中取 k-i 个数字，合并后保持各自相对顺序，使最终 k 位数最大。返回该最大数（数组形式）。\n\n分三步：\n1) 单调栈：从单个数组里取 t 个数字使其最大（保持顺序）——「删除 len-t 个」的删数最小化变形；\n2) 合并：两个候选数组按字典序贪心挑选较大前缀；\n3) 枚举分配 i（0..k），取所有分配中最大的结果。',
    en: 'Given two digit arrays nums1, nums2 of lengths m, n and integer k (1<=k<=m+n), take i digits from nums1 and k-i from nums2, merge while preserving each array\'s relative order, to form the largest k-digit number. Return it as an array.\n\nThree steps: 1) monotone stack: take t digits from a single array to maximize it (keeping order) — the "remove len-t" variant; 2) merge: greedily pick the larger lexicographic prefix from the two candidates; 3) enumerate the split i (0..k) and take the best result.',
  },
  tags: ['greedy', 'stack', 'merge'],
  complexity: { time: 'O(k·(m+n)²)', space: 'O(k)' },
  references: [
    { label: 'LeetCode 321', url: 'https://leetcode.com/problems/create-maximum-number/' },
  ],
  defaultInput: { nums1: [3, 4, 6, 5], nums2: [9, 1, 2, 5, 8, 3], k: 5 },
};
