import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bfs-grid',
  categoryId: 'graph',
  title: { zh: '网格 BFS', en: 'Grid BFS' },
  summary: {
    zh: '在二维网格上广度优先搜索，求最短步数或连通区域。',
    en: 'Breadth-first search on a 2D grid for shortest steps or connected regions.',
  },
  description: {
    zh: '给定 m×n 网格 grid（0 表示可通行，1 表示障碍），从起点 (sr,sc) BFS 找到终点 (tr,tc) 的最短步数（每步上下左右一格）。BFS 天然保证按层扩展，首次到达即为最短。不可达返回 -1。时间 O(mn)，空间 O(mn)。',
    en: 'On an m×n grid (0 walkable, 1 blocked), BFS from (sr,sc) to (tr,tc) with 4-directional moves returns the shortest step count; -1 if unreachable. BFS layers guarantee first arrival is shortest. Time O(mn), space O(mn).',
  },
  tags: ['bfs', 'grid', 'shortest-path'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
