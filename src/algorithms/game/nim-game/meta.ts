// Nim Game · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'nim-game',
  categoryId: 'game',
  title: { zh: 'Nim 博弈', en: 'Nim Game' },
  summary: {
    zh: 'Nim 博弈属于game类别。',
    en: 'Nim Game is a game algorithm.',
  },
  description: {
    zh: 'Nim 博弈（Nim Game）属于game类别的算法。',
    en: 'Nim Game is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
