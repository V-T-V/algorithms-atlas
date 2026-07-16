// Connect Four AI · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'connect4',
  categoryId: 'game',
  title: { zh: '四子棋AI', en: 'Connect Four AI' },
  summary: {
    zh: '四子棋AI属于game类别。',
    en: 'Connect Four AI is a game algorithm.',
  },
  description: {
    zh: '四子棋AI（Connect Four AI）属于game类别的算法。',
    en: 'Connect Four AI is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
