import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-escape-maze',
  categoryId: 'graph',
  title: { zh: '迷宫逃脱（最短路）', en: 'Maze Escape (Shortest Path)' },
  summary: {
    zh: 'BFS 求迷宫从起点到出口的最短步数路径。',
    en: 'BFS for the shortest step path from entrance to exit in a maze.',
  },
  description: {
    zh: '迷宫逃脱。给定字符网格：井号/1 为墙，点/0 为路，S 起点，E 出口。每步可向四方向移动一格（不可穿墙、不可越界）。BFS 求从 S 到 E 的最少步数。时间 O(R·C)，空间 O(R·C)。',
    en: 'Escape a maze. #/1 = wall, ./0 = path, S = start, E = exit. Move 4-directions per step. BFS shortest path. Time O(RC), space O(RC).',
  },
  tags: ['graph', 'bfs', 'maze', 'grid', 'shortest-path'],
  complexity: { time: 'O(R·C)', space: 'O(R·C)' },
};
