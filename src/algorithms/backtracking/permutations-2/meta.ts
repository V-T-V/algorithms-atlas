// 全排列 II（Permutations II）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'permutations-2',
  categoryId: 'backtracking',
  title: { zh: '全排列 II（去重）', en: 'Permutations II (Dedup)' },
  summary: {
    zh: '数组含重复元素，生成所有不重复的全排列。',
    en: 'Generate all distinct permutations of an array with duplicates.',
  },
  description: {
    zh: '给定一个可包含重复数字的序列，返回所有不重复的全排列。\n\n核心：排序后用「交换回溯 + used 标记」或「按位置回溯 + 同层剪枝」。本实现采用后者——逐位置填充，每个位置从尚未使用的元素中挑一个，若该元素与前一个相同且前一个尚未使用（同层），则剪枝。这样保证相同值的元素只按「先后顺序」被使用一次，从而去除重复排列。',
    en: 'Return all unique permutations of a sequence that may contain duplicates.\n\nCore idea: sort, then use position-by-position backtracking with a used[] array and same-level pruning. At each position pick an unused element; if it equals its predecessor and the predecessor is also unused (same level), prune. This forces equal-valued elements to be used in a fixed order, eliminating duplicate permutations.',
  },
  tags: ['backtracking', 'dedup', 'sorting', 'pruning'],
  complexity: { time: 'O(n·n!)', space: 'O(n)' },
  references: [{ label: 'LeetCode 47', url: 'https://leetcode.com/problems/permutations-ii/' }],
  defaultInput: [1, 1, 2],
};
