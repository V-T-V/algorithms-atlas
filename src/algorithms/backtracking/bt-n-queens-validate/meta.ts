// N 皇后验证 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-n-queens-validate',
  categoryId: 'backtracking',
  title: { zh: 'N 皇后验证', en: 'N-Queens Validation' },
  summary: {
    zh: '回溯验证给定皇后列位置数组是否构成合法的 N 皇后布局。',
    en: 'Backtracking-based validation of a given column array as a legal N-Queens placement.',
  },
  description: {
    zh: '检查每行恰好一个皇后（cols[r] 给出第 r 行的列），且任意两皇后不同列、不同对角线。',
    en: 'Each row has exactly one queen (cols[r] is the column of row r); verify no two share a column or diagonal.',
  },
  tags: ['backtracking', 'validation'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
