// Gomoku AI · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gomoku',
  categoryId: 'game',
  title: { zh: '五子棋AI', en: 'Gomoku AI' },
  summary: {
    zh: '五子棋AI属于game类别。',
    en: 'Gomoku AI is a game algorithm.',
  },
  description: {
    zh: '五子棋AI（Gomoku AI）属于game类别的算法。',
    en: 'Gomoku AI is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
