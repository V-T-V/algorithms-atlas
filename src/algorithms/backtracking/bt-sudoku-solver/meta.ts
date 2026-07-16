// 解数独 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-sudoku-solver',
  categoryId: 'backtracking',
  title: { zh: '解数独', en: 'Sudoku Solver' },
  summary: { zh: '回溯求解 9×9 数独。', en: 'Backtracking to solve 9x9 sudoku.' },
  description: { zh: '找空格，尝试 1-9，检查行列宫。', en: 'Try 1-9 at each empty cell. O(9^m).' },
  tags: ['backtracking', 'sudoku'],
  complexity: { time: 'O(9^m)', space: 'O(m)' },
};
