// 迷宫老鼠 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-rat-in-maze',
  categoryId: 'backtracking',
  title: { zh: '迷宫老鼠', en: 'Rat in a Maze' },
  summary: {
    zh: '在 N×N 迷宫找从左上到右下的路径。',
    en: 'Find path from top-left to bottom-right in a maze.',
  },
  description: { zh: 'DFS 四方向回溯，0 通 1 墙。', en: 'DFS 4-dir backtrack. O(4^(N*N)).' },
  tags: ['backtracking', 'maze'],
  complexity: { time: 'O(4^(N*N))', space: 'O(N*N)' },
};
