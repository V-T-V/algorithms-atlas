// Rat in Maze · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rat-maze',
  categoryId: 'backtracking',
  title: { zh: '迷宫老鼠', en: 'Rat in Maze' },
  summary: {
    zh: '迷宫老鼠属于backtracking类别。',
    en: 'Rat in Maze is a backtracking algorithm.',
  },
  description: {
    zh: '迷宫老鼠（Rat in Maze）属于backtracking类别的算法。',
    en: 'Rat in Maze is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
