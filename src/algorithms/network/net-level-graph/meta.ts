// 分层图 (BFS 层次图) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-level-graph',
  categoryId: 'network',
  title: { zh: '分层图 (BFS 层次图)', en: 'Level Graph (BFS Layers)' },
  summary: {
    zh: '用 BFS 按到源点距离为残量图节点分层，是 Dinic 算法的核心子步骤。',
    en: "Layer residual-graph nodes by BFS distance from the source; a core subroutine of Dinic's algorithm.",
  },
  description: {
    zh: '分层图：在残量图上从源点 s 做 BFS，level[v] = level[u]+1 仅保留从低层到高层的边 (u,v)。Dinic 在每轮构造分层图后，只沿分层图（严格上升的边）DFS 找增广路，保证每次增广路长度等于最短路径长度，从而总增广轮数为 O(V)。',
    en: 'Level graph: BFS from source s in the residual graph; level[v] = level[u]+1 keeps only edges (u,v) going from lower to higher layers. After building the level graph each phase, Dinic DFS-augments only along strictly-ascending edges, so every augmenting path has shortest length and there are O(V) phases total.',
  },
  tags: ['network', 'max-flow', 'dinic', 'bfs', 'level-graph'],
  complexity: { time: 'O(E)', space: 'O(V + E)' },
};
