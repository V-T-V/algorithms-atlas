// Sudoku Solver · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sudoku-solver',
  categoryId: 'backtracking',
  title: { zh: '数独求解', en: 'Sudoku Solver' },
  summary: {
    zh: '数独求解属于backtracking类别。',
    en: 'Sudoku Solver is a backtracking algorithm.',
  },
  description: {
    zh: '数独求解（Sudoku Solver）属于backtracking类别的算法。',
    en: 'Sudoku Solver is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(9^n)', space: 'O(n)' },
};
