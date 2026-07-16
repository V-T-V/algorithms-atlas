// 验证数独 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-sudoku-valid',
  categoryId: 'backtracking',
  title: { zh: '验证数独 (LeetCode 36)', en: 'Valid Sudoku' },
  summary: {
    zh: '检查 9×9 数独每行、每列、每个 3×3 宫内数字 1-9 不重复。',
    en: 'Check each row, column, and 3x3 box of a 9x9 board has no duplicate digits 1-9.',
  },
  description: {
    zh: '一次扫描，用三组集合记录行/列/宫已出现的数字，遇到重复即判定无效。',
    en: 'Single scan with row/column/box sets to detect duplicates; valid if none.',
  },
  tags: ['backtracking', 'sudoku', 'validation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
