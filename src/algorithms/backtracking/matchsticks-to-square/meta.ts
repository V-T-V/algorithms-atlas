// 火柴拼正方形（Matchsticks to Square）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'matchsticks-to-square',
  categoryId: 'backtracking',
  title: { zh: '火柴拼正方形', en: 'Matchsticks to Square' },
  summary: {
    zh: '把若干火柴分成 4 组，每组总长相等（拼成正方形）。',
    en: 'Split matchsticks into 4 groups of equal total length (a square).',
  },
  description: {
    zh: '给定一个正整数数组（每根火柴的长度），判断能否用上所有火柴拼成一个正方形（4 条边长度相等）。\n\n等价于：能否把数组分成 4 个子集，每个子集之和等于 total/4（周长除以 4，即边长 side）。回溯思路：把每根火柴尝试放入 4 条边之一，当前边已用长度 + 该火柴 ≤ side 时才放；排序降序以加速剪枝。关键剪枝：同一边长下若当前火柴放某边失败，则等价边（已用长度相同的边）也跳过。',
    en: 'Given an array of positive integers (matchstick lengths), determine whether all matchsticks can form a square (4 equal sides).\n\nEquivalently: partition the array into 4 subsets each summing to total/4 (the side length). Backtracking: try placing each matchstick into one of 4 sides; only place if current side length + stick ≤ side; sort descending to prune early. Key prune: if placing a stick into a side fails, skip sides with the same current length.',
  },
  tags: ['backtracking', 'partition', 'pruning'],
  complexity: { time: 'O(4ⁿ)', space: 'O(n)' },
  references: [
    { label: 'LeetCode 473', url: 'https://leetcode.com/problems/matchsticks-to-square/' },
  ],
  defaultInput: [1, 1, 2, 2, 2],
};
