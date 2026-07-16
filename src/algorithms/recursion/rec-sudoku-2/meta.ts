// 数独求解器（回溯 DFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-sudoku-2',
  categoryId: 'recursion',
  title: { zh: '数独求解器（回溯 DFS）', en: 'Sudoku Solver (Backtracking DFS)' },
  summary: {
    zh: '回溯 DFS：逐个空格尝试 1-9，检查行/列/宫约束，失败则回溯。',
    en: 'Backtracking DFS: try 1-9 in each empty cell checking row/column/box constraints, backtracking on failure.',
  },
  description: {
    zh: '9×9 数独求解：每行、每列、每个 3×3 宫格须包含 1-9 各一次。回溯算法：找到第一个空格，尝试填入 1-9 中合法的数字，递归求解剩余；若某步无解则回溯。为加速可配合「选择候选最少的空格」（MRV 启发式）。本实现采用朴素顺序回溯。',
    en: 'Solve a 9x9 Sudoku: each row, column, and 3x3 box must contain 1-9 exactly once. Backtracking: find the first empty cell, try each legal digit 1-9, and recurse on the rest; if a branch has no solution, backtrack. For speed one can choose the cell with fewest candidates (MRV heuristic). This implementation uses straightforward sequential backtracking.',
  },
  tags: ['recursion', 'backtracking', 'sudoku', 'constraint-satisfaction'],
  complexity: { time: 'O(9^e)', space: 'O(e)' },
};
