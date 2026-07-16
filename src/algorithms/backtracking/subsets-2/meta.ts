// 子集 II（Subsets II）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'subsets-2',
  categoryId: 'backtracking',
  title: { zh: '子集 II（去重）', en: 'Subsets II (Dedup)' },
  summary: {
    zh: '数组含重复元素，枚举所有不重复的子集。',
    en: 'Enumerate all distinct subsets of an array that may contain duplicates.',
  },
  description: {
    zh: '给定一个可能包含重复元素的整数数组，返回其所有可能的子集（幂集），且子集不能重复。\n\n核心技巧：先对数组排序，回溯时「同层跳过重复」——若当前元素与前一个相同，且前者在本层未被选取（即这是本层第二次遇到该值），则剪枝。这样每一段相同的值只会在「连续选若干个」时出现一次，从根上避免了重复子集。',
    en: 'Given an integer array that may contain duplicates, return all possible distinct subsets.\n\nKey trick: sort first, then during backtracking "skip duplicates at the same recursion level" — if nums[i] === nums[i-1] and i > start, prune this branch. This ensures each run of equal values is only consumed once contiguously, eliminating duplicate subsets at the source.',
  },
  tags: ['backtracking', 'dedup', 'sorting', 'pruning'],
  complexity: { time: 'O(n·2ⁿ)', space: 'O(n)' },
  references: [{ label: 'LeetCode 90', url: 'https://leetcode.com/problems/subsets-ii/' }],
  defaultInput: [1, 2, 2],
};
