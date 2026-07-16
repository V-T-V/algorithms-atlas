// N 皇后计数（N-Queens II）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'n-queens-2',
  categoryId: 'backtracking',
  title: { zh: 'N 皇后计数', en: 'N-Queens II (Count)' },
  summary: {
    zh: '不列举解，仅统计 N×N 棋盘上互不攻击皇后的摆放方案总数。',
    en: 'Count (without listing) the number of distinct N-Queens solutions.',
  },
  description: {
    zh: '在 N×N 棋盘上放置 N 个皇后使其互不攻击（不同行、不同列、不同对角线），统计满足条件的方案总数。\n\n经典回溯：逐行放置，每行恰放一个皇后，用三个集合（列、主对角线 row-col、副对角线 row+col）做 O(1) 冲突检测。遇到解就计数 +1，不保存解本身，从而比列举版省内存。可加入位运算优化（用整数的位表示占用集合）。',
    en: 'Count the total number of ways to place N non-attacking queens on an N×N board.\n\nClassic backtracking: place row by row, using three sets (column, row-col diagonal, row+col diagonal) for O(1) conflict checks. Each complete placement increments the counter without storing the solution, saving memory versus the enumeration version. Can be sped up with bitwise tricks.',
  },
  tags: ['backtracking', 'counting', 'pruning', 'recursion'],
  complexity: { time: 'O(N!)', space: 'O(N)' },
  references: [{ label: 'LeetCode 52', url: 'https://leetcode.com/problems/n-queens-ii/' }],
  defaultInput: 8,
};
