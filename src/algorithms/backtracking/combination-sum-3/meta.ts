// 组合总和 III（Combination Sum III）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'combination-sum-3',
  categoryId: 'backtracking',
  title: { zh: '组合总和 III', en: 'Combination Sum III' },
  summary: {
    zh: '从 1..9 中选 k 个不同数字使其和为 n。',
    en: 'Pick k distinct numbers from 1..9 that sum to n.',
  },
  description: {
    zh: '从数字 1 到 9 中选取 k 个不同的数，使其和等于 n，返回所有可能的组合。每个数字在每个组合中只能用一次。\n\n回溯思路：按数字从小到大递归，维护「剩余目标 remaining」与「还需选的个数 left」。剪枝：剩余可选范围不够、或剩余目标过小/过大时直接返回。这天然保证组合升序、不重复。',
    en: 'Find all valid combinations of k distinct numbers chosen from 1..9 such that they sum to n. Each number is used at most once per combination.\n\nBacktracking: recurse over candidate numbers in increasing order, tracking the remaining target and how many more to pick. Prune when there are not enough candidates left or the remaining target is too small/large. The increasing order guarantees ascending, non-duplicate combinations.',
  },
  tags: ['backtracking', 'combination', 'pruning'],
  complexity: { time: 'O(C(9,k)·k)', space: 'O(k)' },
  references: [
    { label: 'LeetCode 216', url: 'https://leetcode.com/problems/combination-sum-iii/' },
  ],
  defaultInput: { k: 3, n: 7 },
};
