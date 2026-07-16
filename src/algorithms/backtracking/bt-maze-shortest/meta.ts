// 迷宫最短路径回溯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-maze-shortest',
  categoryId: 'backtracking',
  title: { zh: '迷宫最短路径回溯', en: 'Maze Shortest Path (Backtracking)' },
  summary: {
    zh: '回溯枚举所有可达路径，记录从起点到终点的最短路径。',
    en: 'Backtracking to enumerate all reachable paths and record the shortest from start to goal.',
  },
  description: {
    zh: 'DFS 回溯探索四方向，标记已访问防止环路，到达终点时更新最短路径长度与具体路径。',
    en: 'DFS backtracking explores four directions, marks visited cells to avoid cycles, and updates the shortest path whenever the goal is reached.',
  },
  tags: ['backtracking', 'maze', 'dfs'],
  complexity: { time: 'O(4^(n·m))', space: 'O(n·m)' },
};
