// Connect4 求解器 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-connect4-solve',
  categoryId: 'game',
  title: { zh: 'Connect4 求解器', en: 'Connect4 Solver' },
  summary: {
    zh: '带深度限制的极小极大求解四子棋最优落列。',
    en: 'Depth-limited minimax to solve the best column in Connect Four.',
  },
  description: {
    zh: '7 列 ×6 行棋盘，重力下落。先手红、后手黄，四子连线（横/纵/对角）者胜。minimax + 深度限制求最优列。',
    en: 'A 7-column ×6-row gravity board; red moves first. Four-in-a-row (any direction) wins. Depth-limited minimax finds the best column.',
  },
  tags: ['game', 'minimax', 'grid'],
  complexity: { time: 'O(7^d)', space: 'O(d)' },
};
