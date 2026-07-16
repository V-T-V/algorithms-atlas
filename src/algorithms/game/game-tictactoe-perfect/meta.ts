// 完美井字棋 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-tictactoe-perfect',
  categoryId: 'game',
  title: { zh: '完美井字棋', en: 'Perfect Tic-Tac-Toe' },
  summary: {
    zh: '用 minimax 求井字棋任意局面的最优落子与价值。',
    en: 'Minimax to find the optimal move and value of any tic-tac-toe position.',
  },
  description: {
    zh: '棋盘 9 格用 0/1/2 表示空/X/O。递归枚举所有合法落子，胜=+10、负=-10、平=0，并按深度调整。',
    en: 'A 9-cell board (0/1/2 = empty/X/O). Recurse over legal moves; win=+10, lose=-10, draw=0, depth-adjusted.',
  },
  tags: ['game', 'minimax', 'grid'],
  complexity: { time: 'O(9!)', space: 'O(9)' },
};
