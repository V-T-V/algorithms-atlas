import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-create-maximum-2',
  categoryId: 'dp',
  title: { zh: '拼接最大数', en: 'Create Maximum Number' },
  summary: {
    zh: '从两个数组各取若干位保持相对顺序，拼成长 k 的最大数。',
    en: 'Pick digits from two arrays (order preserved) to form the max number of length k.',
  },
  description: {
    zh: 'LeetCode 321。给定两个非负数字数组 nums1、nums2 与长度 k，从 nums1 取 i 位、nums2 取 k-i 位（各自保持原相对顺序），合并为长度 k 的最大数。子问题：单数组取 t 位最大子序列（单调栈）；双数组归并时按字典序贪心（比较剩余后缀）。枚举 i ∈ [max(0,k-m), min(k,n)] 取最大。时间 O(k·(m+n))。',
    en: 'LeetCode 321. For each split i, take max subsequence of length i from nums1 and k-i from nums2 (monotone stack), merge greedily. Time O(k·(m+n)).',
  },
  tags: ['dp', 'greedy', 'monotone-stack', 'leetcode'],
  complexity: { time: 'O(k·(m+n))', space: 'O(k)' },
};
