// 等分割子集和（Partition Equal Subset Sum）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'partition-equal-subset-sum',
  categoryId: 'backtracking',
  title: { zh: '等分割子集和', en: 'Partition Equal Subset Sum' },
  summary: {
    zh: '判断数组能否分成两个和相等的子集。',
    en: 'Determine if an array can be partitioned into two subsets of equal sum.',
  },
  description: {
    zh: '给定一个正整数数组，判断是否可以把它分成两个子集，使两个子集的元素之和相等。等价于：能否从数组中选出若干元素，使其和等于总和的一半。\n\n方法：先求总和 total，若 total 为奇数直接返回 false；目标 target = total/2。用「回溯 + 记忆化」在剩余目标上搜索：对每个元素选/不选，命中 target 即成功。用排序降序 + 提前剪枝（当前元素大于剩余目标、或剩余元素之和不足）加速。',
    en: 'Given a positive integer array, decide whether it can be partitioned into two subsets with equal sums. Equivalently: can we pick some elements whose sum equals total/2?\n\nApproach: compute total; if odd, return false; set target = total/2. Use backtracking with memoization over the remaining target: include/exclude each element, succeed on hitting target. Sort descending and prune early (current element exceeds remaining, or remaining elements cannot reach target) for speed.',
  },
  tags: ['backtracking', 'subset-sum', 'memoization', 'pruning'],
  complexity: { time: 'O(n·target)', space: 'O(target)' },
  references: [
    { label: 'LeetCode 416', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
  ],
  defaultInput: [1, 5, 11, 5],
};
