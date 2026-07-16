// 扫雷展开 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-minesweeper',
  categoryId: 'backtracking',
  title: { zh: '扫雷展开', en: 'Minesweeper Update' },
  summary: {
    zh: '点击扫雷盘格，自动展开 0 区域。',
    en: 'Click a minesweeper cell, auto-expand zero region.',
  },
  description: { zh: 'DFS：若 0 则递归展开邻居。', en: 'DFS expand if zero. O(R*C).' },
  tags: ['backtracking', 'grid', 'dfs'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
