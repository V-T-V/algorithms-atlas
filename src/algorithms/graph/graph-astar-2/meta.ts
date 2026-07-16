import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-astar-2',
  categoryId: 'graph',
  title: { zh: 'A* 寻路（曼哈顿启发）', en: 'A* Pathfinding (Manhattan Heuristic)' },
  summary: {
    zh: '网格寻路用 A* 配合曼哈顿距离启发，求最短步数路径。',
    en: 'Grid pathfinding via A* with Manhattan-distance heuristic for shortest step path.',
  },
  description: {
    zh: 'A* 在四联通网格上从源到目标寻最短路，移动代价 1，启发函数 h=曼哈顿距离，admissible 保证最优。open 集按 f=g+h 取最小，弹出后扩展四邻居（越界/障碍跳过），用 gScore 松弛。时间 O(E log V)（用优先队列；本实现线性扫描 open），空间 O(V)。',
    en: 'A* on 4-connected grid, move cost 1, h=Manhattan distance (admissible). Pop min f from open, relax neighbors. Optimal. Time O(E log V), space O(V).',
  },
  tags: ['graph', 'shortest-path', 'astar', 'heuristic', 'grid'],
  complexity: { time: 'O(E log V)', space: 'O(V)' },
};
