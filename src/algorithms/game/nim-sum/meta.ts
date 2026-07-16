// Nim Sum Advanced · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'nim-sum',
  categoryId: 'game',
  title: { zh: 'Nim和进阶', en: 'Nim Sum Advanced' },
  summary: {
    zh: 'Nim和进阶属于game类别。',
    en: 'Nim Sum Advanced is a game algorithm.',
  },
  description: {
    zh: 'Nim和进阶（Nim Sum Advanced）属于game类别的算法。',
    en: 'Nim Sum Advanced is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
