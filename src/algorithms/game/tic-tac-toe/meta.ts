// Tic-Tac-Toe AI · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tic-tac-toe',
  categoryId: 'game',
  title: { zh: '井字棋AI', en: 'Tic-Tac-Toe AI' },
  summary: {
    zh: '井字棋AI属于game类别。',
    en: 'Tic-Tac-Toe AI is a game algorithm.',
  },
  description: {
    zh: '井字棋AI（Tic-Tac-Toe AI）属于game类别的算法。',
    en: 'Tic-Tac-Toe AI is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
