// N皇后 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-n-queens',
  categoryId: 'backtracking',
  title: { zh: 'N皇后', en: 'N-Queens' },
  summary: {
    zh: '在 n×n 棋盘放 n 个互不攻击的皇后，求方案数。',
    en: 'Count ways to place n non-attacking queens.',
  },
  description: {
    zh: '逐行放，列/对角线标记剪枝。',
    en: 'Row by row with column/diagonal marking. O(n!).',
  },
  tags: ['backtracking', 'n-queens'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
